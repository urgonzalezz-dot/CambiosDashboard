import React from 'react';
import { GenericCard } from '@libs/ui';
import AssessmentIcon from '@mui/icons-material/Assessment';
import styles from './ExecutiveSummaryCard.module.scss';

const ExecutiveSummaryCard = ({ riskDistribution, stats, metadata }) => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'critical':
        return '#DC2626'; // red-600
      case 'high':
        return '#EA580C'; // orange-600
      case 'medium':
        return '#F59E0B'; // amber-500
      case 'low':
        return '#10B981'; // green-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  return (
    <GenericCard title="Resumen " icon={<AssessmentIcon />}>
      {/* Warning si es análisis parcial */}
      {metadata?.isPartial && (
        <div className={styles.warningBanner}>
          Mostrando {metadata.analyzedCount} de {metadata.totalAvailable}{' '}
          dependencias
        </div>
      )}

      {/* Risk Distribution */}
      <div className={styles.riskDistribution}>
        <h3>Distribución de Riesgo</h3>
        <div className={styles.riskGrid}>
          {Object.entries(riskDistribution).map(([level, count]) => (
            <div
              key={level}
              className={styles.riskCard}
              style={{ borderLeftColor: getRiskColor(level) }}
            >
              <div className={styles.riskLevel}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </div>
              <div className={styles.riskCount}>{count}</div>
              <div className={styles.riskLabel}>dependencias</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Clave */}
      <div className={styles.statsSection}>
        <h3>Estadísticas Clave</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue} style={{ color: '#DC2626' }}>
              {stats.deprecated}
            </span>
            <span className={styles.statLabel}>Deprecated</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue} style={{ color: '#10B981' }}>
              {stats.safeUpdates}
            </span>
            <span className={styles.statLabel}>Actualizaciones seguras</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.upToDate}</span>
            <span className={styles.statLabel}>Actualizadas</span>
          </div>
          {stats.nonSemver > 0 && (
            <div className={styles.statItem}>
              <span className={styles.statValue} style={{ color: '#F59E0B' }}>
                {stats.nonSemver}
              </span>
              <span className={styles.statLabel}>Non-semver</span>
            </div>
          )}
        </div>
      </div>

      {/* Metadata Info */}
      {metadata && (
        <div className={styles.metadataInfo}>
          <small>
            Análisis v{metadata.analysisVersion} •{' '}
            {new Date(metadata.generatedAt).toLocaleString('es-MX')}
          </small>
        </div>
      )}
    </GenericCard>
  );
};

ExecutiveSummaryCard.displayName = 'ExecutiveSummaryCard';
export default ExecutiveSummaryCard;
