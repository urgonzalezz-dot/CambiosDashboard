# Arquitectura de Micro-Frontends

## Visión General

Esta aplicación utiliza una arquitectura de micro-frontends basada en Nx y Module Federation. El sistema consta de:

- **1 Host**: Aplicación principal que proporciona el layout y carga los MFEs
- **4 MFEs**: Dashboard, Auth0, Dependencies, GCP

### Solución Implementada

Se implementó una **arquitectura de contención en tres niveles**:

1. **Nivel Host**: Contención fuerte del layout principal
2. **Nivel MFE Container**: Wrapper compartido que garantiza comportamiento consistente
3. **Nivel MFE**: Componentes que usan unidades relativas (%, rem) en lugar de viewport units

---

## Estructura del Host

### Layout Principal (`/apps/host/src/pages/Layout/`)

```
┌─────────────────────────────────────────┐
│           HEADER (4rem)                 │
├──────────┬──────────────────────────────┤
│          │                              │
│ SIDEBAR  │      MAIN AREA               │
│ (auto)   │   ┌──────────────────────┐   │
│          │   │   .mfeSandbox        │   │
│          │   │   (padding: 1.5rem)  │   │
│          │   │                      │   │
│          │   │   <MFE aquí>         │   │
│          │   │                      │   │
│          │   └──────────────────────┘   │
│          │                              │
└──────────┴──────────────────────────────┘
```

### Propiedades CSS Clave del Host

**`.shell`** (Grid Container):

```scss
height: 100vh;
display: grid;
grid-template-rows: 4rem 1fr;
grid-template-columns: auto 1fr;
overflow: hidden; // El shell no hace scroll
```

**`.mfeSandbox`** (Contenedor de MFEs):

```scss
// Dimensiones
height: 100%;
width: 100%;
padding: 1.5rem;

// Scroll (manejado por el host)
overflow-y: auto;
overflow-x: hidden;

// Contención fuerte
isolation: isolate; // Nuevo stacking context
contain: layout style paint; // Limita impacto de MFEs
```

**Propósito de cada propiedad:**

- `isolation: isolate` → Crea un nuevo stacking context, los z-index de los MFEs no afectan al host
- `contain: layout style paint` → Limita el impacto de layout/paint de los MFEs en el host
- `overflow-y: auto` → El host maneja el scroll, no cada MFE individualmente

---

## MfeContainer Wrapper

### Ubicación

`/libs/ui/src/lib/components/MfeContainer/`

### Propósito

Componente wrapper compartido que todos los MFEs deben usar para garantizar:

1. Respeto del espacio asignado por el host
2. Contención de estilos (no afecta al host)
3. Comportamiento consistente de scroll y layout
4. Aislamiento del contexto de apilamiento (z-index)

### Uso en MFEs

```jsx
// En remote-entry.js de cada MFE
import { MfeContainer } from '@libs/ui';
import App from './app/app';

const RemoteEntry = () => (
  <MfeContainer testId="nombre-mfe">
    <App />
  </MfeContainer>
);
```

### Propiedades CSS del MfeContainer

```scss
.mfeContainer {
  // Dimensiones relativas al padre (no viewport units)
  width: 100%;
  height: 100%;
  min-width: 0; // Permite que flex/grid hijos no desborden
  min-height: 0;

  // Contención CSS
  contain: layout style;
  isolation: isolate;

  // Display
  display: flex;
  flex-direction: column;

  // El MFE no maneja scroll (lo hace el host en .mfeSandbox)
  overflow: visible;

  // Position para que absolute dentro del MFE funcione
  position: relative;
}
```

---

## Contexto Compartido (HostContext)

### Ubicación

`/libs/ui/src/lib/context/HostContext.jsx`

### Propósito

Proporciona comunicación bidireccional entre el host y los MFEs sin acoplamiento fuerte.

### Información Compartida

```javascript
{
  layout: {
    headerHeight: '4rem',
    sidebarWidth: 'auto',
    isInHost: true,          // ← Los MFEs detectan si están en el host
  },
  user: { name, email },
  isAuthenticated: boolean,
  navigate: (url) => {},     // Función de navegación del host
  stores: {
    available: [],
    selected: {},
    setSelected: () => {},
  },
  notifications: {
    show: (message) => {},   // Sistema de notificaciones compartido
  }
}
```

### Uso en MFEs

```jsx
import { useHostContext, useIsInHost } from '@libs/ui';

function MyComponent() {
  const hostContext = useHostContext();
  const isInHost = useIsInHost();

  if (isInHost) {
    // Lógica cuando está dentro del host
    console.log('Usuario:', hostContext.user);
    hostContext.navigate('/dashboard');
    hostContext.notifications.show('Mensaje');
  }
}
```

---

## 📦 Estructura de Cada MFE

### Modo Dual: Standalone vs Remoto

Cada MFE puede ejecutarse en dos modos:

#### 1. **Modo Standalone** (Desarrollo)

- Se ejecuta con su propio router y layout
- Útil para desarrollo aislado
- Comando: `nx serve dashboard`

#### 2. **Modo Remoto** (Producción)

- Se carga desde el host sin router propio
- Respeta el layout del host
- Se integra vía Module Federation

### Archivos Clave

```
apps/[mfe-name]/src/
├── app/
│   └── app.js              # Para modo standalone (con router)
├── remote-entry.js         # Para modo remoto (sin router, con MfeContainer)
└── pages/
    └── [Page]/
        ├── Page.jsx        # Componente de página
        └── Page.module.scss # Estilos (sin vw/vh)
```

### Ejemplo: Dashboard MFE

**`remote-entry.js`** (usado cuando se carga desde el host):

