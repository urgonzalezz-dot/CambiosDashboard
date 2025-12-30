import React, { memo } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

// Si quieres activar theme como tu equipo, descomenta esto:
// import CssBaseline from '@mui/material/CssBaseline';
// import { ThemeProvider } from '@mui/material/styles';
// import { theme } from '@libs/ui';

import Styles from './_Layout.module.scss';

const Layout = () => {
  const outletContext = useOutletContext(); // recibe contexto del host (si lo mandas)

  return (
    // Si quieres theme como tu equipo, envuelve aquí:
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />

    <div className={Styles.main_container}>
      <main className={Styles.main}>
        <Outlet context={outletContext} />
      </main>
    </div>

    // </ThemeProvider>
  );
};

Layout.displayName = 'DashboardLayout';
export default memo(Layout);
