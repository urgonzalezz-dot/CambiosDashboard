import * as React from 'react';
import styles from './StatCard.module.scss';

import LanIcon from '@mui/icons-material/Lan';
import TimelineIcon from '@mui/icons-material/Timeline';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const iconMap = {
  repos: LanIcon,
  pull: TimelineIcon,
  deps: Inventory2Icon,
  users: PersonOutlineIcon,
};

const StatCard = ({ type = 'repos', label, value, helper }) => {
  const Icon = iconMap[type] || LanIcon;

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <Icon className={styles.icon} />
        <span className={styles.label}>{label}</span>
      </header>

      <div className={styles.cardBody}>
        <p className={styles.value}>{value}</p>
        <p className={styles.helper}>{helper}</p>
      </div>
    </article>
  );
};

export default StatCard;
