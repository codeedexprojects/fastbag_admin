import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography,
  InputAdornment, IconButton, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { adminLogin, subAdminLogin } from '../services/allApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async () => {
    const reqBody = { mobile_number: mobileNumber, password };

    try {
      const response = role === 'admin' ? await adminLogin(reqBody) : await subAdminLogin(reqBody);
      console.log(response);

      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user_id', response.user_id);
      localStorage.setItem('role', role); 

      if (role === 'subadmin' && response.permissions) {
        localStorage.setItem('permissions', JSON.stringify(response.permissions));
      }

      toast.success(`${role === 'admin' ? 'Admin' : 'Sub-Admin'} login successful!`);

      
        navigate('/dash');
     

    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Username or password is incorrect.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f6fa',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: { xs: '100%', md: '60%' },
          boxShadow: 3,
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: 'white',
          position: 'relative',
        }}
      >
        {/* Left Image Section */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
          }}
        >
          <img
            src="https://i.postimg.cc/9M4B3t14/6343825.jpg"
            alt="Login illustration"
            style={{ width: '100%', maxWidth: '350px' }}
          />
        </Box>

        {/* Right Form Section */}
        <Box
          sx={{
            flex: 1,
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Role Toggle */}
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={(e, newRole) => newRole && setRole(newRole)}
              size="small"
              color="primary"
            >
              <ToggleButton value="admin">Admin</ToggleButton>
              <ToggleButton value="subadmin">Staff</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            {role === 'admin' ? 'Admin Login' : 'Sub Admin/Staff Login'}
          </Typography>

          <TextField
            fullWidth
            placeholder="Username"
            variant="outlined"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, backgroundColor: '#F6F6F9', borderRadius: '5px' }}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, backgroundColor: '#F6F6F9', borderRadius: '5px' }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{
              mb: 2,
              backgroundColor: '#6C63FF',
              fontWeight: 'bold',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              '&:hover': {
                backgroundColor: '#5a53e2',
              },
            }}
          >
            LOGIN
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
