// apps/auth0/src/app/app.js
import React from 'react';
import { useHostContext } from '@libs/ui';
import { UpdateCard, GenericCard } from '@libs/ui';
import UsersIcon from '@mui/icons-material/Person';
import { MixedGraph } from '../components/MixedGraph/MixedGraph';
import styles from './app.module.scss';

/**
 * Auth0 MFE Component
 *
 * Este componente muestra información sobre usuarios y autenticación.
 * Respeta el layout del host cuando se carga como remoto.
 */
export function App() {
  // Acceso al contexto del host (si está disponible)
  const hostContext = useHostContext();
  const isInHost = hostContext?.layout?.isInHost || false;

  const handleRefresh = () => {
    console.log('Extrayendo información de las APIs de Auth0');
    if (isInHost) {
      // Opcionalmente, usar el sistema de notificaciones del host
      hostContext.notifications?.show('Actualizando datos de Auth0...');
    }
  };

  return (
    <div className={styles.auth0Container}>
      <UpdateCard
        lastUpdate="02/12/2025 12:00:00 am"
        repository="Entrada única"
        onRefresh={handleRefresh}
      />

      <GenericCard title="Vista General de Usuarios" icon={<UsersIcon />}>
        <MixedGraph />
      </GenericCard>
    </div>
  );
}

App.displayName = 'Auth0App';
export default App;
