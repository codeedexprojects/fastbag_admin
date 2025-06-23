import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Badge,
  Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const displayName = role === 'admin' ? 'Admin' : 'Staff';
  const subRole = role === 'admin' ? 'Administrator' : 'Sub-Administrator';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#1f2937', // matches Sidebar
        color: '#ffffff',
        borderBottom: '1px solid #374151',
        px: 3,
        height: '64px',
        justifyContent: 'center',
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-end', minHeight: '64px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

          {/* Optional Notification Icon */}
          {/* <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon sx={{ color: '#60a5fa' }} />
              </Badge>
            </IconButton>
          </Tooltip> */}

          {/* User Info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#ffffff' }}>
              {displayName}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>
              {subRole}
            </Typography>
          </Box>

          {/* Avatar */}
          <Avatar
            sx={{
              bgcolor: '#3b82f6',
              width: 36,
              height: 36,
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>

          {/* Logout Button */}
          <Tooltip title="Logout">
            <IconButton
              onClick={handleLogout}
              sx={{
                color: '#f87171',
                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
