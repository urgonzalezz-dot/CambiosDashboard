/**
 * @fileoverview Orquestador principal que integra todo el flujo de análisis
 *
 * Este servicio coordina:
 * 1. Obtener dependencias básicas (buildDependenciesComparison)
 * 2. Enriquecer con análisis completo (enrichDependencies)
 * 3. Generar executive summary (buildExecutiveSummary)
 * 4. Añadir metadata de análisis
 */

import { buildDependenciesComparison } from './buildDependenciesComparison.js';
import { enrichDependencies } from './buildEnrichedDependencies.js';
import { buildExecutiveSummary } from './executiveSummaryBuilder.js';
import { createMemoizedAPIs } from './memoization.js';

/**
 * Cuenta el número real de dependencias instaladas en lockfile
 * Cuenta solo packages que empiecen con "node_modules/" (instaladas reales)
 * NO cuenta root ("") ni duplicados por path
 *
 * @param {Object} lockfileJson
 * @returns {number}
 */
function countInstalledDependencies(lockfileJson) {
  try {
    const packages = lockfileJson?.packages || {};

    // Filtrar:
    // 1. Solo keys que empiecen con "node_modules/"
    // 2. NO contar "" (root)
    // 3. Contar todas las instaladas (incluyendo nested node_modules)
    const installedCount = Object.keys(packages).filter((key) => {
      return key.startsWith('node_modules/');
    }).length;

    return installedCount;
  } catch (err) {
    console.warn('Error counting installed dependencies:', err);
    return 0;
  }
}

/**
 * Genera hash del lockfile para tracking de cambios (compatible con navegador)
 * Usa hash simple basado en contenido del lockfile
 * @param {Object} lockfileJson
 * @returns {string}
 */
function generateLockfileHash(lockfileJson) {
  try {
    const content = JSON.stringify(lockfileJson);

    // Simple hash function (djb2) compatible con navegador
    let hash = 5381;
    for (let i = 0; i < content.length; i++) {
      hash = (hash << 5) + hash + content.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }

    // Convertir a hex positivo
    const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
    return hashHex.substring(0, 16);
  } catch (err) {
    console.warn('Error generating lockfile hash:', err);
    return null;
  }
}

/**
 * Realiza el análisis completo de dependencias
 *
 * @param {Object} params
 * @param {Object} params.lockfileJson - package-lock.json parseado completo
 * @param {Function} params.getLatestVersion - Función para obtener latest version (del NPM hook)
 * @param {Function} params.getPackageMetadata - Función para obtener metadata NPM completa
 * @param {number} params.limit - Límite de dependencias a analizar (default: 50)
 * @param {number} params.topN - Top N para executive summary (default: 15)
 * @param {string|null} params.repoCommit - Hash del commit actual (opcional, lo setea CI en fase posterior)
 *
 * @returns {Promise<{ metadata: Object, executiveSummary: Object, dependencies: Array }>}
 */
