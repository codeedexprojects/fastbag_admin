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
import { Paper, styled } from '@mui/material';
import { BellDot } from 'lucide-react';

const GlassPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(2),
}));

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
        backgroundColor: '#1f2937', 
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
           <Tooltip title="Notifications">
  <IconButton
    onClick={() => navigate("/view-notifications")}
  sx={{
      color: '#f87171',
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: 'rgba(218, 205, 205, 0.22)',
      },
      '&:hover svg': {
        color: '#f87171',
        filter: 'drop-shadow(0 0 6px rgb(255, 255, 255))',
      },
      '& svg': {
        transition: 'all 0.2s ease',
      },
    }}
  >
    <Badge badgeContent={3} color="error">
      <BellDot color='white' />
    </Badge>
  </IconButton>
</Tooltip>


          {/* User Info */}
         <Box 
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    px: 2,
    py: 1,
    borderRadius: 2,
    
    // backgroundColor: 'rgba(59, 130, 246, 0.1)', // subtle blue background
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)', // glow effect
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
    },
  }}
>
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end',cursor:'pointer' }}>
    <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#ffffff'  }}>
      {displayName}
    </Typography>
    <Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>
      {subRole}
    </Typography>
  </Box>

  <Avatar
    sx={{
      bgcolor: '#3b82f6',
      width: 36,
      height: 36,
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 0 0 rgba(0,0,0,0)', // reset
      transition: 'all 0.3s ease',
      cursor:'pointer',
      '&:hover': {
        boxShadow: '0 0 6px #3b82f6',
      },
    }}
  >
    {displayName.charAt(0).toUpperCase()}
  </Avatar>
</Box>


          {/* Logout Button */}
         <Tooltip title="Logout">
  <IconButton
    onClick={handleLogout}
    sx={{
      color: '#f87171',
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: 'rgba(239, 68, 68, 0.1)',
      },
      '&:hover svg': {
        color: '#f87171',
        filter: 'drop-shadow(0 0 6px #f87171)',
      },
      '& svg': {
        transition: 'all 0.2s ease',
      },
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
