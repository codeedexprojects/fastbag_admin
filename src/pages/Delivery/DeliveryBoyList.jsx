import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Card, CardMedia, CardContent,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, MenuItem, Select, InputLabel, FormControl, CardActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { addDeliveryBoy, getDeliveryBoys, deleteDeliveryBoy, updateDeliveryBoy } from '../../services/allApi';
import { toast } from 'react-toastify';

const DeliveryBoyList = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    name: '', mobile_number: '', email: '', vehicle_type: '',
    vehicle_number: '', gender: '', dob: '', is_active: true,
    aadhar_card_image: null, driving_license_image: null,
  });

  const navigate = useNavigate();

  const fetchDeliveryBoys = async () => {
    try {
      const res = await getDeliveryBoys();
      setDeliveryBoys(res.results || []);
    } catch {
      toast.error('Failed to fetch delivery boys');
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const handleChange = (field) => (e) => {
    const value = ['aadhar_card_image', 'driving_license_image'].includes(field)
      ? e.target.files[0]
      : field === 'is_active'
        ? e.target.value === 'true'
        : e.target.value;

    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const {
      name, mobile_number, email, vehicle_type, vehicle_number,
      gender, dob, aadhar_card_image, driving_license_image
    } = formData;

    if (!name || !mobile_number || !email || !vehicle_type || !vehicle_number || !gender || !dob || !aadhar_card_image || !driving_license_image) {
      toast.error('Please fill all fields and upload both images');
      return;
    }

    const reqBody = new FormData();
    Object.entries(formData).forEach(([key, value]) => reqBody.append(key, value));

    try {
      await addDeliveryBoy(reqBody);
      toast.success('Delivery boy added');
      setOpen(false);
      fetchDeliveryBoys();
    } catch {
      toast.error('Failed to add delivery boy');
    }
  };

  const handleEdit = (boy) => {
    setEditData(boy);
    setEditOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    setSelectedDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteDeliveryBoy(selectedDeleteId);
      toast.success('Delivery boy deleted');
      setDeleteDialogOpen(false);
      fetchDeliveryBoys();
    } catch {
      toast.error('Failed to delete delivery boy');
    }
  };

  const handleUpdate = async () => {
    const {
      id, name, mobile_number, email, vehicle_type,
      vehicle_number, gender, dob, is_active
    } = editData;

    if (!name || !mobile_number || !email || !vehicle_type || !vehicle_number || !gender || !dob) {
      toast.error("Please fill all fields");
      return;
    }

    const updatedData = {
      name, mobile_number, email, vehicle_type,
      vehicle_number, gender, dob, is_active
    };

    try {
      await updateDeliveryBoy(id, updatedData); // PATCH request
      toast.success("Delivery boy updated successfully");
      setEditOpen(false);
      fetchDeliveryBoys();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>Delivery Boys</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Delivery Boy</Button>
      </Box>

      <Grid container spacing={3}>
  {deliveryBoys.map(boy => (
    <Grid item xs={12} sm={6} md={3} key={boy.id}>
      <Card elevation={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box onClick={() => navigate(`/view-deliveryboydetails/${boy.id}`)} sx={{ cursor: 'pointer', flexGrow: 1 }}>
          {boy.photo && (
            <CardMedia component="img" height="200" image={boy.photo} alt={boy.name} />
          )}
          <CardContent>
            <Typography variant="h6">{boy.name}</Typography>
            <Typography variant="body2">Mobile: {boy.mobile_number}</Typography>
            <Typography variant="body2">Vehicle: {boy.vehicle_number}</Typography>
          </CardContent>
        </Box>
        <CardActions sx={{ justifyContent: 'flex-end', mt: 'auto', px: 2, pb: 2 }}>
          <Button size="medium" color="primary" startIcon={<EditIcon />} onClick={() => handleEdit(boy)} />
          <Button size="medium" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteConfirm(boy.id)} />
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>


      {/* Add Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Delivery Boy</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth label="Name" margin="dense" value={formData.name} onChange={handleChange('name')} />
          <TextField fullWidth label="Mobile Number" margin="dense" value={formData.mobile_number} onChange={handleChange('mobile_number')} />
          <TextField fullWidth label="Email" margin="dense" value={formData.email} onChange={handleChange('email')} />
          <TextField fullWidth label="Vehicle Number" margin="dense" value={formData.vehicle_number} onChange={handleChange('vehicle_number')} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Vehicle Type</InputLabel>
            <Select value={formData.vehicle_type} onChange={handleChange('vehicle_type')} label="Vehicle Type">
              <MenuItem value="Bike">Bike</MenuItem>
              <MenuItem value="Scooter">Scooter</MenuItem>
              <MenuItem value="Car">Car</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Gender</InputLabel>
            <Select value={formData.gender} onChange={handleChange('gender')} label="Gender">
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
              <MenuItem value="O">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth type="date" label="Date of Birth" margin="dense" InputLabelProps={{ shrink: true }} value={formData.dob} onChange={handleChange('dob')} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select value={formData.is_active.toString()} onChange={handleChange('is_active')} label="Status">
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Box mt={2}>
            <Typography variant="body2" sx={{ mb: 1 }}>Aadhar Card Image</Typography>
            <Button variant="outlined" component="label" fullWidth>
              {formData.aadhar_card_image ? formData.aadhar_card_image.name : 'Choose Aadhar Image'}
              <input type="file" accept="image/*" hidden onChange={handleChange('aadhar_card_image')} />
            </Button>
          </Box>
          <Box mt={2}>
            <Typography variant="body2" sx={{ mb: 1 }}>Driving License Image</Typography>
            <Button variant="outlined" component="label" fullWidth>
              {formData.driving_license_image ? formData.driving_license_image.name : 'Choose License Image'}
              <input type="file" accept="image/*" hidden onChange={handleChange('driving_license_image')} />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Delivery Boy</DialogTitle>
        <DialogContent dividers>
          {editData && (
            <>
              <TextField fullWidth label="Name" margin="dense" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
              <TextField fullWidth label="Mobile Number" margin="dense" value={editData.mobile_number} onChange={(e) => setEditData({ ...editData, mobile_number: e.target.value })} />
              <TextField fullWidth label="Email" margin="dense" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
              <TextField fullWidth label="Vehicle Number" margin="dense" value={editData.vehicle_number} onChange={(e) => setEditData({ ...editData, vehicle_number: e.target.value })} />
              <FormControl fullWidth margin="dense">
                <InputLabel>Vehicle Type</InputLabel>
                <Select value={editData.vehicle_type} onChange={(e) => setEditData({ ...editData, vehicle_type: e.target.value })}>
                  <MenuItem value="Bike">Bike</MenuItem>
                  <MenuItem value="Scooter">Scooter</MenuItem>
                  <MenuItem value="Car">Car</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel>Gender</InputLabel>
                <Select value={editData.gender} onChange={(e) => setEditData({ ...editData, gender: e.target.value })}>
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth type="date" label="Date of Birth" margin="dense" InputLabelProps={{ shrink: true }} value={editData.dob} onChange={(e) => setEditData({ ...editData, dob: e.target.value })} />
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select value={editData.is_active.toString()} onChange={(e) => setEditData({ ...editData, is_active: e.target.value === 'true' })}>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this delivery boy?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DeliveryBoyList;
