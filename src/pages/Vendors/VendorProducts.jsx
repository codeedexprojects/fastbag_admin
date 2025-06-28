import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
} from '@mui/material';
import { getVendorsProducts } from '../../services/allApi';
import { useNavigate } from 'react-router-dom';

const Products = ({ vendorId }) => {
  const [productsData, setProductsData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const data = await getVendorsProducts(vendorId);
        if (data?.response?.data?.detail === "No products found for the given vendor ID.") {
          setProductsData([]);
        } else {
          setProductsData(data.data.results || []);
        }
      } catch (error) {
        console.error('Error fetching vendor products:', error);
        if (
          error?.response?.status === 404 &&
          error?.response?.data?.detail === "No products found for the given vendor ID."
        ) {
          setProductsData([]);
        } else {
          setError(true);
        }
      }
    };

    if (vendorId) {
      fetchVendorProducts();
    }
  }, [vendorId]);

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

  if (error) {
    return <Typography color="error">Failed to load vendor products.</Typography>;
  }

  if (productsData === null) {
    return <Typography>Loading vendor products...</Typography>;
  }

  // Filter products by categoryFilter (matching both string or object category keys)
  const filteredProducts = categoryFilter
    ? productsData.filter((p) => {
        const catName = typeof p.category === 'string' ? p.category : p.category_name || '';
        return catName === categoryFilter;
      })
    : productsData;

    console.log(productsData)

  // Sorting products by name or price
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

  // Collect unique categories (handle different category keys)
  const uniqueCategories = [
    ...new Set(
      productsData.map((p) =>
        typeof p.category === 'string' ? p.category : p.category_name || ''
      )
    ),
  ].filter((c) => c !== '');

  return (
    <Box sx={{ mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Vendor Products</Typography>
       <Box sx={{ mb: 2, maxWidth: 220 }}>
  <Select
    fullWidth
    value={categoryFilter}
    onChange={handleCategoryChange}
    displayEmpty
    size="small"
    sx={{
      bgcolor: '#f9fafb',
      borderRadius: 2,
      boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
      fontSize: 14,
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      }
    }}
  >
    <MenuItem value="" sx={{ fontWeight: 500 }}>
      All Categories
    </MenuItem>
    {uniqueCategories.map((cat) => (
      <MenuItem key={cat} value={cat} sx={{ fontWeight: 500 }}>
        {cat}
      </MenuItem>
    ))}
  </Select>
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
                            <TableCell>No</TableCell>

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
            {sortedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No products added yet.
                </TableCell>
              </TableRow>
            ) : (
              sortedProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product,index) => (
                  <TableRow key={product.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{product.name}</TableCell>
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
                    <TableCell>
                      {typeof product.category === 'string'
                        ? product.category
                        : product.category_name || ''}
                    </TableCell>
                    <TableCell>
                      {typeof product.subcategory === 'string'
                        ? product.subcategory
                        : product.subcategory_name || ''}
                    </TableCell>
                    <TableCell>Rs.{product.price}</TableCell>
                    <TableCell>Rs.{product.offer_price || product.price}</TableCell>
                   <TableCell>
  <Typography
    variant="caption"
    sx={{
      fontWeight: 600,
      textTransform: 'capitalize',
      letterSpacing: 0.6,
      color: product.is_available ? 'success.main' : 'error.main',
      fontSize: '0.75rem',
      px: 1,
      py: 0.5,
      borderRadius: 1,
      bgcolor: product.is_available ? 'success.light' : 'error.light',
      display: 'inline-block',
      textAlign: 'center',
      minWidth: 80,
    }}
  >
    {product.is_available ? 'In Stock' : 'Out of Stock'}
  </Typography>
</TableCell>

                  </TableRow>
                ))
            )}
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
