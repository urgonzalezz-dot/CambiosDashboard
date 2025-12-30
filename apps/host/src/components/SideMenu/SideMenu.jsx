import React, { useState, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import List from '@mui/material/List';
import MuiDrawer from '@mui/material/Drawer';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';
import { Divider, IconButton } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import GridViewIcon from '@mui/icons-material/GridView';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PersonIcon from '@mui/icons-material/Person';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

import './_sideMenu.scss';

const drawerWidth = '15%';

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer - 10,
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const SideMenu = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [openIndex, setOpenIndex] = useState(-1);

  const dataMenu = useMemo(
    () => [
      {
        name: 'Dashboard',
        url: '/Dashboard',
        icon: GridViewIcon,
        selectedIcon: GridViewIcon,
        menus: [], // sin submenús por ahora
      },
      {
        name: 'Dependencias',
        url: '/dependencies',
        icon: Inventory2Icon,
        selectedIcon: Inventory2Icon,
        menus: [],
      },
      {
        name: 'Usuarios',
        url: '/auth0',
        icon: PersonIcon,
        selectedIcon: PersonIcon,
        menus: [],
      },
    ],
    []
  );

  // Marcamos seleccionado según la ruta actual
  const rootMenus = useMemo(
    () =>
      dataMenu.map((item) => {
        const selected =
          location.pathname === item.url ||
          location.pathname.startsWith(`${item.url}/`);
        return { ...item, selected };
      }),
    [dataMenu, location.pathname]
  );

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => {
    setOpen(false);
    setOpenIndex(-1);
  };

  const handleClick = useCallback(
    (index) => () => {
      if (rootMenus[index].menus.length > 0) {
        if (openIndex === index) {
          setOpenIndex(-1);
        } else {
          setOpenIndex(index);
          setOpen(true);
        }
      }
    },
    [rootMenus, openIndex]
  );

  return (
    <Drawer variant="permanent" anchor="left" open={open}>
      <DrawerHeader sx={{ minHeight: '4rem !important' }}>
        <Divider />
      </DrawerHeader>
      <Divider />

      <List sx={{ padding: 0 }}>
        {rootMenus.map(
          (
            {
              name,
              menus = [],
              icon: IconComponent,
              selectedIcon: SelectedIconComponent,
              selected,
              url,
            },
            index
          ) => (
            <div key={index}>
              <Link to={url} className="link" relative="path">
                <ListItem
                  disablePadding
                  className="menu-item"
                  sx={{
                    borderLeft: selected
                      ? '3px solid #833177'
                      : '3px solid transparent',
                    backgroundColor: selected ? '#EBEBEB' : '#fff',
                  }}
                  onClick={handleClick(index)}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 45,
                      justifyContent: open ? 'initial' : 'center',
                      px: '0.75rem',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? '5px' : 'auto',
                        ml: open ? '0px' : 'auto',
                        justifyContent: 'center',
                        transition: 'visibility',
                        transitionDuration: '40ms',
                        transitionTimingFunction: 'ease-in-out',
                        '&:hover': {
                          color: '#833177',
                        },
                      }}
                    >
                      {!selected && <IconComponent />}
                      {selected && (
                        <SelectedIconComponent sx={{ color: '#833177' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      primary={name}
                      sx={{
                        visibility: open ? 'visible' : 'collapse',
                        fontSize: '0.875rem',
                        display: open ? 'block' : 'none',
                        fontWeight: selected ? 600 : 400,
                        color: selected ? '#833177' : '#767676',
                        '&:hover': {
                          color: '#833177',
                        },
                      }}
                    />
                    {menus.length > 0 && openIndex === index && open && (
                      <ExpandLess sx={{ opacity: open ? 1 : 0 }} />
                    )}
                    {menus.length > 0 && !(openIndex === index) && open && (
                      <ExpandMore sx={{ opacity: open ? 1 : 0 }} />
                    )}
                  </ListItemButton>
                </ListItem>
              </Link>

              {/* Submenús — no usamos aún, pero dejamos la estructura lista */}
              {menus.length > 0 && (
                <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menus.map((menu, ix) => (
                      <Link
                        key={ix}
                        to={menu.url}
                        className="link"
                        relative="path"
                      >
                        <ListItem
                          className="menu-item"
                          disablePadding
                          sx={{
                            borderLeft: '3px solid transparent',
                            backgroundColor: menu.selected ? '#F5F5F5' : '#fff',
                          }}
                        >
                          <ListItemButton
                            sx={{
                              minHeight: 40,
                              height: 40,
                              justifyContent: open ? 'initial' : 'center',
                              px: '0.75rem',
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? '5px' : 'auto',
                                ml: open ? '0px' : 'auto',
                                justifyContent: 'center',
                                transition: 'visibility',
                                transitionDuration: '40ms',
                                transitionTimingFunction: 'ease-in-out',
                              }}
                            >
                              {menu.selected ? (
                                <CircleIcon
                                  sx={{
                                    height: '10px',
                                    width: '10px',
                                    marginLeft: '0.75rem',
                                    color: '#833177',
                                  }}
                                />
                              ) : (
                                <CircleOutlinedIcon
                                  sx={{
                                    height: '10px',
                                    width: '10px',
                                    marginLeft: '0.75rem',
                                  }}
                                />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              disableTypography
                              primary={menu.name}
                              sx={{
                                visibility: open ? 'visible' : 'collapse',
                                fontSize: '0.875rem',
                                fontWeight: menu.selected ? 600 : 400,
                                color: menu.selected ? '#833177' : '#767676',
                                '&:hover': {
                                  color: '#833177',
                                },
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      </Link>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          )
        )}
      </List>

      <DrawerHeader
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          minHeight: '1.875rem',
        }}
        className="menu__icon"
      >
        <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
    </Drawer>
  );
};

export default React.memo(SideMenu);
