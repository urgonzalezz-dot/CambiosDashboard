/**
 * @fileoverview Determina la acción recomendada basada en análisis
 */

/**
 * Determina la acción recomendada para una dependencia
 * @param {Object} params
 * @param {string[]} params.tags
 * @param {Object} params.versionGap
 * @param {boolean} params.isDeprecated
 * @param {boolean} params.isOutdated
 * @param {string} params.versionParseStatus
 * @returns {{ type: string, displayText: string, priority: number }}
 */
export function getRecommendedAction({
  tags = [],
  versionGap = { major: 0, minor: 0, patch: 0, status: 'unknown' },
  isDeprecated = false,
  isOutdated = false,
  versionParseStatus = 'ok',
}) {
  // Prioridad 1: Security
  if (tags.includes('security')) {
    return {
      type: 'UPDATE_SECURITY',
      displayText: 'Actualizar ahora (fix de seguridad)',
      priority: 1,
    };
  }

  // Prioridad 2: Deprecated
  if (isDeprecated) {
    return {
      type: 'REPLACE',
      displayText: 'Reemplazar paquete (deprecated)',
      priority: 1,
    };
  }

  // Prioridad 3: Non-semver (requiere revisión manual)
  if (versionParseStatus !== 'ok') {
    return {
      type: 'REVIEW_MANUAL',
      displayText: 'Revisar manualmente (versión no estándar)',
      priority: 3,
    };
  }

  const { major } = versionGap;

  // Prioridad 4: Major gap >= 2
  if (major >= 2) {
    return {
      type: 'PLAN_MIGRATION',
      displayText: 'Planificar migración (breaking changes)',
      priority: 2,
    };
  }

  // Prioridad 5: Major gap == 1
  if (major === 1) {
    return {
      type: 'UPDATE_MAJOR',
      displayText: 'Actualizar major (probar bien)',
      priority: 2,
    };
  }

  // Prioridad 6: Minor/patch
  if (tags.includes('minor-update')) {
    return {
      type: 'UPDATE_SAFE',
      displayText: 'Actualizar ahora (seguro)',
      priority: 3,
    };
  }

  // Sin acción necesaria
  if (tags.includes('up-to-date')) {
    return {
      type: 'MONITOR',
      displayText: 'Mantener monitoreado',
      priority: 4,
    };
  }

  // Fallback
  return {
    type: 'MONITOR',
    displayText: 'Revisar manualmente',
    priority: 3,
  };
}
