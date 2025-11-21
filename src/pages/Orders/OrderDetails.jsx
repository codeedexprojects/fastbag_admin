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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Alert,
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
  Store,
  Navigation,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import {
  updateOrderStatus,
  viewSpecificOrder,
  getDeliveryBoyForOrder,
  assignDeliveryBoy,
  getAvailableDeliveryBoys,
} from '../../services/allApi';
import html2pdf from 'html2pdf.js';
import { IosShare } from '@mui/icons-material';

// ✨ IMPORTANT: Replace with your actual Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const OrderDetails = () => {
  const [loading, setLoading] = useState(false);
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState({});
  const [orderStatus, setOrderStatus] = useState('');
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [availableDeliveryBoys, setAvailableDeliveryBoys] = useState([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const invoiceRef = useRef();
  const mapRef = useRef(null);

  // ✨ Load Google Maps Script
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          setMapLoaded(true);
          clearInterval(checkGoogleMaps);
        }
      }, 100);
      
      setTimeout(() => clearInterval(checkGoogleMaps), 10000);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps loaded successfully');
      setMapLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps');
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await viewSpecificOrder(orderId);
        console.log('Order details:', data);
        setOrderDetails(data);
        
        if (data.vendor_details) {
          setVendors(data.vendor_details);
        }
        
        if (data.user_location) {
          console.log('User location from address:', data.user_location);
          setUserLocation(data.user_location);
        }
        
        // Fetch delivery boy assignment
        await fetchDeliveryBoy();
      } catch (error) {
        console.error('Error fetching order details:', error);
        setErrorMessage('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const fetchDeliveryBoy = async () => {
    try {
      const response = await getDeliveryBoyForOrder(orderId);
      if (response.success && response.delivery_boy) {
        setDeliveryBoy(response.delivery_boy);
      }
    } catch (error) {
      console.error('Error fetching delivery boy:', error);
    }
  };

  useEffect(() => {
    if (orderDetails.order_status) {
      setOrderStatus(orderDetails.order_status);
    }
  }, [orderDetails]);

  useEffect(() => {
    if (mapLoaded && userLocation && userLocation.latitude && userLocation.longitude) {
      console.log('Initializing map with location:', userLocation);
      initializeMap();
    }
  }, [mapLoaded, userLocation, vendors, deliveryBoy]);

  const initializeMap = () => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps not loaded');
      return;
    }

    if (!mapRef.current) {
      console.error('Map container not found');
      return;
    }

    try {
      const mapOptions = {
        zoom: 13,
        center: {
          lat: parseFloat(userLocation.latitude),
          lng: parseFloat(userLocation.longitude),
        },
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      };

      const map = new window.google.maps.Map(mapRef.current, mapOptions);

      // Add user/delivery location marker (Blue)
      new window.google.maps.Marker({
        position: {
          lat: parseFloat(userLocation.latitude),
          lng: parseFloat(userLocation.longitude),
        },
        map: map,
        title: 'Delivery Location',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
      });

      // Add vendor markers (Red)
      if (vendors && vendors.length > 0) {
        vendors.forEach((vendor, index) => {
          if (vendor.latitude && vendor.longitude) {
            new window.google.maps.Marker({
              position: {
                lat: parseFloat(vendor.latitude),
                lng: parseFloat(vendor.longitude),
              },
              map: map,
              title: vendor.business_name,
              label: {
                text: (index + 1).toString(),
                color: 'white',
                fontWeight: 'bold'
              },
              icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              },
            });
          }
        });
      }

      // Add delivery boy marker if assigned (Green)
      if (deliveryBoy && deliveryBoy.current_latitude && deliveryBoy.current_longitude) {
        new window.google.maps.Marker({
          position: {
            lat: parseFloat(deliveryBoy.current_latitude),
            lng: parseFloat(deliveryBoy.current_longitude),
          },
          map: map,
          title: `Delivery Boy: ${deliveryBoy.name}`,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          },
        });
      }

      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const handleGenerateInvoice = () => {
    const element = invoiceRef.current;
    if (!element) return;

    const options = {
      margin: 0.3,
      filename: `Invoice_Order_${orderDetails.order_id || ''}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
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
    lines.push(['Email', orderDetails.user_email || '-']);
    lines.push(['Phone', orderDetails.user_mobile_number || '-']);
    lines.push(['']);
    lines.push(['Shipping Address']);
    lines.push([orderDetails.shipping_address || '']);
    lines.push(['']);

    if (vendors.length > 0) {
      lines.push(['Vendor Details']);
      vendors.forEach((vendor, index) => {
        lines.push([`Vendor ${index + 1}`, vendor.business_name]);
        lines.push(['Contact', vendor.contact_number]);
        lines.push(['Address', vendor.address]);
      });
      lines.push(['']);
    }

    if (deliveryBoy) {
      lines.push(['Delivery Boy Details']);
      lines.push(['Name', deliveryBoy.name]);
      lines.push(['Phone', deliveryBoy.phone_number]);
      lines.push(['Vehicle', `${deliveryBoy.vehicle_type} - ${deliveryBoy.vehicle_number}`]);
      lines.push(['']);
    }

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
          product.subtotal,
        ]);
      });
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
        return { backgroundColor: '#1976d2', color: 'white' };
      case 'out for delivery':
        return { backgroundColor: '#0288d1', color: 'white' };
      case 'pending':
        return { backgroundColor: '#ff9800', color: 'white' };
      case 'cancelled':
        return { backgroundColor: '#e53935', color: 'white' };
      case 'return':
        return { backgroundColor: '#6d4c41', color: 'white' };
      case 'shipped':
        return { backgroundColor: '#7b1fa2', color: 'white' };
      case 'rejected':
        return { backgroundColor: '#9e9e9e', color: 'white' };
      case 'delivered':
        return { backgroundColor: '#2e7d32', color: 'white' };
      default:
        return { backgroundColor: '#757575', color: 'white' };
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
        setSuccessMessage('Order status updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setErrorMessage('Failed to update order status');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleOpenAssignDialog = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      // Pass orderId to the API call
      const response = await getAvailableDeliveryBoys(orderId);
      
      if (response.success) {
        if (response.delivery_boys && response.delivery_boys.length > 0) {
          setAvailableDeliveryBoys(response.delivery_boys);
          setAssignDialogOpen(true);
        } else {
          setErrorMessage('No delivery boys available within the delivery radius');
        }
      } else {
        setErrorMessage(response.message || 'Failed to fetch available delivery boys');
      }
    } catch (error) {
      console.error('Error fetching delivery boys:', error);
      setErrorMessage('Failed to fetch available delivery boys. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDeliveryBoy = async () => {
    if (!selectedDeliveryBoy) return;

    try {
      setLoading(true);
      setErrorMessage('');
      
      const response = await assignDeliveryBoy(
        orderId,
        selectedDeliveryBoy,
        `New order #${orderId} assigned to you`
      );

      if (response.success) {
        setDeliveryBoy(response.delivery_boy);
        setAssignDialogOpen(false);
        setSelectedDeliveryBoy('');
        setSuccessMessage('Delivery boy assigned successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Refresh map
        if (mapLoaded && userLocation) {
          setTimeout(() => initializeMap(), 500);
        }
      } else {
        setErrorMessage(response.message || 'Failed to assign delivery boy');
      }
    } catch (error) {
      console.error('Error assigning delivery boy:', error);
      setErrorMessage('Failed to assign delivery boy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      {/* Success/Error Messages */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      <Typography variant="h4" mb={3}>
        Order Details
      </Typography>
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
                border: 'none',
              },
            }}
          >
            <MenuItem value="" disabled>
              Select Status
            </MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="out for delivery">Out for delivery</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="cancelled">Canceled</MenuItem>
            <MenuItem value="return">Return</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
          </Select>

          <Button variant="contained" startIcon={<IosShare />} onClick={handleExportCSV}>
            Export
          </Button>
          <Button
            variant="containedSecondary"
            startIcon={<FileText size={20} />}
            onClick={handleGenerateInvoice}
          >
            Invoice
          </Button>
        </Box>
      </Box>

      <div ref={invoiceRef} style={{ padding: 20, borderRadius: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ height: 230 }}>
                <Typography variant="h6">
                  Order #{orderDetails.order_id}
                  <Button
                    size="medium"
                    sx={{ ml: 1, ...getStatusColor(orderStatus), textTransform: 'capitalize' }}
                  >
                    {orderStatus || 'Loading...'}
                  </Button>
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <Clock size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Created</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>
                    {orderDetails.created_at}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <CreditCard size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Payment</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>
                    {orderDetails.payment_method}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Truck size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Shipping PIN</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>
                    {orderDetails.delivery_pin}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ height: 230 }}>
                <Typography variant="h6">Customer</Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <User size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Name</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>
                    {orderDetails.user_name}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Mail size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Email</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>
                    {orderDetails.user_email}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Phone size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Phone</Typography>
                  <Typography variant="body2" sx={{ ml: 'auto' }}>
                    {orderDetails.user_mobile_number}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ height: 230 }}>
                <Typography variant="h6">Shipping Address</Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <MapPin size={20} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Address</Typography>
                </Box>
                <Typography variant="body2" mt={1}>
                  {orderDetails.shipping_address}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Vendor Details Section */}
        {vendors && vendors.length > 0 && (
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12}>
              <Card sx={{ boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                  <Typography variant="h6" mb={2}>
                    <Store size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Vendor Details
                  </Typography>
                  <Grid container spacing={2}>
                    {vendors.map((vendor, index) => (
                      <Grid item xs={12} md={6} key={vendor.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                              {vendor.store_logo && (
                                <Avatar
                                  src={vendor.store_logo}
                                  alt={vendor.business_name}
                                  sx={{ width: 50, height: 50 }}
                                />
                              )}
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {vendor.business_name}
                                </Typography>
                                <Chip
                                  label={vendor.store_id}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              <strong>Owner:</strong> {vendor.owner_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              <strong>Contact:</strong> {vendor.contact_number}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              <strong>Email:</strong> {vendor.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              <strong>Address:</strong> {vendor.address}, {vendor.city},{' '}
                              {vendor.state} - {vendor.pincode}
                            </Typography>
                            {vendor.opening_time_str && vendor.closing_time_str && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Hours:</strong> {vendor.opening_time_str} -{' '}
                                {vendor.closing_time_str}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Delivery Boy and Map Section */}
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    <Truck size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Delivery Boy
                  </Typography>
                  {!deliveryBoy && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleOpenAssignDialog}
                      startIcon={<User size={16} />}
                    >
                      Assign
                    </Button>
                  )}
                </Box>

                {deliveryBoy ? (
                  <Box>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      {deliveryBoy.profile_image && (
                        <Avatar
                          src={deliveryBoy.profile_image}
                          alt={deliveryBoy.name}
                          sx={{ width: 60, height: 60 }}
                        />
                      )}
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {deliveryBoy.name}
                        </Typography>
                        <Chip
                          label={deliveryBoy.is_available ? 'Available' : 'Busy'}
                          size="small"
                          color={deliveryBoy.is_available ? 'success' : 'warning'}
                        />
                      </Box>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <Phone size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                      {deliveryBoy.phone_number}
                    </Typography>
                    {deliveryBoy.email && (
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        <Mail size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                        {deliveryBoy.email}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <strong>Vehicle:</strong> {deliveryBoy.vehicle_type} (
                      {deliveryBoy.vehicle_number})
                    </Typography>
                    {deliveryBoy.place && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Location:</strong> {deliveryBoy.place}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No delivery boy assigned yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Map Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  <Navigation size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Delivery Map
                </Typography>
                {!mapLoaded ? (
                  <Box
                    sx={{
                      width: '100%',
                      height: 300,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                      borderRadius: 2,
                    }}
                  >
                    <CircularProgress size={24} />
                    <Typography variant="body2" color="text.secondary" ml={2}>
                      Loading map...
                    </Typography>
                  </Box>
                ) : userLocation && userLocation.latitude && userLocation.longitude ? (
                  <Box
                    ref={mapRef}
                    sx={{
                      width: '100%',
                      height: 300,
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 300,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Delivery location not available
                    </Typography>
                  </Box>
                )}
                <Box mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    <Box component="span" sx={{ color: '#4285F4' }}>
                      ● Blue
                    </Box>{' '}
                    - Delivery Location |{' '}
                    <Box component="span" sx={{ color: '#EA4335' }}>
                      ● Red
                    </Box>{' '}
                    - Vendor |{' '}
                    <Box component="span" sx={{ color: '#34A853' }}>
                      ● Green
                    </Box>{' '}
                    - Delivery Boy
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Product List */}
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12}>
            <Card sx={{ boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h6">Order List</Typography>
                <TableContainer
                  component={Paper}
                  sx={{ mt: 2, boxShadow: '0 1px 10px rgba(0, 0, 0, 0.19)' }}
                >
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
                                {product.vendor_name && (
                                  <Typography variant="caption" color="text.secondary">
                                    Vendor: {product.vendor_name}
                                  </Typography>
                                )}
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
                  <Typography fontWeight="bold">
                    Grand Total: ₹ {orderDetails.final_amount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* Assign Delivery Boy Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assign Delivery Boy</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Select a delivery boy to assign to this order
          </Typography>
          {availableDeliveryBoys.length > 0 ? (
            <List>
              {availableDeliveryBoys.map((boy) => (
                <ListItem
                  key={boy.id}
                  button
                  selected={selectedDeliveryBoy === boy.id}
                  onClick={() => setSelectedDeliveryBoy(boy.id)}
                  sx={{
                    border: '1px solid',
                    borderColor: selectedDeliveryBoy === boy.id ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={boy.profile_image} alt={boy.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={boy.name}
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          {boy.phone_number}
                        </Typography>
                        <br />
                        <Typography variant="caption" component="span">
                          {boy.vehicle_type} - {boy.vehicle_number}
                        </Typography>
                        <br />
                        <Typography variant="caption" component="span" color="primary">
                          Distance: {boy.distance_km} km
                        </Typography>
                      </>
                    }
                  />
                  <Chip
                    label={boy.is_available ? 'Available' : 'Busy'}
                    size="small"
                    color={boy.is_available ? 'success' : 'warning'}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
              No delivery boys available within the delivery radius
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAssignDeliveryBoy}
            variant="contained"
            disabled={!selectedDeliveryBoy}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default OrderDetails;