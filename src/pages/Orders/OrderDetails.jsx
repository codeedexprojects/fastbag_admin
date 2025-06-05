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
  Paper
} from '@mui/material';
import {
  AccessTime,
  Payment,
  LocalShipping,
  Person,
  Email,
  Phone,
  Place,
  ShoppingCart,
  Sync
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { updateOrderStatus, viewSpecificOrder } from '../../services/allApi';
import html2pdf from 'html2pdf.js';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState({});
  const [orderStatus, setOrderStatus] = useState('');
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const data = await viewSpecificOrder(orderId);
      setOrderDetails(data);
    };
    fetchOrderDetails();
  }, [orderId]);
      console.log(orderDetails)

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

  // Order Info
  lines.push(['Order Details']);
  lines.push(['Order ID', orderDetails.order_id || '']);
  lines.push(['Order Status', orderStatus || '']);
  lines.push(['Created At', orderDetails.created_at || '']);
  lines.push(['Payment Method', orderDetails.payment_method || '']);
  lines.push(['Delivery PIN', orderDetails.delivery_pin || '']);
  lines.push(['']);

  // Customer Info
  lines.push(['Customer Details']);
  lines.push(['Name', orderDetails.user_name || '']);
  lines.push(['Email', '-']);
  lines.push(['Phone', orderDetails.contact_number || '-']);
  lines.push(['']);

  // Shipping Address
  lines.push(['Shipping Address']);
  lines.push([orderDetails.shipping_address || '']);
  lines.push(['']);

  // Product List Header
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

  // Summary
  lines.push(['Order Summary']);
  lines.push(['Subtotal', orderDetails.total_amount || '']);
  lines.push(['Shipping', 'Included']);
  lines.push(['Grand Total', orderDetails.final_amount || '']);

  // Convert to CSV
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


  const handleOrderStatusChange = async (event) => {
    const newValue = event.target.value;

    try {
      const reqBody = new FormData();
      reqBody.append('order_status', newValue);

      const res = await updateOrderStatus(reqBody, orderDetails.order_id);

      if (res.status === 200) {
        setOrderStatus(newValue);
        console.log('Order status updated successfully');
      } else {
        console.error('Failed to update order status:', res);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Order Details
      </Typography>

      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="textSecondary">
          Dashboard &gt; Order List &gt; Order Details
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Select
            value={orderStatus || ''}
            onChange={handleOrderStatusChange}
            size="small"
            variant="outlined"
            displayEmpty
          >
            <MenuItem value="" disabled>Select Status</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="out for delivery">Out for delivery</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="cancelled">Canceled</MenuItem>
            <MenuItem value="return">Return</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
          <Button variant="outlined" onClick={handleExportCSV}>Export</Button>
          <Button variant="contained" color="primary" onClick={handleGenerateInvoice}>
            Invoice
          </Button>
        </Box>
      </Box>

      <div ref={invoiceRef} style={{ backgroundColor: 'white', padding: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Order #{orderDetails.order_id}
                  <Button variant="contained" size="small" sx={{ ml: 1, bgcolor: 'orange', color: 'white' }}>
                    {orderStatus || 'Loading...'}
                  </Button>
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <AccessTime sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">Created</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.created_at}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Payment sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">Payment</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.payment_method}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <LocalShipping sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">Shipping PIN</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.delivery_pin}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Customer</Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <Person sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">Name</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.user_name}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Email sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">Email</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Phone sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">Phone</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.contact_number || '-'}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Shipping Address</Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <Place sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">Address</Typography>
                </Box>
                <Typography variant="body2" mt={1}>{orderDetails.shipping_address}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Order List{' '}
                  <Typography component="span" color="green">
                    {orderDetails.product_details?.length || 0} Products
                  </Typography>
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 2, bgcolor: '#f5f7f9' }}>
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
                                width={50}
                                height={50}
                                style={{ objectFit: 'cover', borderRadius: 8 }}
                              />
                              <Box>
                                <Typography>{product.product_name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                  Variant: {product.variant || product.selected_variant}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{product.product_id}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>Rs {product.price_per_unit}</TableCell>
                          <TableCell>Rs {product.subtotal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Typography>Subtotal: Rs {orderDetails.total_amount}</Typography>
                  <Typography>Shipping: Included</Typography>
                  <Typography sx={{ fontWeight: 'bold', mt: 1 }}>
                    Grand Total: Rs {orderDetails.final_amount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Order Timeline</Typography>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" alignItems="center" mt={2}>
                  <ShoppingCart color="primary" sx={{ mr: 2 }} />
                  <Typography variant="body2">Order Placed</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderDetails.created_at}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Sync color="secondary" sx={{ mr: 2 }} />
                  <Typography variant="body2">Status</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>{orderStatus}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
};

export default OrderDetails;
