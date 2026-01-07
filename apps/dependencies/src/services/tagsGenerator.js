/**
 * @fileoverview Genera tags para categorizar dependencias
 */

/**
 * Genera tags basadas en el análisis de la dependencia
 * @param {Object} params
 * @param {Object|null} params.vulnerabilities
 * @param {Object} params.versionGap
 * @param {boolean} params.isDeprecated
 * @param {boolean|null} params.isDirect
 * @param {boolean|null} params.isRuntime
 * @param {boolean} params.isOutdated
 * @param {number} params.ageInMonths
 * @param {string} params.versionParseStatus
 * @returns {string[]} Array de tags
 */
export function generateTags({
  vulnerabilities = null,
  versionGap = { major: 0, minor: 0, patch: 0, status: 'unknown' },
  isDeprecated = false,
  isDirect = null,
  isRuntime = null,
  isOutdated = false,
  ageInMonths = 0,
  versionParseStatus = 'ok',
}) {
  const tags = [];

  // 1. Security (MVP: no aplica)
  if (vulnerabilities && vulnerabilities.total > 0) {
    tags.push('security');
  }

  // 2. Breaking change (major gap >= 1)
  if (versionGap.status === 'ok' && versionGap.major >= 1) {
    tags.push('breaking-change');
  }

  // 3. Transitive (NO es directa, o no se pudo determinar)
  if (isDirect === false) {
    tags.push('transitive');
  } else if (isDirect === null) {
    tags.push('unknown-type'); // No se pudo determinar
  }

  // 4. EOL/Unmaintained (deprecated o muy viejo)
  if (isDeprecated) {
    tags.push('eol-unmaintained');
  } else if (ageInMonths > 24) {
    tags.push('low-activity');
  }

  // 5. Minor update (solo minor/patch disponible, no major)
  if (versionGap.status === 'ok' && versionGap.major === 0 && isOutdated) {
    tags.push('minor-update');
  }

  // 6. Up to date
  if (!isOutdated) {
    tags.push('up-to-date');
  }

  // 7. Runtime (dependencias de producción)
  if (isDirect === true && isRuntime === true) {
    tags.push('runtime');
  }

  // 8. Non-semver (versiones no parseables)
  if (versionParseStatus !== 'ok') {
    tags.push('non-semver');
  }

  return tags;
}
