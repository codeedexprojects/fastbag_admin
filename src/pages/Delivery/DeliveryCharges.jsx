import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Chip,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { toast } from 'react-toastify';
import {
  getAllDeliveryCharges,
  createDeliveryCharge,
  updateDeliveryCharge,
  deleteDeliveryCharge,
} from '../../services/allApi';

const DeliveryCharges = () => {
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCharge, setCurrentCharge] = useState({
    id: null,
    distance_from: '',
    distance_to: '',
    day_charge: '',
    night_charge: '',
    night_start_time: '22:00:00',
    night_end_time: '06:00:00',
    is_active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log('Component mounted, fetching charges...');
    fetchDeliveryCharges();
  }, []);

  const fetchDeliveryCharges = async () => {
  try {
    setLoading(true);
    console.log('Calling getAllDeliveryCharges...');
    
    const response = await getAllDeliveryCharges();
    
    console.log('=== FULL RESPONSE ===');
    console.log('Response:', response);
    console.log('Type:', typeof response);
    console.log('Is Array?', Array.isArray(response));
    console.log('Has success?', response?.success);
    console.log('Has data?', response?.data);
    console.log('Data is Array?', Array.isArray(response?.data));
    console.log('Data length:', response?.data?.length);
    console.log('First item:', response?.data?.[0]);
    console.log('==================');
    
    // Handle different response structures
    let chargesData = [];
    
    // Check if response.data.data exists (nested structure)
    if (response?.data?.data && Array.isArray(response.data.data)) {
      console.log('✅ Using response.data.data');
      chargesData = response.data.data;
    }
    // Check if response.data is an array
    else if (response?.data && Array.isArray(response.data)) {
      console.log('✅ Using response.data');
      chargesData = response.data;
    }
    // Check if response itself is an array
    else if (Array.isArray(response)) {
      console.log('✅ Using response directly');
      chargesData = response;
    }
    // Check if response has success and data properties (your API format)
    else if (response?.success && response?.data && Array.isArray(response.data)) {
      console.log('✅ Using response.data (API format)');
      chargesData = response.data;
    }
    else {
      console.error('❌ Unexpected response structure:', response);
      toast.error('Unexpected data format received');
    }
    
    console.log('✅ Setting charges with data:', chargesData);
    console.log('✅ Charges count:', chargesData.length);
    setCharges(chargesData);
    
  } catch (error) {
    console.error('❌ Error fetching delivery charges:', error);
    toast.error('Error loading delivery charges');
    setCharges([]);
  } finally {
    setLoading(false);
  }
};

  // Log when charges state changes
  useEffect(() => {
    console.log('Charges state updated:', charges);
    console.log('Charges length:', charges.length);
  }, [charges]);

  const handleOpenDialog = (charge = null) => {
    if (charge) {
      setEditMode(true);
      setCurrentCharge({
        id: charge.id,
        distance_from: charge.distance_from,
        distance_to: charge.distance_to,
        day_charge: charge.day_charge,
        night_charge: charge.night_charge,
        night_start_time: charge.night_start_time || '22:00:00',
        night_end_time: charge.night_end_time || '06:00:00',
        is_active: charge.is_active,
      });
    } else {
      setEditMode(false);
      setCurrentCharge({
        id: null,
        distance_from: '',
        distance_to: '',
        day_charge: '',
        night_charge: '',
        night_start_time: '22:00:00',
        night_end_time: '06:00:00',
        is_active: true,
      });
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCharge({
      id: null,
      distance_from: '',
      distance_to: '',
      day_charge: '',
      night_charge: '',
      night_start_time: '22:00:00',
      night_end_time: '06:00:00',
      is_active: true,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!currentCharge.distance_from && currentCharge.distance_from !== 0) {
      newErrors.distance_from = 'Distance from is required';
    } else if (parseFloat(currentCharge.distance_from) < 0) {
      newErrors.distance_from = 'Distance must be positive';
    }

    if (!currentCharge.distance_to) {
      newErrors.distance_to = 'Distance to is required';
    } else if (parseFloat(currentCharge.distance_to) <= parseFloat(currentCharge.distance_from)) {
      newErrors.distance_to = 'Distance to must be greater than distance from';
    }

    if (!currentCharge.day_charge && currentCharge.day_charge !== 0) {
      newErrors.day_charge = 'Day charge is required';
    } else if (parseFloat(currentCharge.day_charge) < 0) {
      newErrors.day_charge = 'Charge must be positive';
    }

    if (!currentCharge.night_charge && currentCharge.night_charge !== 0) {
      newErrors.night_charge = 'Night charge is required';
    } else if (parseFloat(currentCharge.night_charge) < 0) {
      newErrors.night_charge = 'Charge must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    console.log('handleSave called');
    
    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    try {
      const chargeData = {
        distance_from: parseFloat(currentCharge.distance_from),
        distance_to: parseFloat(currentCharge.distance_to),
        day_charge: parseFloat(currentCharge.day_charge),
        night_charge: parseFloat(currentCharge.night_charge),
        night_start_time: currentCharge.night_start_time,
        night_end_time: currentCharge.night_end_time,
        is_active: currentCharge.is_active,
      };

      console.log('Sending data:', chargeData);

      let response;
      if (editMode) {
        console.log('Updating charge with ID:', currentCharge.id);
        response = await updateDeliveryCharge(currentCharge.id, chargeData);
      } else {
        console.log('Creating new charge');
        response = await createDeliveryCharge(chargeData);
      }

      console.log('=== SAVE RESPONSE ===');
      console.log('Response:', response);
      console.log('Has success?', response?.success);
      console.log('Has data?', response?.data);
      console.log('==================');

      // Check if the operation was successful
      if (response && response.success) {
        console.log('✅ Operation successful');
        toast.success(
          editMode ? 'Delivery charge updated successfully' : 'Delivery charge created successfully'
        );
        handleCloseDialog();
        fetchDeliveryCharges();
      } else {
        console.log('❌ Operation failed');
        const errorMsg = response?.message || 'Failed to save delivery charge';
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('❌ Error saving delivery charge:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error?.response?.data?.message || 'Error saving delivery charge');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery charge?')) {
      return;
    }

    try {
      console.log('Deleting charge with ID:', id);
      const response = await deleteDeliveryCharge(id);
      
      console.log('=== DELETE RESPONSE ===');
      console.log('Response:', response);
      console.log('Has success?', response?.success);
      console.log('==================');

      if (response && response.success) {
        console.log('✅ Delete successful');
        toast.success('Delivery charge deleted successfully');
        fetchDeliveryCharges();
      } else {
        console.log('❌ Delete failed');
        toast.error(response?.message || 'Failed to delete delivery charge');
      }
    } catch (error) {
      console.error('❌ Error deleting delivery charge:', error);
      toast.error('Error deleting delivery charge');
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentCharge(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  console.log('Rendering component, loading:', loading, 'charges:', charges.length);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading delivery charges...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalShippingIcon sx={{ fontSize: 32, color: '#1976d2' }} />
          <Typography variant="h4" fontWeight="600">
            Delivery Charges Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          Add Delivery Charge
        </Button>
      </Box>

      {/* Debug info - remove this after fixing */}
      <Paper sx={{ padding: 2, marginBottom: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="body2">
          <strong>Debug Info:</strong> Found {charges.length} charge(s)
        </Typography>
      </Paper>

      {charges.length === 0 ? (
        <Paper sx={{ padding: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No delivery charges configured yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click the button below to add your first delivery charge
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ marginTop: 2 }}
          >
            Add Your First Delivery Charge
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Distance Range (km)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WbSunnyIcon fontSize="small" color="warning" />
                    Day Charge
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NightsStayIcon fontSize="small" color="primary" />
                    Night Charge
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Night Hours</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {charges.map(charge => {
                console.log('Rendering charge:', charge);
                return (
                  <TableRow key={charge.id} hover>
                    <TableCell>{charge.id}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${charge.distance_from} - ${charge.distance_to} km`}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="500">
                        ₹{parseFloat(charge.day_charge).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="500">
                        ₹{parseFloat(charge.night_charge).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {charge.night_start_time} - {charge.night_end_time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={charge.is_active ? 'Active' : 'Inactive'}
                        color={charge.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleOpenDialog(charge)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(charge.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Delivery Charge' : 'Add New Delivery Charge'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ paddingTop: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Distance From (km)"
                  type="number"
                  value={currentCharge.distance_from}
                  onChange={e => handleInputChange('distance_from', e.target.value)}
                  error={!!errors.distance_from}
                  helperText={errors.distance_from}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Distance To (km)"
                  type="number"
                  value={currentCharge.distance_to}
                  onChange={e => handleInputChange('distance_to', e.target.value)}
                  error={!!errors.distance_to}
                  helperText={errors.distance_to}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Day Charge (₹)"
                  type="number"
                  value={currentCharge.day_charge}
                  onChange={e => handleInputChange('day_charge', e.target.value)}
                  error={!!errors.day_charge}
                  helperText={errors.day_charge}
                  InputProps={{
                    startAdornment: <WbSunnyIcon color="warning" sx={{ mr: 1 }} />,
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Night Charge (₹)"
                  type="number"
                  value={currentCharge.night_charge}
                  onChange={e => handleInputChange('night_charge', e.target.value)}
                  error={!!errors.night_charge}
                  helperText={errors.night_charge}
                  InputProps={{
                    startAdornment: <NightsStayIcon color="primary" sx={{ mr: 1 }} />,
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Night Start Time"
                  type="time"
                  value={currentCharge.night_start_time}
                  onChange={e => handleInputChange('night_start_time', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Night End Time"
                  type="time"
                  value={currentCharge.night_end_time}
                  onChange={e => handleInputChange('night_end_time', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentCharge.is_active}
                      onChange={e => handleInputChange('is_active', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Active"
                />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Note:</strong> Night charges will be applied between the specified night
                    hours. Make sure the distance ranges don't overlap with existing charges.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryCharges;