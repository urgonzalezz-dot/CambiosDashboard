import React, { useCallback, useMemo, useState } from 'react';
import { useHostContext, UpdateCard, GenericCard } from '@libs/ui';
import ExtensionIcon from '@mui/icons-material/Extension';
import DependenciesGrid from '../components/DependenciesGrid';
import styles from './app.module.scss';

import { useGithubLockfile } from '../hooks/useGithubLockfile/useGithubLockfile';
import { useNpmRegistry } from '../hooks/useNpmRegistry/useNpmRegistry';
import {
  buildDependenciesComparison,
  getStatsFromList,
} from '../services/buildDependenciesComparison';

export function App() {
  const hostContext = useHostContext();
  const isInHost = hostContext?.layout?.isInHost || false;

  const [dependencies, setDependencies] = useState([]);
  const [lastUpdate, setLastUpdate] = useState('—');

  const {
    fetchLockfileDependencies,
    loading: loadingLock,
    error: errorLock,
  } = useGithubLockfile();

  const {
    getLatestVersion,
    loading: loadingNpm,
    error: errorNpm,
  } = useNpmRegistry();

  const loading = loadingLock || loadingNpm;
  const error = errorLock || errorNpm;

  const stats = useMemo(() => getStatsFromList(dependencies), [dependencies]);

  const handleRefresh = useCallback(async () => {
    try {
      if (isInHost)
        hostContext.notifications?.show(
          'Actualizando análisis de dependencias...'
        );

      // 1) Lockfile
      const lock = await fetchLockfileDependencies();
      if (lock?.err) throw lock.err;

      // 2) Construir lista (por ahora solo dependencies; luego sumas devDependencies con toggle)
      const lockedMap = lock.dependencies || {};

      const list = await buildDependenciesComparison({
        lockedMap,
        getLatestVersion,
        limit: 20, // demo estable; luego lo haces configurable
      });

      // 3) Guardar estado UI
      setDependencies(list);

      const now = new Date().toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setLastUpdate(now);

      if (isInHost)
        hostContext.notifications?.show('Análisis actualizado correctamente');
    } catch (e) {
      console.error('REFRESH ERROR', e);
      if (isInHost)
        hostContext.notifications?.show('Error al actualizar el análisis');
    }
  }, [fetchLockfileDependencies, getLatestVersion, isInHost, hostContext]);

  const handleDependencyInfo = (dependency) => {
    if (isInHost) {
      hostContext.notifications?.show(
        `Mostrando información de ${dependency.packageName}`
      );
    }
  };

  return (
    <div className={styles.dependenciesContainer}>
      <UpdateCard
        lastUpdate={lastUpdate}
        repository="Entrada única"
        onRefresh={handleRefresh}
      />

      <GenericCard title="Análisis de dependencias" icon={<ExtensionIcon />}>
        {loading && <p>Cargando dependencias…</p>}
        {error && <p>Error al cargar dependencias</p>}

        {!loading && !error && (
          <>
            <p>
              Total: {stats.total} | Desactualizadas: {stats.outdated} |
              Actualizadas: {stats.updated}
            </p>

            <DependenciesGrid
              dependencies={dependencies}
              onDependencyInfo={handleDependencyInfo}
            />
          </>
        )}
      </GenericCard>
    </div>
  );
}

App.displayName = 'DependenciesApp';
export default App;
