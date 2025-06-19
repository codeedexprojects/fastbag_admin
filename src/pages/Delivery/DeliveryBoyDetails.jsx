// DeliveryBoyDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Typography, Grid, Card, CardContent, Avatar,
  Divider, CircularProgress, Box, Chip, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField, InputLabel, MenuItem, Select,
  FormControlLabel, Switch
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { getDeliveryBoy, updateDeliveryBoy, deleteDeliveryBoy } from '../../services/allApi';

const genders = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Others' },
];

const vehicleTypes = ['Bike', 'Car', 'Auto', 'Van'];

const acceptedOrders = [
  { id: 'ORD123', customer: 'Alice', date: '2025-06-01', status: 'DELIVERED' },
  { id: 'ORD124', customer: 'Bob', date: '2025-06-02', status: 'IN TRANSIT' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'warning';
    case 'CONFIRMED': return 'success';
    case 'CANCELLED': return 'error';
    case 'PREPARING': return 'info';
    case 'DELIVERED': return 'primary';
    default: return 'default';
  }
};

const DeliveryBoyDetails = () => {
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [editPreview, setEditPreview] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const { id } = useParams();

  const fetchDeliveryBoy = async () => {
    setLoading(true);
    try {
      const response = await getDeliveryBoy(id);
      setDeliveryBoy(response.data);
    } catch (error) {
      console.error("Error fetching delivery boy:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryBoy();
  }, [id]);

  const handleEdit = (boy) => {
    setEditData({ ...boy });
    setEditPreview({
      aadhar: boy.aadhar_card_image,
      license: boy.driving_license_image,
    });
    setEditOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    setSelectedDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteDeliveryBoy(selectedDeleteId);
      toast.success('Delivery boy deleted');
      setDeleteDialogOpen(false);
      fetchDeliveryBoy();
    } catch {
      toast.error('Failed to delete delivery boy');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const {
      id, name, mobile_number, email, vehicle_type,
      vehicle_number, gender, dob, is_active,
      aadhar_card_image, driving_license_image
    } = editData;

    if (!name || !mobile_number || !email || !vehicle_type || !vehicle_number || !gender || !dob) {
      toast.error("Please fill all fields");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("name", name);
    reqBody.append("mobile_number", mobile_number);
    reqBody.append("email", email);
    reqBody.append("vehicle_type", vehicle_type);
    reqBody.append("vehicle_number", vehicle_number);
    reqBody.append("gender", gender);
    reqBody.append("dob", dob);
    reqBody.append("is_active", is_active);

    if (aadhar_card_image instanceof File) {
      reqBody.append("aadhar_card_image", aadhar_card_image);
    }

    if (driving_license_image instanceof File) {
      reqBody.append("driving_license_image", driving_license_image);
    }

    setLoading(true);
    try {
      await updateDeliveryBoy(id, reqBody);
      toast.success("Delivery boy updated successfully");
      setEditOpen(false);
      fetchDeliveryBoy();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
  if (!deliveryBoy) return <Container sx={{ textAlign: 'center', mt: 4 }}><Typography color="error">Delivery boy not found.</Typography></Container>;

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={700}>{deliveryBoy.name}</Typography>
        <Box>
          <IconButton onClick={() => handleEdit(deliveryBoy)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDeleteConfirm(deliveryBoy.id)}><DeleteIcon /></IconButton>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box display="flex" justifyContent="center" mb={3}>
                <Avatar src={deliveryBoy.photo} sx={{ width: 120, height: 120 }}>
                  {!deliveryBoy.photo && deliveryBoy.name?.charAt(0)}
                </Avatar>
              </Box>
              <Typography variant="body1"><strong>Mobile:</strong> {deliveryBoy.mobile_number}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {deliveryBoy.email}</Typography>
              <Typography variant="body1"><strong>Vehicle:</strong> {deliveryBoy.vehicle_type} - {deliveryBoy.vehicle_number}</Typography>
              <Typography variant="body1"><strong>DOB:</strong> {deliveryBoy.dob}</Typography>
              <Typography variant="body1">
                <strong>Gender:</strong> {
                  genders.find(g => g.value === deliveryBoy.gender)?.label || deliveryBoy.gender
                }
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Documents</Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {deliveryBoy.aadhar_card_image && (
                  <Box>
                    <Typography variant="body2" fontWeight={600}>Aadhar Card</Typography>
                    <a href={deliveryBoy.aadhar_card_image} download>
                      <img src={deliveryBoy.aadhar_card_image} alt="Aadhar" width="100" style={{ borderRadius: 8 }} />
                    </a>
                  </Box>
                )}
                {deliveryBoy.driving_license_image && (
                  <Box>
                    <Typography variant="body2" fontWeight={600}>Driving License</Typography>
                    <a href={deliveryBoy.driving_license_image} download>
                      <img src={deliveryBoy.driving_license_image} alt="License" width="100" style={{ borderRadius: 8 }} />
                    </a>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h6" mb={2}>Accepted Orders</Typography>
          <Grid container spacing={2}>
            {acceptedOrders.map(order => (
              <Grid item xs={12} sm={6} key={order.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography><strong>Order ID:</strong> {order.id}</Typography>
                    <Typography><strong>Customer:</strong> {order.customer}</Typography>
                    <Typography><strong>Date:</strong> {order.date}</Typography>
                    <Chip label={order.status} color={getStatusColor(order.status)} size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this delivery boy?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
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
                {genders.map((g) => (
                  <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                ))}
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
          <Button onClick={() => setEditOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryBoyDetails;