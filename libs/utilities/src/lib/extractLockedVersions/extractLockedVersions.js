export function extractMainLockedVersions(lockFile) {
  const lockedVersionsGen = {};
  const lockedVersionsDev = {};
  const packages = lockFile.packages || {};

  const rootDependencies = packages['']?.dependencies || {};
  const rootDevDependencies = packages['']?.devDependencies || {};

  const mainDevNames = new Set(Object.keys(rootDevDependencies));
  const mainDepNames = new Set(Object.keys(rootDependencies));

  for (const key in packages) {
    if (key.startsWith('node_modules/') && packages[key].version) {
      const packageName = key.substring('node_modules/'.length);

      if (mainDevNames.has(packageName))
        lockedVersionsDev[packageName] = packages[key].version;
      if (mainDepNames.has(packageName))
        lockedVersionsGen[packageName] = packages[key].version;
    }
  }

  return {
    dependencies: lockedVersionsGen,
    devDependencies: lockedVersionsDev,
  };
}