export async function analyzeAllDependencies({
  lockfileJson = {},
  getLatestVersion = async () => ({}),
  getPackageMetadata = async () => ({}),
  limit = 50,
  topN = 15,
  repoCommit = null,
}) {
  try {
    // Aplicar memoization para evitar llamadas duplicadas
    const memoized = createMemoizedAPIs({
      getLatestVersion,
      getPackageMetadata,
    });

    const rootPackage = lockfileJson?.packages?.[''] || {};
    const dependencies = rootPackage.dependencies || {};
    const devDependencies = rootPackage.devDependencies || {};

    // Combinar ambas para análisis completo
    const lockedMap = { ...dependencies, ...devDependencies };

    console.log(
      '[analyzeAllDependencies] Total deps to analyze:',
      Object.keys(lockedMap).length
    );
    console.log(
      '[analyzeAllDependencies] dependencies:',
      Object.keys(dependencies).length
    );
    console.log(
      '[analyzeAllDependencies] devDependencies:',
      Object.keys(devDependencies).length
    );

    // 2. Construir lista básica con versiones latest
    const basicDependencies = await buildDependenciesComparison({
      lockedMap,
      getLatestVersion: memoized.getLatestVersion,
      limit,
    });

    // 3. Enriquecer con análisis completo
    const enrichedDependencies = await enrichDependencies({
      basicDependencies,
      lockfileJson,
      getPackageMetadata: memoized.getPackageMetadata,
    });

    // 4. Generar executive summary
    const executiveSummary = buildExecutiveSummary(enrichedDependencies, topN);

    // 5. Generar metadata
    const totalAvailable = countInstalledDependencies(lockfileJson);

    const metadata = {
      analysisVersion: '2.0.0', // FASE 2
      generatedAt: new Date().toISOString(),
      lockfileHash: generateLockfileHash(lockfileJson),
      repoCommit: repoCommit || null,
      analyzedCount: enrichedDependencies.length,
      requestedLimit: limit,
      totalAvailable,
      isPartial: enrichedDependencies.length < totalAvailable,
    };

    return {
      metadata,
      executiveSummary,
      dependencies: enrichedDependencies,
    };
  } catch (err) {
    console.error('Error in analyzeAllDependencies:', err);

    // Fallback: retornar estructura vacía válida
    return {
      metadata: {
        analysisVersion: '2.0.0',
        generatedAt: new Date().toISOString(),
        lockfileHash: null,
        repoCommit: null,
        analyzedCount: 0,
        requestedLimit: limit,
        totalAvailable: 0,
        isPartial: false,
        error: err.message,
      },
      executiveSummary: {
        riskDistribution: { critical: 0, high: 0, medium: 0, low: 0 },
        stats: {
          total: 0,
          withVulnerabilities: 0,
          deprecated: 0,
          safeUpdates: 0,
          upToDate: 0,
          nonSemver: 0,
        },
        topPriority: [],
      },
      dependencies: [],
    };
  }
}

/**
 * Analiza solo dependencies (runtime) o devDependencies
 *
 * @param {Object} params - Mismos params que analyzeAllDependencies
 * @param {'dependencies' | 'devDependencies'} params.type - Tipo de deps a analizar
 * @param {string|null} params.repoCommit - Hash del commit actual (opcional, lo setea CI en fase posterior)
 * @returns {Promise<{ metadata: Object, executiveSummary: Object, dependencies: Array }>}
 */
export async function analyzeByType({
  lockfileJson = {},
  getLatestVersion = async () => ({}),
  getPackageMetadata = async () => ({}),
  type = 'dependencies',
  limit = 50,
  topN = 15,
  repoCommit = null,
}) {
  try {
    // Aplicar memoization
    const memoized = createMemoizedAPIs({
      getLatestVersion,
      getPackageMetadata,
    });

    // Seleccionar el mapa correcto según el tipo
    const rootPackage = lockfileJson?.packages?.[''] || {};
    const lockedMap = rootPackage[type] || {};

    // Resto del flujo igual
    const basicDependencies = await buildDependenciesComparison({
      lockedMap,
      getLatestVersion: memoized.getLatestVersion,
      limit,
    });

    const enrichedDependencies = await enrichDependencies({
      basicDependencies,
      lockfileJson,
      getPackageMetadata: memoized.getPackageMetadata,
    });

    const executiveSummary = buildExecutiveSummary(enrichedDependencies, topN);

    const totalAvailable = countInstalledDependencies(lockfileJson);

    const metadata = {
      analysisVersion: '2.0.0',
      generatedAt: new Date().toISOString(),
      lockfileHash: generateLockfileHash(lockfileJson),
      repoCommit: repoCommit || null,
      analyzedCount: enrichedDependencies.length,
      requestedLimit: limit,
      totalAvailable,
      isPartial: enrichedDependencies.length < totalAvailable,
      type,
    };

    return {
      metadata,
      executiveSummary,
      dependencies: enrichedDependencies,
    };
  } catch (err) {
    console.error(`Error analyzing ${type}:`, err);
    return {
      metadata: {
        analysisVersion: '2.0.0',
        generatedAt: new Date().toISOString(),
        lockfileHash: null,
        repoCommit: null,
        analyzedCount: 0,
        requestedLimit: limit,
        totalAvailable: 0,
        isPartial: false,
        type,
        error: err.message,
      },
      executiveSummary: {
        riskDistribution: { critical: 0, high: 0, medium: 0, low: 0 },
        stats: {
          total: 0,
          withVulnerabilities: 0,
          deprecated: 0,
          safeUpdates: 0,
          upToDate: 0,
          nonSemver: 0,
        },
        topPriority: [],
      },
      dependencies: [],
    };
  }
}
