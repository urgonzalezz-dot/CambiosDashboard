import * as React from 'react';
import { useHostContext } from '@libs/ui';
import DashboardHeaderCard from '../../components/DashboardHeader';
import DashboardStatsRow from '../../components/DashboardStatsRow';
import DashboardChartsRow from '../../components/DashboardChartsRow/DashboardChartsRow';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const hostContext = useHostContext();
  const isInHost = hostContext?.layout?.isInHost || false;

  React.useEffect(() => {
    if (isInHost) {
      console.log('Dashboard MFE cargado dentro del host', {
        user: hostContext.user,
        layout: hostContext.layout,
      });
    }
  }, [isInHost, hostContext]);

  // aqui pondre apis
  const dependenciesStats = React.useMemo(
    () => ({
      total: 120,
      updated: 78,
      pending: 18,
      error: 6,
      outdated: 18,
    }),
    []
  );

  const deploymentsStats = React.useMemo(
    () => ({
      successRate: 92,
      failureRate: 8,
    }),
    []
  );

  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeaderCard />
      <DashboardStatsRow />
      <DashboardChartsRow
        dependenciesStats={dependenciesStats}
        deploymentsStats={deploymentsStats}
      />
    </div>
  );
};

Dashboard.displayName = 'Dashboard';
export default React.memo(Dashboard);
