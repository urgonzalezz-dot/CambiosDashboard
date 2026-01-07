/**
 * @fileoverview Orquestador que enriquece dependencias con análisis completo
 *
 * Mantiene compatibilidad con el flujo existente y extiende con nuevos campos.
 */

import {
  calculateVersionGap,
  detectVersionType,
  calculateAgeInMonths,
  isVersionOutdated,
} from './versionAnalysis.js';
import {
  extractDirectDependencies,
  classifyDependency,
} from './directDependencyDetector.js';
import { calculateRiskScore } from './riskScoring.js';
import { generateTags } from './tagsGenerator.js';
import { getRecommendedAction } from './actionRecommender.js';

/**
 * Enriquece una lista básica de dependencias con análisis completo
 * @param {Object} params
 * @param {Array} params.basicDependencies - Lista básica de deps del buildDependenciesComparison
 * @param {Object} params.lockfileJson - package-lock.json parseado completo
 * @param {Object} params.packageJson - package.json parseado (fallback para direct deps)
 * @param {Function} params.getPackageMetadata - Función para obtener metadata NPM
 * @returns {Promise<Array>} Lista enriquecida
 */
export async function enrichDependencies({
  basicDependencies = [],
  lockfileJson = {},
  packageJson = null,
  getPackageMetadata = async () => ({}),
}) {
  // 1. Extraer dependencias directas del lockfile (con fallback a package.json)
  const { directRuntime, directDev } = extractDirectDependencies(
    lockfileJson,
    packageJson
  );

  // 2. Enriquecer cada dependencia
  const enrichedPromises = basicDependencies.map(async (dep) => {
    try {
      return await enrichSingleDependency({
        dependency: dep,
        directRuntime,
        directDev,
        getPackageMetadata,
      });
    } catch (err) {
      console.error(`Error enriching ${dep.packageName}:`, err);
      // Fallback: retornar dep básica con defaults
      return createFallbackEnrichedDep(dep);
    }
  });

  const enriched = await Promise.all(enrichedPromises);

  return enriched;
}

/**
 * Enriquece una sola dependencia
 * @param {Object} params
 * @returns {Promise<Object>} Dependencia enriquecida
 */
async function enrichSingleDependency({
  dependency,
  directRuntime,
  directDev,
  getPackageMetadata,
}) {
  const { packageName, author, currentVersion, latestVersion, isOutdated } =
    dependency;

  // 1. Análisis de versiones
  const versionGap = await calculateVersionGap(currentVersion, latestVersion);
  const versionParseStatus =
    versionGap.status === 'ok' ? 'ok' : versionGap.status;

  // 2. Clasificación direct/transitive
  const { isDirect, isRuntime } = classifyDependency(
    packageName,
    directRuntime,
    directDev
  );

  // 3. Obtener metadata de NPM (deprecated, last publish)
  let isDeprecated = false;
  let deprecationMessage = null;
  let lastPublishDate = null;
  let ageInMonths = 0;
  let metadataFailed = false;

  try {
    const metadata = await getPackageMetadata(packageName);

    if (metadata && !metadata.err) {
      // Deprecated
      if (metadata.deprecated) {
        isDeprecated = true;
        deprecationMessage = String(metadata.deprecated);
      }

      // Last publish date
      const timeData = metadata.time || {};
      const latestTime =
        timeData[latestVersion] || timeData[metadata['dist-tags']?.latest];

      if (latestTime) {
        lastPublishDate = latestTime;
        ageInMonths = calculateAgeInMonths(latestTime);
      }
    } else {
      metadataFailed = true;
    }
  } catch (err) {
    console.warn(`Could not fetch metadata for ${packageName}:`, err.message);
    metadataFailed = true;
  }

  // 4. Calcular risk score
  const riskScoreResult = calculateRiskScore({
    vulnerabilities: null, // MVP: no security scoring
    versionGap,
    isDeprecated,
    ageInMonths,
  });

  // 5. Generar tags
  const tags = generateTags({
    vulnerabilities: null,
    versionGap,
    isDeprecated,
    isDirect,
    isRuntime,
    isOutdated,
    ageInMonths,
    versionParseStatus,
  });

  // 6. Determinar acción recomendada
  const recommendedAction = getRecommendedAction({
    tags,
    versionGap,
    isDeprecated,
    isOutdated,
    versionParseStatus,
  });

  // 7. Construir objeto enriquecido
  return {
    // Campos básicos (mantener compatibilidad)
    packageName,
    author,
    currentVersion,
    latestVersion,
    isOutdated,

    // Nuevos campos de análisis
    riskScore: riskScoreResult.total,
    riskLevel: riskScoreResult.level,
    tags,
    recommendedAction,

    // Análisis detallado
    analysis: {
      versionGap: {
        major: versionGap.major,
        minor: versionGap.minor,
        patch: versionGap.patch,
      },
      versionParseStatus,
      isDeprecated,
      deprecationMessage,
      vulnerabilities: null, // MVP: null
      isDirect,
      isRuntime,
      maintenance: {
        lastPublishDate,
        ageInMonths,
        weeklyDownloads: null, // Opcional, no implementado
      },
    },

    // Breakdown del score
    scoreBreakdown: riskScoreResult.breakdown,
  };
}

/**
 * Crea una dependencia enriquecida con valores fallback
 * Usado cuando falla el análisis completo
 * @param {Object} dep
 * @returns {Object}
 */
function createFallbackEnrichedDep(dep) {
  // Si tiene versionGap pero falla metadata, usar datos parciales
  const hasVersionInfo = dep.currentVersion && dep.latestVersion;

  return {
    ...dep,
    riskScore: 0,
    riskLevel: 'low',
    tags: hasVersionInfo ? [] : ['up-to-date'],
    recommendedAction: {
      type: 'MONITOR',
      displayText: hasVersionInfo
        ? 'Revisar manualmente'
        : 'Mantener monitoreado',
      priority: hasVersionInfo ? 3 : 4,
    },
    analysis: {
      versionGap: { major: 0, minor: 0, patch: 0 },
      versionParseStatus: 'unknown',
      isDeprecated: false,
      deprecationMessage: null,
      vulnerabilities: null,
      isDirect: null,
      isRuntime: null,
      maintenance: {
        lastPublishDate: null,
        ageInMonths: 0,
        weeklyDownloads: null,
      },
    },
    scoreBreakdown: {
      security: 0,
      versionGap: 0,
      deprecated: 0,
      maintenance: 0,
    },
  };
}
