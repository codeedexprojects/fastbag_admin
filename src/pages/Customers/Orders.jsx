import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination, Chip, TextField, MenuItem, IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { viewSpecificUserOrders } from '../../services/allApi';
import { useParams } from 'react-router-dom';

const TransactionsAndOrders = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedDate, setSelectedDate] = useState(null); // dayjs object or null
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await viewSpecificUserOrders(id);
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      }
    };
    fetchOrders();
  }, [id]);

  useEffect(() => {
    let filtered = [...orders];

    if (selectedDate) {
      const formattedDate = dayjs(selectedDate).format('DD/MM/YYYY'); 
      // Comparing strings in dd/mm/yyyy format from backend (already in this format)
      filtered = filtered.filter(order => order.created_at === formattedDate);
    }

    filtered.sort((a, b) => {
      const [dayA, monthA, yearA] = a.created_at.split('/');
      const [dayB, monthB, yearB] = b.created_at.split('/');
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredOrders(filtered);
    setPage(0); // Reset to first page after filtering/sorting
  }, [orders, selectedDate, sortOrder]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Clear the date filter
  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Order History</Typography>
        <Box display="flex" gap={1} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Filter by Date"
              value={selectedDate}
              onChange={(newValue) => {
                setSelectedDate(newValue);
                setPage(0); // Reset pagination on date change
              }}
              slotProps={{ textField: { size: 'small' } }}
              disableFuture
              clearable
            />
          </LocalizationProvider>
          {selectedDate && (
            <IconButton onClick={clearDateFilter} size="small" aria-label="clear date filter">
              <Close />
            </IconButton>
          )}
          <TextField
            select
            label="Sort by Date"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            size="small"
          >
            <MenuItem value="desc">Newest First</MenuItem>
            <MenuItem value="asc">Oldest First</MenuItem>
          </TextField>
        </Box>
      </Box>

      <TableContainer sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden", mt: 3 }}component={Paper}>
        <Table sx={{minWidth:650}}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody     sx={{
            '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
            '&:last-child td, &:last-child th': { border: 0 },
          }}>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.user_name}</TableCell>
                  <TableCell>₹{order.total_amount}</TableCell>
                  <TableCell>
<Typography
  variant="caption"
  sx={{
    px: 1.2,
    py: 0.4,
    borderRadius: '8px',
    fontWeight: 600,
    color:
      order.status === 'Delivered'
        ? '#2e7d32'
        : order.status === 'Shipped'
        ? '#1565c0'
        : '#c62828',
    backgroundColor:
      order.status === 'Delivered'
        ? '#c8e6c9'
        : order.status === 'Shipped'
        ? '#bbdefb'
        : '#ffcdd2',
    display: 'inline-block',
  }}
>
  {order.status || 'Pending'}
</Typography>


                  </TableCell>
                  <TableCell>{order.created_at}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredOrders.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </Box>
  );
};

export default TransactionsAndOrders;
