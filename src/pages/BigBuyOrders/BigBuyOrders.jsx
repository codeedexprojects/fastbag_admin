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
  Paper,
  Stack,
  Drawer,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { toast } from 'react-toastify';
import { 
  deleteBigBuyOrders, 
  viewBigBuyOrders, 
  editBigBuyOrders,
  detailBigBuyOrders 
} from '../../services/allApi';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { 
  CircleX, 
  Pencil, 
  Save, 
  Trash2, 
  MapPin, 
  Calendar, 
  Users, 
  Utensils,
  Eye,
  Phone,
  Mail,
  Package,
  Clock,
  ChevronRight,
  X
} from 'lucide-react';

const BigBuyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  const fetchOrderDetails = async (orderId) => {
    setDetailLoading(true);
    try {
      const response = await detailBigBuyOrders(orderId);
      setOrderDetails(response.data || response);
    } catch (error) {
      toast.error('Failed to fetch order details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailDrawerOpen(true);
    fetchOrderDetails(order.id);
  };

  const handleCloseDetails = () => {
    setDetailDrawerOpen(false);
    setSelectedOrder(null);
    setOrderDetails(null);
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
        return 'info';
      case 'DELIVERED':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#fff3e0';
      case 'CONFIRMED':
        return '#e8f5e9';
      case 'CANCELLED':
        return '#ffebee';
      case 'PREPARING':
        return '#e3f2fd';
      case 'DELIVERED':
        return '#f3e5f5';
      default:
        return '#f5f5f5';
    }
  };

  const handleEditOpen = (order, e) => {
    e.stopPropagation();
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
        if (selectedOrder?.id === editOrder.id) {
          fetchOrderDetails(editOrder.id);
        }
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

  const handleDeleteClick = (order, e) => {
    e.stopPropagation();
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
        if (selectedOrder?.id === orderToDelete.id) {
          handleCloseDetails();
        }
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
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Big Buy Orders
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
          Dashboard &gt; Big Buy Orders
        </Typography>
      </Box>

      {/* Compact Horizontal Order Cards */}
      <Stack spacing={2}>
        {orders.map((order, index) => {
          const serialNumber = orders.length - index;
          
          return (
            <Card
              key={order.id}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transform: 'translateX(4px)',
                  borderColor: '#667eea',
                },
              }}
              onClick={() => handleViewDetails(order)}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Order Number & ID */}
                  <Grid item xs={12} sm={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Order Number
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        #{serialNumber}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: 'monospace', 
                          color: 'text.secondary',
                          display: 'block',
                          mt: 0.5
                        }}
                      >
                        {order.order_id?.substring(0, 8)}...
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Customer Info */}
                  <Grid item xs={12} sm={2.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: '#667eea',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}
                      >
                        {order.user_name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {order.user_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Customer
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Delivery Info */}
                  <Grid item xs={12} sm={2.5}>
                    <Stack spacing={0.5}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Calendar size={14} color="#666" />
                        <Typography variant="body2" fontSize="0.85rem">
                          {order.preferred_delivery_date}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Users size={14} color="#666" />
                        <Typography variant="body2" fontSize="0.85rem">
                          {order.number_of_people} people
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Status */}
                  <Grid item xs={12} sm={1.5}>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Grid>

                  {/* Amount */}
                  <Grid item xs={12} sm={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Total Amount
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="success.main">
                        ₹{parseFloat(order.amount).toLocaleString('en-IN', { 
                          minimumFractionDigits: 2 
                        })}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Actions */}
                  <Grid item xs={12} sm={1.5}>
                    <Box display="flex" justifyContent="flex-end" gap={0.5}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          sx={{ color: 'primary.main' }}
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          sx={{ color: 'info.main' }}
                          onClick={(e) => handleEditOpen(order, e)}
                        >
                          <Pencil size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          sx={{ color: 'error.main' }}
                          onClick={(e) => handleDeleteClick(order, e)}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {/* Detail Drawer */}
      <Drawer
        anchor="right"
        open={detailDrawerOpen}
        onClose={handleCloseDetails}
        PaperProps={{
          sx: { width: { xs: '100%', sm: '600px' } }
        }}
      >
        {detailLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        ) : orderDetails ? (
          <Box>
            {/* Drawer Header */}
            <Box
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    Order Details
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontFamily: 'monospace' }}>
                    {orderDetails.order_id}
                  </Typography>
                </Box>
                <IconButton onClick={handleCloseDetails} sx={{ color: 'white' }}>
                  <X size={24} />
                </IconButton>
              </Box>
              
              <Box display="flex" gap={2} mt={3}>
                <Chip
                  label={orderDetails.status}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Chip
                  label={`₹${parseFloat(orderDetails.amount).toLocaleString('en-IN', { 
                    minimumFractionDigits: 2 
                  })}`}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)',
                  }}
                />
              </Box>
            </Box>

            {/* Drawer Content */}
            <Box sx={{ p: 3 }}>
              {/* Customer Information */}
              <Paper elevation={0} sx={{ p: 2.5, mb: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Customer Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: '#667eea', width: 50, height: 50 }}>
                      {orderDetails.user_name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {orderDetails.user_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Customer
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

              {/* Delivery Address */}
              {orderDetails.delivery_address && (
                <Paper elevation={0} sx={{ p: 2.5, mb: 3, backgroundColor: '#e8f5e9', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    <MapPin size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                    Delivery Address
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    {orderDetails.delivery_address.address_type || 'Home'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {orderDetails.delivery_address.address_line1}
                    {orderDetails.delivery_address.address_line2 && 
                      `, ${orderDetails.delivery_address.address_line2}`}
                    <br />
                    {orderDetails.delivery_address.city}, {orderDetails.delivery_address.state}
                    <br />
                    PIN: {orderDetails.delivery_address.pincode}
                  </Typography>
                  {orderDetails.delivery_address.contact_number && (
                    <Box display="flex" alignItems="center" gap={1} mt={2}>
                      <Phone size={16} color="#2e7d32" />
                      <Typography variant="body2" fontWeight={600}>
                        {orderDetails.delivery_address.contact_number}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              )}

              {/* Order Details Grid */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
                    <Calendar size={20} color="#1976d2" style={{ marginBottom: 8 }} />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Delivery Date
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {orderDetails.preferred_delivery_date}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f3e5f5', borderRadius: 2 }}>
                    <Users size={20} color="#9c27b0" style={{ marginBottom: 8 }} />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Number of People
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {orderDetails.number_of_people}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 2 }}>
                    <Utensils size={20} color="#ed6c02" style={{ marginBottom: 8 }} />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Diet Category
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {orderDetails.diet_category || 'N/A'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: '#fce4ec', borderRadius: 2 }}>
                    <Clock size={20} color="#c2185b" style={{ marginBottom: 8 }} />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Created At
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {new Date(orderDetails.created_at).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Special Occasion */}
              {orderDetails.special_occasion && (
                <Paper elevation={0} sx={{ p: 2.5, mb: 3, backgroundColor: '#fff9c4', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    🎉 Special Occasion
                  </Typography>
                  <Typography variant="body2">
                    {orderDetails.special_occasion}
                  </Typography>
                </Paper>
              )}

              {/* Additional Notes */}
              {orderDetails.additional_notes && (
                <Paper elevation={0} sx={{ p: 2.5, mb: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    📝 Additional Notes
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    {orderDetails.additional_notes}
                  </Typography>
                </Paper>
              )}

              {/* Order Items Table */}
              <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  <Package size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  Order Items ({orderDetails.order_items?.length || 0})
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetails.order_items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {item.food_item}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${item.quantity_in_kg} kg`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* Action Buttons */}
              <Box display="flex" gap={2} mt={3}>
                <Button
                  variant="contained"
                  startIcon={<Pencil size={18} />}
                  fullWidth
                  onClick={(e) => {
                    handleCloseDetails();
                    handleEditOpen(orderDetails, e);
                  }}
                >
                  Edit Order
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Trash2 size={18} />}
                  fullWidth
                  onClick={(e) => {
                    handleCloseDetails();
                    handleDeleteClick(orderDetails, e);
                  }}
                >
                  Delete Order
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography>No order details available</Typography>
          </Box>
        )}
      </Drawer>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
          Edit Order #{editOrder?.order_id}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={editOrder?.status || ''}
              onChange={(e) => handleEditChange('status', e.target.value)}
            >
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
              <MenuItem value="PREPARING">PREPARING</MenuItem>
              <MenuItem value="DELIVERED">DELIVERED</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED</MenuItem>
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
        <DialogActions sx={{ p: 2 }}>
          <Button startIcon={<CircleX />} onClick={handleEditClose}>
            Cancel
          </Button>
          <Button variant="contained" startIcon={<Save />} onClick={handleEditSave}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete order <strong>#{orderToDelete?.order_id}</strong>?
            <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" startIcon={<CircleX />} onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Trash2 />}
            color="error"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default BigBuyOrders;