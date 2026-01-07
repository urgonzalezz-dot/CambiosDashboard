/**
 * @fileoverview Cálculo de Risk Score con ajustes según feedback
 *
 * Criterios de scoring (ajustados):
 * - Security: 0-40 pts (MVP: siempre 0)
 * - Version Gap: 0-25 pts (major >= 2 = 25, major = 1 = 15, minor/patch = 5)
 * - Deprecated: 0-20 pts
 * - Maintenance: 0-3 pts (>24 meses sin release)
 *
 * NOTA: isDirect NO penaliza, solo para contexto/tags
 */

/**
 * Calcula score por vulnerabilidades
 * @param {Object|null} vulnerabilities
 * @returns {number} 0-40
 */
function calculateSecurityScore(vulnerabilities) {
  // MVP: Security scoring no implementado aún
  // Se integrará vía CI/backend en fase posterior
  return 0;

  // Implementación futura:
  // if (!vulnerabilities) return 0;
  // const { critical = 0, high = 0, moderate = 0, low = 0 } = vulnerabilities;
  // if (critical > 0) return 40;
  // if (high > 0) return 30;
  // if (moderate > 0) return 15;
  // if (low > 0) return 5;
  // return 0;
}

/**
 * Calcula score por version gap
 * @param {Object} versionGap - { major, minor, patch, status }
 * @returns {number} 0-25
 */
function calculateVersionGapScore(versionGap) {
  if (!versionGap || versionGap.status !== 'ok') {
    return 0; // Non-semver no penaliza en score
  }

  const { major, minor, patch } = versionGap;

  if (major >= 2) return 25;
  if (major === 1) return 15;

  // Minor o patch updates (bajo riesgo)
  if (minor > 0 || patch > 0) return 5;

  return 0;
}

/**
 * Calcula score por deprecated
 * @param {boolean} isDeprecated
 * @returns {number} 0-20
 */
function calculateDeprecatedScore(isDeprecated) {
  return isDeprecated ? 20 : 0;
}

/**
 * Calcula score por mantenimiento (reducido según feedback)
 * @param {number} ageInMonths
 * @returns {number} 0-3
 */
function calculateMaintenanceScore(ageInMonths) {
  if (ageInMonths > 24) return 3; // >2 años
  return 0;
}

/**
 * Determina el nivel de riesgo según el score
 * Umbrales ajustados para generar Top 10-15 accionable
 * @param {number} score
 * @returns {'critical' | 'high' | 'medium' | 'low'}
 */
export function getRiskLevel(score) {
  // Umbrales calibrados:
  // - Critical: 60+ (deprecated + major>=2 + maintenance)
  // - High: 35-59 (major=1 + algo más)
  // - Medium: 15-34 (minor/patch + otros factores)
  // - Low: 0-14

  if (score >= 60) return 'critical';
  if (score >= 35) return 'high';
  if (score >= 15) return 'medium';
  return 'low';
}

/**
 * Calcula el Risk Score completo de una dependencia
 * @param {Object} params
 * @param {Object|null} params.vulnerabilities
 * @param {Object} params.versionGap
 * @param {boolean} params.isDeprecated
 * @param {number} params.ageInMonths
 * @returns {{ total: number, level: string, breakdown: Object }}
 */
export function calculateRiskScore({
  vulnerabilities = null,
  versionGap = { major: 0, minor: 0, patch: 0, status: 'unknown' },
  isDeprecated = false,
  ageInMonths = 0,
}) {
  const breakdown = {};

  // 1. Security (MVP: 0)
  const securityScore = calculateSecurityScore(vulnerabilities);
  breakdown.security = securityScore;

  // 2. Version Gap
  const versionScore = calculateVersionGapScore(versionGap);
  breakdown.versionGap = versionScore;

  // 3. Deprecated
  const deprecatedScore = calculateDeprecatedScore(isDeprecated);
  breakdown.deprecated = deprecatedScore;

  // 4. Maintenance
  const maintenanceScore = calculateMaintenanceScore(ageInMonths);
  breakdown.maintenance = maintenanceScore;

  // Total
  const total =
    securityScore + versionScore + deprecatedScore + maintenanceScore;

  return {
    total,
    level: getRiskLevel(total),
    breakdown,
  };
}
