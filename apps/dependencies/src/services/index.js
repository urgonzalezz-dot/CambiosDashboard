/**
 * @fileoverview Barrel export para todos los servicios de análisis de dependencias
 */

// Analizador principal (usar este en la UI)
export {
  analyzeAllDependencies,
  analyzeByType,
} from './dependenciesAnalyzer.js';

// Memoization (opcional, se aplica automáticamente en analyzers)
export {
  createMemoizedAPIs,
  memoizeGetLatestVersion,
  memoizeGetPackageMetadata,
} from './memoization.js';

// Servicios individuales (para uso avanzado)
export { enrichDependencies } from './buildEnrichedDependencies.js';
export {
  buildExecutiveSummary,
  filterByRiskLevel,
  filterByTags,
  filterByType,
} from './executiveSummaryBuilder.js';
export { calculateRiskScore, getRiskLevel } from './riskScoring.js';
export { generateTags } from './tagsGenerator.js';
export { getRecommendedAction } from './actionRecommender.js';
export {
  calculateVersionGap,
  detectVersionType,
  calculateAgeInMonths,
  isVersionOutdated,
} from './versionAnalysis.js';
export {
  extractDirectDependencies,
  classifyDependency,
} from './directDependencyDetector.js';

// Legacy (mantener compatibilidad)
export {
  buildDependenciesComparison,
  getStatsFromList,
} from './buildDependenciesComparison.js';
