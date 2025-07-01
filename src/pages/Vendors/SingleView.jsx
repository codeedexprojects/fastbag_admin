import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileSection from '../Vendors/Profile';
import StatsAndTransactions from '../Vendors/ProfileDetails';
import Products from '../Vendors/VendorProducts';
import { Box, Typography, Grid } from '@mui/material';

const VendorDetails = () => {
  const { vendorId } = useParams();
  const [reloadProfile, setReloadProfile] = useState(false);

  const handleReloadProfile = () => {
    setReloadProfile(prev => !prev);
  };


  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Vendor Details
      </Typography>

      <Typography variant="body2" color="textSecondary">
        Dashboard &gt; Vendors List &gt; Vendor Details
      </Typography>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={3}>
          <ProfileSection vendorId={vendorId} key={reloadProfile}/>
        </Grid>
        <Grid item xs={12} sm={9}>
          <StatsAndTransactions vendorId={vendorId} onApprove={handleReloadProfile}/>
          <Products vendorId={vendorId} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorDetails;
