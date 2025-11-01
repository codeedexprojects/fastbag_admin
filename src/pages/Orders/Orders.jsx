import React, { useState, useEffect } from 'react';
import {
  Box, Button, Grid, Typography, Table, TableBody,
  TableCell, TableHead, TableRow, IconButton,
  Pagination, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Backdrop, MenuItem, TextField,
  InputAdornment,
  Paper,
  TableContainer
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { viewOrders, deleteAllOrders } from "../../services/allApi";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IosShare } from '@mui/icons-material';
import { CalendarSearch, ChevronDown, Eye, Filter, Trash2 } from 'lucide-react';

const exportToCSV = (data, filename = 'orders.csv') => {
  const headers = [
    'Order ID', 'Products', 'Date', 'Customer', 'Total Amount', 'Payment Method', 'Order Status',
  ];
  const rows = data.map(order => [
    order.order_id,
    order.product_details?.map(p => p.product_name).join(', ') || 'N/A',
    order.created_at || 'N/A',
    order.user_name || 'N/A',
    order.total_amount || '0',
    order.payment_method || 'N/A',
    order.order_status || 'Pending',
  ]);
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers, ...rows].map(row => row.map(val => `"${val}"`).join(',')).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const OrderList = () => {
  const [activeButton, setActiveButton] = useState('All Time');
  const [selectedDate, setSelectedDate] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;
  const nav = useNavigate();

  const filterOptions = ['All Time', '12 Months', '30 Days', '7 Days', '24 Hour'];
  const orderStatusOptions = ['All', 'processing', 'shipped', 'out for delivery', 'delivered', 'cancelled', 'rejected', 'return'];

  // Fetch orders from backend with pagination
  useEffect(() => {
    fetchOrders();
  }, [currentPage, orderStatusFilter, activeButton, selectedDate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Calculate date range based on active filter
      let startDate = null;
      let endDate = null;
      const now = dayjs();

      if (selectedDate) {
        // If specific date is selected, use that
        startDate = selectedDate.format('YYYY-MM-DD');
        endDate = selectedDate.format('YYYY-MM-DD');
      } else if (activeButton !== 'All Time') {
        // Calculate date range based on filter
        endDate = now.format('YYYY-MM-DD');
        
        switch (activeButton) {
          case '12 Months':
            startDate = now.subtract(12, 'month').format('YYYY-MM-DD');
            break;
          case '30 Days':
            startDate = now.subtract(30, 'day').format('YYYY-MM-DD');
            break;
          case '7 Days':
            startDate = now.subtract(7, 'day').format('YYYY-MM-DD');
            break;
          case '24 Hour':
            startDate = now.startOf('day').format('YYYY-MM-DD');
            break;
        }
      }

      // Build API parameters
      const params = {
        page: currentPage,
        page_size: pageSize,
      };

      if (orderStatusFilter && orderStatusFilter !== 'All') {
        params.order_status = orderStatusFilter;
      }

      if (startDate) {
        params.start_date = startDate;
      }

      if (endDate) {
        params.end_date = endDate;
      }

      console.log('Fetching orders with params:', params); // Debug log

      const response = await viewOrders(params);
      
      console.log('API Response:', response); // Debug log

      // Handle paginated response
      if (response.results) {
        setOrders(response.results);
        setTotalCount(response.count);
        setTotalPages(Math.ceil(response.count / pageSize));
      } else {
        // Fallback for non-paginated response
        setOrders(response);
        setTotalCount(response.length);
        setTotalPages(Math.ceil(response.length / pageSize));
      }
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    console.log('Page changed to:', value); // Debug log
    setCurrentPage(value);
  };

  const handleFilterChange = (option) => {
    console.log('Filter changed to:', option); // Debug log
    setActiveButton(option);
    setSelectedDate(null);
    setCurrentPage(1); // Reset to first page
  };

  const handleDateChange = (newValue) => {
    console.log('Date changed to:', newValue); // Debug log
    setSelectedDate(newValue);
    setActiveButton('All Time');
    setCurrentPage(1); // Reset to first page
  };

  const handleStatusFilterChange = (e) => {
    console.log('Status filter changed to:', e.target.value); // Debug log
    setOrderStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleDeleteClick = () => setOpenConfirmDialog(true);

  const handleConfirmDelete = async () => {
    setOpenConfirmDialog(false);
    setLoading(true);
    try {
      const res = await deleteAllOrders();
      if (res.status === 200) {
        toast.success("All orders deleted successfully");
        setOrders([]);
        setTotalCount(0);
        setTotalPages(0);
        setCurrentPage(1);
        fetchOrders();
      } else {
        toast.error("Failed to delete orders");
      }
    } catch (error) {
      toast.error("Error deleting orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => setOpenConfirmDialog(false);

  const exportAllOrders = async () => {
    try {
      setLoading(true);
      // Fetch all orders for export (without pagination)
      const params = {
        page_size: 10000, // Large number to get all orders
      };

      if (orderStatusFilter && orderStatusFilter !== 'All') {
        params.order_status = orderStatusFilter;
      }

      // Add date filters if active
      if (selectedDate) {
        params.start_date = selectedDate.format('YYYY-MM-DD');
        params.end_date = selectedDate.format('YYYY-MM-DD');
      } else if (activeButton !== 'All Time') {
        const now = dayjs();
        params.end_date = now.format('YYYY-MM-DD');
        
        switch (activeButton) {
          case '12 Months':
            params.start_date = now.subtract(12, 'month').format('YYYY-MM-DD');
            break;
          case '30 Days':
            params.start_date = now.subtract(30, 'day').format('YYYY-MM-DD');
            break;
          case '7 Days':
            params.start_date = now.subtract(7, 'day').format('YYYY-MM-DD');
            break;
          case '24 Hour':
            params.start_date = now.startOf('day').format('YYYY-MM-DD');
            break;
        }
      }

      const response = await viewOrders(params);
      const allOrders = response.results || response;
      
      exportToCSV(allOrders);
      toast.success('Orders exported successfully');
    } catch (error) {
      toast.error('Failed to export orders');
      console.error('Export error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>Order</Typography>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Typography variant="body2" color="text.secondary">Dashboard &gt; Order List</Typography>
        </Grid>
        <Grid item>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            slots={{ openPickerIcon: CalendarSearch }}
            slotProps={{
              textField: {
                size: 'small',
                variant: 'outlined',
                sx: {
                  mr: 2,
                  backgroundColor: '#f9fafb',
                  borderRadius: 2,
                  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.06)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                },
              },
            }}
            maxDate={dayjs()}
          />
          <Button 
            variant="contained" 
            startIcon={<IosShare />} 
            sx={{ marginRight: 2 }} 
            onClick={exportAllOrders}
          >
            Export
          </Button>
          <Button 
            onClick={handleDeleteClick} 
            variant="containedError" 
            startIcon={<Trash2 size={20} />}
          >
            Delete All
          </Button>
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 1, borderRadius: 2, boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)', gap: 1, backgroundColor: '#fff' }}>
            {filterOptions.map((option) => (
              <Button
                key={option}
                onClick={() => handleFilterChange(option)}
                sx={{
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: activeButton === option ? '#e0e7ff' : 'transparent',
                  color: activeButton === option ? '#1e3a8a' : '#4b5563',
                  '&:hover': {
                    backgroundColor: '#e0e7ff',
                  }
                }}
              >
                {option}
              </Button>
            ))}
          </Box>
        </Grid>
        <Grid item>
          <TextField
            select
            label="Filter by Status"
            size="small"
            value={orderStatusFilter}
            onChange={handleStatusFilterChange}
            SelectProps={{
              IconComponent: ChevronDown,
            }}
            sx={{
              width: 200,
              backgroundColor: '#f9fafb',
              borderRadius: 2,
              boxShadow: '0 1px 8px rgba(0, 0, 0, 0.05)',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiInputLabel-root': {
                color: '#6b7280',
                fontSize: 14,
              },
              '& .MuiSelect-select': {
                fontSize: 14,
              },
              '& .MuiSvgIcon-root': {
                color: '#374151',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Filter size={18} style={{ color: '#374151' }} />
                </InputAdornment>
              ),
            }}
          >
            {orderStatusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Debug info - Remove this in production */}
      <Box sx={{ mb: 2, p: 2, bgcolor: '#f0f0f0', borderRadius: 2, fontSize: '12px' }}>
        <Typography variant="caption">
          Debug Info: Page {currentPage} | Total: {totalCount} | Total Pages: {totalPages} | Orders on page: {orders.length}
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 3, boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)', overflow: "hidden", mt: 3 }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="order table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>No.</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Payment</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={order.id} hover>
                <TableCell sx={{ textAlign: 'center' }}>
                  {/* Use serial_number from backend, or fallback to calculated value */}
                  {order.serial_number || (totalCount - ((currentPage - 1) * pageSize) - index)}
                </TableCell>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>
                  {order.product_details?.length > 0
                    ? order.product_details.map((p) => p.product_name).join(', ')
                    : 'N/A'}
                </TableCell>
                <TableCell>{order.created_at || 'N/A'}</TableCell>
                <TableCell>{order.user_name}</TableCell>
                <TableCell>{`Rs ${order.total_amount}`}</TableCell>
                <TableCell sx={{ textTransform: 'uppercase' }}>{order.payment_method || 'N/A'}</TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1.2,
                      py: 0.4,
                      borderRadius: '8px',
                      fontWeight: 600,
                      color:
                        order.order_status === 'processing' ? '#ef6c00' :
                          order.order_status === 'shipped' ? '#1565c0' :
                            order.order_status === 'out for delivery' ? '#283593' :
                              order.order_status === 'delivered' ? '#2e7d32' :
                                order.order_status === 'cancelled' ? '#ad1457' :
                                  order.order_status === 'rejected' ? '#b71c1c' :
                                    order.order_status === 'return' ? '#6a1b9a' : '#c62828',
                      backgroundColor:
                        order.order_status === 'processing' ? '#ffe0b2' :
                          order.order_status === 'shipped' ? '#bbdefb' :
                            order.order_status === 'out for delivery' ? '#c5cae9' :
                              order.order_status === 'delivered' ? '#c8e6c9' :
                                order.order_status === 'cancelled' ? '#f8bbd0' :
                                  order.order_status === 'rejected' ? '#ffcdd2' :
                                    order.order_status === 'return' ? '#e1bee7' : '#ffcdd2',
                      display: 'inline-block',
                      textTransform: 'capitalize',
                    }}
                  >
                    {order.order_status || 'Pending'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton color="info" onClick={() => { nav(`/order-details/${order.id}`); }}>
                    <Eye />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete all orders? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default OrderList;