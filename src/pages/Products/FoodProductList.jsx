import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, TablePagination, CircularProgress,
  Dialog, DialogActions, DialogContent, DialogTitle, Backdrop
} from '@mui/material';
import { Add, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getFoodProducts, deleteFoodProduct } from '../../services/allApi';
import { toast } from 'react-toastify';
import { CirclePlus, CircleX, Eye, Trash2 } from 'lucide-react';

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
          variant="containedSecondary"
          onClick={handleAddProduct}
          startIcon={<CirclePlus/>}
        >
          Add Product
        </Button>
      </Box>

      {/* Table */}
       <TableContainer
                component={Paper}
                elevation={3}
                sx={{ borderRadius: 3 ,boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',overflow: "hidden", mt: 3 }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="category table">
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
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
            {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product,index) => (
              <TableRow hover key={product.id}>
                {/* Product Info */}
                <TableCell>{index+1}</TableCell>
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
                    <Table
  size="small"
  sx={{
    '& td, & th': {
      borderBottom: 'none',
      padding: '4px 8px',
    },
  }}
>
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
        <TableCell sx={{ textTransform: 'capitalize' }}>
          {variant.name}
        </TableCell>
        <TableCell>
          <Box
            sx={{
              display: 'inline-block',
              px: 1.5,
              py: 0.5,
              borderRadius: '999px',
              fontSize: '0.7rem',
              fontWeight: 500,
              minWidth: 90,
              textAlign: 'center',
              bgcolor: variant.is_in_stock ? 'success.light' : 'error.light',
              color: variant.is_in_stock ? 'success.dark' : 'error.dark',
            }}
          >
            {variant.is_in_stock ? 'In Stock' : 'Out of Stock'}
          </Box>
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
                  <IconButton color='primary' onClick={() => navigate(`/view-foodproduct/${product.id}`)}>
                    <Eye />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(product)}>
                    <Trash2 />
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
          <Button onClick={() => setDeleteModalOpen(false)} startIcon={<CircleX/>} variant="contained">Cancel</Button>
          <Button onClick={handleDeleteProduct}             startIcon={<Trash2/>} variant="containedError">Delete</Button>
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
