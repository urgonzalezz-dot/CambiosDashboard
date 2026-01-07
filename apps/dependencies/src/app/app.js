import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';
import { useHostContext, UpdateCard, GenericCard } from '@libs/ui';
import ExtensionIcon from '@mui/icons-material/Extension';
import DependenciesGrid from '../components/DependenciesGrid';
import ExecutiveSummaryCard from '../components/ExecutiveSummaryCard/ExecutiveSummaryCard';
import PrioritySection from '../components/PrioritySection/PrioritySection';
import styles from './app.module.scss';

import { useGithubLockfile } from '../hooks/useGithubLockfile/useGithubLockfile';
import { useNpmRegistry } from '../hooks/useNpmRegistry/useNpmRegistry';
import { analyzeAllDependencies } from '../services/dependenciesAnalyzer';
import { getStatsFromList } from '../services/buildDependenciesComparison';

export function App() {
  const hostContext = useHostContext();
  const isInHost = hostContext?.layout?.isInHost || false;

  const [dependencies, setDependencies] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('—');

  const {
    fetchLockfileDependencies,
    loading: loadingLock,
    error: errorLock,
  } = useGithubLockfile();

  const {
    getLatestVersion,
    getPackageMetadata,
    loading: loadingNpm,
    error: errorNpm,
  } = useNpmRegistry();

  const loading = loadingLock || loadingNpm;
  const error = errorLock || errorNpm;

  // Stats legacy (para compatibilidad)
  const stats = useMemo(() => getStatsFromList(dependencies), [dependencies]);

  const handleRefresh = useCallback(async () => {
    try {
      if (isInHost)
        hostContext.notifications?.show(
          'Actualizando análisis de dependencias...'
        );

      // 1) Obtener lockfile completo
      const lockfileData = await fetchLockfileDependencies();
      if (lockfileData?.err) throw lockfileData.err;

      // 2) Construir lockfileJson en formato esperado
      const lockfileJson = {
        packages: {
          '': {
            dependencies: lockfileData.dependencies || {},
            devDependencies: lockfileData.devDependencies || {},
          },
          // Agregar packages si están disponibles
          ...(lockfileData.packages || {}),
        },
      };

      const result = await analyzeAllDependencies({
        lockfileJson,
        getLatestVersion,
        getPackageMetadata,
        limit: 50,
        topN: 15,
        repoCommit: null,
      });

      setAnalysisResult(result);

      setDependencies(result.dependencies);

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
  }, [
    fetchLockfileDependencies,
    getLatestVersion,
    getPackageMetadata,
    isInHost,
    hostContext,
  ]);

  const didFetchRef = useRef(false);

  useEffect(() => {
    // Evita doble llamada en dev (React 18 StrictMode)
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    handleRefresh();
  }, [handleRefresh]);

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

      {analysisResult && (
        <ExecutiveSummaryCard
          riskDistribution={analysisResult.executiveSummary.riskDistribution}
          stats={analysisResult.executiveSummary.stats}
          metadata={analysisResult.metadata}
        />
      )}

      {analysisResult &&
        analysisResult.executiveSummary.topPriority.length > 0 && (
          <PrioritySection
            topPriority={analysisResult.executiveSummary.topPriority}
            onDependencyInfo={handleDependencyInfo}
          />
        )}

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
