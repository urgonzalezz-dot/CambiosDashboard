import React, { useState } from 'react';
import { GenericCard } from '@libs/ui';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import DependencyPriorityCard from '../DependencyPriorityCard/DependencyPriorityCard';
import styles from './PrioritySection.module.scss';

const PrioritySection = ({ topPriority, onDependencyInfo }) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'runtime' | 'dev'

  const filteredDeps = topPriority.filter((dep) => {
    if (filter === 'all') return true;
    if (filter === 'runtime') return dep.analysis?.isRuntime === true;
    if (filter === 'dev')
      return (
        dep.analysis?.isRuntime === false && dep.analysis?.isDirect === true
      );
    return true;
  });

  return (
    <GenericCard
      title={`Top Prioridad (${filteredDeps.length})`}
      icon={<PriorityHighIcon />}
    >
      {/* Filtros */}
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterButton} ${
            filter === 'all' ? styles.active : ''
          }`}
          onClick={() => setFilter('all')}
        >
          Todas ({topPriority.length})
        </button>
        <button
          className={`${styles.filterButton} ${
            filter === 'runtime' ? styles.active : ''
          }`}
          onClick={() => setFilter('runtime')}
        >
          Runtime (
          {topPriority.filter((d) => d.analysis?.isRuntime === true).length})
        </button>
        <button
          className={`${styles.filterButton} ${
            filter === 'dev' ? styles.active : ''
          }`}
          onClick={() => setFilter('dev')}
        >
          Dev (
          {
            topPriority.filter(
              (d) =>
                d.analysis?.isRuntime === false && d.analysis?.isDirect === true
            ).length
          }
          )
        </button>
      </div>

      {/* Lista de Dependencias Priorizadas */}
      <div className={styles.priorityList}>
        {filteredDeps.length === 0 ? (
          <p className={styles.emptyMessage}>
            No hay dependencias con esta prioridad
          </p>
        ) : (
          filteredDeps.map((dep) => (
            <DependencyPriorityCard
              key={dep.packageName}
              dependency={dep}
              onViewDetails={() => onDependencyInfo(dep)}
            />
          ))
        )}
      </div>
    </GenericCard>
  );
};

PrioritySection.displayName = 'PrioritySection';
export default PrioritySection;
