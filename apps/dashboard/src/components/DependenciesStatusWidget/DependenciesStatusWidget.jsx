import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './DependenciesStatusWidget.module.scss';

/**
 * DependenciesStatusWidget
 *
 * UI basada en:
 * - Total
 * - Actualizadas / Pendientes / Error / Desactualizadas
 * - Barras proporcionales
 *
 * Nota: si stats vienen vacíos, muestra placeholders.
 */
const DependenciesStatusWidget = ({ stats }) => {
  const safe = useMemo(() => {
    const total = Number(stats?.total ?? 0);
    const updated = Number(stats?.updated ?? 0);
    const pending = Number(stats?.pending ?? 0);
    const error = Number(stats?.error ?? 0);
    const outdated = Number(stats?.outdated ?? 0);

    const computedTotal = total || updated + pending + error + outdated;
    return { total: computedTotal, updated, pending, error, outdated };
  }, [stats]);

  const rows = useMemo(
    () => [
      { label: 'Actualizadas', value: safe.updated, tone: 'updated' },
      { label: 'Pendientes', value: safe.pending, tone: 'pending' },
      { label: 'Error', value: safe.error, tone: 'error' },
      { label: 'Desactualizadas', value: safe.outdated, tone: 'outdated' },
    ],
    [safe]
  );

  const hasAnyData = safe.total > 0;

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.totalBlock}>
          <div className={styles.totalValue}>
            {hasAnyData ? safe.total : '—'}
          </div>
          <div className={styles.totalLabel}>Dependencias totales</div>
        </div>

        {/* Placeholder “donut” (sin librería) */}
        <div className={styles.donutPlaceholder} aria-hidden="true" />
      </div>

      <div className={styles.list}>
        {rows.map((r) => {
          const pct = hasAnyData ? Math.round((r.value / safe.total) * 100) : 0;

          return (
            <div key={r.label} className={styles.item}>
              <div className={styles.itemHeader}>
                <div className={styles.itemLeft}>
                  <span className={styles.dot} data-tone={r.tone} />
                  <span className={styles.label}>{r.label}</span>
                </div>
                <div className={styles.meta}>
                  {hasAnyData ? `${pct}% (${r.value})` : '—'}
                </div>
              </div>

              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  data-tone={r.tone}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {!hasAnyData && (
        <div className={styles.emptyNote}>
          Sin datos aún. Mostrando estructura lista para conectar API.
        </div>
      )}
    </div>
  );
};

DependenciesStatusWidget.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number,
    updated: PropTypes.number,
    outdated: PropTypes.number,
    pending: PropTypes.number,
    error: PropTypes.number,
  }),
};

DependenciesStatusWidget.displayName = 'DependenciesStatusWidget';
export default React.memo(DependenciesStatusWidget);
