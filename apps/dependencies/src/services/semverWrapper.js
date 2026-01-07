/**
 * @fileoverview Wrapper para semver que funciona en ES modules y CommonJS
 */

async function loadSemver() {
  try {
    // Intentar como ES module
    const mod = await import('semver');
    return mod.default || mod;
  } catch (err) {
    return null;
  }
}

// Inicializar semver
let semverInstance = null;

export async function getSemver() {
  if (!semverInstance) {
    semverInstance = await loadSemver();
    if (!semverInstance) {
      throw new Error('Could not load semver library');
    }
  }
  return semverInstance;
}

export async function valid(version) {
  const s = await getSemver();
  return s.valid(version);
}

export async function validRange(range) {
  const s = await getSemver();
  return s.validRange(range);
}

export async function clean(version) {
  const s = await getSemver();
  return s.clean(version);
}

export async function coerce(version) {
  const s = await getSemver();
  return s.coerce(version);
}

export async function parse(version) {
  const s = await getSemver();
  return s.parse(version);
}

export async function lt(v1, v2) {
  const s = await getSemver();
  return s.lt(v1, v2);
}
