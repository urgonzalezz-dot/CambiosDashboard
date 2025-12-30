import React from 'react';
import { useHostContext } from '@libs/ui';
import { useGithubLockfile } from '../hooks/useGithubLockfile/useGithubLockfile';
import App from '../app/app';
import styles from './Dependencies.module.scss';

const Dependencies = () => {
  const hostContext = useHostContext();
  const isInHost = hostContext?.layout?.isInHost || false;

  const { fetchLockfileDependencies, loading, error } = useGithubLockfile();

  React.useEffect(() => {
    if (isInHost) {
      console.log('Dependencies MFE cargado dentro del host', {
        user: hostContext.user,
        layout: hostContext.layout,
      });
    }
  }, [isInHost, hostContext]);

  // 🔎 VALIDACIÓN REAL (temporal)
  React.useEffect(() => {
    (async () => {
      const res = await fetchLockfileDependencies();
      console.log('LOCKFILE DEPENDENCIES RESULT:', res);
    })();
  }, [fetchLockfileDependencies]);

  if (loading) {
    return (
      <div className={styles.dependenciesPage}>Cargando dependencias…</div>
    );
  }

  if (error) {
    return (
      <div className={styles.dependenciesPage}>
        Error al cargar dependencias
      </div>
    );
  }

  return (
    <div className={styles.dependenciesPage}>
      <App />
    </div>
  );
};

Dependencies.displayName = 'Dependencies';
export default React.memo(Dependencies);
