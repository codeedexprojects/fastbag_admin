import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination, TextField, MenuItem, IconButton
} from '@mui/material';
import { CalendarSearch, X } from 'lucide-react';
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
  const [selectedDate, setSelectedDate] = useState(null);
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
    setPage(0);
  }, [orders, selectedDate, sortOrder]);

  const clearDateFilter = () => setSelectedDate(null);

  return (
    <Box sx={{ mt: 4, px: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>Order History</Typography>

        <Box display="flex" gap={1.5} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Filter by Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              disableFuture
              slots={{ openPickerIcon: CalendarSearch }}
              slotProps={{
                textField: {
                  size: 'small',
                  variant: 'outlined',
                  sx: {
                    minWidth: 180,
                    boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f9fafb',
                    borderRadius: 2,
                    fontSize: 14,
                    '& .MuiOutlinedInput-root': {
                      paddingRight: '10px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d1d5db',
                      borderRadius: '8px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#9ca3af',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6366f1',
                      borderWidth: 2,
                    },
                    '& .MuiInputBase-input': {
                      padding: '10px 12px',
                      color: '#111827',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#4b5563',
                    },
                  },
                },
                openPickerButton: {
                  sx: {
                    color: '#4b5563',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>

          {selectedDate && (
            <IconButton
              onClick={clearDateFilter}
              size="small"
              sx={{
                width: 34,
                height: 34,
                border: '1px solid #e5e7eb',
                borderRadius: '50%',
                color: '#374151',

                backgroundColor: '#fff',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
              }}
            >
              <X size={18} />
            </IconButton>
          )}

          <TextField
            select
            label="Sort by Date"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            size="small"
            sx={{
              minWidth: 150,
              backgroundColor: '#f9fafb',
              boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',

              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: '#9ca3af',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6366f1',
                  borderWidth: 2,
                },
              },
              '& .MuiInputBase-input': {
                color: '#111827',
                fontSize: 14,
              },
              '& .MuiSvgIcon-root': {
                color: '#374151',
              },
            }}
          >
            <MenuItem value="desc">Newest First</MenuItem>
            <MenuItem value="asc">Oldest First</MenuItem>
          </TextField>

        </Box>


      </Box>

       <TableContainer
                component={Paper}
                elevation={3}
                sx={{ borderRadius: 3 ,boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',overflow: "hidden", mt: 3 }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="category table">
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><strong>Order ID</strong></TableCell>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Total</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No orders found.</TableCell>
              </TableRow>
            ) : (
              filteredOrders
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
                          px: 1.4,
                          py: 0.4,
                          borderRadius: '10px',
                          fontWeight: 600,
                          color:
                            order.status === 'Delivered' ? '#2e7d32' :
                              order.status === 'Shipped' ? '#1565c0' :
                                '#c62828',
                          backgroundColor:
                            order.status === 'Delivered' ? '#c8e6c9' :
                              order.status === 'Shipped' ? '#bbdefb' :
                                '#ffcdd2',
                          display: 'inline-block'
                        }}
                      >
                        {order.status || 'Pending'}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.created_at}</TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredOrders.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </Box>
  );
};

export default TransactionsAndOrders;