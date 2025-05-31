import React, { useState } from 'react';
import { TextField, Button, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { adminLogin } from '../services/allApi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async () => {
    const reqBody = {
      mobile_number: mobileNumber,
      password: password,
    };

    try {
      const response = await adminLogin(reqBody);

      // Store tokens in localStorage if login is successful
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user_id', response.user_id);

      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 401) {
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
      <ToastContainer />
      <Box
        sx={{
          display: 'flex',
          width: { xs: '100%', md: '60%' },
          boxShadow: 3,
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        {/* Left Section with Image */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#ffffff',
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
          }}
        >
          <img
            src="https://i.postimg.cc/9M4B3t14/6343825.jpg" // Replace this with your image URL
            alt="Login illustration"
            style={{ width: '100%', maxWidth: '350px' }}
          />
        </Box>

        {/* Right Section with Form */}
        <Box sx={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Admin Login
          </Typography>

          {/* Mobile Number Input */}
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

          {/* Password Input */}
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

          {/* Login Button */}
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
