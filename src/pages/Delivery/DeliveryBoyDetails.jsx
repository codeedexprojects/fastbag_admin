import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Typography, Grid, Card, CardContent, Avatar,
  Divider, CircularProgress, Box, Chip, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [acceptedPage, setAcceptedPage] = useState(0);
  const [acceptedRowsPerPage, setAcceptedRowsPerPage] = useState(5);
  const [rejectedPage, setRejectedPage] = useState(0);
  const [rejectedRowsPerPage, setRejectedRowsPerPage] = useState(5);

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
const nav=useNavigate()
  useEffect(() => {
    const fetchAcceptedOrders = async () => {
      setLoading(true);
      try {
        const res = await getAcceptedOrders(id);
        const allOrders = res?.results || [];
        setAcceptedOrders(allOrders.filter(o => o.is_accepted && !o.is_rejected));
        setRejectedOrders(allOrders.filter(o => o.is_rejected));
      } catch (error) {
        console.log("Error fetching accepted orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAcceptedOrders();
  }, []);

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
      nav(-1)
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

  if (loading) return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
  if (!deliveryBoy) return <Container sx={{ textAlign: 'center', mt: 4 }}><Typography color="error">Delivery boy not found.</Typography></Container>;

 return (
  <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h4" fontWeight={700} color="primary.main">
        {deliveryBoy.name}
      </Typography>
      <Box>
        <IconButton color="primary" onClick={() => handleEdit(deliveryBoy)} size="small">
          <Pencil  />
        </IconButton>
        <IconButton color="error" onClick={() => handleDeleteConfirm(deliveryBoy.id)} size="small">
          <Trash2  />
        </IconButton>
      </Box>
    </Box>

    <Grid container spacing={4}>
      {/* Profile Card */}
      <Grid item xs={12}>
        <Card elevation={2} sx={{ borderRadius: 3,boxShadow: '0 1px 10px rgba(0, 0, 0, 0.19)', }}>
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
    <Typography>
      <strong>Address:</strong> {deliveryBoy.address}
      {deliveryBoy.latitude != null && deliveryBoy.longitude != null && (
        <> ({deliveryBoy.latitude}, {deliveryBoy.longitude})</>
      )}
    </Typography>
  </Box>

  {/* Divider */}
  <Divider orientation="vertical" flexItem sx={{   borderRightWidth: 3,display: { xs: 'none', md: 'block' }, mx: 2 }} />

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

      {/* Accepted Orders */}
      <Grid item xs={12}>
        <Typography variant="h6" mb={2}>Accepted Orders</Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 3,boxShadow: '0 1px 10px rgba(0, 0, 0, 0.19)',  }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f0f2f5' }}>
                <TableCell>No</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Delivery Address</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {acceptedOrders
                .slice(acceptedPage * acceptedRowsPerPage, acceptedPage * acceptedRowsPerPage + acceptedRowsPerPage)
                .map((order, index) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{acceptedPage * acceptedRowsPerPage + index + 1}</TableCell>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>{order.user_details?.name}</TableCell>
                    <TableCell>{order.assigned_at}</TableCell>
                    <TableCell>
                      {order.user_details?.address && (
                        <>
                          {order.user_details.address.address_line1}, {order.user_details.address.address_line2}<br />
                          {order.user_details.address.city}, {order.user_details.address.state}<br />
                          {order.user_details.address.country} - {order.user_details.address.pincode}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.vendor_details && (
                        <>
                          {order.vendor_details.name}<br />
                          {order.vendor_details.address}, {order.vendor_details.landmark}<br />
                          {order.vendor_details.city}, {order.vendor_details.state} - {order.vendor_details.pincode}<br />
                          {(order.vendor_details.latitude && order.vendor_details.longitude) && (
                            <small>(Lat: {order.vendor_details.latitude}, Lng: {order.vendor_details.longitude})</small>
                          )}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={acceptedOrders.length}
            rowsPerPage={acceptedRowsPerPage}
            page={acceptedPage}
            onPageChange={(e, newPage) => setAcceptedPage(newPage)}
            onRowsPerPageChange={(e) => {
              setAcceptedRowsPerPage(parseInt(e.target.value, 10));
              setAcceptedPage(0);
            }}
          />
        </TableContainer>
      </Grid>

      {/* Rejected Orders */}
      <Grid item xs={12}>
        <Typography variant="h6" mb={2}>Rejected Orders</Typography>
        <TableContainer component={Paper} sx={{  borderRadius: 3,boxShadow: '0 1px 10px rgba(0, 0, 0, 0.19)',  }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f0f2f5' }}>
                <TableCell>No</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Delivery Address</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rejectedOrders
                .slice(rejectedPage * rejectedRowsPerPage, rejectedPage * rejectedRowsPerPage + rejectedRowsPerPage)
                .map((order, index) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{rejectedPage * rejectedRowsPerPage + index + 1}</TableCell>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>{order.user_details?.name}</TableCell>
                    <TableCell>{order.assigned_at}</TableCell>
                    <TableCell>
                      {order.user_details?.address && (
                        <>
                          {order.user_details.address.address_line1}, {order.user_details.address.address_line2}<br />
                          {order.user_details.address.city}, {order.user_details.address.state}<br />
                          {order.user_details.address.country} - {order.user_details.address.pincode}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.vendor_details && (
                        <>
                          {order.vendor_details.name}<br />
                          {order.vendor_details.address}, {order.vendor_details.landmark}<br />
                          {order.vendor_details.city}, {order.vendor_details.state} - {order.vendor_details.pincode}<br />
                          {(order.vendor_details.latitude && order.vendor_details.longitude) && (
                            <small>(Lat: {order.vendor_details.latitude}, Lng: {order.vendor_details.longitude})</small>
                          )}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rejectedOrders.length}
            rowsPerPage={rejectedRowsPerPage}
            page={rejectedPage}
            onPageChange={(e, newPage) => setRejectedPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRejectedRowsPerPage(parseInt(e.target.value, 10));
              setRejectedPage(0);
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
        <Button onClick={() => setDeleteDialogOpen(false)}  variant='contained' startIcon={<CircleX/>}>Cancel</Button>
        <Button onClick={handleDelete} color="error" variant='contained' startIcon={<Trash2/>}>Delete</Button>
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
