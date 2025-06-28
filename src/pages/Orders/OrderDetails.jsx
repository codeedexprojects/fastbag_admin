import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Backdrop,
  CircularProgress
} from '@mui/material';
import {
  Clock,
  CreditCard,
  Truck,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  RefreshCcw,
  FileText,
  Download
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { updateOrderStatus, viewSpecificOrder } from '../../services/allApi';
import html2pdf from 'html2pdf.js';
import { IosShare } from '@mui/icons-material';

const OrderDetails = () => {
  const [loading, setLoading] = useState(false);
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState({});
  const [orderStatus, setOrderStatus] = useState('');
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await viewSpecificOrder(orderId);
        setOrderDetails(data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (orderDetails.order_status) {
      setOrderStatus(orderDetails.order_status);
    }
  }, [orderDetails]);

  const handleGenerateInvoice = () => {
    const element = invoiceRef.current;
    if (!element) return;

    const options = {
      margin: 0.3,
      filename: `Invoice_Order_${orderDetails.order_id || ''}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
  };

  const handleExportCSV = () => {
    if (!orderDetails) return;
    const lines = [];
    lines.push(['Order Details']);
    lines.push(['Order ID', orderDetails.order_id || '']);
    lines.push(['Order Status', orderStatus || '']);
    lines.push(['Created At', orderDetails.created_at || '']);
    lines.push(['Payment Method', orderDetails.payment_method || '']);
    lines.push(['Delivery PIN', orderDetails.delivery_pin || '']);
    lines.push(['']);
    lines.push(['Customer Details']);
    lines.push(['Name', orderDetails.user_name || '']);
    lines.push(['Email', '-']);
    lines.push(['Phone', orderDetails.contact_number || '-']);
    lines.push(['']);
    lines.push(['Shipping Address']);
    lines.push([orderDetails.shipping_address || '']);
    lines.push(['']);
    lines.push(['Product Details']);
    lines.push(['Product Name', 'Product ID', 'Variant', 'Quantity', 'Price/Unit', 'Subtotal']);
    if (orderDetails.product_details?.length > 0) {
      orderDetails.product_details.forEach((product) => {
        lines.push([
          product.product_name,
          product.product_id,
          product.variant || product.selected_variant || '',
          product.quantity,
          product.price_per_unit,
          product.subtotal
        ]);
      });
    } else {
      lines.push(['No products available']);
    }
    lines.push(['']);
    lines.push(['Order Summary']);
    lines.push(['Subtotal', orderDetails.total_amount || '']);
    lines.push(['Shipping', 'Included']);
    lines.push(['Grand Total', orderDetails.final_amount || '']);

    const csvContent = lines.map((line) => line.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Order_${orderDetails.order_id || 'Export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return { backgroundColor: '#1976d2', color: 'white' }; // Blue
      case 'out for delivery':
        return { backgroundColor: '#0288d1', color: 'white' }; // Cyan
      case 'pending':
        return { backgroundColor: '#ff9800', color: 'white' }; // Orange
      case 'cancelled':
        return { backgroundColor: '#e53935', color: 'white' }; // Red
      case 'return':
        return { backgroundColor: '#6d4c41', color: 'white' }; // Brown
      case 'shipped':
        return { backgroundColor: '#7b1fa2', color: 'white' }; // Purple
      case 'rejected':
        return { backgroundColor: '#9e9e9e', color: 'white' }; // Grey
      case 'delivered':
        return { backgroundColor: '#2e7d32', color: 'white' }; // Green
      default:
        return { backgroundColor: '#757575', color: 'white' }; // Default Grey
    }
  };


  const handleOrderStatusChange = async (event) => {
    const newValue = event.target.value;
    try {
      const reqBody = new FormData();
      reqBody.append('order_status', newValue);
      const res = await updateOrderStatus(reqBody, orderDetails.order_id);
      if (res.status === 200) {
        setOrderStatus(newValue);
      } else {
        console.error('Failed to update order status:', res);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Order Details</Typography>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Dashboard &gt; Order List &gt; Order Details
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
         <Select
  value={orderStatus || ''}
  onChange={handleOrderStatusChange}
  size="small"
  variant="outlined"
  displayEmpty
  sx={{
    minWidth: 160,
    backgroundColor: '#f5f7fa',
    borderRadius: 2,
    fontSize: 14,
      boxShadow: '0 1px 10px rgba(0, 0, 0, 0.19)',
    color: '#333',
    '.MuiOutlinedInput-notchedOutline': {
border:'none'    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#888',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976d2',
      borderWidth: '2px',
    },
    '.MuiSvgIcon-root': {
      color: '#555',
    }
  }}
>
  <MenuItem value="" disabled>Select Status</MenuItem>
  <MenuItem value="processing">Processing</MenuItem>
  <MenuItem value="out for delivery">Out for delivery</MenuItem>
  <MenuItem value="pending">Pending</MenuItem>
  <MenuItem value="cancelled">Canceled</MenuItem>
  <MenuItem value="return">Return</MenuItem>
  <MenuItem value="shipped">Shipped</MenuItem>
  <MenuItem value="rejected">Rejected</MenuItem>
  <MenuItem value="delivered">Delivered</MenuItem>
</Select>

          <Button variant="contained" startIcon={<IosShare />} onClick={handleExportCSV}>Export</Button>
          <Button variant="containedSecondary" startIcon={<FileText size={20} />} onClick={handleGenerateInvoice}>Invoice</Button>
        </Box>
      </Box>

      <div ref={invoiceRef} style={{  padding: 20, borderRadius: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',}}>
              <CardContent sx={{ height: 230 }}>
                <Typography variant="h6">
                  Order #{orderDetails.order_id}
                  <Button
                    size="medium"
                    
                    sx={{ ml: 1, ...getStatusColor(orderStatus),textTransform:'capitalize' }}
                  >
                    {orderStatus || 'Loading...'}
                  </Button>

                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <Clock size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Created</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.created_at}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <CreditCard size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Payment</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.payment_method}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Truck size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Shipping PIN</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.delivery_pin}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',}}>
              <CardContent sx={{ height: 230 }}>
                <Typography variant="h6">Customer</Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <User size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Name</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.user_name}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Mail size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Email</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Phone size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Phone</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.contact_number}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',}}>
              <CardContent sx={{ height: 230 }}>
                <Typography variant="h6">Shipping Address</Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <MapPin size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Address</Typography>
                </Box>
                <Typography variant="body2" mt={1}>{orderDetails.shipping_address}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} md={8}>
            <Card sx={{  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',}}>
              <CardContent>
                <Typography variant="h6">Order List</Typography>
                <TableContainer component={Paper} sx={{ mt: 2 , boxShadow: '0 1px 10px rgba(0, 0, 0, 0.19)', }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Product ID</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price/Unit</TableCell>
                        <TableCell>Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetails.product_details?.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <img
                                src={product.product_image}
                                alt={product.product_name}
                                width={40}
                                height={40}
                                style={{ borderRadius: 6, objectFit: 'cover' }}
                              />
                              <Box>
                                <Typography>{product.product_name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Variant: {product.variant || product.selected_variant}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{product.product_id}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>₹ {product.price_per_unit}</TableCell>
                          <TableCell>₹ {product.subtotal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box mt={3} textAlign="right">
                  <Typography>Subtotal: ₹ {orderDetails.total_amount}</Typography>
                  <Typography>Shipping: Included</Typography>
                  <Typography fontWeight="bold">Grand Total: ₹ {orderDetails.final_amount}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',}}>
              <CardContent>
                <Typography variant="h6">Order Timeline</Typography>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" alignItems="center" mt={2}>
                  <ShoppingCart size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Order Placed</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.created_at}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <RefreshCcw size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Status</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderStatus}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default OrderDetails;
