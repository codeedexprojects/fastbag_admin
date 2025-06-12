// ... imports
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { deleteBigBuyOrders, viewBigBuyOrders, editBigBuyOrders } from '../../services/allApi';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const BigBuyOrders = () => {
  const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
  setLoading(true);
  try {
    const data = await viewBigBuyOrders();
    setOrders(data.results);
  } catch (error) {
    toast.error('Failed to fetch orders.');
  } finally {
    setLoading(false);
  }
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'PREPARING':
        return 'dark';
      case 'DELIVERED':
        return 'primary';
      default:
        return 'default';
    }
  };

  const handleEditOpen = (order) => {
    setEditOrder(order);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditOrder(null);
  };

  const handleEditChange = (field, value) => {
    setEditOrder((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSave = async () => {
  setLoading(true);
  try {
    const res = await editBigBuyOrders(editOrder, editOrder.id);
    if (res.status) {
      toast.success('Order updated successfully!');
      fetchOrders();
      handleEditClose();
    } else {
      toast.error('Failed to update order.');
    }
  } catch (error) {
    toast.error('Failed to update order.');
  } finally {
    setLoading(false);
  }
};


  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
    setOrderToDelete(null);
  };

const handleDeleteConfirm = async () => {
  setLoading(true);
  try {
    const res = await deleteBigBuyOrders(orderToDelete.id);
    if (res.status) {
      fetchOrders();
      toast.success('Order deleted successfully!');
    }
  } catch (error) {
    toast.error('Failed to delete order.');
  } finally {
    setDeleteOpen(false);
    setOrderToDelete(null);
    setLoading(false);
  }
};


  return (
    <Box sx={{ p: 4, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Big Buy Orders
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, letterSpacing: 0.5 }}>
        Dashboard &gt; Big Buy Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card
              variant="outlined"
              sx={{
                height: 430,
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.3s ease',
                borderRadius: 2,
                boxShadow: '0 1px 4px rgb(0 0 0 / 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 20px rgb(0 0 0 / 0.15)',
                },
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ flexGrow: 1, overflowY: 'auto', pt: 2, pb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{ fontFamily: 'monospace', fontWeight: 600 }}
                    title={`Order ID: ${order.order_id}`}
                  >
                    #{order.order_id}
                  </Typography>
                  <Box>
                    <Tooltip title="Edit Order">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditOpen(order)}
                        aria-label="edit order"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Order">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(order)}
                        aria-label="delete order"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Chip
                  label={order.status.toUpperCase()}
                  color={getStatusColor(order.status)}
                  size="small"
                  sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    borderRadius: 1,
                  }}
                />

                {/* ✅ New Amount Section */}
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.3 }}>
                    Amount
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{parseFloat(order.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                  <Typography variant="body1" component="div" sx={{ fontWeight: 600, mb: 0.3 }}>
                    User Info
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.user_name}
                  </Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                  <Typography variant="body1" component="div" sx={{ fontWeight: 600, mb: 0.3 }}>
                    Delivery Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.3 }}>
                    <strong>Delivery Date:</strong> {order.preferred_delivery_date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Occasion:</strong> {order.special_occasion}
                  </Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                  <Typography variant="body1" component="div" sx={{ fontWeight: 600, mb: 0.3 }}>
                    Preferences
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.3 }}>
                    <strong>People:</strong> {order.number_of_people}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.3 }}>
                    <strong>Diet:</strong> {order.diet_category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Notes:</strong> {order.additional_notes || 'N/A'}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Created At: {order.created_at}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                  Order Items
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    pl: 3,
                    m: 0,
                    maxHeight: 100,
                    overflowY: 'auto',
                    '& li': {
                      mb: 0.7,
                      listStyleType: 'disc',
                      color: 'text.primary',
                    },
                  }}
                >
                  {order.order_items.map((item) => (
                    <li key={item.id}>
                      <Typography variant="body2" component="span">
                        {item.food_item} - {item.quantity_in_kg} kg
                      </Typography>
                    </li>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Order #{editOrder?.order_id}</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={editOrder?.status || ''}
              onChange={(e) => handleEditChange('status', e.target.value)}
            >
              <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
              <MenuItem value="PREPARING">PREPARING</MenuItem>
              <MenuItem value="DELIVERED">DELIVERED</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED</MenuItem>
              <MenuItem value="PENDING">PENDING</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Amount"
            fullWidth
            margin="normal"
            type="number"
            value={editOrder?.amount || ''}
            onChange={(e) => handleEditChange('amount', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete order #{orderToDelete?.order_id}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={loading}
>
  <CircularProgress color="inherit" />
</Backdrop>

    </Box>
  );
};

export default BigBuyOrders;
