import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

/**
 * HostContext - Contexto compartido entre el Host y los MFEs
 * 
 * Proporciona:
 * - Información de layout (dimensiones disponibles)
 * - Tema/estilos compartidos
 * - Datos de usuario y autenticación
 * - Configuración global
 */
const HostContext = createContext({
  // Información de layout
  layout: {
    headerHeight: '4rem',
    sidebarWidth: 'auto',
    isInHost: false, // Los MFEs pueden detectar si están en el host
  },
  // Tema compartido
  theme: null,
  // Usuario y autenticación (placeholder)
  user: null,
  isAuthenticated: false,
  // Funciones compartidas
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

  return (
    <HostContext.Provider value={contextValue}>
      {children}
    </HostContext.Provider>
  );
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
