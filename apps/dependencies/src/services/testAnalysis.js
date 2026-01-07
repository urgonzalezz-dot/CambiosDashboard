/**
 * @fileoverview Script de prueba para validar la lógica de análisis
 *
 * Ejecutar con: node testAnalysis.js
 */

import { analyzeAllDependencies } from './dependenciesAnalyzer.js';

// Mock de lockfile para testing
const mockLockfile = {
  packages: {
    '': {
      dependencies: {
        react: '19.0.0',
        axios: '0.21.1',
        lodash: '4.17.20',
      },
      devDependencies: {
        jest: '30.0.2',
        '@types/node': '18.0.0',
      },
    },
    'node_modules/react': { version: '19.0.0' },
    'node_modules/axios': { version: '0.21.1' },
    'node_modules/lodash': { version: '4.17.20' },
    'node_modules/jest': { version: '30.0.2' },
    'node_modules/@types/node': { version: '18.0.0' },
  },
};

// Mock de getLatestVersion
const mockGetLatestVersion = async (packageName) => {
  const latestVersions = {
    react: { latest: '19.0.0' },
    axios: { latest: '1.6.0' },
    lodash: { latest: '4.17.21' },
    jest: { latest: '30.0.2' },
    '@types/node': { latest: '20.19.9' },
  };

  return latestVersions[packageName] || { latest: null };
};

// Mock de getPackageMetadata
const mockGetPackageMetadata = async (packageName) => {
  const metadata = {
    axios: {
      deprecated: false,
      time: {
        '1.6.0': '2024-01-15T10:00:00Z',
      },
      'dist-tags': { latest: '1.6.0' },
    },
    lodash: {
      deprecated: false,
      time: {
        '4.17.21': '2021-02-20T10:00:00Z',
      },
      'dist-tags': { latest: '4.17.21' },
    },
  };

  return metadata[packageName] || {};
};

// Ejecutar análisis
async function runTest() {
  console.log('🧪 Ejecutando prueba de análisis de dependencias...\n');

  try {
    const result = await analyzeAllDependencies({
      lockfileJson: mockLockfile,
      getLatestVersion: mockGetLatestVersion,
      getPackageMetadata: mockGetPackageMetadata,
      limit: 10,
      topN: 5,
    });

    console.log('✅ Análisis completado\n');
    console.log('📊 Executive Summary:');
    console.log(JSON.stringify(result.executiveSummary, null, 2));
    console.log('\n📦 Top Priority Dependencies:');

    result.executiveSummary.topPriority.forEach((dep, idx) => {
      console.log(`\n${idx + 1}. ${dep.packageName}`);
      console.log(`   Risk: ${dep.riskScore} (${dep.riskLevel})`);
      console.log(`   Versión: ${dep.currentVersion} → ${dep.latestVersion}`);
      console.log(`   Tags: ${dep.tags.join(', ')}`);
      console.log(`   Acción: ${dep.recommendedAction.displayText}`);
    });

    console.log('\n Prueba exitosa');
  } catch (err) {
    console.error(' Error en prueba:', err);
  }
}

// Ejecutar
runTest();
