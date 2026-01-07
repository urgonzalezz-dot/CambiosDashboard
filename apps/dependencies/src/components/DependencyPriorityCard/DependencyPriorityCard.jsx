import React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import styles from './DependencyPriorityCard.module.scss';

const DependencyPriorityCard = ({ dependency, onViewDetails }) => {
  const {
    packageName,
    currentVersion,
    latestVersion,
    riskScore,
    riskLevel,
    tags = [],
    recommendedAction,
    analysis,
  } = dependency;

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical':
        return '#DC2626';
      case 'high':
        return '#EA580C';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getTagColor = (tag) => {
    switch (tag) {
      case 'security':
        return { bg: '#FEE2E2', text: '#991B1B' };
      case 'breaking-change':
        return { bg: '#FFEDD5', text: '#9A3412' };
      case 'eol-unmaintained':
        return { bg: '#F3E8FF', text: '#6B21A8' };
      case 'runtime':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      case 'minor-update':
        return { bg: '#D1FAE5', text: '#065F46' };
      case 'up-to-date':
        return { bg: '#D1FAE5', text: '#065F46' };
      case 'transitive':
        return { bg: '#F3F4F6', text: '#374151' };
      case 'non-semver':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'unknown-type':
        return { bg: '#F3F4F6', text: '#6B7280' };
      case 'low-activity':
        return { bg: '#FEF3C7', text: '#92400E' };
      default:
        return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'UPDATE_SECURITY':
        return 'U';
      case 'REPLACE':
        return 'R';
      case 'PLAN_MIGRATION':
        return 'P';
      case 'UPDATE_MAJOR':
        return 'U';
      case 'UPDATE_SAFE':
        return 'S';
      case 'MONITOR':
        return 'M';
      case 'REVIEW_MANUAL':
        return 'R';
      default:
        return '•';
    }
  };

  return (
    <div
      className={styles.card}
      style={{ borderLeftColor: getRiskColor(riskLevel) }}
    >
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h4 className={styles.packageName}>{packageName}</h4>
          <div
            className={styles.riskBadge}
            style={{ backgroundColor: getRiskColor(riskLevel) }}
          >
            Risk: {riskScore}
          </div>
        </div>
        <div className={styles.versionRow}>
          <span className={styles.version}>
            {currentVersion} → {latestVersion}
          </span>
          {analysis?.versionGap && (
            <span className={styles.versionGap}>
              {analysis.versionGap.major > 0 &&
                `+${analysis.versionGap.major} major`}
              {analysis.versionGap.minor > 0 &&
                ` +${analysis.versionGap.minor} minor`}
              {analysis.versionGap.patch > 0 &&
                ` +${analysis.versionGap.patch} patch`}
            </span>
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div className={styles.tagsRow}>
          {tags.map((tag) => {
            const colors = getTagColor(tag);
            return (
              <span
                key={tag}
                className={styles.tag}
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {tag.replace(/-/g, ' ')}
              </span>
            );
          })}
        </div>
      )}

      {recommendedAction && (
        <div className={styles.actionRow}>
          <span className={styles.actionIcon}>
            {getActionIcon(recommendedAction.type)}
          </span>
          <span className={styles.actionText}>
            {recommendedAction.displayText}
          </span>
          <span className={styles.actionPriority}>
            P{recommendedAction.priority}
          </span>
        </div>
      )}

      <div className={styles.footer}>
        <button className={styles.detailsButton} onClick={onViewDetails}>
          <InfoIcon fontSize="small" />
          Ver detalles
        </button>
      </div>
    </div>
  );
};

DependencyPriorityCard.displayName = 'DependencyPriorityCard';
export default DependencyPriorityCard;
