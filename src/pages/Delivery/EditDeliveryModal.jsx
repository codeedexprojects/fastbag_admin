import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, FormControlLabel, Switch,
  InputLabel, MenuItem, Select, Avatar, Typography, Box, IconButton
} from '@mui/material';
import { ImageUp, Trash2, Save, CircleX } from 'lucide-react';

const genders = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
  { label: 'Other', value: 'O' }
];
const vehicleTypes = ['Two Wheeler', 'Four Wheeler'];

const EditDeliveryBoyModal = ({
  open,
  handleClose,
  editData,
  setEditData,
  editPreview,
  setEditPreview,
  handleUpdate,
  loading
}) => {
  if (!editData) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setEditData((prev) => ({ ...prev, [name]: files[0] }));
      const reader = new FileReader();
      reader.onload = () => {
        setEditPreview((prev) => ({
          ...prev,
          [name === 'aadhar_card_image' ? 'aadhar' : 'license']: reader.result
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handlePreviewDelete = (type) => {
    setEditData((prev) => ({
      ...prev,
      [type]: null
    }));
    setEditPreview((prev) => ({
      ...prev,
      [type === 'aadhar_card_image' ? 'aadhar' : 'license']: null
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}>
      <DialogTitle fontWeight={600}>Edit Delivery Boy</DialogTitle>
      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={2}>
          {/* Basic Info */}
          <Grid item xs={12} sm={6}>
            <TextField label="Name" name="name" fullWidth value={editData.name || ''} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Mobile Number" name="mobile_number" fullWidth value={editData.mobile_number || ''} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" name="email" fullWidth value={editData.email || ''} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="DOB" type="date" name="dob" InputLabelProps={{ shrink: true }} fullWidth value={editData.dob || ''} onChange={handleInputChange} />
          </Grid>

          {/* Vehicle Info */}
          <Grid item xs={12} sm={6}>
            <TextField label="Vehicle Number" name="vehicle_number" fullWidth value={editData.vehicle_number || ''} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Vehicle Type</InputLabel>
            <Select name="vehicle_type" fullWidth value={editData.vehicle_type || ''} onChange={handleInputChange}>
              {vehicleTypes.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          </Grid>

          {/* Other Info */}
          <Grid item xs={12} sm={6}>
            <InputLabel>Gender</InputLabel>
            <Select name="gender" fullWidth value={editData.gender || ''} onChange={handleInputChange}>
              {genders.map((g) => (
                <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Switch checked={editData.is_active || false} onChange={(e) => setEditData(prev => ({ ...prev, is_active: e.target.checked }))} />}
              label="Active"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Address" name="address" fullWidth multiline minRows={2} value={editData.address || ''} onChange={handleInputChange} />
          </Grid>

          {/* File Uploads */}
          <Grid item xs={12} sm={6}>
            <Typography fontWeight={600} fontSize={14} gutterBottom>Aadhar Card</Typography>
            {editPreview.aadhar && (
              <Box position="relative" display="inline-block" mb={1}>
                <Avatar variant="rounded" src={editPreview.aadhar} sx={{ width: 80, height: 80, borderRadius: 2 }} />
                <IconButton
                  size="small"
                  color='error' 
                  onClick={() => handlePreviewDelete('aadhar_card_image')}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    p: 0.5
                  }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            )}
            <Button
              fullWidth
              variant="containedSecondary"
              component="label"
              startIcon={<ImageUp size={18} />}
            >
              Upload Aadhar
              <input hidden accept="image/*" type="file" name="aadhar_card_image" onChange={handleFileChange} />
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography fontWeight={600} fontSize={14} gutterBottom>Driving License</Typography>
            {editPreview.license && (
              <Box position="relative" display="inline-block" mb={1}>
                <Avatar variant="rounded" src={editPreview.license} sx={{ width: 80, height: 80, borderRadius: 2 }} />
                <IconButton
                  size="small"
                  color='error' 
                  onClick={() => handlePreviewDelete('driving_license_image')}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    p: 0.5
                  }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            )}
            <Button
              fullWidth
              variant="containedSecondary"
              component="label"
              startIcon={<ImageUp size={18} />}
            >
              Upload License
              <input hidden accept="image/*" type="file" name="driving_license_image" onChange={handleFileChange} />
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} startIcon={<CircleX size={18} />} color="error" variant='contained' disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} variant="contained" startIcon={<Save size={18} />} disabled={loading}>
          {loading ? 'Updating...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDeliveryBoyModal;
