/**
 * @fileoverview Smoke tests para casos edge: ranges, non-semver, pre-releases, lockfile incompleto
 *
 * Ejecutar con: node smokeTests.js
 */

import { detectVersionType, calculateVersionGap } from './versionAnalysis.js';
import {
  extractDirectDependencies,
  classifyDependency,
} from './directDependencyDetector.js';

console.log('🧪 Ejecutando Smoke Tests...\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(` PASS: ${testName}`);
    passedTests++;
  } else {
    console.log(` FAIL: ${testName}`);
    failedTests++;
  }
}

async function runTests() {
  // ==========================================
  // TEST 1: Ranges (^, ~, >=, etc.)
  // ==========================================
  console.log('📦 TEST 1: Version Ranges');

  assert(
    (await detectVersionType('^1.2.3')) === 'range',
    'Caret range ^1.2.3 detected as range'
  );

  assert(
    (await detectVersionType('~2.0.0')) === 'range',
    'Tilde range ~2.0.0 detected as range'
  );

  assert(
    (await detectVersionType('>=1.0.0 <2.0.0')) === 'range',
    'Compound range detected as range'
  );

  assert(
    (await detectVersionType('1.2.x')) === 'range',
    'Wildcard range 1.2.x detected as range'
  );

  console.log('');

  // ==========================================
  // TEST 2: Non-semver (file:, github:, etc.)
  // ==========================================
  console.log('📦 TEST 2: Non-semver Versions');

  assert(
    (await detectVersionType('file:../local-pkg')) === 'non-semver',
    'file: protocol detected as non-semver'
  );

  assert(
    (await detectVersionType('github:user/repo#v1.0.0')) === 'non-semver',
    'github: protocol detected as non-semver'
  );

  assert(
    (await detectVersionType('workspace:*')) === 'non-semver',
    'workspace: protocol detected as non-semver'
  );

  assert(
    (await detectVersionType('git+https://github.com/user/repo.git')) ===
      'non-semver',
    'git: protocol detected as non-semver'
  );

  assert(
    (await detectVersionType('latest')) === 'non-semver',
    'Tag "latest" detected as non-semver'
  );

  assert(
    (await detectVersionType('next')) === 'non-semver',
    'Tag "next" detected as non-semver'
  );

  console.log('');

  // ==========================================
  // TEST 3: Pre-releases
  // ==========================================
  console.log('📦 TEST 3: Pre-releases');

  assert(
    (await detectVersionType('1.2.3-alpha.1')) === 'ok',
    'Pre-release version 1.2.3-alpha.1 parsed as ok'
  );

  assert(
    (await detectVersionType('2.0.0-beta')) === 'ok',
    'Pre-release version 2.0.0-beta parsed as ok'
  );

  const gap1 = await calculateVersionGap('1.0.0-alpha', '1.0.0');
  assert(
    gap1.status === 'ok' && gap1.major === 0,
    'Gap from pre-release to stable calculated correctly'
  );

  console.log('');

  // ==========================================
  // TEST 4: Version Gap Calculation
  // ==========================================
  console.log('📦 TEST 4: Version Gap Calculation');

  const gap2 = await calculateVersionGap('1.0.0', '3.5.2');
  assert(
    gap2.major === 2 && gap2.minor === 0 && gap2.patch === 0,
    'Major gap of 2 calculated correctly (1.0.0 → 3.5.2)'
  );

  const gap3 = await calculateVersionGap('2.3.4', '2.8.1');
  assert(
    gap3.major === 0 && gap3.minor === 5 && gap3.patch === 0,
    'Minor gap of 5 calculated correctly (2.3.4 → 2.8.1)'
  );

  const gap4 = await calculateVersionGap('5.0.0', '5.0.10');
  assert(
    gap4.major === 0 && gap4.minor === 0 && gap4.patch === 10,
    'Patch gap of 10 calculated correctly (5.0.0 → 5.0.10)'
  );

  // Gap con range debe retornar status != 'ok'
  const gap5 = await calculateVersionGap('^1.0.0', '2.0.0');
  assert(
    gap5.status === 'range',
    'Gap with range version returns status="range"'
  );

  console.log('');

  // ==========================================
  // TEST 5: Lockfile sin packages completos
  // ==========================================
  console.log('📦 TEST 5: Lockfile Incompleto');

  // Lockfile sin packages[""]
  const incompleteLockfile = {
    packages: {
      'node_modules/react': { version: '19.0.0' },
    },
  };

  const packageJsonFallback = {
    dependencies: {
      react: '^19.0.0',
      axios: '^1.0.0',
    },
    devDependencies: {
      jest: '^30.0.0',
    },
  };

  const { directRuntime, directDev } = extractDirectDependencies(
    incompleteLockfile,
    packageJsonFallback
  );

  assert(
    directRuntime.has('react') && directRuntime.has('axios'),
    'Fallback to package.json works for runtime deps'
  );

  assert(directDev.has('jest'), 'Fallback to package.json works for dev deps');

  // Clasificación cuando no hay datos
  const emptyLockfile = { packages: {} };
  const { directRuntime: emptyRuntime, directDev: emptyDev } =
    extractDirectDependencies(emptyLockfile, null);
  const classification = classifyDependency(
    'some-package',
    emptyRuntime,
    emptyDev
  );

  assert(
    classification.isDirect === null && classification.isRuntime === null,
    'Classification returns null when no data available (no inventar)'
  );

  console.log('');

  // ==========================================
  // TEST 6: Coerción de versiones no estándar
  // ==========================================
  console.log('📦 TEST 6: Coerción de Versiones');

  const gap6 = await calculateVersionGap('v1.2.3', 'v2.0.0');
  assert(
    gap6.status === 'ok' && gap6.major === 1,
    'Version with "v" prefix coerced correctly (v1.2.3 → v2.0.0, major gap 1)'
  );

  const gap7 = await calculateVersionGap('1.2.0', '1.3.0');
  assert(
    gap7.status === 'ok' && gap7.minor === 1,
    'Version coerced correctly (1.2.0 → 1.3.0, minor gap 1)'
  );

  console.log('');

  // ==========================================
  // RESUMEN
  // ==========================================
  console.log('='.repeat(50));
  console.log(` RESULTADOS:`);
  console.log(`   Passed: ${passedTests}`);
  console.log(`    Failed: ${failedTests}`);
  console.log(`   Total: ${passedTests + failedTests}`);
  console.log('='.repeat(50));

  if (failedTests === 0) {
    console.log('\n🎉 Todos los smoke tests pasaron exitosamente!\n');
    process.exit(0);
  } else {
    console.log(
      `\n⚠️  ${failedTests} test(s) fallaron. Revisar implementación.\n`
    );
    process.exit(1);
  }
}

// Ejecutar tests
runTests().catch((err) => {
  console.error(' Error ejecutando tests:', err);
  process.exit(1);
});
