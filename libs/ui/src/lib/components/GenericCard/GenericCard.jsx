import { memo } from 'react';
import PropTypes from 'prop-types';
import Styles from './_GenericCard.module.scss';

const GenericCardComponent = ({ title, icon, children }) => {
  return (
    <section className={Styles.card}>
      {(title || icon) && (
        <header className={Styles.header}>
          <div className={Styles.headerTitle}>
            {icon && <span className={Styles.headerIcon}>{icon}</span>}
            {title && <h2 className={Styles.headerText}>{title}</h2>}
          </div>
        </header>
      )}

      <div className={Styles.body}>{children}</div>
    </section>
  );
};

GenericCardComponent.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.node,
};

const GenericCard = memo(GenericCardComponent);
GenericCard.displayName = 'GenericCard';

export { GenericCard };
