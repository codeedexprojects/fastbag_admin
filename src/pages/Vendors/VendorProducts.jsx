import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Select,
  MenuItem,
  TableSortLabel,
  Link
} from '@mui/material';
import { CalendarToday, FilterList } from '@mui/icons-material';
import { getVendorsProducts } from '../../services/allApi';
import { useNavigate } from 'react-router-dom';

const Products = ({ vendorId }) => {
  const [productsData, setProductsData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const data = await getVendorsProducts(vendorId);
        setProductsData(data.results);
      } catch (error) {
        console.error('Error fetching vendor products:', error);
      }
    };

    if (vendorId) {
      fetchVendorProducts();
    }
  }, [vendorId]);

  console.log(productsData)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (!productsData) {
    return <Typography>Loading vendor products...</Typography>;
  }

  // Assuming productsData is a flat array of products now
  const filteredProducts = categoryFilter
    ? productsData.filter((p) => p.category_name === categoryFilter)
    : productsData;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortConfig.key === 'price') {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      return sortConfig.direction === 'asc' ? priceA - priceB : priceB - priceA;
    }
    return 0;
  });

  const uniqueCategories = [...new Set(productsData.map((p) => p.category_name))];

  return (
    <Box sx={{ mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Vendor Products</Typography>

        <Box sx={{ mb: 2, maxWidth: 200 }}>
          <Select
            fullWidth
            value={categoryFilter}
            onChange={handleCategoryChange}
            displayEmpty
            size="small"
            sx={{ bgcolor: '#f5f5f5' }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {uniqueCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {/* <Box>
          <Button variant="outlined" startIcon={<CalendarToday />} sx={{ mr: 1 }}>
            Select Date
          </Button>
          <Button variant="outlined" startIcon={<FilterList />}>
            Filters
          </Button>
        </Box> */}
      </Box>



      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'name'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('name')}
                >
                  Product Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Image</TableCell>

              <TableCell>Category</TableCell>
              <TableCell>Sub Category</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'price'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('price')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell>Offer Price</TableCell>
              <TableCell>Stock Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id}>

                  <TableCell>
                    {/* <Link
                      component="button"
                      variant="body2"
                      onClick={() => navigate(`/product/${product.id}`)}
                      sx={{ cursor: 'pointer' }}
                    > */}
                      {product.name}
                    {/* </Link> */}
                  </TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].image}
                        alt={product.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 4,
                          color: '#9e9e9e',
                          fontSize: 12,
                        }}
                      >
                        No Image
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  <TableCell>{product.sub_category_name}</TableCell>
                  <TableCell>Rs.{product.price}</TableCell>
                  <TableCell>Rs.{product.offer_price || product.price}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.is_available ? 'In Stock' : 'Out of Stock'}
                      color={product.is_available ? 'success' : 'error'}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedProducts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </Box>
  );
};

export default Products;
