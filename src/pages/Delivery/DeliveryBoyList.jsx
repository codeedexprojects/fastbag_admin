import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Select, InputLabel, FormControl, Backdrop, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import {
  addDeliveryBoy,
  getDeliveryBoys,
  deleteDeliveryBoy,
  updateDeliveryBoy
} from '../../services/allApi';
import { toast } from 'react-toastify';

const DeliveryBoyList = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', mobile_number: '', email: '', vehicle_type: '',
    vehicle_number: '', gender: '', dob: '', is_active: true,
    aadhar_card_image: null, driving_license_image: null,
  });

  const [preview, setPreview] = useState({
    aadhar: null,
    license: null
  });

  const [editPreview, setEditPreview] = useState({
    aadhar: null,
    license: null
  });

  const navigate = useNavigate();

  const fetchDeliveryBoys = async () => {
    setLoading(true);
    try {
      const res = await getDeliveryBoys();
      setDeliveryBoys(res.results || []);
    } catch {
      toast.error('Failed to fetch delivery boys');
    } finally {
      setLoading(false);
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

    if (field === 'aadhar_card_image') {
      setPreview((prev) => ({
        ...prev,
        aadhar: URL.createObjectURL(e.target.files[0])
      }));
    }
    if (field === 'driving_license_image') {
      setPreview((prev) => ({
        ...prev,
        license: URL.createObjectURL(e.target.files[0])
      }));
    }

    setFormData({ ...formData, [field]: value });
  };

  const handleEditChange = (field) => (e) => {
    const value = ['aadhar_card_image', 'driving_license_image'].includes(field)
      ? e.target.files[0]
      : field === 'is_active'
        ? e.target.value === 'true'
        : e.target.value;

    if (field === 'aadhar_card_image') {
      setEditPreview((prev) => ({
        ...prev,
        aadhar: URL.createObjectURL(e.target.files[0])
      }));
    }
    if (field === 'driving_license_image') {
      setEditPreview((prev) => ({
        ...prev,
        license: URL.createObjectURL(e.target.files[0])
      }));
    }

    setEditData({ ...editData, [field]: value });
  };

  const clearForm = () => {
    setFormData({
      name: '', mobile_number: '', email: '', vehicle_type: '',
      vehicle_number: '', gender: '', dob: '', is_active: true,
      aadhar_card_image: null, driving_license_image: null,
    });
    setPreview({ aadhar: null, license: null });
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

    setLoading(true);
    try {
      await addDeliveryBoy(reqBody);
      toast.success('Delivery boy added');
      setOpen(false);
      clearForm();
      fetchDeliveryBoys();
    } catch {
      toast.error('Failed to add delivery boy');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (boy) => {
    setEditData({ ...boy });
    setEditPreview({
      aadhar: boy.aadhar_card_image,
      license: boy.driving_license_image
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
      fetchDeliveryBoys();
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

  // Only append files if new ones are selected
  if (aadhar_card_image instanceof File) {
    reqBody.append("aadhar_card_image", aadhar_card_image);
  }

  if (driving_license_image instanceof File) {
    reqBody.append("driving_license_image", driving_license_image);
  }

  setLoading(true);
  try {
    await updateDeliveryBoy(id, reqBody); // Ensure this API accepts FormData
    toast.success("Delivery boy updated successfully");
    setEditOpen(false);
    fetchDeliveryBoys();
  } catch {
    toast.error("Update failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <Container sx={{ py: 4 }}>
      <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>Delivery Boys</Typography>
        <Button variant="contained" sx={{backgroundColor:'#1e1e2d'}} onClick={() => setOpen(true)}>Add Delivery Boy</Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 10 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Name', 'Mobile', 'Email', 'Vehicle', 'Type', 'Gender', 'DOB', 'Status', 'Actions'].map(header => (
                <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryBoys.map((boy) => (
              <TableRow key={boy.id}>
                <TableCell>{boy.name}</TableCell>
                <TableCell>{boy.mobile_number}</TableCell>
                <TableCell>{boy.email}</TableCell>
                <TableCell>{boy.vehicle_number}</TableCell>
                <TableCell>{boy.vehicle_type}</TableCell>
                <TableCell>{boy.gender === 'M' ? 'Male' : boy.gender === 'F' ? 'Female' : 'Other'}</TableCell>
                <TableCell>{boy.dob}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      px: 1.2,
                      py: 0.4,
                      borderRadius: '8px',
                      fontWeight: 600,
                      color: boy.is_active ? '#2e7d32' : '#c62828',
                      backgroundColor: boy.is_active ? '#c8e6c9' : '#ffcdd2',
                      display: 'inline-block',
                    }}
                  >
                    {boy.is_active ? 'Active' : 'Inactive'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => navigate(`/view-deliveryboydetails/${boy.id}`)}><VisibilityIcon /></IconButton>
                  <IconButton color="info" onClick={() => handleEdit(boy)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteConfirm(boy.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Delivery Boy</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Name" value={formData.name} onChange={handleChange('name')} fullWidth required />
            <TextField label="Mobile Number" value={formData.mobile_number} onChange={handleChange('mobile_number')} fullWidth required />
            <TextField label="Email" value={formData.email} onChange={handleChange('email')} fullWidth required />
            <TextField label="Vehicle Number" value={formData.vehicle_number} onChange={handleChange('vehicle_number')} fullWidth required />
            <FormControl fullWidth>
              <InputLabel>Vehicle Type</InputLabel>
              <Select value={formData.vehicle_type} onChange={handleChange('vehicle_type')}>
                <MenuItem value="Bike">Bike</MenuItem>
                <MenuItem value="Car">Car</MenuItem>
                <MenuItem value="Auto">Auto</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select value={formData.gender} onChange={handleChange('gender')}>
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
                <MenuItem value="O">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField type="date" label="DOB" value={formData.dob} onChange={handleChange('dob')} InputLabelProps={{ shrink: true }} fullWidth required />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={formData.is_active.toString()} onChange={handleChange('is_active')}>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Typography>Aadhar Card Image</Typography>
              <input type="file" accept="image/*" onChange={handleChange('aadhar_card_image')} />
              {preview.aadhar && <img src={preview.aadhar} alt="Aadhar Preview" height="100" style={{ marginTop: 8 }} />}
            </Box>
            <Box>
              <Typography>Driving License Image</Typography>
              <input type="file" accept="image/*" onChange={handleChange('driving_license_image')} />
              {preview.license && <img src={preview.license} alt="License Preview" height="100" style={{ marginTop: 8 }} />}
            </Box>
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
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField label="Name" value={editData.name} onChange={handleEditChange('name')} fullWidth />
              <TextField label="Mobile Number" value={editData.mobile_number} onChange={handleEditChange('mobile_number')} fullWidth />
              <TextField label="Email" value={editData.email} onChange={handleEditChange('email')} fullWidth />
              <TextField label="Vehicle Number" value={editData.vehicle_number} onChange={handleEditChange('vehicle_number')} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Vehicle Type</InputLabel>
                <Select value={editData.vehicle_type} onChange={handleEditChange('vehicle_type')}>
                  <MenuItem value="Bike">Bike</MenuItem>
                  <MenuItem value="Car">Car</MenuItem>
                  <MenuItem value="Auto">Auto</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select value={editData.gender} onChange={handleEditChange('gender')}>
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField type="date" label="DOB" value={editData.dob} onChange={handleEditChange('dob')} InputLabelProps={{ shrink: true }} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={editData.is_active.toString()} onChange={handleEditChange('is_active')}>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Box>
                <Typography>Aadhar Card Image</Typography>
                <input type="file" accept="image/*" onChange={handleEditChange('aadhar_card_image')} />
                {editPreview.aadhar && <img src={editPreview.aadhar} alt="Edit Aadhar" height="100" style={{ marginTop: 8 }} />}
              </Box>
              <Box>
                <Typography>Driving License Image</Typography>
                <input type="file" accept="image/*" onChange={handleEditChange('driving_license_image')} />
                {editPreview.license && <img src={editPreview.license} alt="Edit License" height="100" style={{ marginTop: 8 }} />}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
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
