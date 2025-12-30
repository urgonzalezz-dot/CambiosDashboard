import axios from 'axios';
import { useState, useCallback } from 'react';

export const useGetFunctionPublic = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getData = useCallback(
    async (
      url,
      params = {},
      headers = {},
      fallbackToken = '',
      responseType = undefined,
      onDownloadProgress = undefined
    ) => {
      setLoading(true);
      setError(null);

      const token = fallbackToken; // sin Auth0

      try {
        const response = await axios.get(url, {
          params,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
          },
          responseType,
          onDownloadProgress,
        });

        setData(response); // igual que el del equipo (guarda response completo)
        return response;
      } catch (err) {
        setError(err);
        return { err };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = () => setError(null);

  return { data, loading, error, getData, clearError };
};
