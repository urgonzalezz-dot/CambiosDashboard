import React from 'react';
import PropTypes from 'prop-types';

import DependencyCard from '../DependencyCard';
import styles from './DependenciesGrid.module.scss';

/**
 * DependenciesGrid Component
 *
 * Layout 2 columnas:
 * - Izquierda: dependencias desactualizadas
 * - Derecha: dependencias actualizadas
 */
const DependenciesGrid = ({ dependencies = [], onDependencyInfo }) => {
  const outdatedDeps = dependencies.filter((dep) => dep.isOutdated);
  const updatedDeps = dependencies.filter((dep) => !dep.isOutdated);

  const isEmpty = dependencies.length === 0;

  if (isEmpty) {
    return (
      <div className={styles.empty}>
        <p>No hay dependencias para mostrar</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {/* Columna izquierda: Desactualizadas */}
      <div className={styles.column}>
        {outdatedDeps.length === 0 ? (
          <p className={styles.columnEmpty}>
            No hay dependencias desactualizadas
          </p>
        ) : (
          <div className={styles.cardsList}>
            {outdatedDeps.map((dep) => (
              <DependencyCard
                key={`${dep.packageName}-${dep.currentVersion}-${dep.latestVersion}-outdated`}
                packageName={dep.packageName}
                author={dep.author}
                currentVersion={dep.currentVersion}
                latestVersion={dep.latestVersion}
                isOutdated={dep.isOutdated}
                onInfoClick={() => onDependencyInfo?.(dep)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Columna derecha: Actualizadas */}
      <div className={styles.column}>
        {updatedDeps.length === 0 ? (
          <p className={styles.columnEmpty}>No hay dependencias actualizadas</p>
        ) : (
          <div className={styles.cardsList}>
            {updatedDeps.map((dep) => (
              <DependencyCard
                key={`${dep.packageName}-${dep.currentVersion}-${dep.latestVersion}-updated`}
                packageName={dep.packageName}
                author={dep.author}
                currentVersion={dep.currentVersion}
                latestVersion={dep.latestVersion}
                isOutdated={dep.isOutdated}
                onInfoClick={() => onDependencyInfo?.(dep)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

DependenciesGrid.propTypes = {
  dependencies: PropTypes.arrayOf(
    PropTypes.shape({
      packageName: PropTypes.string.isRequired,
      author: PropTypes.string,
      currentVersion: PropTypes.string.isRequired,
      latestVersion: PropTypes.string.isRequired,
      isOutdated: PropTypes.bool,
    })
  ),
  onDependencyInfo: PropTypes.func,
};

DependenciesGrid.displayName = 'DependenciesGrid';
export default DependenciesGrid;
