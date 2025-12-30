import React from 'react';
import PropTypes from 'prop-types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styles from './DependencyCard.module.scss';

/**
 * DependencyCard Component
 *
 * Tarjeta individual para mostrar información de una dependencia:
 * - Nombre del paquete
 * - Autor/organización
 * - Versión actual vs última
 * - Estado (actualizada/desactualizada)
 */
const DependencyCard = ({
  packageName = 'Extendable client for Github',
  author = '@oktoki',
  currentVersion = '7.0.5',
  latestVersion = '7.0.6',
  isOutdated = true,
  onInfoClick,
}) => {
  const status = isOutdated ? 'outdated' : 'updated';
  const statusText = isOutdated ? 'Desactualizada' : 'Actualizada';

  return (
    <div className={styles.card} data-status={status}>
      <div className={styles.content}>
        {/* Header con nombre del paquete */}
        <div className={styles.header}>
          <h3 className={styles.packageName}>{packageName}</h3>
        </div>

        {/* Autor */}
        <div className={styles.author}>
          <span>{author}</span>
          <span className={styles.badge} data-status={status}>
            {statusText}
          </span>
        </div>

        {/* Versiones */}
        <div className={styles.versions}>
          <span className={styles.versionLabel}>Actual:</span>
          <span className={styles.versionValue}>{currentVersion}</span>
          <span className={styles.versionArrow}>→</span>
          <span className={styles.versionLabel}>Última:</span>
          <span className={styles.versionValue}>{latestVersion}</span>
        </div>
      </div>

      {/* Botón de info */}
      <button
        className={styles.infoButton}
        onClick={onInfoClick}
        aria-label="Más información"
      >
        <InfoOutlinedIcon fontSize="small" />
      </button>
    </div>
  );
};

DependencyCard.propTypes = {
  packageName: PropTypes.string.isRequired,
  author: PropTypes.string,
  currentVersion: PropTypes.string.isRequired,
  latestVersion: PropTypes.string.isRequired,
  isOutdated: PropTypes.bool,
  onInfoClick: PropTypes.func,
};

DependencyCard.displayName = 'DependencyCard';
export default DependencyCard;
