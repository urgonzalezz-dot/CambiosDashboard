// apps/dependencies/src/remote-entry.js
/**
 * Remote Entry Point para Dependencies MFE
 *
 * Este es el punto de entrada cuando el MFE se carga desde el host.
 * Exporta el componente raíz envuelto en MfeContainer.
 */
import React from 'react';
import { MfeContainer } from '@libs/ui';
import Dependencies from './pages/Dependencies';

/**
 * RemoteEntry - Componente que se exporta al host
 */
const RemoteEntry = () => {
  return (
    <MfeContainer testId="dependencies-mfe">
      <Dependencies />
    </MfeContainer>
  );
};

RemoteEntry.displayName = 'DependenciesRemoteEntry';

export default RemoteEntry;
