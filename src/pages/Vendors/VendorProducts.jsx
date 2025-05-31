import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip } from '@mui/material';
import { CalendarToday, FilterList } from '@mui/icons-material';
import { getVendorsProducts } from '../../services/allApi';

const Products = ({ vendorId }) => {
  const [productsData, setProductsData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch the vendor products when component mounts
  useEffect(() => {
    console.log('vendorId:', vendorId); // Check if vendorId is correctly passed
    const fetchVendorProducts = async () => {
      try {
        const data = await getVendorsProducts(vendorId);
        console.log('API Response:', data); // Log the data to check structure
        setProductsData(data);
      } catch (error) {
        console.error('Error fetching vendor products:', error);
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

  if (!productsData) {
    return <Typography>Loading vendor products...</Typography>;
  }

  const allProducts = [
    ...productsData.clothing_products,
    ...productsData.dish_products,
    ...productsData.grocery_products,
  ];

  return (
    <Box sx={{ mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Vendor Products</Typography>
        <Box>
          <Button variant="outlined" startIcon={<CalendarToday />} sx={{ mr: 1 }}>Select Date</Button>
          <Button variant="outlined" startIcon={<FilterList />}>Filters</Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Sub Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Offer Price</TableCell>
              <TableCell>Stock Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category_name}</TableCell>
                <TableCell>{product.subcategory_name}</TableCell>
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
        count={allProducts.length}
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
