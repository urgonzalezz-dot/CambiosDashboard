import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../pages/Layout/Layout';

// MFEs
const DashboardMf = React.lazy(() => import('dashboard/Module'));
const Auth0Mf = React.lazy(() => import('auth0/Module'));
const GcpMf = React.lazy(() => import('gcp/Module'));
const DependenciesMf = React.lazy(() => import('dependencies/Module'));

export function App() {
  return (
    <React.Suspense fallback={<div>Cargando Microfrontend...</div>}>
      <Routes>
        {/* Sección “App” con chrome (Header + SideMenu) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardMf />} />
          <Route path="/auth0" element={<Auth0Mf />} />
          <Route path="/gcp" element={<GcpMf />} />
          <Route path="/dependencies" element={<DependenciesMf />} />
        </Route>

        {/* Otras secciones podrían tener su propio Layout:
            /login, /error-access, /no-access, etc. */}
      </Routes>
    </React.Suspense>
  );
}

export default App;
