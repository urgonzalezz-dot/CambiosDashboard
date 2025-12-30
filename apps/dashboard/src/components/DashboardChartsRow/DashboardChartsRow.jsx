import React from 'react';
import PropTypes from 'prop-types';
import { GenericCard } from '@libs/ui';
import DependenciesStatusWidget from '../DependenciesStatusWidget/DependenciesStatusWidget';
import DeploymentsStatusWidget from '../DeploymentsStatusWidget/DeploymentsStatusWidget';
import styles from './DashboardChartsRow.module.scss';

/**
 * DashboardChartsRow
 *
 * Renderiza dos cards en layout 2 columnas:
 * - Estado de dependencias
 * - Despliegues
 */
const DashboardChartsRow = ({ dependenciesStats, deploymentsStats }) => {
  return (
    <div className={styles.row}>
      <GenericCard title="Estado de dependencias">
        <DependenciesStatusWidget stats={dependenciesStats} />
      </GenericCard>

      <GenericCard title="Despliegues">
        <DeploymentsStatusWidget stats={deploymentsStats} />
      </GenericCard>
    </div>
  );
};

DashboardChartsRow.propTypes = {
  dependenciesStats: PropTypes.shape({
    total: PropTypes.number,
    updated: PropTypes.number,
    outdated: PropTypes.number,
    pending: PropTypes.number,
    error: PropTypes.number,
  }),
  deploymentsStats: PropTypes.shape({
    successRate: PropTypes.number, // 0-100
    failureRate: PropTypes.number, // 0-100
  }),
};

DashboardChartsRow.displayName = 'DashboardChartsRow';
export default React.memo(DashboardChartsRow);
