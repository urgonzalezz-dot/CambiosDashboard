# Solución para Layout con Drawer de Material-UI

## Problema Identificado

El `SideMenu` de la librería `@lp_front_account/lp-kit-dashboards` usa un **Drawer de Material-UI** con:

- `position: fixed` (se posiciona fuera del flujo normal del layout)
- `z-index: 1200` (por encima del contenido normal)

Esto causa que el Drawer se **superponga** al contenido principal (Header y MFEs), ignorando el CSS Grid del host.

## Solución

### Concepto

En lugar de intentar que el Drawer respete el grid, ajustamos el layout para que trabaje **CON** el comportamiento de `position: fixed` del Drawer:

1. **Header**: z-index más alto (1301) para estar por encima del Drawer
2. **Drawer**: Se renderiza con position: fixed (comportamiento por defecto)
3. **Espaciador invisible**: Ocupa el mismo ancho que el Drawer, empujando el contenido hacia la derecha
4. **Contenido principal**: Ocupa el espacio restante sin superposición

### Diagrama Visual

```
┌────────────────────────────────────────────────────┐
│        HEADER (z-index: 1301)                      │ ← Por encima del Drawer
├─────────────┬──────────────────────────────────────┤
│             │                                      │
│  DRAWER     │  SPACER    │    CONTENIDO MAIN     │
│  (fixed)    │  (240px)   │    (flex: 1)          │
│  z-index:   │  invisible │                        │
│  1200       │            │    ┌─────────────────┐ │
│             │            │    │  MFE Container  │ │
│             │            │    │  • Dashboard    │ │
│             │            │    │  • Auth0        │ │
│             │            │    │  • etc.         │ │
│             │            │    └─────────────────┘ │
│             │            │                        │
└─────────────┴────────────┴────────────────────────┘
```

---

## Archivos Modificados

### 1. `/app/apps/host/src/pages/Layout/_Layout.module.scss`

**Cambios clave**:

```scss
.shell {
  display: flex; // ← Cambió de grid a flex
  flex-direction: column;
}

.header {
  z-index: 1301; // ← Por encima del Drawer (1200)
}

.mainContainer {
  display: flex; // ← Contenedor flex horizontal
  flex: 1;
}

.drawerSpacer {
  width: 240px; // ← Mismo ancho que el Drawer abierto
  flex-shrink: 0;
}

.main {
  flex: 1; // ← Ocupa el espacio restante
}
```

**Archivo completo**: Ver `/app/apps/host/src/pages/Layout/_Layout.module.scss`

---

### 2. `/app/apps/host/src/pages/Layout/Layout.jsx`

**Cambios en la estructura JSX**:

```jsx
<div className={styles.shell}>
  {/* 1. Header con z-index alto */}
  <div className={`${styles.header} ${headerStyles.headerWrapper}`}>
    <Header {...props} />
  </div>

  {/* 2. Contenedor flex para drawer + contenido */}
  <div className={styles.mainContainer}>
    {/* 3. Drawer (position: fixed, no ocupa espacio) */}
    <SideMenu dataMenu={dataMenu} showSideMenu routes={location.pathname} goTo={handleGoTo} />

    {/* 4. Espaciador invisible (mismo ancho que el Drawer) */}
    <div className={styles.drawerSpacer} />

    {/* 5. Contenido principal */}
    <main className={styles.main}>
      <div className={styles.mfeSandbox}>
        <Outlet />
      </div>
    </main>
  </div>
</div>
```

**Imports necesarios**:

```jsx
import headerStyles from './HeaderWrapper.module.scss';
```

**Archivo completo**: Ver `/app/apps/host/src/pages/Layout/Layout.jsx`

---

### 3. `/app/apps/host/src/pages/Layout/HeaderWrapper.module.scss` (NUEVO)

Este archivo asegura que el Header esté por encima del Drawer:

```scss
.headerWrapper {
  position: relative;
  z-index: 1301 !important; // Por encima del Drawer (1200)
  background: #fff; // Fondo para ocultar contenido debajo

  & > * {
    position: relative;
    z-index: 1301 !important;
  }
}
```

**Archivo completo**: Ver `/app/apps/host/src/pages/Layout/HeaderWrapper.module.scss`

---

## Estilos del Drawer Spacer

El espaciador es un `<div>` invisible que ocupa el mismo ancho que el Drawer:

```scss
.drawerSpacer {
  flex-shrink: 0;
  width: 240px; // Ajustar según el ancho real del Drawer
  transition: width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}

// Responsive
@media (max-width: 1200px) {
  .drawerSpacer {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .drawerSpacer {
    width: 0; // En móvil, el drawer es overlay (no empuja contenido)
  }
}
```

---

## Ajuste del Ancho del Drawer

