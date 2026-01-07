import { useCallback } from 'react';
import { useGetFunctionPublic } from '@libs/hooks';
import { extractMainLockedVersions } from '@libs/utilities';

export const useGithubLockfile = () => {
  const { data, loading, error, getData, clearError } = useGetFunctionPublic();

  const fetchLockfileDependencies = useCallback(async () => {
    const owner = 'urgonzalezz-dot';
    const repo = 'prueba-api-git';
    const path = 'Proyecto/package-lock.json';
    const token = '';

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const res = await getData(
      url,
      {},
      { 'X-GitHub-Api-Version': '2022-11-28' },
      token
    );

    if (res?.err) return { err: res.err };

    const base64Content = res?.data?.content;
    if (!base64Content) return { err: new Error('GitHub content is empty') };

    // En browser: atob decodifica base64
    const decoded = atob(base64Content);
    const lockJson = JSON.parse(decoded);

    const extracted = extractMainLockedVersions(lockJson);
    return extracted; // { dependencies, devDependencies }
  }, [getData]);

  return { data, loading, error, clearError, fetchLockfileDependencies };
};
