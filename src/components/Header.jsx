import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Badge
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
        backgroundColor: '#1e1e2d',
        color: '#ffffff',
        borderBottom: '1px solid #393946',
        px: 2,
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Notification Bell */}
          {/* <IconButton sx={{ bgcolor: '#e0edff', borderRadius: '12px', p: 1 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon sx={{ color: '#1e40af' }} />
            </Badge>
          </IconButton> */}

          {/* Name + Role */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: '#ffffff' }}>
              {displayName}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#a4a6b3' }}>
              {subRole}
            </Typography>
          </Box>

          {/* Avatar */}
          <Avatar
            sx={{ bgcolor: '#3b82f6', width: 36, height: 36, fontSize: '14px' }}
          >
            {displayName.slice(0, 1).toUpperCase()}
          </Avatar>

          {/* Logout */}
          <IconButton onClick={handleLogout} sx={{ color: '#ffffff' }}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
