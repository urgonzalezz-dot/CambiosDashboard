/**
 * @fileoverview Análisis de versiones usando librería semver
 * Cubre: coerción, ranges, pre-releases con versionParseStatus
 */

import * as semverWrapper from './semverWrapper.js';

/**
 * Detecta el tipo de versión y su status de parseo
 * @param {string} version
 * @returns {Promise<'ok' | 'range' | 'non-semver'>}
 */
export async function detectVersionType(version) {
  if (!version) return 'non-semver';

  const v = String(version).trim();

  // Detectar aliases especiales (no semver)
  if (
    v.startsWith('npm:') ||
    v.startsWith('file:') ||
    v.startsWith('link:') ||
    v.startsWith('workspace:') ||
    v.startsWith('git:') ||
    v.startsWith('github:') ||
    v.startsWith('http:') ||
    v.startsWith('https:')
  ) {
    return 'non-semver';
  }

  // Detectar tags comunes
  if (v === 'latest' || v === 'next' || v === 'canary') {
    return 'non-semver';
  }

  // Detectar ranges usando validRange de semver
  const isRange = await semverWrapper.validRange(v);
  const isValid = await semverWrapper.valid(v);

  if (isRange && !isValid) {
    // Es un range válido pero no una versión exacta
    return 'range';
  }

  //  coerce (maneja pre-releases, formatos no estándar)
  const coerced = await semverWrapper.coerce(v);
  if (!coerced) {
    return 'non-semver';
  }

  return 'ok';
}

/**
 * Normaliza una versión para análisis
 * Maneja coerción y limpieza de prefijos
 * @param {string} version
 * @returns {Promise<string|null>}
 */
async function normalizeVersion(version) {
  if (!version) return null;

  const v = String(version).trim();

  // Primero intentar como versión válida exacta
  const isValid = await semverWrapper.valid(v);
  if (isValid) {
    const cleaned = await semverWrapper.clean(v);
    return cleaned;
  }

  // Si no, intentar coerce
  const coerced = await semverWrapper.coerce(v);
  return coerced ? coerced.version : null;
}

/**
 * Calcula el gap de versiones usando semver
 * @param {string} currentVersion
 * @param {string} latestVersion
 * @returns {Promise<{ major: number, minor: number, patch: number, status: string }>}
 */
export async function calculateVersionGap(currentVersion, latestVersion) {
  const defaultResult = {
    major: 0,
    minor: 0,
    patch: 0,
    status: 'unknown',
  };

  try {
    const currentType = await detectVersionType(currentVersion);
    const latestType = await detectVersionType(latestVersion);

    // Si alguna es non-semver o range, no calcular gap
    if (currentType !== 'ok' || latestType !== 'ok') {
      return {
        ...defaultResult,
        status: currentType !== 'ok' ? currentType : latestType,
      };
    }
    // Normalizar versiones
    const current = await normalizeVersion(currentVersion);
    const latest = await normalizeVersion(latestVersion);

    if (!current || !latest) {
      return { ...defaultResult, status: 'parse-error' };
    }

    // Parsear con semver
    const currentSemver = await semverWrapper.parse(current);
    const latestSemver = await semverWrapper.parse(latest);

    if (!currentSemver || !latestSemver) {
      return { ...defaultResult, status: 'parse-error' };
    }

    // Calcular gaps
    const majorGap = Math.max(0, latestSemver.major - currentSemver.major);
    const minorGap =
      majorGap > 0 ? 0 : Math.max(0, latestSemver.minor - currentSemver.minor);
    const patchGap =
      majorGap > 0 || minorGap > 0
        ? 0
        : Math.max(0, latestSemver.patch - currentSemver.patch);

    return {
      major: majorGap,
      minor: minorGap,
      patch: patchGap,
      status: 'ok',
    };
  } catch (err) {
    console.warn('Error calculating version gap:', err);
    return { ...defaultResult, status: 'error' };
  }
}

/**
 * Compara dos versiones (retorna true si version1 < version2)
 * @param {string} version1
 * @param {string} version2
 * @returns {Promise<boolean>}
 */
export async function isVersionOutdated(version1, version2) {
  try {
    const type1 = await detectVersionType(version1);
    const type2 = await detectVersionType(version2);

    if (type1 !== 'ok' || type2 !== 'ok') {
      // Fallback a comparación string
      return String(version1) !== String(version2);
    }

    const v1 = await normalizeVersion(version1);
    const v2 = await normalizeVersion(version2);

    if (!v1 || !v2) {
      return String(version1) !== String(version2);
    }

    return await semverWrapper.lt(v1, v2);
  } catch (err) {
    console.warn('Error comparing versions:', err);
    return String(version1) !== String(version2);
  }
}

/**
 * Calcula la edad en meses desde una fecha
 * @param {string|Date|null} dateString - Fecha ISO o Date object
 * @returns {number} - Edad en meses (0 si no hay fecha)
 */
export function calculateAgeInMonths(dateString) {
  if (!dateString) return 0;

  try {
    const date = new Date(dateString);
    const now = new Date();

    if (isNaN(date.getTime())) return 0;

    const diffMs = now - date;
    const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30);

    return Math.max(0, Math.floor(diffMonths));
  } catch (err) {
    console.warn('Error calculating age:', err);
    return 0;
  }
}
