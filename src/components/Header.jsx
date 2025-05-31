import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Avatar, Menu, MenuItem, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate=useNavigate();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        navigate('/admin-login')
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                backgroundColor: '#1e1e2d',
                color: '#a4a6b3',
                borderBottom: '1px solid #393946',
            }}
        >
            <Toolbar>
                {/* Search Icon */}
                <IconButton color="inherit">
                    <SearchIcon />
                </IconButton>

                {/* Spacer to push icons to the right */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Notification Icons */}
                <IconButton color="inherit">
                    <CalendarMonthIcon />
                </IconButton>
                <IconButton color="inherit">
                    <Badge badgeContent={3} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                {/* <IconButton color="inherit">
                    <Badge badgeContent={64} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton> */}

                {/* User Profile */}
                <Typography variant="body1" sx={{ mx: 2, color: '#ffffff' }}>
                    Samad
                </Typography>
                <Avatar
                    alt="Admin"
                    src="/profile-picture.png" // Replace with actual profile image path
                    onClick={handleMenu}
                    sx={{ cursor: 'pointer', backgroundColor: '#4f46e5' }} // Custom avatar color
                />

                {/* Profile Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{
                        '& .MuiPaper-root': {
                            backgroundColor: '#1e1e2d',
                            color: '#a4a6b3',
                            border: '1px solid #393946',
                        },
                    }}
                >
                    <MenuItem onClick={handleClose} sx={{ '&:hover': { backgroundColor: '#393946' } }}>
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleClose} sx={{ '&:hover': { backgroundColor: '#393946' } }}>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;