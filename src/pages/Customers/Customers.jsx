import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TablePagination, CircularProgress, MenuItem, Select, InputLabel, FormControl, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Search, Visibility, Edit, Delete } from '@mui/icons-material';
import { viewUsers, deleteUser } from '../../services/allApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomersList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortType, setSortType] = useState('newest');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const parseDateDMY = (dateStr) => {
    if (!dateStr) return new Date(0);
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewClick = (id) => {
    navigate(`/customer-details/${id}`);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setUserToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      const res = await deleteUser(userToDelete.id);
      if (res.status === 204) {
        toast.success('Customer deleted successfully!');
        fetchUsers();
      } else {
        toast.error('Failed to delete the customer');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text?.toString().split(new RegExp(`(${query})`, 'gi'));
    return parts?.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: 'lightblue' }}>{part}</span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const filteredUsers = users.filter((user) =>
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (user.mobile_number?.toString().includes(searchTerm) || '')
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortType === 'name_asc') return (a.name || '').localeCompare(b.name || '');
    if (sortType === 'name_desc') return (b.name || '').localeCompare(a.name || '');
    if (sortType === 'newest') return parseDateDMY(b.date_joined) - parseDateDMY(a.date_joined);
    if (sortType === 'oldest') return parseDateDMY(a.date_joined) - parseDateDMY(b.date_joined);
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Joined Date'];
    const rows = sortedUsers.map(u => [
      u.name,
      u.email,
      u.mobile_number,
      u.is_active ? 'Active' : 'Blocked',
      u.date_joined,
    ]);
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\r\n';
    rows.forEach(rowArray => {
      const row = rowArray.map(field => `"${field}"`).join(',');
      csvContent += row + '\r\n';
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>Customers</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body2" color="textSecondary">Dashboard &gt; Customers List</Typography>
        <Button variant="outlined" onClick={exportToCSV}>Export</Button>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <TextField
          variant="outlined"
          label="Search customer"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />
          }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value={sortType}
            label="Sort By"
            onChange={(e) => { setSortType(e.target.value); setPage(0); }}
          >
            <MenuItem value="newest">Newest Added</MenuItem>
            <MenuItem value="oldest">Oldest Added</MenuItem>
            <MenuItem value="name_asc">Name A-Z</MenuItem>
            <MenuItem value="name_desc">Name Z-A</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden", mt: 3 }} component={Paper}>
        <Table sx={{minWidth:650}}>
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold',color:'white' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold',color:'white' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold',color:'white' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold',color:'white' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold',color:'white' }}>Joined Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold',color:'white' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody    sx={{
            '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
            '&:last-child td, &:last-child th': { border: 0 },
          }}>
            {paginatedUsers.map((user, index) => (
              <TableRow key={user.id} hover sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                <TableCell>{highlightMatch(user.name || '', searchTerm)}</TableCell>
                <TableCell>{highlightMatch(user.email || '', searchTerm)}</TableCell>
                <TableCell>{highlightMatch(user.mobile_number || '', searchTerm)}</TableCell>
                <TableCell>{user.is_active ? 'Active' : 'Blocked'}</TableCell>
                <TableCell>{user.date_joined}</TableCell>
                <TableCell>
                  <IconButton color='primary' onClick={() => handleViewClick(user.id)}><Visibility /></IconButton>
                  <IconButton color='info'><Edit /></IconButton>
                  <IconButton color='error' onClick={() => handleDeleteClick(user)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No customers found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user <strong>{userToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomersList;
