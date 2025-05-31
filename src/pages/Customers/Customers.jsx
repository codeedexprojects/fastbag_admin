import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, IconButton, Checkbox,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, CircularProgress
} from '@mui/material';
import { Search, Visibility, Edit, Delete, FilterList } from '@mui/icons-material';
import { viewUsers } from '../../services/allApi';
import { useNavigate } from 'react-router-dom';

const CustomersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await viewUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleViewClick = (id) => {
    navigate(`/customer-details/${id}`);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Customers
      </Typography>

      {/* Top Section: Breadcrumb and Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body2" color="textSecondary">
          Dashboard &gt; Customers List
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined">Export</Button>
          <Button variant="contained" sx={{backgroundColor:"#1e1e2d"}}>+ Add Customer</Button>
        </Box>
      </Box>

      {/* Search and Filter Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search customer..."
          size="small"
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />
          }}
        />
        <Button variant="outlined" startIcon={<FilterList />}>Filters</Button>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">{user.name}</Typography>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile_number}</TableCell>
                <TableCell>{user.is_active ? 'Active' : 'Blocked'}</TableCell>
                <TableCell>{new Date(user.date_joined).toLocaleDateString()}</TableCell>
                <TableCell>
                <IconButton onClick={() => handleViewClick(user.id)}><Visibility /></IconButton>
                                  <IconButton><Edit /></IconButton>
                  <IconButton><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </Box>
  );
};

export default CustomersList;
