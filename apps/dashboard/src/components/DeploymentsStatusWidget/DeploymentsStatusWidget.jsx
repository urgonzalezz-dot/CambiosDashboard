import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './DeploymentsStatusWidget.module.scss';

/**
 * DeploymentsStatusWidget
 *
 * UI simple:
 * - Tasa de éxito
 * - Tasa de falla
 */
const DeploymentsStatusWidget = ({ stats }) => {
  const safe = useMemo(() => {
    const successRate = Number(stats?.successRate ?? 0);
    const failureRate = Number(stats?.failureRate ?? 0);

    // Si viene solo success, calculamos failure
    const normalizedSuccess = Math.max(0, Math.min(100, successRate));
    const normalizedFailure =
      stats?.failureRate == null
        ? Math.max(0, Math.min(100, 100 - normalizedSuccess))
        : Math.max(0, Math.min(100, failureRate));

    return { successRate: normalizedSuccess, failureRate: normalizedFailure };
  }, [stats]);

  const hasAnyData = stats?.successRate != null || stats?.failureRate != null;

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.itemHeader}>
          <span className={styles.label}>Tasa de éxito</span>
          <span className={styles.value}>
            {hasAnyData ? `${safe.successRate}%` : '—'}
          </span>
        </div>
        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            data-tone="success"
            style={{ width: `${safe.successRate}%` }}
          />
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.itemHeader}>
          <span className={styles.label}>Tasa de falla</span>
          <span className={styles.value}>
            {hasAnyData ? `${safe.failureRate}%` : '—'}
          </span>
        </div>
        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            data-tone="failure"
            style={{ width: `${safe.failureRate}%` }}
          />
        </div>
      </div>

      {!hasAnyData && (
        <div className={styles.emptyNote}>
          Sin datos aún. Mostrando estructura lista para conectar API.
        </div>
      )}
    </div>
  );
};

DeploymentsStatusWidget.propTypes = {
  stats: PropTypes.shape({
    successRate: PropTypes.number,
    failureRate: PropTypes.number,
  }),
};

DeploymentsStatusWidget.displayName = 'DeploymentsStatusWidget';
export default React.memo(DeploymentsStatusWidget);
