// apps/dashboard/src/remote-entry.js
/**
 * Remote Entry Point para Dashboard MFE
 * 
 * Este es el punto de entrada cuando el MFE se carga desde el host.
 * Exporta el componente raíz sin router ni layout adicional,
 * ya que el host proporciona el layout principal.
 */
import React from 'react';
import { MfeContainer } from '@libs/ui';
import Dashboard from './pages/Dashboard/Dashboard';

/**
 * RemoteEntry - Componente que se exporta al host
 * 
 * Envuelve el contenido del MFE en MfeContainer para asegurar
 * que respeta el espacio asignado por el host.
 */
const RemoteEntry = () => {
  return (
    <MfeContainer testId="dashboard-mfe">
      <Dashboard />
    </MfeContainer>
  );
};

RemoteEntry.displayName = 'DashboardRemoteEntry';

export default RemoteEntry;
