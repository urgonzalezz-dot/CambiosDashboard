import * as React from 'react';
import StatCard from '../StatCard/StatCard';
import styles from './DashboardStatsRow.module.scss';

const stats = [
  {
    id: 'repos',
    type: 'repos',
    label: 'Repositorios',
    value: 'Entrada Única',
    helper: '10 ramas activas',
  },
  {
    id: 'pull',
    type: 'pull',
    label: 'Pull request',
    value: 2,
    helper: 'Abiertos',
  },
  {
    id: 'deps',
    type: 'deps',
    label: 'Dependencias',
    value: 15,
    helper: 'Desactualizados',
  },
  {
    id: 'users',
    type: 'users',
    label: 'Usuarios',
    value: '8,934',
    helper: 'Activos',
  },
];

const DashboardStatsRow = () => {
  return (
    <section className={styles.row}>
      {stats.map((item) => (
        <StatCard
          key={item.id}
          type={item.type}
          label={item.label}
          value={item.value}
          helper={item.helper}
        />
      ))}
    </section>
  );
};

export default DashboardStatsRow;
