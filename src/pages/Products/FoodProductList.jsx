import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, TablePagination, CircularProgress,
  Dialog, DialogActions, DialogContent, DialogTitle, Backdrop
} from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getFoodProducts, deleteFoodProduct } from '../../services/allApi';
import { toast } from 'react-toastify';

const FoodProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getFoodProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handlers
  const handleAddProduct = () => navigate('/add-foodproduct');
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await deleteFoodProduct(productToDelete.id);
      setDeleteModalOpen(false);

      if (res.status === 204) {
        setProducts(products.filter((p) => p.id !== productToDelete.id));
        toast.success('Product deleted!');
      } else {
        toast.error('Product deletion failed!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>Food Products</Typography>

      {/* Breadcrumb & Add Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body2" color="textSecondary">
          Dashboard &gt; Product List
        </Typography>
        <Button
          variant="contained"
          onClick={handleAddProduct}
          sx={{ textTransform: 'none', backgroundColor: '#1e1e2d' }}
        >
          + Add Product
        </Button>
      </Box>

      {/* Table */}
      <TableContainer sx={{ borderRadius: 1, boxShadow: 10, overflow: "hidden", mt: 3 }} component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Subcategory</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Images</TableCell>
              <TableCell sx={{ fontWeight: 'bold',textAlign:'center' }}>Variants</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Offer Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Discount</TableCell>
              {/* <TableCell sx={{ fontWeight: 'bold' }}>Availability</TableCell> */}
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
              <TableRow hover key={product.id}>
                {/* Product Info */}
                <TableCell>
                  <Typography variant="body1">{product.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{product.description}</Typography>
                </TableCell>
                <TableCell>{product.category_name}</TableCell>
                <TableCell>{product.subcategory_name}</TableCell>

                {/* Images */}
                <TableCell>
                  {product.images?.length > 0 ? (
                    product.images.map((img) => (
                      <img
                        key={img.id}
                        src={img.image}
                        alt={product.name}
                        style={{ width: 50, height: 50, marginRight: 5 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">No images</Typography>
                  )}
                </TableCell>

                {/* Variants */}
                <TableCell>
                  {Array.isArray(product.variants) && product.variants.length > 0 ? (
                    <Table size="small" sx={{ '& td, & th': { borderBottom: 'none', padding: '4px 8px' } }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {product.variants.map((variant, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{textTransform:'capitalize'}}>{variant.name}</TableCell>
                            <TableCell>
                              <Typography color={variant.is_in_stock ? 'green' : 'red'}>
                                {variant.is_in_stock ? 'In Stock' : 'Out of Stock'}
                              </Typography>
                            </TableCell>
                            <TableCell>₹{variant.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No variants available
                    </Typography>
                  )}
                </TableCell>

                <TableCell>₹{product.price}</TableCell>
                <TableCell>₹{product.offer_price}</TableCell>
                <TableCell>{product.discount}%</TableCell>
                {/* <TableCell>
                  <Typography color={product.is_available ? 'green' : 'red'}>
                    {product.is_available ? 'Available' : 'Out of Stock'}
                  </Typography>
                </TableCell> */}

                {/* Actions */}
                <TableCell>
                  <IconButton color="info" onClick={() => navigate(`/view-foodproduct/${product.id}`)}>
                    <Visibility />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(product)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={products.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Delete Dialog */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteProduct} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default FoodProductList;
