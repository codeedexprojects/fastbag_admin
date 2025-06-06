import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Pagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { viewOrders, deleteAllOrders } from "../../services/allApi";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const exportToCSV = (data, filename = 'orders.csv') => {
  const headers = [
    'Order ID',
    'Products',
    'Date',
    'Customer',
    'Total Amount',
    'Payment Method',
    'Order Status',
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
  const filterOptions = ['All Time', '12 Months', '30 Days', '7 Days', '24 Hour'];
  const [selectedDate, setSelectedDate] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const pageSize = 5;

  const nav = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await viewOrders();
      setOrders(data);
      setFilteredOrders(data);
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
          case '12 Months':
            cutoffDate = now.subtract(12, 'month');
            break;
          case '30 Days':
            cutoffDate = now.subtract(30, 'day');
            break;
          case '7 Days':
            cutoffDate = now.subtract(7, 'day');
            break;
          case '24 Hour':
            cutoffDate = now.startOf('day');
            break;
          default:
            cutoffDate = null;
        }

        if (cutoffDate) {
          filtered = filtered.filter(order => {
            if (!order.created_at) return false;
            const orderDate = parseDate(order.created_at);
            if (!orderDate) return false;

            if (activeButton === '24 Hour') {
              return orderDate.isSame(now, 'day');
            }

            return orderDate.isAfter(cutoffDate) && orderDate.isBefore(now.add(1, 'day'));
          });
        }
      }
    }

    if (selectedDate) {
      filtered = filtered.filter(order => {
        if (!order.created_at) return false;
        const orderDate = parseDate(order.created_at);
        return orderDate && orderDate.isSame(selectedDate, 'day');
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [activeButton, selectedDate, orders]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (activeButton === 'All Time' && !selectedDate) {
      setSelectedDate(null);
    }
  }, [activeButton, selectedDate]);

  // Open confirmation dialog when Delete All button clicked
  const handleDeleteClick = () => {
    setOpenConfirmDialog(true);
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    setOpenConfirmDialog(false);
    const res = await deleteAllOrders();
    if (res.status === 200) {
      toast.success("All orders deleted successfully");
      setOrders([]);
      setFilteredOrders([]);
    } else {
      toast.error("Failed to delete orders");
    }
  };

  // Cancel deletion dialog
  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Order
      </Typography>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Typography variant="body2" color="text.secondary" gutterBottom>Dashboard &gt; Order List</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            sx={{ marginRight: 2 }}
            onClick={() => exportToCSV(filteredOrders)}
          >
            Export
          </Button>
          <Button
            onClick={handleDeleteClick}
            variant="contained"
            sx={{ backgroundColor: "rgb(172, 0, 0)" }}
          >
            Delete All
          </Button>
        </Grid>
      </Grid>

    <Box sx={{padding:'20px'}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                  '&:hover': {
                    backgroundColor: activeButton === option ? '#e0e7ff' : '#f3f4f6',
                  },
                }}
                onClick={() => {
                  setActiveButton(option);
                  if (option !== 'All Time') {
                    setSelectedDate(null);
                  }
                }}
              >
                {option}
              </Button>
            ))}
          </Box>
  
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
  
  
  
        </Box>
    </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Checkbox /></TableCell>
            <TableCell>Order ID</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell><Checkbox /></TableCell>
              <TableCell>
                <Typography color="primary" sx={{ cursor: 'pointer' }}>
                  {order.order_id}
                </Typography>
              </TableCell>
              <TableCell>
                {order.product_details?.length > 0
                  ? order.product_details.map((p) => p.product_name).join(', ')
                  : 'N/A'}
              </TableCell>
              <TableCell>{order.created_at || 'N/A'}</TableCell>
              <TableCell>{order.user_name}</TableCell>
              <TableCell>{`Rs ${order.total_amount}`}</TableCell>
              <TableCell style={{ textTransform: 'uppercase' }}>{order.payment_method || 'N/A'}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor:
                      order.order_status === 'processing'
                        ? 'orange'
                        : order.order_status === 'shipped'
                          ? 'lightblue'
                          : order.order_status === 'delivered'
                            ? 'green'
                            : 'red',
                    color: 'white',
                    textTransform: 'capitalize',
                  }}
                >
                  {order.order_status || 'Pending'}
                </Button>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => { nav(`/order-details/${order.id}`) }}><VisibilityIcon /></IconButton>
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

      {/* Confirmation Dialog */}
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
    </Box>
  );
};

export default OrderList;
