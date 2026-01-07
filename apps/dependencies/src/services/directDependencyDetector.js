/**
 * @fileoverview Detecta si una dependencia es directa o transitiva
 * usando package-lock.json packages[""] como source of truth,
 * con fallback a package.json si packages[""] no existe
 */

/**
 * Extrae dependencias directas del package-lock.json
 * Con fallback a package.json si packages[""] no está disponible
 *
 * @param {Object} lockfileJson - Contenido parseado de package-lock.json
 * @param {Object} packageJson - Contenido parseado de package.json (fallback)
 * @returns {{ direct: Set<string>, directRuntime: Set<string>, directDev: Set<string> }}
 */
export function extractDirectDependencies(lockfileJson, packageJson = null) {
  const direct = new Set();
  const directRuntime = new Set();
  const directDev = new Set();

  try {
    const packages = lockfileJson?.packages || {};
    const rootPackage = packages[''] || packages['./'];

    // Intentar desde packages[""]
    if (
      rootPackage &&
      (rootPackage.dependencies || rootPackage.devDependencies)
    ) {
      // Dependencies (runtime)
      const runtimeDeps = rootPackage.dependencies || {};
      Object.keys(runtimeDeps).forEach((pkg) => {
        direct.add(pkg);
        directRuntime.add(pkg);
      });

      // DevDependencies
      const devDeps = rootPackage.devDependencies || {};
      Object.keys(devDeps).forEach((pkg) => {
        direct.add(pkg);
        directDev.add(pkg);
      });

      return { direct, directRuntime, directDev };
    }

    // Fallback a package.json si existe
    if (packageJson) {
      console.warn(
        'packages[""] not found in lockfile, falling back to package.json'
      );

      const runtimeDeps = packageJson.dependencies || {};
      Object.keys(runtimeDeps).forEach((pkg) => {
        direct.add(pkg);
        directRuntime.add(pkg);
      });

      const devDeps = packageJson.devDependencies || {};
      Object.keys(devDeps).forEach((pkg) => {
        direct.add(pkg);
        directDev.add(pkg);
      });

      return { direct, directRuntime, directDev };
    }

    // Si no hay ninguna fuente, retornar vacío
    console.warn('No source available for direct dependencies detection');
    return { direct, directRuntime, directDev };
  } catch (err) {
    console.error('Error extracting direct dependencies:', err);
    return {
      direct: new Set(),
      directRuntime: new Set(),
      directDev: new Set(),
    };
  }
}

/**
 * Determina si una dependencia es directa y su tipo
 * Retorna null si no se puede determinar (evita inventar valores)
 *
 * @param {string} packageName
 * @param {Set<string>} directRuntime
 * @param {Set<string>} directDev
 * @returns {{ isDirect: boolean|null, isRuntime: boolean|null }}
 */
export function classifyDependency(packageName, directRuntime, directDev) {
  const inRuntime = directRuntime.has(packageName);
  const inDev = directDev.has(packageName);

  if (inRuntime) {
    return { isDirect: true, isRuntime: true };
  }

  if (inDev) {
    return { isDirect: true, isRuntime: false };
  }

  // Si tenemos datos válidos pero no está en ninguno = transitive
  if (directRuntime.size > 0 || directDev.size > 0) {
    return { isDirect: false, isRuntime: null };
  }

  // Si no tenemos datos, no inventar
  return { isDirect: null, isRuntime: null };
}
