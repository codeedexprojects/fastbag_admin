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
import { addDeliveryBoy, getDeliveryBoys, deleteDeliveryBoy, updateDeliveryBoy } from '../../services/allApi';
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

    setLoading(true);
    try {
      await addDeliveryBoy(reqBody);
      toast.success('Delivery boy added');
      setOpen(false);
      fetchDeliveryBoys();
    } catch {
      toast.error('Failed to add delivery boy');
    } finally {
      setLoading(false);
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

    setLoading(true);
    try {
      await updateDeliveryBoy(id, updatedData);
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
        <Button variant="contained"    sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#333" } }}    onClick={() => setOpen(true)}>Add Delivery Boy</Button>
      </Box>

     <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3 }}>
  <Table>
    <TableHead sx={{ backgroundColor: '#1976d2' }}>
      <TableRow>
        {[
          'Name', 'Mobile', 'Email', 'Vehicle', 'Vehicle Type',
          'Gender', 'DOB', 'Status', 'Actions'
        ].map((header) => (
          <TableCell key={header} sx={{ color: '#fff', fontWeight: 'bold' }}>
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody>
      {deliveryBoys.map((boy) => (
        <TableRow
          key={boy.id}
          hover
          sx={{
            '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
            '&:last-child td, &:last-child th': { border: 0 },
          }}
        >
          <TableCell>{boy.name}</TableCell>
          <TableCell>{boy.mobile_number}</TableCell>
          <TableCell>{boy.email}</TableCell>
          <TableCell>{boy.vehicle_number}</TableCell>
          <TableCell>{boy.vehicle_type}</TableCell>
          <TableCell>{boy.gender === 'M' ? 'Male' : boy.gender === 'F' ? 'Female' : 'Other'}</TableCell>
          <TableCell>{boy.dob}</TableCell>
          <TableCell>
            <Typography
              variant="caption"
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
          <TableCell align="center" sx={{ minWidth: 140 }}>
            <IconButton color="primary" onClick={() => navigate(`/view-deliveryboydetails/${boy.id}`)} title="View Details">
              <VisibilityIcon />
            </IconButton>
            <IconButton color="info" onClick={() => handleEdit(boy)} title="Edit Delivery Boy">
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleDeleteConfirm(boy.id)} title="Delete Delivery Boy">
              <DeleteIcon />
            </IconButton>
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
          {/* all form fields same as before */}
          {/* ... */}
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
          {/* editData form same as before */}
          {/* ... */}
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
