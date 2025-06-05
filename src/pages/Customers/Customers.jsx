import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, IconButton, Checkbox,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, CircularProgress, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Search, Visibility, Edit, Delete, FilterList } from '@mui/icons-material';
import { viewUsers } from '../../services/allApi';
import { useNavigate } from 'react-router-dom';

const CustomersList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortType, setSortType] = useState('newest'); // newest on top by default
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await viewUsers();
        setUsers(data);
        console.log(users)
      } catch (err) {
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Parse dd/MM/yyyy string to Date object
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

  // Filter users by search term
  const filteredUsers = users.filter((user) =>
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (user.mobile_number?.toString().includes(searchTerm) || '')
  );

  // Sort users according to sortType
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortType === 'name_asc') {
      return (a.name || '').localeCompare(b.name || '');
    }
    if (sortType === 'name_desc') {
      return (b.name || '').localeCompare(a.name || '');
    }
    if (sortType === 'newest') {
      return parseDateDMY(b.date_joined) - parseDateDMY(a.date_joined);
    }
    if (sortType === 'oldest') {
      return parseDateDMY(a.date_joined) - parseDateDMY(b.date_joined);
    }
    return 0;
  });

  // Pagination slice
  const paginatedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Export to CSV (only filtered & sorted data)
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
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Customers
      </Typography>

      {/* Top Section: Breadcrumb and Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body2" color="textSecondary">
          Dashboard &gt; Customers List
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={exportToCSV}>Export</Button>
        </Box>
      </Box>

      {/* Search and Sort Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <TextField
          variant="outlined"
          placeholder="Search customer..."
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
            id="sort-select"
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
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">
                    {highlightMatch(user.name || '', searchTerm)}
                  </Typography>
                </TableCell>
                <TableCell>{highlightMatch(user.email || '', searchTerm)}</TableCell>
                <TableCell>{highlightMatch(user.mobile_number || '', searchTerm)}</TableCell>
                <TableCell>{user.is_active ? 'Active' : 'Blocked'}</TableCell>
                <TableCell>{user.date_joined}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewClick(user.id)}><Visibility /></IconButton>
                  <IconButton><Edit /></IconButton>
                  <IconButton><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={sortedUsers.length}
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
