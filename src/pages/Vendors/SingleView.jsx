import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileSection from '../Vendors/Profile';
import StatsAndTransactions from '../Vendors/ProfileDetails';
import Products from '../Vendors/VendorProducts';
import { Box, Typography, Grid } from '@mui/material';

const VendorDetails = () => {
  const { vendorId } = useParams();
  const [reloadProfile, setReloadProfile] = useState(0);

  const handleReloadProfile = () => {
    setReloadProfile(prev => prev + 1);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Vendor Details
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Dashboard &gt; Vendors List &gt; Vendor Details
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={3}>
          <ProfileSection vendorId={vendorId} key={reloadProfile} />
        </Grid>
        <Grid item xs={12} md={9}>
          <StatsAndTransactions onApprove={handleReloadProfile} />
          <Box sx={{ mt: 3 }}>
            <Products vendorId={vendorId} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorDetails;