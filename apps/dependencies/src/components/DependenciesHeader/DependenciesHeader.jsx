import React from 'react';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Button } from '@libs/ui';
import styles from './DependenciesHeader.module.scss';

/**
 * DependenciesHeader Component
 *
 * Header del análisis de dependencias con:
 * - Título y repositorio
 * - Botón de actualizar
 * - Información de última actualización
 */
const DependenciesHeader = ({
  onRefresh,
  lastUpdate = '02/12/2025 12:00:00 am',
  repository = 'Entrada única',
  totalDependencies = 50,
  outdated = 30,
  updated = 20,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        {/* Sección izquierda: Título y stats */}
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Análisis de dependencias</h1>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Análisis:</span>
              <span className={styles.statValue}>
                {outdated} de {totalDependencies}
              </span>
              <span className={styles.badge} data-status="outdated">
                Desactualizadas
              </span>
            </div>

            <div className={styles.stat}>
              <span className={styles.statLabel}>Análisis:</span>
              <span className={styles.statValue}>
                {updated} de {totalDependencies}
              </span>
              <span className={styles.badge} data-status="updated">
                Actualizadas
              </span>
            </div>
          </div>
        </div>

        {/* Sección derecha: Botón y metadata */}
        <div className={styles.headerRight}>
          <Button
            variant="primary"
            size="md"
            startIcon={<AutorenewIcon />}
            onClick={onRefresh}
          >
            Actualizar
          </Button>

          <div className={styles.metadata}>
            <p>Último cambio: {lastUpdate}</p>
            <p>Repositorio: {repository}</p>
          </div>
        </div>
      </div>

      {/* Subtítulo */}
      <div className={styles.subtitle}>
        <p>Comparación con versiones más recientes de NPM</p>
      </div>
    </div>
  );
};

DependenciesHeader.displayName = 'DependenciesHeader';
export default DependenciesHeader;
