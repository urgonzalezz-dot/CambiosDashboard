import * as React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header, Icons, SideMenu } from '@lp_front_account/lp-kit-dashboards';
import { HostContextProvider } from '@libs/ui';
import { useState, memo, forwardRef } from 'react';
import styles from './_Layout.module.scss';
import headerStyles from './HeaderWrapper.module.scss';

// Icons MUI
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';

const DashboardIcon = memo(
  forwardRef((props, ref) => (
    <SpaceDashboardOutlinedIcon ref={ref} {...props} />
  ))
);
DashboardIcon.displayName = 'DashboardIcon';

const Auth0Icon = memo(
  forwardRef((props, ref) => <LockOpenOutlinedIcon ref={ref} {...props} />)
);
Auth0Icon.displayName = 'Auth0Icon';

const GcpIcon = memo(
  forwardRef((props, ref) => <CloudOutlinedIcon ref={ref} {...props} />)
);
GcpIcon.displayName = 'GcpIcon';

const DependenciesIcon = memo(
  forwardRef((props, ref) => <ExtensionOutlinedIcon ref={ref} {...props} />)
);
DependenciesIcon.displayName = 'DependenciesIcon';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const userMock = { name: 'Jane Doe', email: 'admin@liverpool.com' };
  const storesMock = [
    { id: 1, name: 'México, CDMX' },
    { id: 2, name: 'Guadalajara, JAL' },
  ];
  const [selectedStore, setSelectedStore] = useState(storesMock[0]);

  const dataMenu = [
    {
      name: 'Inicio',
      url: '/dashboard',
      menus: [],
      icon: DashboardIcon,
      selectedIcon: DashboardIcon,
    },
    {
      name: 'Auth0',
      url: '/auth0',
      menus: [],
      icon: Auth0Icon,
      selectedIcon: Auth0Icon,
    },
    {
      name: 'GCP',
      url: '/gcp',
      menus: [],
      icon: GcpIcon,
      selectedIcon: GcpIcon,
    },
    {
      name: 'Dependencias',
      url: '/dependencies',
      menus: [],
      icon: DependenciesIcon,
      selectedIcon: DependenciesIcon,
    },
  ];

  const handleGoTo = (url) => navigate(url);

  // Contexto que se comparte con todos los MFEs
  const hostContextValue = {
    layout: {
      headerHeight: '4rem',
      sidebarWidth: 'auto',
      isInHost: true,
    },
    user: userMock,
    isAuthenticated: true,
    navigate: handleGoTo,
    stores: {
      available: storesMock,
      selected: selectedStore,
      setSelected: setSelectedStore,
    },
    notifications: {
      show: (message) => {
        console.log('Notification:', message);
        // sistema de notificaciones
      },
    },
  };

  return (
    <HostContextProvider value={hostContextValue}>
      <div className={styles.shell}>
        {/* Header - debe estar POR ENCIMA del Drawer (z-index: 1301) */}
        <div className={`${styles.header} ${headerStyles.headerWrapper}`}>
          <Header
            title="Dashboard de monitoreo"
            headerLogo={
              <a href="/">
                <Icons
                  iconType="HeaderLogo"
                  name="Marketplace"
                  isWhite
                  height="2.5rem"
                  width="11.2rem"
                  viewBox="0 0 240 60"
                />
              </a>
            }
            user={userMock}
            stores={storesMock}
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
            checkStoreIcon={true}
            showStoreIcon={true}
            isAuthenticated={true}
            userStatus="ACTIVE"
            isSimpleHeader={false}
            inactiveOrNotAuthRedirection={() => {}}
            onLogout={() => {}}
            onLogin={() => {}}
            profileIcon={<div />}
            openProfileIcon={false}
            setOpenProfileIcon={() => {}}
            notifications={<div />}
            isNotificationsIcon={true}
            badgeNotification={false}
          />
        </div>

        {/* Contenedor flex para contenido debajo del header */}
        <div className={styles.mainContainer}>
          {/* 
            Drawer de Material-UI (position: fixed, z-index: 1200)
            Se renderiza pero no ocupa espacio en el layout
          */}
          <SideMenu
            dataMenu={dataMenu}
            showSideMenu
            routes={location.pathname}
            goTo={handleGoTo}
          />

          {/* 
            Espaciador invisible que ocupa el mismo ancho que el Drawer
            Esto empuja el contenido principal hacia la derecha
          */}
          <div className={styles.drawerSpacer} />

          {/* Área principal de contenido */}
          <main className={styles.main}>
            <div className={styles.mfeSandbox}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </HostContextProvider>
  );
}