El ancho del `.drawerSpacer` debe coincidir con el ancho del Drawer de la librería.

### Para encontrar el ancho correcto:

1. **Inspeccionar con DevTools**:

   - Abre la aplicación en el navegador
   - Inspecciona el elemento `<div class="MuiDrawer-paper">`
   - Revisa su `width` en el panel de estilos

2. **Ancho típicos del Drawer de MUI**:

   - Abierto: `240px` (común)
   - Cerrado: `65px` o `calc(${theme.spacing(8)} + 1px)`

3. **Actualizar el ancho en el CSS**:

```scss
.drawerSpacer {
  width: 240px; // ← Ajustar este valor
}
```

---

## Manejo del Estado Abierto/Cerrado (Opcional)

Si el Drawer se puede colapsar/expandir, necesitas manejar el estado:

### Opción 1: CSS con Media Query

Ya incluido en los estilos responsive.

### Opción 2: JavaScript con Estado

```jsx
const [drawerOpen, setDrawerOpen] = useState(true);

<div className={`${styles.drawerSpacer} ${drawerOpen ? '' : styles.closed}`} />;
```

```scss
.drawerSpacer.closed {
  width: 65px; // Ancho del drawer cerrado
}
```

---

## Verificación

Después de aplicar los cambios, verifica:

### Checklist

- [ ] El Header es visible y no está cubierto por el Drawer
- [ ] El Drawer está visible a la izquierda
- [ ] El contenido principal (MFEs) no se superpone con el Drawer
- [ ] No hay scroll horizontal
- [ ] El layout responde correctamente en diferentes tamaños de pantalla

###🔍 Inspección con DevTools

1. Abrir DevTools (F12)
2. Inspecciona el elemento `<div class="MuiDrawer-paper">`
3. Verifica:

   - `position: fixed` ✓
   - `z-index: 1200` ✓
   - `width: 240px` (o el valor que uses) ✓

4. Inspecciona el `.drawerSpacer`:

   - `width` debe coincidir con el ancho del Drawer ✓

5. Inspecciona el Header:
   - `z-index: 1301` (mayor que 1200) ✓

---

## Troubleshooting

### Problema: El Drawer aún se superpone al contenido

**Solución**: Aumentar el ancho del `.drawerSpacer` para que coincida exactamente con el Drawer.

### Problema: El Header se ve detrás del Drawer

**Solución**: Verificar que `HeaderWrapper.module.scss` esté importado y aplicado correctamente.

### Problema: Hay espacio en blanco a la izquierda

**Solución**: El Drawer puede estar oculto. Verifica la prop `showSideMenu` en el componente `<SideMenu>`.

### Problema: En móvil, el contenido está muy a la derecha

**Solución**: Ajustar el `.drawerSpacer` para `width: 0` en breakpoints móviles.

---

## 📊 Comparación: Antes vs Después

### Antes (CSS Grid - No funciona con Drawer fixed)

```
Shell (Grid)
├── Header (grid-area: header)
├── Sidebar (grid-area: side)  ← position: fixed ignora el grid
└── Main (grid-area: main)     ← Se superpone con el Drawer
```

### Después (Flexbox con Spacer)

```
Shell (Flex Column)
├── Header (z-index: 1301)
└── MainContainer (Flex Row)
    ├── Drawer (position: fixed, z-index: 1200)
    ├── Spacer (width: 240px) ← Empuja el contenido
    └── Main (flex: 1)        ← Ocupa espacio restante
```

---

## Referencias

- [Material-UI Drawer](https://mui.com/material-ui/react-drawer/)
- [CSS position: fixed](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [CSS Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [CSS z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)

---

## 🎓 Lecciones Aprendidas

1. **CSS Grid no funciona con position: fixed**: Los elementos con `position: fixed` se posicionan relativos al viewport, no al contenedor grid.

2. **Drawer de MUI siempre usa position: fixed**: Es el comportamiento por diseño para que el drawer pueda superponerse al contenido cuando sea necesario.

3. **El espaciador es la solución**: En lugar de luchar contra el comportamiento del Drawer, trabajamos con él usando un espaciador invisible.

4. **Z-index es crítico**: El Header debe tener un z-index mayor que el Drawer para estar visible.

5. **Flexbox es más flexible**: Para layouts que combinan elementos fixed y normales, flexbox suele ser mejor que grid.

---

## Notas Finales

Esta solución es **robusta y escalable**:

- Funciona con cualquier librería de Drawer que use position: fixed
- Mantiene la contención de MFEs implementada anteriormente
- Es responsive out-of-the-box con los media queries incluidos
- No requiere modificar el componente Drawer de la librería externa

**Fecha de implementación**: Diciembre 2025  
**Aplicable a**: Material-UI Drawer, Ant Design Drawer, y cualquier sidebar con position: fixed
