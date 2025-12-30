// apps/gcp/src/app/app.js
import React from 'react';
import { useHostContext } from '@libs/ui';
import NxWelcome from './nx-welcome';
import styles from './app.module.scss';

/**
 * GCP MFE Component
 * 
 * Este componente muestra información sobre Google Cloud Platform.
 * Respeta el layout del host cuando se carga como remoto.
 */
export function App() {
  // Acceso al contexto del host (si está disponible)
  const hostContext = useHostContext();
  const isInHost = hostContext?.layout?.isInHost || false;

  React.useEffect(() => {
    if (isInHost) {
      console.log('GCP MFE cargado dentro del host');
    }
  }, [isInHost]);

  return (
    <div className={styles.gcpContainer}>
      <NxWelcome title="GCP - Google Cloud Platform" />
    </div>
  );
}

App.displayName = 'GcpApp';
export default App;
