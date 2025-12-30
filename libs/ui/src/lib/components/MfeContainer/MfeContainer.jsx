import React from 'react';
import PropTypes from 'prop-types';
import styles from './MfeContainer.module.scss';

/**
 * MfeContainer - Wrapper para micro-frontends que asegura:
 * 1. Respeto del espacio asignado por el host
 * 2. Contención de estilos (no afecta al host)
 * 3. Comportamiento consistente de scroll y layout
 * 4. Aislamiento del contexto de apilamiento (z-index)
 */
const MfeContainer = ({ children, className = '', testId = 'mfe-container' }) => {
  return (
    <div 
      className={`${styles.mfeContainer} ${className}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
};

MfeContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  testId: PropTypes.string,
};

MfeContainer.displayName = 'MfeContainer';

export default MfeContainer;
