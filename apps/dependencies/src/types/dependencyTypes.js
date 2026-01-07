/**
 * @fileoverview Tipos y contratos de datos para análisis de dependencias
 *
 * Estos tipos se usan como JSDoc para documentación y validación IDE.
 */

/**
 * @typedef {'ok' | 'range' | 'non-semver'} VersionParseStatus
 * Estado de parseo de versión
 */

/**
 * @typedef {'critical' | 'high' | 'medium' | 'low'} RiskLevel
 * Nivel de riesgo calculado
 */

/**
 * @typedef {'security' | 'breaking-change' | 'transitive' | 'eol-unmaintained' | 'minor-update' | 'up-to-date' | 'runtime' | 'non-semver' | 'low-activity'} DependencyTag
 * Tags que categorizan una dependencia
 */

/**
 * @typedef {'UPDATE_SECURITY' | 'REPLACE' | 'PLAN_MIGRATION' | 'UPDATE_MAJOR' | 'UPDATE_SAFE' | 'MONITOR' | 'REVIEW_MANUAL'} ActionType
 * Tipo de acción recomendada
 */

/**
 * @typedef {Object} VersionGap
 * @property {number} major - Gap en versión major
 * @property {number} minor - Gap en versión minor
 * @property {number} patch - Gap en versión patch
 */

/**
 * @typedef {Object} VulnerabilitiesInfo
 * @property {number} critical - Vulnerabilidades críticas
 * @property {number} high - Vulnerabilidades altas
 * @property {number} moderate - Vulnerabilidades moderadas
 * @property {number} low - Vulnerabilidades bajas
 * @property {number} total - Total de vulnerabilidades
 */

/**
 * @typedef {Object} MaintenanceInfo
 * @property {string|null} lastPublishDate - Fecha última publicación (ISO)
 * @property {number} ageInMonths - Edad en meses desde última publicación
 * @property {number|null} weeklyDownloads - Descargas semanales (opcional)
 */

/**
 * @typedef {Object} DependencyAnalysisDetail
 * @property {VersionGap} versionGap - Gap de versiones
 * @property {VersionParseStatus} versionParseStatus - Estado de parseo
 * @property {boolean} isDeprecated - Si está deprecated
 * @property {string|null} deprecationMessage - Mensaje de deprecación
 * @property {VulnerabilitiesInfo|null} vulnerabilities - Info de vulnerabilidades (MVP: null)
 * @property {boolean} isDirect - Si es dependencia directa
 * @property {boolean} isRuntime - Si es runtime (dependencies vs devDependencies)
 * @property {MaintenanceInfo} maintenance - Info de mantenimiento
 */

/**
 * @typedef {Object} RecommendedAction
 * @property {ActionType} type - Tipo de acción
 * @property {string} displayText - Texto para mostrar
 * @property {number} priority - Prioridad (1=max, 4=low)
 */

/**
 * @typedef {Object} RiskScoreBreakdown
 * @property {number} security - Score por seguridad (MVP: 0)
 * @property {number} versionGap - Score por gap de versión
 * @property {number} deprecated - Score por deprecated
 * @property {number} maintenance - Score por mantenimiento
 */

/**
 * @typedef {Object} DependencyAnalysis
 * Análisis completo de una dependencia (extiende datos básicos)
 *
 * @property {string} packageName - Nombre del paquete
 * @property {string} author - Autor/organización
 * @property {string} currentVersion - Versión actual
 * @property {string} latestVersion - Última versión disponible
 * @property {boolean} isOutdated - Si está desactualizada
 *
 * @property {number} riskScore - Score de riesgo (0-110)
 * @property {RiskLevel} riskLevel - Nivel de riesgo
 * @property {DependencyTag[]} tags - Tags categorizando la dependencia
 * @property {RecommendedAction} recommendedAction - Acción recomendada
 * @property {DependencyAnalysisDetail} analysis - Detalles del análisis
 * @property {RiskScoreBreakdown} scoreBreakdown - Desglose del score
 */

/**
 * @typedef {Object} RiskDistribution
 * @property {number} critical - Count de deps críticas
 * @property {number} high - Count de deps high
 * @property {number} medium - Count de deps medium
 * @property {number} low - Count de deps low
 */

/**
 * @typedef {Object} ExecutiveSummaryStats
 * @property {number} total - Total de dependencias
 * @property {number} withVulnerabilities - Con vulnerabilidades (MVP: 0)
 * @property {number} deprecated - Deprecated
 * @property {number} safeUpdates - Actualizaciones seguras (minor/patch)
 * @property {number} upToDate - Actualizadas
 * @property {number} nonSemver - Versiones no semver
 */

/**
 * @typedef {Object} ExecutiveSummary
 * @property {RiskDistribution} riskDistribution - Distribución por nivel
 * @property {ExecutiveSummaryStats} stats - Estadísticas clave
 * @property {DependencyAnalysis[]} topPriority - Top 10-15 por risk score
 */

/**
 * @typedef {Object} EnrichedDependenciesResult
 * @property {ExecutiveSummary} executiveSummary - Resumen ejecutivo
 * @property {DependencyAnalysis[]} dependencies - Lista completa enriquecida
 */

// Export para que puedan ser importados (aunque JSDoc no lo requiere)
export default {};
