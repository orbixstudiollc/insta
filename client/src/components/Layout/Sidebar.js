import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  AccountBox,
  PhotoLibrary,
  Analytics,
  ContentCopy,
  BatchPrediction,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;
const DRAWER_WIDTH_COLLAPSED = 60;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
  },
  {
    text: 'Accounts',
    icon: <AccountBox />,
    path: '/accounts',
  },
  {
    text: 'Posts',
    icon: <PhotoLibrary />,
    path: '/posts',
  },
  {
    text: 'Analytics',
    icon: <Analytics />,
    path: '/analytics',
  },
  {
    text: 'Templates',
    icon: <ContentCopy />,
    path: '/templates',
  },
  {
    text: 'Bulk Operations',
    icon: <BatchPrediction />,
    path: '/bulk-operations',
  },
];

const Sidebar = ({ open }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          overflowX: 'hidden',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          border: 'none',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Toolbar spacing */}
      <Box sx={{ height: 64 }} />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={!open ? item.text : ''} placement="right">
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
                  color: isActive(item.path) ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive(item.path) 
                      ? 'primary.dark' 
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                  borderRadius: '0 25px 25px 0',
                  mr: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isActive(item.path) ? 'white' : 'text.primary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: 'opacity 0.3s',
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;