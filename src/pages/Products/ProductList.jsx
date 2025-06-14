import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  TablePagination,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Backdrop, CircularProgress } from '@mui/material';

import { Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { viewProducts, productsCount, deleteProduct } from '../../services/allApi';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [productData, countData] = await Promise.all([viewProducts(), productsCount()]);
      setProducts(productData);
      setTotalProducts(countData.total_products);
    } catch (error) {
      console.error('Failed to fetch data:', error);
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
    navigate('/add-product');
  };

  const getTotalStockPerColor = (color) => {
    if (!color.sizes) return 0;
    return color.sizes.reduce((sum, sizeObj) => sum + (sizeObj.stock || 0), 0);
  };

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteProduct(selectedProductId);
      if (res.status === 204) {
        toast.success('Product deleted successfully');
        setDeleteDialogOpen(false);
        fetchAllData(); // Refresh product list
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Something went wrong while deleting');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Fashion Products</Typography>
        <Button variant="contained" sx={{ backgroundColor: '#1e1e2d' }} onClick={handleAddProduct}>
          + Add Product
        </Button>
      </Box>

      <Typography variant="body2" color="textSecondary" mb={2}>
        Dashboard &gt; Product List — Total Products: <b>{totalProducts}</b>
      </Typography>

     
        <TableContainer sx={{ borderRadius: 1, boxShadow: 10, overflow: "hidden", mt: 3 }}  component={Paper}>
          <Table sx={{minWidth:650}}>
            <TableHead sx={{ backgroundColor: '' }}>
              <TableRow>
                {/* <TableCell sx={{ color: 'white', fontWeight: 'bold' }} padding="checkbox"><Checkbox /></TableCell> */}
                <TableCell sx={{  fontWeight: 'bold' }}>Product</TableCell>
                <TableCell sx={{  fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{  fontWeight: 'bold' }}>Subcategory</TableCell>
                <TableCell sx={{  fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{  fontWeight: 'bold' }}>Sizes & Stock (by Color)</TableCell>
                <TableCell sx={{  fontWeight: 'bold' }}>Colors</TableCell>
                <TableCell sx={{  fontWeight: 'bold' }}>Images</TableCell>
                <TableCell sx={{  fontWeight: 'bold' }}>Total Stock</TableCell>
                <TableCell sx={{  fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                <TableRow key={product.id} hover>
                  {/* <TableCell padding="checkbox"><Checkbox /></TableCell> */}
                  <TableCell>
                    <Typography fontWeight="bold">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                  </TableCell>
                  <TableCell>{product.category || 'N/A'}</TableCell>
                  <TableCell>{product.subcategory || 'N/A'}</TableCell>
                  <TableCell>{product.price ? `Rs. ${product.price}` : 'N/A'}</TableCell>
                  <TableCell sx={{ maxWidth: 200, whiteSpace: 'normal' }}>
                    {product.colors?.length > 0 ? (
                      product.colors?.map((color, idx) => (
                        <Box key={idx} sx={{ mb: 1 }}>
                          <Typography variant="body2" fontWeight="600">
                            {color.color_name || color.color_code}:
                          </Typography>
                          {(color.sizes || []).map((sizeObj, i) => (
                            <Typography key={i} variant="body2" sx={{ ml: 1 }}>
                              {sizeObj.size} ({sizeObj.stock})
                            </Typography>
                          ))}
                        </Box>
                      ))
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {product?.colors?.map((color, idx) => (
                      <Box
                        key={idx}
                        title={color.color_name || color.color_code}
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: color.color_code || '#ccc',
                          border: '1px solid #000',
                          borderRadius: '4px',
                          display: 'inline-block',
                          m: 0.5,
                        }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    {product?.images?.map((image, idx) => (
                      <Avatar
                        key={idx}
                        alt="Product Image"
                        src={image.image_url}
                        variant="rounded"
                        sx={{ width: 50, height: 50, m: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    {product?.colors?.map((color, idx) => (
                      <Typography key={idx} variant="body2">
                        <b>{color.color_name || color.color_code}:</b> {getTotalStockPerColor(color)}
                      </Typography>
                    )) || product.total_stock || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <IconButton color='info' title="View Details" onClick={() => navigate(`/view-product/${product.id}`)}>
                      <Visibility />
                    </IconButton>
                    <IconButton color='error' title="Delete Product" onClick={() => handleDeleteClick(product.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={products.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={loading}
>
  <CircularProgress color="inherit" />
</Backdrop>

    </Box>
  );
};

export default ProductList;
