import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress } from '@mui/material';
import { Email, Phone, LocationOn, Person, CalendarToday } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { viewUsersById } from '../../services/allApi';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const data = await viewUsersById(id);
        setUser(data);
      } catch (err) {
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();

  }, [id]);
              // console.log(user)

              


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Avatar
        sx={{ width: 100, height: 100, mx: 'auto', bgcolor: 'purple' }}
      />
      <Typography variant="h6" align="center" sx={{ mt: 2 }}>
        {user.name}
      </Typography>
      <Typography variant="body2" align="center" color="primary">
        {user.is_verified ? 'Verified' : 'Unverified'}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Person sx={{ mr: 1 }} />
          <Typography variant="body2">User ID: {user.id}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Email sx={{ mr: 1 }} />
          <Typography variant="body2">Email: {user.email}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Phone sx={{ mr: 1 }} />
          <Typography variant="body2">Phone: {user.mobile_number}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn sx={{ mr: 1 }} />
          <Typography variant="body2">
            Address: {user.addresses[0]?.address_line1}, {user.addresses[0]?.city}, {user.addresses[0]?.state}, {user.addresses[0]?.country}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarToday sx={{ mr: 1 }} />
          <Typography variant="body2">Joined: {user.date_joined}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserDetails;
