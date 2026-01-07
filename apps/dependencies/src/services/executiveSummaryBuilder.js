/**
 * @fileoverview Construye el Executive Summary con stats y top priority
 */

/**
 * Genera el Executive Summary a partir de dependencias enriquecidas
 * @param {Array} enrichedDependencies - Lista completa enriquecida
 * @param {number} topN - Número de deps para topPriority (default: 15)
 * @returns {Object} Executive summary
 */
export function buildExecutiveSummary(enrichedDependencies = [], topN = 15) {
  // 1. Calcular risk distribution
  const riskDistribution = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  enrichedDependencies.forEach((dep) => {
    const level = dep.riskLevel || 'low';
    riskDistribution[level] = (riskDistribution[level] || 0) + 1;
  });

  // 2. Calcular stats clave
  const stats = {
    total: enrichedDependencies.length,
    withVulnerabilities: 0, // MVP: 0
    deprecated: 0,
    safeUpdates: 0, // Minor/patch updates
    upToDate: 0,
    nonSemver: 0,
  };

  enrichedDependencies.forEach((dep) => {
    const tags = dep.tags || [];

    // Deprecated
    if (dep.analysis?.isDeprecated) {
      stats.deprecated++;
    }

    // Safe updates (minor-update tag)
    if (tags.includes('minor-update')) {
      stats.safeUpdates++;
    }

    // Up to date
    if (tags.includes('up-to-date')) {
      stats.upToDate++;
    }

    // Non-semver
    if (tags.includes('non-semver')) {
      stats.nonSemver++;
    }
  });

  // 3. Top Priority: Ordenar por priority (asc) + riskScore (desc)
  // Priority 1 primero, luego por score dentro de cada priority
  const sortedByPriority = [...enrichedDependencies].sort((a, b) => {
    const aPriority = a.recommendedAction?.priority || 4;
    const bPriority = b.recommendedAction?.priority || 4;

    // Primero por priority (1 = max urgencia)
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Luego por riskScore (mayor score = mayor riesgo)
    const aScore = a.riskScore || 0;
    const bScore = b.riskScore || 0;
    return bScore - aScore;
  });

  // Filtrar solo las que necesitan acción (excluir MONITOR de prioridad 4)
  const actionable = sortedByPriority.filter((dep) => {
    const priority = dep.recommendedAction?.priority || 4;
    return priority <= 3; // Solo priority 1, 2, 3
  });

  // Si hay menos de topN actionable, rellenar con las de mayor riskScore
  let topPriority = actionable.slice(0, topN);

  if (topPriority.length < topN) {
    const remaining = sortedByPriority
      .filter((dep) => !topPriority.includes(dep))
      .slice(0, topN - topPriority.length);
    topPriority = [...topPriority, ...remaining];
  }

  return {
    riskDistribution,
    stats,
    topPriority,
  };
}

/**
 * Filtra dependencias por nivel de riesgo
 * @param {Array} enrichedDependencies
 * @param {string|string[]} levels - Ej: 'critical' o ['critical', 'high']
 * @returns {Array}
 */
export function filterByRiskLevel(enrichedDependencies = [], levels = []) {
  const levelsArray = Array.isArray(levels) ? levels : [levels];

  return enrichedDependencies.filter((dep) =>
    levelsArray.includes(dep.riskLevel)
  );
}

/**
 * Filtra dependencias por tags
 * @param {Array} enrichedDependencies
 * @param {string|string[]} tags
 * @returns {Array}
 */
export function filterByTags(enrichedDependencies = [], tags = []) {
  const tagsArray = Array.isArray(tags) ? tags : [tags];

  return enrichedDependencies.filter((dep) => {
    const depTags = dep.tags || [];
    return tagsArray.some((tag) => depTags.includes(tag));
  });
}

/**
 * Filtra dependencias runtime vs dev
 * @param {Array} enrichedDependencies
 * @param {'runtime' | 'dev' | 'all'} type
 * @returns {Array}
 */
export function filterByType(enrichedDependencies = [], type = 'all') {
  if (type === 'all') return enrichedDependencies;

  return enrichedDependencies.filter((dep) => {
    const isDirect = dep.analysis?.isDirect || false;
    const isRuntime = dep.analysis?.isRuntime || false;

    if (!isDirect) return false; // Solo mostrar direct deps cuando filtramos por tipo

    if (type === 'runtime') return isRuntime;
    if (type === 'dev') return !isRuntime;

    return false;
  });
}
