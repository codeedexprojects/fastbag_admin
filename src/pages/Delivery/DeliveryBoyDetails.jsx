import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Typography, Grid, Card, CardContent, Avatar,
  Divider, CircularProgress, Box, Chip, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination
} from '@mui/material';
import { toast } from 'react-toastify';
import { getDeliveryBoy, updateDeliveryBoy, deleteDeliveryBoy, getAcceptedOrders } from '../../services/allApi';
import EditDeliveryBoyModal from './EditDeliveryModal';
import { CircleX, Pencil, Trash2 } from 'lucide-react';

const genders = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Others' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'warning';
    case 'CONFIRMED': return 'success';
    case 'CANCELLED': return 'error';
    case 'PREPARING': return 'info';
    case 'DELIVERED': return 'primary';
    case 'PICKED': return 'success';
    case 'ASSIGNED': return 'info';
    case 'ACCEPTED': return 'success';
    case 'REJECTED': return 'error';
    default: return 'default';
  }
};

const getAssignmentStatusColor = (status) => {
  switch (status) {
    case 'Accepted': return 'success';
    case 'Rejected': return 'error';
    case 'Pending': return 'warning';
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
  const [allOrders, setAllOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { id } = useParams();
  const nav = useNavigate();

  const fetchDeliveryBoy = async () => {
    setLoading(true);
    try {
      const response = await getDeliveryBoy(id);
      setDeliveryBoy(response.data);
    } catch (error) {
      console.error("Error fetching delivery boy:", error);
      toast.error("Failed to fetch delivery boy details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryBoy();
  }, [id]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      try {
        const res = await getAcceptedOrders(id);
        const orders = res?.results || [];
        setAllOrders(orders);
      } catch (error) {
        console.log("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
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
      nav(-1);
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
      aadhar_card_image, driving_license_image, address,
    } = editData;

    if (!name || !mobile_number || !email || !vehicle_type || !vehicle_number || !gender || !dob || !address) {
      toast.error("Please fill all fields");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("name", name);
    reqBody.append("mobile_number", mobile_number);
    reqBody.append("email", email);
    reqBody.append("vehicle_type", vehicle_type);
    reqBody.append("vehicle_number", vehicle_number);
    reqBody.append("address", address);
    reqBody.append("gender", gender);
    reqBody.append("dob", dob);
    reqBody.append("is_active", is_active);

    if (aadhar_card_image instanceof File) reqBody.append("aadhar_card_image", aadhar_card_image);
    if (driving_license_image instanceof File) reqBody.append("driving_license_image", driving_license_image);

    setLoading(true);
    try {
      const res = await updateDeliveryBoy(id, reqBody);
      if (res.status === 200) {
        toast.success("Updated successfully");
        fetchDeliveryBoy();
      }
      setEditOpen(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !deliveryBoy) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!deliveryBoy) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Delivery boy not found.</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} color="primary.main">
          {deliveryBoy.name}
        </Typography>
        <Box>
          <IconButton color="primary" onClick={() => handleEdit(deliveryBoy)} size="small">
            <Pencil />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteConfirm(deliveryBoy.id)} size="small">
            <Trash2 />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 3, boxShadow: '0 1px 10px rgba(0, 0, 0, 0.19)' }}>
            <CardContent>
              <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
                {/* Left: Info Section */}
                <Box flex={1}>
                  <Box display="flex" gap={2} alignItems="center" mb={2}>
                    <Avatar src={deliveryBoy.photo} sx={{ width: 100, height: 100 }}>
                      {!deliveryBoy.photo && deliveryBoy.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="h6">{deliveryBoy.name}</Typography>
                  </Box>

                  <Typography><strong>Mobile:</strong> {deliveryBoy.mobile_number}</Typography>
                  <Typography><strong>Email:</strong> {deliveryBoy.email}</Typography>
                  <Typography><strong>Vehicle:</strong> {deliveryBoy.vehicle_type} - {deliveryBoy.vehicle_number}</Typography>
                  <Typography><strong>DOB:</strong> {deliveryBoy.dob}</Typography>
                  <Typography><strong>Gender:</strong> {genders.find(g => g.value === deliveryBoy.gender)?.label || deliveryBoy.gender}</Typography>
                  <Typography><strong>Address:</strong> {deliveryBoy.address}</Typography>
                </Box>

                {/* Divider */}
                <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 3, display: { xs: 'none', md: 'block' }, mx: 2 }} />

                {/* Right: Documents Section */}
                <Box flex={1}>
                  <Typography variant="h6" gutterBottom>Documents</Typography>
                  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                    {deliveryBoy.aadhar_card_image && (
                      <Box textAlign="center">
                        <a href={deliveryBoy.aadhar_card_image} download>
                          <img src={deliveryBoy.aadhar_card_image} alt="Aadhar" height={150} width="100" style={{ borderRadius: 8 }} />
                        </a>
                        <Typography variant="body2" fontWeight={600} mt={1}>Aadhar Card</Typography>
                      </Box>
                    )}
                    {deliveryBoy.driving_license_image && (
                      <Box textAlign="center">
                        <a href={deliveryBoy.driving_license_image} download>
                          <img src={deliveryBoy.driving_license_image} alt="License" height={150} width="100" style={{ borderRadius: 8 }} />
                        </a>
                        <Typography variant="body2" fontWeight={600} mt={1}>Driving License</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* All Orders - Single Table */}
        <Grid item xs={12}>
          <Typography variant="h6" mb={2}>All Assigned Orders</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 1px 10px rgba(0, 0, 0, 0.19)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f0f2f5' }}>
                  <TableCell><strong>No</strong></TableCell>
                  <TableCell><strong>Order ID</strong></TableCell>
                  <TableCell><strong>Customer</strong></TableCell>
                  <TableCell><strong>Assigned Date</strong></TableCell>
                  <TableCell><strong>Delivery Location</strong></TableCell>
                  <TableCell><strong>Vendor Location</strong></TableCell>
                  <TableCell><strong>Delivery Charge</strong></TableCell>
                  <TableCell><strong>Assignment Status</strong></TableCell>
                  <TableCell><strong>Order Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography color="text.secondary">No orders assigned yet</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  allOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order, index) => (
                      <TableRow key={order.id} hover>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{order.order_id}</TableCell>
                        <TableCell>{order.user_details?.name || 'N/A'}</TableCell>
                        <TableCell>
                          {order.assigned_at ? new Date(order.assigned_at).toLocaleString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {order.user_details?.address ? (
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {order.user_details.address.location_name || 
                                 `${order.user_details.address.city}, ${order.user_details.address.state}`}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {order.user_details.address.address_line1}
                                {order.user_details.address.address_line2 && `, ${order.user_details.address.address_line2}`}
                              </Typography>
                            </Box>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {order.vendor_details ? (
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {order.vendor_details.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {order.vendor_details.location_name || 
                                 `${order.vendor_details.city}, ${order.vendor_details.state}`}
                              </Typography>
                            </Box>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <strong>₹{order.delivery_charge || '0.00'}</strong>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.assignment_status || 'Pending'} 
                            color={getAssignmentStatusColor(order.assignment_status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status || 'N/A'} 
                            color={getStatusColor(order.status)} 
                            size="small" 
                          />
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={allOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this delivery boy?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant='contained' startIcon={<CircleX />}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant='contained' startIcon={<Trash2 />}>Delete</Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default DeliveryBoyDetails;