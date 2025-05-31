import React, { useState } from 'react';
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
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const OrderList = () => {
  const [activeButton, setActiveButton] = useState('All Time'); // Active filter state
  const filterOptions = ['All Time', '12 Months', '30 Days', '7 Days', '24 Hour'];
  
  const [selectedDate, setSelectedDate] = useState('');


  const orders = [
    { id: '#302012', product: 'Handmade Pouch', date: '1 min ago', customer: 'John Bushmill', total: '$121.00', payment: 'Mastercard', status: 'Processing' },
    { id: '#302011', product: 'Smartwatch E2', date: '1 min ago', customer: 'Ilham Budi A', total: '$590.00', payment: 'Visa', status: 'Processing' },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      {/* Title Section */}
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Order
      </Typography>

      {/* Breadcrumb and Action Buttons */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Typography variant="body1">
            Dashboard &gt; Order List
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="outlined" sx={{ marginRight: 2 }}>
            Export
          </Button>
          <Button variant="contained" color="primary">
            + Add Order
          </Button>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {/* Filter Buttons inside a Box */}
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
                                borderColor: activeButton === option ? '#4f46e5' : 'transparent', // Blue border when active
                                color: activeButton === option ? '#4f46e5' : '#000', // Blue text when active
                                backgroundColor: activeButton === option ? '#e0e7ff' : 'transparent', // Light blue background for active button
                                '&:hover': {
                                    backgroundColor: activeButton === option ? '#e0e7ff' : '#f3f4f6', // Keep background on hover
                                },
                            }}
                            onClick={() => setActiveButton(option)} // Set active button on click
                        >
                            {option}
                        </Button>
                    ))}
                </Box>


                {/* Action Buttons */}
                <Box>
                <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)} // Update the selected date
                        style={{ marginRight: '10px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />                    <Button variant="outlined" color="primary">Filters</Button>
                </Box>
            </Box>

      {/* Orders Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox />
            </TableCell>
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
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <Typography color="primary" sx={{ cursor: 'pointer' }}>
                  {order.id}
                </Typography>
              </TableCell>
              <TableCell>{order.product}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>{order.payment}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor:
                      order.status === 'Processing'
                        ? 'orange'
                        : order.status === 'Shipped'
                        ? 'lightblue'
                        : order.status === 'Delivered'
                        ? 'green'
                        : 'red',
                    color: 'white',
                    textTransform: 'capitalize',
                  }}
                >
                  {order.status}
                </Button>
              </TableCell>
              <TableCell>
                <IconButton>
                  <VisibilityIcon />
                </IconButton>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
        <Pagination count={5} color="primary" />
      </Box>
    </Box>
  );
};

export default OrderList;
