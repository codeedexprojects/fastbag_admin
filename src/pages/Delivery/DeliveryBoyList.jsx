import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Backdrop, CircularProgress, Button
} from '@mui/material';
import { CircleX, Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDeliveryBoys, deleteDeliveryBoy, updateDeliveryBoy } from '../../services/allApi';
import { toast } from 'react-toastify';
import EditDeliveryBoyModal from './EditDeliveryModal';

const DeliveryBoyList = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editPreview, setEditPreview] = useState({ aadhar: null, license: null });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
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

  const handleEdit = (boy) => {
    setEditData({ ...boy });
    setEditPreview({
      aadhar: boy.aadhar_card_image,
      license: boy.driving_license_image
    });
    setEditOpen(true);
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
    if (aadhar_card_image instanceof File) reqBody.append("aadhar_card_image", aadhar_card_image);
    if (driving_license_image instanceof File) reqBody.append("driving_license_image", driving_license_image);

    setLoading(true);
    try {
      await updateDeliveryBoy(id, reqBody);
      toast.success("Delivery boy updated successfully");
      setEditOpen(false);
      fetchDeliveryBoys();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
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

  return (
    <Container sx={{ py: 4 }}>
      <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>Delivery Boys</Typography>
      </Box>

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          borderRadius: 3,
          boxShadow: '0 1px 12px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {['No', 'Name', 'Mobile', 'Email', 'Vehicle', 'Type', 'Gender', 'DOB', 'Status', 'Actions'].map(header => (
                <TableCell key={header} sx={{ fontWeight: 700 }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryBoys.map((boy, index) => (
              <TableRow key={boy.id} hover>
                <TableCell>{index + 1}</TableCell>
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
                      px: 1.3,
                      py: 0.5,
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 2,
                      color: boy.is_active ? '#1b5e20' : '#b71c1c',
                      backgroundColor: boy.is_active ? '#c8e6c9' : '#ffcdd2',
                      display: 'inline-block',
                    }}
                  >
                    {boy.is_active ? 'Active' : 'Inactive'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton color='primary' onClick={() => navigate(`/view-deliveryboydetails/${boy.id}`)} size="small">
                    <Eye size={20} />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(boy)} color="info" size="small">
                    <Pencil size={20} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteConfirm(boy.id)} color="error" size="small">
                    <Trash2 size={20} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditDeliveryBoyModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        editData={editData}
        setEditData={setEditData}
        editPreview={editPreview}
        setEditPreview={setEditPreview}
        handleUpdate={handleUpdate}
        loading={loading}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this delivery boy?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" startIcon={<CircleX/>} onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" startIcon={<Trash2/>} onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DeliveryBoyList;