```jsx
import { MfeContainer } from '@libs/ui';
import Dashboard from './pages/Dashboard/Dashboard';

const RemoteEntry = () => (
  <MfeContainer testId="dashboard-mfe">
    <Dashboard />
  </MfeContainer>
);

export default RemoteEntry;
```

**`app/app.js`** (usado en modo standalone):

```jsx
import { useRoutes } from 'react-router-dom';
import routes from '../route';

export default function App() {
  const element = useRoutes(routes);
  return <Suspense>{element}</Suspense>;
}
```

---

## 🎨 Reglas de Estilos para MFEs

### ✅ **HACER**

1. **Usar unidades relativas al contenedor padre**

   ```scss
   width: 100%; // ✅ Relativo al padre
   height: auto; // ✅ Basado en contenido
   padding: 1.5rem; // ✅ Unidad relativa
   ```

2. **Usar min-width y min-height: 0 en contenedores flex/grid**

   ```scss
   .container {
     min-width: 0; // Evita desbordamiento horizontal
     min-height: 0; // Permite que el grid funcione correctamente
   }
   ```

3. **Usar max-width para evitar desbordamiento**

   ```scss
   max-width: 100%; // No exceder el contenedor padre
   ```

4. **Usar box-sizing: border-box**
   ```scss
   box-sizing: border-box; // Padding no desborda
   ```

### ❌ **NO HACER**

1. **NO usar viewport units**

   ```scss
   width: 100vw; // ❌ Ignora el contenedor del host
   height: 100vh; // ❌ Ignora el header/sidebar
   ```

2. **NO usar position: fixed**

   ```scss
   position: fixed; // ❌ Se posiciona relativo al viewport, no al host
   ```

3. **NO definir altura fija excesiva**

   ```scss
   height: 2000px; // ❌ Puede romper el layout
   ```

4. **NO usar estilos globales que afecten al host**
   ```scss
   // ❌ Esto afectaría a todo el host
   body {
     margin: 0;
   }
   ```

---

## Configuración de Module Federation

### Host (`apps/host/module-federation.config.js`)

```javascript
module.exports = {
  name: 'host',
  remotes: ['dashboard', 'auth0', 'dependencies', 'gcp'],
};
```

### MFE (`apps/[mfe]/module-federation.config.js`)

```javascript
module.exports = {
  name: 'dashboard',
  exposes: {
    './Module': './src/remote-entry.js', // ← Punto de entrada remoto
  },
};
```

---

## 🚀 Comandos de Desarrollo

### Ejecutar el Host

```bash
nx serve host
```

### Ejecutar un MFE standalone

```bash
nx serve dashboard
nx serve auth0
nx serve dependencies
nx serve gcp
```

### Ejecutar todos juntos

```bash
nx run-many --target=serve --projects=host,dashboard,auth0,dependencies,gcp
```

---

## 📊 Flujo de Renderizado

### Cuando se carga un MFE desde el host:

```
1. Usuario navega a /dashboard
   ↓
2. Host router carga <DashboardMf /> dentro de <Outlet />
   ↓
3. Module Federation carga remote-entry.js del dashboard
   ↓
4. remote-entry.js retorna <MfeContainer><Dashboard /></MfeContainer>
   ↓
5. MfeContainer aplica estilos de contención
   ↓
6. Dashboard se renderiza dentro del espacio asignado
   ↓
7. Dashboard accede al HostContext si necesita datos del host
```

---

## 🧪 Checklist de Integración

Cuando agregues un nuevo MFE, asegúrate de:

- [ ] Crear `remote-entry.js` que envuelve el componente en `<MfeContainer>`
- [ ] Separar `app.js` (standalone) de `remote-entry.js` (remoto)
- [ ] Usar `useHostContext()` para acceder al contexto del host
- [ ] NO usar viewport units (vw, vh) en los estilos
- [ ] Usar `width: 100%` y `height: auto` o `100%` relativo al padre
- [ ] Agregar `min-width: 0` y `min-height: 0` en contenedores flex/grid
- [ ] Configurar Module Federation en `module-federation.config.js`
- [ ] Registrar el remoto en el host (`remotes: ['nuevo-mfe']`)
- [ ] Agregar la ruta en el router del host

---

## 📚 Referencias

- [Module Federation](https://module-federation.io/)
- [Nx Module Federation](https://nx.dev/recipes/module-federation)
- [CSS Containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment)
- [CSS Isolation](https://developer.mozilla.org/en-US/docs/Web/CSS/isolation)

---

## 🐛 Troubleshooting

### Problema: El MFE se renderiza a ancho completo

**Solución**: Verificar que no uses `width: 100vw` en los estilos. Usar `width: 100%`.

### Problema: El MFE no respeta el header/sidebar

**Solución**: Verificar que no uses `height: 100vh`. Usar `height: 100%` o `auto`.

### Problema: El scroll no funciona correctamente

**Solución**: El scroll debe manejarlo el host en `.mfeSandbox`, no el MFE. El MFE debe tener `overflow: visible`.

### Problema: Los estilos del MFE afectan al host

**Solución**: Verificar que el MFE esté envuelto en `<MfeContainer>` y que no uses estilos globales.

### Problema: El contexto del host no está disponible en el MFE

**Solución**: Verificar que el host tenga `<HostContextProvider>` y que el MFE use `useHostContext()`.

---

## Notas de Implementación

**Fecha de implementación**: Diciembre 2025
**Versión de Nx**: 22.1.3  
**Versión de Module Federation**: 0.21.2  
**React**: 19.0.0

**Cambios principales realizados**:

1. Creación de `MfeContainer` wrapper en libs/ui
2. Implementación de `HostContext` para compartir estado
3. Refactorización de todos los MFEs para usar el wrapper
4. Mejora de la contención CSS en el host
5. Separación de modos standalone/remoto en Dashboard MFE
6. Eliminación de viewport units en todos los estilos
