import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, FormControlLabel, Switch,
  InputLabel, MenuItem, Select, Avatar, Typography
} from '@mui/material';

const genders = ['Male', 'Female', 'Other'];
const vehicleTypes = ['Bike', 'Car', 'Auto', 'Van'];

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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setEditData((prev) => ({ ...prev, [name]: files[0] }));
      const reader = new FileReader();
      reader.onload = () => {
        setEditPreview((prev) => ({ ...prev, [name === 'aadhar_card_image' ? 'aadhar' : 'license']: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Delivery Boy</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
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
            <TextField label="Vehicle Number" name="vehicle_number" fullWidth value={editData.vehicle_number || ''} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Gender</InputLabel>
            <Select name="gender" fullWidth value={editData.gender || ''} onChange={handleInputChange}>
              {genders.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Vehicle Type</InputLabel>
            <Select name="vehicle_type" fullWidth value={editData.vehicle_type || ''} onChange={handleInputChange}>
              {vehicleTypes.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField type="date" label="DOB" name="dob" InputLabelProps={{ shrink: true }} fullWidth value={editData.dob || ''} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Switch checked={editData.is_active || false} onChange={(e) => setEditData(prev => ({ ...prev, is_active: e.target.checked }))} />}
              label="Active"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>Aadhar Card Image</Typography>
            {editPreview.aadhar && <Avatar variant="rounded" src={editPreview.aadhar} alt="Aadhar" sx={{ width: 80, height: 80, mb: 1 }} />}
            <Button variant="outlined" component="label" fullWidth>
              Upload Aadhar
              <input hidden accept="image/*" type="file" name="aadhar_card_image" onChange={handleFileChange} />
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>Driving License Image</Typography>
            {editPreview.license && <Avatar variant="rounded" src={editPreview.license} alt="License" sx={{ width: 80, height: 80, mb: 1 }} />}
            <Button variant="outlined" component="label" fullWidth>
              Upload License
              <input hidden accept="image/*" type="file" name="driving_license_image" onChange={handleFileChange} />
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleUpdate} variant="contained" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDeliveryBoyModal;
