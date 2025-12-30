# Guía de Implementación - Contenido de Archivos

Guía general para conocer la estructura implementada en los mfes

## Resumen

Se implementó una solución arquitectónica en tres niveles para que los micro-frontends respeten el layout del host:

1. **Host**: Contención CSS fuerte con `isolation` y `contain`
2. **Wrapper compartido**: `MfeContainer` en libs/ui
3. **MFEs**: Uso de unidades relativas, no viewport units

---

## NIVEL 1: LIBS/UI - Componentes Compartidos

### 1.1 MfeContainer Component

**Archivo**: `/app/libs/ui/src/lib/components/MfeContainer/MfeContainer.jsx`

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './MfeContainer.module.scss';

/**
 * MfeContainer - Wrapper para micro-frontends que asegura:
 * 1. Respeto del espacio asignado por el host
 * 2. Contención de estilos (no afecta al host)
 * 3. Comportamiento consistente de scroll y layout
 * 4. Aislamiento del contexto de apilamiento (z-index)
 */
const MfeContainer = ({ children, className = '', testId = 'mfe-container' }) => {
  return (
    <div
      className={\`\${styles.mfeContainer} \${className}\`}
      data-testid={testId}
    >
      {children}
    </div>
  );
};

MfeContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  testId: PropTypes.string,
};

MfeContainer.displayName = 'MfeContainer';

export default MfeContainer;
```

---

**Archivo**: `/app/libs/ui/src/lib/components/MfeContainer/MfeContainer.module.scss`

```scss
/**
 * MfeContainer - Estilos de contención para micro-frontends
 */

.mfeContainer {
  /* Dimensiones relativas al contenedor padre del host */
  width: 100%;
  height: 100%;
  min-width: 0; /* Crítico: permite que flex/grid hijos no desborden */
  min-height: 0;

  /* Contención CSS - evita que el MFE afecte al layout del host */
  contain: layout style;

  /* Isolation - crea nuevo stacking context (z-index independiente) */
  isolation: isolate;

  /* Display por defecto */
  display: flex;
  flex-direction: column;

  /* El MFE es responsable de su propio scroll */
  overflow: visible;

  /* Position relative para que absolute dentro del MFE funcione */
  position: relative;

  /* Box sizing consistente */
  box-sizing: border-box;
}

/**
 * Asegurar que hijos directos no rompan el contenedor
 */
.mfeContainer > * {
  max-width: 100%;
  box-sizing: border-box;
}
```

---

**Archivo**: `/app/libs/ui/src/lib/components/MfeContainer/index.js`

```javascript
export { default as MfeContainer } from './MfeContainer';
```

---

Solo es la manera en la que exportamos pero podemos cambiarla si se desea a exportar en el mismo archivo.

### 1.2 HostContext (Contexto Compartido)

**Archivo**: `/app/libs/ui/src/lib/context/HostContext.jsx`

```jsx
import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

/**
 * HostContext - Contexto compartido entre el Host y los MFEs
 */
const HostContext = createContext({
  layout: {
    headerHeight: '4rem',
    sidebarWidth: 'auto',
    isInHost: false,
  },
  theme: null,
  user: null,
  isAuthenticated: false,
  navigate: null,
  notifications: {
    show: () => {},
  },
});

/**
 * Provider del contexto del host
 */
export const HostContextProvider = ({ children, value }) => {
  const contextValue = {
    layout: {
      headerHeight: '4rem',
      sidebarWidth: 'auto',
      isInHost: true,
      ...value?.layout,
    },
    theme: value?.theme || null,
    user: value?.user || null,
    isAuthenticated: value?.isAuthenticated || false,
    navigate: value?.navigate || null,
    notifications: value?.notifications || { show: () => {} },
    ...value,
  };

  return <HostContext.Provider value={contextValue}>{children}</HostContext.Provider>;
};

HostContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape({
    layout: PropTypes.object,
    theme: PropTypes.object,
    user: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    navigate: PropTypes.func,
    notifications: PropTypes.object,
  }),
};

/**
 * Hook para consumir el contexto del host en los MFEs
 */
export const useHostContext = () => {
  const context = useContext(HostContext);
  return context;
};

/**
 * Hook para detectar si el MFE está corriendo dentro del host
 */
export const useIsInHost = () => {
  const context = useHostContext();
  return context.layout?.isInHost || false;
};

export default HostContext;
```

---

**Archivo**: `/app/libs/ui/src/lib/context/index.js`

```javascript
export { default as HostContext, HostContextProvider, useHostContext, useIsInHost } from './HostContext';
```

---

### 1.3 Actualizar index.js de libs/ui

**Archivo**: `/app/libs/ui/src/index.js`

```javascript
export * from './lib/theme/theme';
export * from './lib/components/Button/Button';
export * from './lib/components/UpdateCard/UpdateCard';
export * from './lib/components/GenericCard/GenericCard';
export * from './lib/components/MfeContainer'; // ← Nuevo
export * from './lib/context'; // ← Nuevo
```

---

## 📁 NIVEL 2: HOST - Layout Principal

### 2.1 Layout Styles (CSS con Contención)

**Archivo**: `/app/apps/host/src/pages/Layout/_Layout.module.scss`

```scss
/* ARQUITECTURA DE CONTENCIÓN PARA MICRO-FRONTENDS */

.shell {
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-rows: 4rem 1fr;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    'header header'
    'side main';
  background: #f5f5f5;
  overflow: hidden; /* El shell no hace scroll */
}

.header {
  grid-area: header;
  position: relative;
  z-index: 1300;
  max-height: 4rem;
  overflow: hidden;
}

.side {
  grid-area: side;
  position: relative;
  z-index: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.main {
  grid-area: main;
  min-height: 0; /* Crítico */
  min-width: 0; /* Crítico */
  position: relative;
  overflow: hidden;
}

/**
 * SANDBOX PARA MICRO-FRONTENDS
 * Este contenedor crea una "jaula" de contención para los MFEs
 */
.mfeSandbox {
  /* Dimensiones */
  height: 100%;
  width: 100%;
  padding: 1.5rem;
  box-sizing: border-box;

  /* Scroll (manejado por el host) */
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  /* CONTENCIÓN FUERTE */
  isolation: isolate; /* Nuevo stacking context */
  contain: layout style paint; /* Limita impacto de MFEs */
  position: relative;
  background: #f5f5f5;
}

/**
 * Asegura que los MFEs no rompan el contenedor
 */
.mfeSandbox > * {
  max-width: 100%;
  box-sizing: border-box;
}

/* SCROLLBAR PERSONALIZADA */
.mfeSandbox::-webkit-scrollbar {
  width: 8px;
}

.mfeSandbox::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.mfeSandbox::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.mfeSandbox::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
```

---

### 2.2 Layout Component (con Contexto)

**Archivo**: `/app/apps/host/src/pages/Layout/Layout.jsx`

**Cambios a realizar**:

1. **Agregar import del HostContextProvider**:

```jsx
import { HostContextProvider } from '@libs/ui';
```

2. **Crear el objeto de contexto antes del return**:

```jsx
const handleGoTo = (url) => navigate(url);

// ← AGREGAR ESTO
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
    },
  },
};
```

3. **Envolver todo el JSX con HostContextProvider**:

```jsx
return (
  <HostContextProvider value={hostContextValue}>
    <div className={styles.shell}>{/* ... resto del código ... */}</div>
  </HostContextProvider>
);
```

---

## 📁 NIVEL 3: MFEs - Dashboard (Ejemplo completo)

### 3.1 Dashboard Remote Entry

**Archivo**: `/app/apps/dashboard/src/remote-entry.js`

```jsx
// apps/dashboard/src/remote-entry.js
/**
 * Remote Entry Point para Dashboard MFE
 * Este es el punto de entrada cuando el MFE se carga desde el host.
 */
import React from 'react';
import { MfeContainer } from '@libs/ui';
import Dashboard from './pages/Dashboard/Dashboard';

const RemoteEntry = () => {
  return (
    <MfeContainer testId="dashboard-mfe">
      <Dashboard />
    </MfeContainer>
  );
};

RemoteEntry.displayName = 'DashboardRemoteEntry';
export default RemoteEntry;
```

---

### 3.2 Dashboard Page Component

**Archivo**: `/app/apps/dashboard/src/pages/Dashboard/Dashboard.jsx`

```jsx
import * as React from 'react';
import { useHostContext } from '@libs/ui';
import DashboardHeaderCard from '../../components/DashboardHeader';
import DashboardStatsRow from '../../components/DashboardStatsRow';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  // Acceso al contexto del host
  const hostContext = useHostContext();
  const isInHost = hostContext?.layout?.isInHost || false;

  React.useEffect(() => {
    if (isInHost) {
      console.log('Dashboard MFE cargado dentro del host', {
        user: hostContext.user,
      });
    }
  }, [isInHost, hostContext]);

  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeaderCard />
      <DashboardStatsRow />
    </div>
  );
};

Dashboard.displayName = 'Dashboard';
export default React.memo(Dashboard);
```

---

### 3.3 Dashboard Page Styles

**Archivo**: `/app/apps/dashboard/src/pages/Dashboard/Dashboard.module.scss`

```scss
/**
 * IMPORTANTE: No usar viewport units (vw, vh)
 */

.dashboardContainer {
  width: 100%; /* ← Relativo al padre, NO 100vw */
  min-height: 0;
  padding: 1.5rem 2rem;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  max-width: 100%;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .dashboardContainer {
    padding: 1rem;
    gap: 1rem;
  }
}
```

---

## 📁 NIVEL 4: Otros MFEs (Auth0, Dependencies, GCP)

### 4.1 Remote Entry (Para cada MFE)

**Auth0**: `/app/apps/auth0/src/remote-entry.js`
**Dependencies**: `/app/apps/dependencies/src/remote-entry.js`
**GCP**: `/app/apps/gcp/src/remote-entry.js`

```jsx
import React from 'react';
import { MfeContainer } from '@libs/ui';
import App from './app/app';

const RemoteEntry = () => {
  return (
    <MfeContainer testId="[NOMBRE-MFE]-mfe">
      <App />
    </MfeContainer>
  );
};

RemoteEntry.displayName = '[Nombre]RemoteEntry';
export default RemoteEntry;
```

**Reemplazar**:

- `[NOMBRE-MFE]` → `auth0`, `dependencies`, o `gcp`
- `[Nombre]` → `Auth0`, `Dependencies`, o `Gcp`

---

### 4.2 App Component (Para cada MFE)

**Ejemplo para Auth0** (`/app/apps/auth0/src/app/app.js`):

```jsx
import React from 'react';
import { useHostContext } from '@libs/ui';
import { UpdateCard, GenericCard } from '@libs/ui';
import UsersIcon from '@mui/icons-material/Person';
import { MixedGraph } from '../components/MixedGraph/MixedGraph';
import styles from './app.module.scss';

export function App() {
  const hostContext = useHostContext();
  const isInHost = hostContext?.layout?.isInHost || false;

  const handleRefresh = () => {
    console.log('Actualizando Auth0');
    if (isInHost) {
      hostContext.notifications?.show('Actualizando datos...');
    }
  };

  return (
    <div className={styles.auth0Container}>
      <UpdateCard lastUpdate="02/12/2025 12:00:00 am" repository="Entrada única" onRefresh={handleRefresh} />
      <GenericCard title="Vista General de Usuarios" icon={<UsersIcon />}>
        <MixedGraph />
      </GenericCard>
    </div>
  );
}

App.displayName = 'Auth0App';
export default App;
```

**Aplicar patrón similar para Dependencies y GCP.**

---

### 4.3 Estilos (Para cada MFE)

**Crear estos archivos**:

- `/app/apps/auth0/src/app/app.module.scss`
- `/app/apps/dependencies/src/app/app.module.scss`
- `/app/apps/gcp/src/app/app.module.scss`

```scss
.auth0Container {
  /* Cambiar nombre según MFE */
  width: 100%; /* NO usar 100vw */
  min-height: 0;
  padding: 1.5rem;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  max-width: 100%;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .auth0Container {
    padding: 1rem;
    gap: 1rem;
  }
}
```

**Reemplazar `auth0Container`** con:

- `dependenciesContainer` para Dependencies
- `gcpContainer` para GCP

---

## ✅ Checklist de Verificación

Después de aplicar todos los cambios, verifica:

### Host

- [ ] `_Layout.module.scss` tiene `isolation` y `contain`
- [ ] `Layout.jsx` envuelve con `<HostContextProvider>`
- [ ] `.mfeSandbox` maneja el scroll con `overflow-y: auto`

### MfeContainer (libs/ui)

- [ ] Componente `MfeContainer` creado
- [ ] Estilos con `contain: layout style` y `isolation: isolate`
- [ ] Exportado en `/libs/ui/src/index.js`

### HostContext (libs/ui)

- [ ] Contexto creado con layout, user, navigate, etc.
- [ ] Hooks `useHostContext` y `useIsInHost` disponibles
- [ ] Exportado en `/libs/ui/src/index.js`

### Cada MFE

- [ ] `remote-entry.js` envuelve con `<MfeContainer>`
- [ ] Componente usa `useHostContext()` para acceder al contexto
- [ ] Estilos usan `width: 100%` (NO `100vw`)
- [ ] Estilos usan `height: auto` o `100%` (NO `100vh`)
- [ ] Archivo `.module.scss` con contenedor principal

---

## 🚀 Comandos para Probar

```bash
# Instalar dependencias (si agregaste paquetes nuevos)
npm install

# Ejecutar el host
nx serve host

# Navegar a las rutas y verificar que los MFEs se renderizan correctamente:
# - http://localhost:4200/dashboard
# - http://localhost:4200/auth0
# - http://localhost:4200/dependencies
# - http://localhost:4200/gcp
```

---

## 🔍 Cómo Verificar que Funciona

1. **Layout respetado**: Los MFEs no deben sobresalir del área asignada
2. **Header y sidebar visibles**: Siempre deben estar en pantalla
3. **Scroll correcto**: El scroll debe ser vertical dentro del contenedor principal
4. **Sin desbordamiento horizontal**: No debe aparecer scrollbar horizontal
5. **Contexto accesible**: Verifica en la consola los logs de los MFEs accediendo al contexto

---

## 📞 Soporte

Si encuentras problemas:

1. Verifica la consola del navegador para errores
2. Inspecciona los elementos con DevTools
3. Revisa que todos los imports sean correctos
4. Asegúrate de que no hay typos en los nombres de archivos

---

**Fecha de creación**: Diciembre 2024  
**Autor**: E1 AI Agent  
**Versión**: 1.0
