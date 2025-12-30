import React, { lazy } from 'react';
import Layout from './pages/Layout/Layout';

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));

const routes = [
  {
    path: 'dashboard',
    element: <Layout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
];

export default routes;
