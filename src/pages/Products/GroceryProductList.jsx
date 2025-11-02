import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, TablePagination, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Backdrop
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getGroceryProducts, deleteGroceryProduct } from '../../services/allApi';
import { toast } from 'react-toastify';
import { CirclePlus, CircleX, Eye, Trash2 } from 'lucide-react';

const GroceryProductList = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch products when the component loads or pagination changes
  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getGroceryProducts({
        page: page + 1, // Backend expects 1-indexed pages
        page_size: rowsPerPage,
      });
      
      // Handle paginated response
      if (response.results) {
        setProducts(response.results);
        setTotalProducts(response.count);
      } else {
        // Fallback for non-paginated response
        setProducts(response);
        setTotalProducts(response.length);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddProduct = () => {
    navigate('/add-groceryproduct');
  };

  const handleDeleteClick = (product) => {
    if (!product.id) {
      console.error('Product ID is undefined:', product);
      return;
    }
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete || !productToDelete.id) {
      console.error('Product ID is undefined:', productToDelete);
      return;
    }

    setLoading(true);
    try {
      const res = await deleteGroceryProduct(productToDelete.id);
      if (res.status === 200) {
        toast.success("Product deleted!");
        fetchProducts(); // Refresh the list
      } else {
        toast.error("Deletion failed!");
      }
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header Section */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Grocery Products
        </Typography>
      </Box>

      {/* Breadcrumb and Add Product Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body2" color="textSecondary">
          Dashboard &gt; Product List — Total Products: <b>{totalProducts}</b>
        </Typography>
        <Button variant="containedSecondary" onClick={handleAddProduct} startIcon={<CirclePlus />}>
          Add Product
        </Button>
      </Box>

      <TableContainer
        sx={{ borderRadius: 3, boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)', overflow: "hidden", mt: 3 }}
        component={Paper}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Subcategory</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Images</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Weight / Price / Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Offer Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stock Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product, index) => (
              <TableRow hover key={product.id}>
                <TableCell>
                  {/* Use serial_number from backend, or fallback to calculated value */}
                  {product.serial_number || (totalProducts - (page * rowsPerPage) - index)}
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{product.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.description}
                  </Typography>
                </TableCell>
                <TableCell>{product.category_name}</TableCell>
                <TableCell>{product.sub_category_name}</TableCell>
                <TableCell>
                  {product.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.image}
                      alt={product.name}
                      style={{ width: 50, height: 50, marginRight: 5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  {Array.isArray(product.weights) && product.weights.length > 0 ? (
                    <Table
                      size="small"
                      aria-label="weight-details"
                      sx={{ '& td, & th': { borderBottom: 'none', padding: '4px 8px' } }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Weight</b></TableCell>
                          <TableCell><b>Price</b></TableCell>
                          <TableCell><b>Stock</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {product.weights.map((weight, index) => (
                          <TableRow key={index}>
                            <TableCell>{weight.weight}</TableCell>
                            <TableCell>₹{weight.price}</TableCell>
                            <TableCell>{weight.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No weight details available
                    </Typography>
                  )}
                </TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>₹{product.offer_price}</TableCell>
                <TableCell>
                  {Array.isArray(product.weights) && product.weights.length > 0 ? (
                    product.weights.map((weight, index) => (
                      <Box
                        key={index}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {weight.weight} :
                        </Typography>
                        <Box
                          component="span"
                          sx={{
                            px: 1.5,
                            py: 0.3,
                            borderRadius: 999,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            color: weight.is_in_stock ? 'success.main' : 'error.main',
                            backgroundColor: weight.is_in_stock ? 'success.light' : 'error.light',
                            textAlign: 'center',
                            width: '80px',
                          }}
                        >
                          {weight.is_in_stock ? 'In Stock' : 'Out of Stock'}
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography color="textSecondary">No Weights Available</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton color='error' onClick={() => handleDeleteClick(product)}>
                    <Trash2 />
                  </IconButton>
                  <IconButton color='info' onClick={() => navigate(`/view-groceryproduct/${product.id}`)}>
                    <Eye />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={totalProducts}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="contained" startIcon={<CircleX/>}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteProduct} variant="containedError" startIcon={<Trash2/>}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default GroceryProductList;