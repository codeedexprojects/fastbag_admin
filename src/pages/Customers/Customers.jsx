import React, { useState, useEffect, forwardRef } from 'react';
import {
  Box, Typography, Button, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TablePagination, CircularProgress, MenuItem, Select, InputLabel, FormControl, Dialog,
  DialogTitle, DialogContent, DialogActions, InputAdornment
} from '@mui/material';
import { Search, Visibility, Edit, Delete, IosShare } from '@mui/icons-material';
import { viewUsers, deleteUser } from '../../services/allApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CircleX, Eye, ChevronDown as LucideChevronDown, Trash2 } from 'lucide-react';

const ChevronDown = forwardRef((props, ref) => <LucideChevronDown {...props} ref={ref} size={18} />);

const CustomersList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [sortType, setSortType] = useState('newest');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, sortType]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Backend pagination: send page number (1-indexed) and page size
      const response = await viewUsers({
        page: page + 1,
        page_size: rowsPerPage,
        ordering: sortType === 'newest' ? '-date_joined' : 
                  sortType === 'oldest' ? 'date_joined' : 
                  sortType === 'name_asc' ? 'name' : '-name'
      });
      
      // Assuming your API returns: { count, next, previous, results }
      setUsers(response.results || response);
      setTotalCount(response.count || (response.results || response).length);
    } catch {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewClick = (id) => navigate(`/customer-details/${id}`);

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
    } catch {
      toast.error('Error deleting user');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text?.toString().split(new RegExp(`(${query})`, 'gi'));
    return parts?.map((part, index) =>
      part.toLowerCase() === query.toLowerCase()
        ? <span key={index} style={{ backgroundColor: 'lightblue' }}>{part}</span>
        : <span key={index}>{part}</span>
    );
  };

  // Client-side search filter (on current page data)
  const filteredUsers = users.filter((user) =>
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (user.mobile_number?.toString().includes(searchTerm) || '')
  );

  const exportToCSV = async () => {
    try {
      // Fetch all users for export (without pagination)
      const allUsersResponse = await viewUsers({ page_size: 10000 });
      const allUsers = allUsersResponse.results || allUsersResponse;
      
      const headers = ['Name', 'Email', 'Phone', 'Status', 'Joined Date'];
      const rows = allUsers.map(u => [
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
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  if (error) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><Typography color="error">{error}</Typography></Box>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" mb={3}>Customers</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body2" color="text.secondary">Dashboard &gt; Customers List</Typography>
        <Button variant="contained" startIcon={<IosShare />} onClick={exportToCSV}>Export</Button>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
        <TextField
          variant="outlined"
          label="Search customer"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            width: 300,
            backgroundColor: '#f9fafb',
            borderRadius: 2,
            boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' },
            },
            '& .MuiInputLabel-root': { color: '#6b7280', fontSize: 14 },
            '& .MuiInputBase-input': { fontSize: 14 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} style={{ color: '#374151' }} />
              </InputAdornment>
            )
          }}
        />

        <FormControl
          size="small"
          sx={{
            minWidth: 150,
            backgroundColor: '#f9fafb',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              paddingRight: '32px',
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' },
            },
            '& .MuiSelect-icon': {
              color: '#374151',
              right: 10,
            },
          }}
        >
          <InputLabel id="sort-label" sx={{ color: '#6b7280', fontSize: 14, '&.Mui-focused': { color: '#6366f1' } }}>Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value={sortType}
            label="Sort By"
            onChange={(e) => { setSortType(e.target.value); setPage(0); }}
            IconComponent={ChevronDown}
          >
            <MenuItem value="newest">Newest Added</MenuItem>
            <MenuItem value="oldest">Oldest Added</MenuItem>
            <MenuItem value="name_asc">Name A-Z</MenuItem>
            <MenuItem value="name_desc">Name Z-A</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 3, boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)', overflow: "hidden", mt: 3 }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="customer table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><strong>No</strong></TableCell>
              <TableCell><strong>Customer Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Joined Date</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id} hover sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                {/* Use serial_number from backend, or fallback to calculated value */}
                <TableCell>{user.serial_number || (totalCount - (page * rowsPerPage) - index)}</TableCell>
                <TableCell>{highlightMatch(user.name || '', searchTerm)}</TableCell>
                <TableCell>{highlightMatch(user.email || '', searchTerm)}</TableCell>
                <TableCell>{highlightMatch(user.mobile_number || '', searchTerm)}</TableCell>
                <TableCell>{user.is_active ? 'Active' : 'Blocked'}</TableCell>
                <TableCell>{user.date_joined}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleViewClick(user.id)}><Eye /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(user)}><Trash2 /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center">No customers found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15, 25, 50]}
      />

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete user <strong>{userToDelete?.name}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<CircleX size={20}/>} variant='contained' onClick={handleDeleteCancel} color="primary">Cancel</Button>
          <Button startIcon={<Trash2 size={20}/>} variant="contained" onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomersList;