import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import UserDetails from '../Customers/Profile';
import Stats from '../Customers/Stats';
import TransactionsAndOrders from '../Customers/Orders';

const CustomerDetails = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Customer Details
      </Typography>

      {/* Breadcrumb */}
      <Typography variant="body2" color="textSecondary">
        Dashboard &gt; Customer List &gt; Customer Details
      </Typography>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Left Side: User Details */}
        <Grid item xs={12} sm={4}>
          <UserDetails />
        </Grid>

        {/* Right Side: Stats and Transactions */}
        <Grid item xs={12} sm={8}>
          <Stats />
          <TransactionsAndOrders />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDetails;
