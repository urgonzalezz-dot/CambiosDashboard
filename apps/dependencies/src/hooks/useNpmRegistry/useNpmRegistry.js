import { useCallback } from 'react';
import { useGetFunctionPublic } from '@libs/hooks';

const NPM_REGISTRY = 'https://registry.npmjs.org';

export const useNpmRegistry = () => {
  const { loading, error, getData } = useGetFunctionPublic();

  const getPackageMetadata = useCallback(
    async (packageName) => {
      const encoded = encodeURIComponent(packageName);
      const res = await getData(`${NPM_REGISTRY}/${encoded}`);
      if (res?.err) return { err: res.err };
      return res?.data; // axios response.data
    },
    [getData]
  );

  const getLatestVersion = useCallback(
    async (packageName) => {
      const meta = await getPackageMetadata(packageName);
      if (meta?.err) return { err: meta.err };
      return { latest: meta?.['dist-tags']?.latest || null };
    },
    [getPackageMetadata]
  );

  return { loading, error, getPackageMetadata, getLatestVersion };
};
