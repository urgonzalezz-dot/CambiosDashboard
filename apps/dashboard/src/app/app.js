// apps/dashboard/src/app/app.js
/**
 * App Component para Dashboard MFE
 * 
 * MODO DUAL:
 * 1. Standalone: Corre con su propio router y layout (para desarrollo)
 * 2. Remote: Se carga desde remote-entry.js sin router (dentro del host)
 * 
 * Este archivo se usa SOLO en modo standalone (npm start dashboard)
 */
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '../route';

export default function App() {
  const element = useRoutes(routes);
  return (
    <Suspense fallback={<div>Cargando Dashboard...</div>}>{element}</Suspense>
  );
}
