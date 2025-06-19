import React, { useState, useEffect } from 'react';
import {
  Box, Button, Grid, Typography, Table, TableBody,
  TableCell, TableHead, TableRow, IconButton,
  Pagination, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Backdrop, MenuItem, TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { viewOrders, deleteAllOrders } from "../../services/allApi";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  return dayjs(`${parts[2]}-${parts[1]}-${parts[0]}`, 'YYYY-MM-DD');
};

const OrderList = () => {
  const [activeButton, setActiveButton] = useState('All Time');
  const [selectedDate, setSelectedDate] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;
  const nav = useNavigate();

  const filterOptions = ['All Time', '12 Months', '30 Days', '7 Days', '24 Hour'];
  const orderStatusOptions = ['All', 'processing', 'shipped', 'out for delivery', 'delivered', 'cancelled', 'rejected', 'return'];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await viewOrders();
      setOrders(data);
      setFilteredOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];
    const now = dayjs();

    if (!selectedDate) {
      if (activeButton !== 'All Time') {
        let cutoffDate = null;
        switch (activeButton) {
          case '12 Months': cutoffDate = now.subtract(12, 'month'); break;
          case '30 Days': cutoffDate = now.subtract(30, 'day'); break;
          case '7 Days': cutoffDate = now.subtract(7, 'day'); break;
          case '24 Hour': cutoffDate = now.startOf('day'); break;
        }

        if (cutoffDate) {
          filtered = filtered.filter(order => {
            const orderDate = parseDate(order.created_at);
            return orderDate && (
              activeButton === '24 Hour'
                ? orderDate.isSame(now, 'day')
                : orderDate.isAfter(cutoffDate) && orderDate.isBefore(now.add(1, 'day'))
            );
          });
        }
      }
    }

    if (selectedDate) {
      filtered = filtered.filter(order => {
        const orderDate = parseDate(order.created_at);
        return orderDate && orderDate.isSame(selectedDate, 'day');
      });
    }

    if (orderStatusFilter !== 'All') {
      filtered = filtered.filter(order => order.order_status === orderStatusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [activeButton, selectedDate, orderStatusFilter, orders]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (_, value) => setCurrentPage(value);

  const handleDeleteClick = () => setOpenConfirmDialog(true);

  const handleConfirmDelete = async () => {
    setOpenConfirmDialog(false);
    setLoading(true);
    const res = await deleteAllOrders();
    if (res.status === 200) {
      toast.success("All orders deleted successfully");
      setOrders([]);
      setFilteredOrders([]);
    } else {
      toast.error("Failed to delete orders");
    }
    setLoading(false);
  };

  const handleCancelDelete = () => setOpenConfirmDialog(false);

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
            onChange={(newValue) => {
              setSelectedDate(newValue);
              setActiveButton('All Time');
            }}
            slotProps={{
              textField: {
                size: 'small',
                variant: 'outlined',
                sx: { mr: 2, backgroundColor: 'white' },
              },
            }}
            maxDate={dayjs()}
          />
          <Button variant="outlined" sx={{ marginRight: 2 }} onClick={() => exportToCSV(filteredOrders)}>Export</Button>
          <Button onClick={handleDeleteClick} variant="contained" sx={{ backgroundColor: "rgb(172, 0, 0)" }}>Delete All</Button>
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Box
            sx={{
              display: 'flex',
              p: 1,
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
            }}
          >
            {filterOptions.map((option) => (
              <Button
                key={option}
                variant="outlined"
                sx={{
                  mr: 1,
                  borderColor: activeButton === option ? '#4f46e5' : 'transparent',
                  color: activeButton === option ? '#4f46e5' : '#000',
                  backgroundColor: activeButton === option ? '#e0e7ff' : 'transparent',
                  '&:hover': { backgroundColor: activeButton === option ? '#e0e7ff' : '#f3f4f6' },
                }}
                onClick={() => {
                  setActiveButton(option);
                  if (option !== 'All Time') setSelectedDate(null);
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
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            sx={{ width: 200, backgroundColor: 'white' }}
          >
            {orderStatusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Table sx={{ minWidth: 650, borderRadius: 1, overflow: 'hidden', boxShadow: 10 }}>
        <TableHead>
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
          {paginatedOrders.map((order, index) => (
            <TableRow key={order.id} hover>
              <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
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
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
