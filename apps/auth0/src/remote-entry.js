// apps/auth0/src/remote-entry.js
/**
 * Remote Entry Point para Auth0 MFE
 * 
 * Este es el punto de entrada cuando el MFE se carga desde el host.
 * Exporta el componente raíz envuelto en MfeContainer.
 */
import React from 'react';
import { MfeContainer } from '@libs/ui';
import App from './app/app';

/**
 * RemoteEntry - Componente que se exporta al host
 */
const RemoteEntry = () => {
  return (
    <MfeContainer testId="auth0-mfe">
      <App />
    </MfeContainer>
  );
};

RemoteEntry.displayName = 'Auth0RemoteEntry';

export default RemoteEntry;
