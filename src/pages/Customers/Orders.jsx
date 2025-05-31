import React, { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination, Chip
} from '@mui/material';
import { CalendarToday, FilterList } from '@mui/icons-material';

const transactions = [
  { id: '#302012', product: 'Handmade Pouch', total: 121.00, status: 'Processing', date: '12 Dec 2023' },
  { id: '#302011', product: 'Smartwatch E2', total: 590.00, status: 'Processing', date: '1 Dec 2023' },
  { id: '#302006', product: 'Smartwatch E1', total: 125.00, status: 'Shipped', date: '10 Nov 2023' },
  { id: '#302001', product: 'Headphone G1 Pro', total: 348.00, status: 'Shipped', date: '2 Nov 2023' },
  { id: '#301998', product: 'Iphone X', total: 607.00, status: 'Delivered', date: '7 Sep 2023' },
];

const TransactionsAndOrders = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Transaction History</Typography>
        <Box>
          <Button variant="outlined" startIcon={<CalendarToday />} sx={{ mr: 1 }}>
            Select Date
          </Button>
          <Button variant="outlined" startIcon={<FilterList />}>
            Filters
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.product}</TableCell>
                <TableCell>${transaction.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.status}
                    color={
                      transaction.status === 'Delivered'
                        ? 'success'
                        : transaction.status === 'Shipped'
                        ? 'info'
                        : 'warning'
                    }
                  />
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={transactions.length}
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
