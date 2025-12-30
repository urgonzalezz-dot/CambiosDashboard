const normalizeVersion = (v) => {
  if (!v) return '';
  return String(v).trim();
};

export const buildDependenciesComparison = async ({
  lockedMap,
  getLatestVersion,
  limit = 15,
}) => {
  const entries = Object.entries(lockedMap || {});
  const slice = entries.slice(0, limit);

  const latestResults = await Promise.all(
    slice.map(async ([packageName]) => {
      const r = await getLatestVersion(packageName);
      return [packageName, r?.latest ?? null];
    })
  );

  const latestMap = Object.fromEntries(latestResults);

  const list = slice.map(([packageName, currentVersion]) => {
    const current = normalizeVersion(currentVersion);
    const latest = normalizeVersion(latestMap[packageName]);

    const hasLatest = Boolean(latest);
    const isOutdated = hasLatest ? current !== latest : false;

    return {
      packageName,
      author: '',
      currentVersion: current || 'N/A',
      latestVersion: latest || 'N/A',
      isOutdated,
    };
  });

  return list;
};

export const getStatsFromList = (list = []) => {
  const total = list.length;
  const outdated = list.filter((d) => d.isOutdated).length;
  const updated = total - outdated;
  return { total, outdated, updated };
};
