import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { getNotificationCounts } from '../services/allApi';

const Header = ({ onMenuClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const displayName = role === 'admin' ? 'Admin' : 'Staff';
  const subRole = role === 'admin' ? 'Administrator' : 'Sub-Administrator';

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getNotificationCounts();
        setUnreadCount(data.unread_count || 0);
      } catch (error) {
        console.error("Failed to fetch unread notification count:", error);
      }
    };
    fetchUnreadCount();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          left: 0,
          right: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important', px: 3 }}>
          {/* Left Section - Menu Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={onMenuClick}
              sx={{
                color: '#0284c7',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: '#e0f2fe',
                  transform: 'rotate(90deg)',
                  boxShadow: '0 0 12px rgba(14, 165, 233, 0.3)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Right Section - Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Notifications */}
            <Tooltip title="Notifications" arrow>
              <IconButton
                onClick={() => navigate("/view-notifications")}
                sx={{
                  color: '#dc2626',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#fee2e2',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                  },
                }}
              >
                <Badge 
                  badgeContent={unreadCount} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '10px',
                      height: '18px',
                      minWidth: '18px',
                      fontWeight: 'bold',
                    }
                  }}
                >
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Divider */}
            <Box
              sx={{
                width: '1px',
                height: '30px',
                background: 'linear-gradient(180deg, transparent 0%, #cbd5e1 50%, transparent 100%)',
                mx: 1,
              }}
            />

            {/* User Profile */}
            <Box
              onClick={handleProfileClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                borderRadius: '12px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#e0f2fe',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  boxShadow: '0 2px 8px rgba(14, 165, 233, 0.2)',
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#0f172a',
                    lineHeight: 1.2,
                  }}
                >
                  {displayName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '11px',
                    color: '#64748b',
                    lineHeight: 1.2,
                  }}
                >
                  {subRole}
                </Typography>
              </Box>
            </Box>

            {/* Logout Button */}
            <Tooltip title="Logout" arrow>
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: '#dc2626',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#fee2e2',
                    transform: 'translateY(-2px) rotate(10deg)',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                  },
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            '& .MuiMenuItem-root': {
              color: '#334155',
              py: 1.5,
              px: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#f0f9ff',
              },
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {displayName}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748b' }}>
            {subRole}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#e2e8f0' }} />
        <MenuItem onClick={handleLogout} sx={{ color: '#dc2626 !important' }}>
          <LogoutIcon sx={{ mr: 1.5, fontSize: '20px' }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;