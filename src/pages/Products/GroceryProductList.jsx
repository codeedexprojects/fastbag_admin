import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton, TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getGroceryProducts, deleteGroceryProduct } from '../../services/allApi';
import EditGroceryProductModal from './EditGrocery';
import { toast } from 'react-toastify';
import { Backdrop } from '@mui/material';


const GroceryProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false); // Delete dialog state
  const [productToDelete, setProductToDelete] = useState(null); // Product to delete
  const navigate = useNavigate();

  // Fetch products when the component loads
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getGroceryProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);



  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Navigate to the "Add Product" page
  const handleAddProduct = () => {
    navigate('/add-groceryproduct');
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleSaveProduct = (updatedProduct) => {
    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id ? { ...product, ...updatedProduct } : product
    );
    setProducts(updatedProducts);
  };
  console.log(products)
  const handleDeleteClick = (product) => {
    console.log('Product to delete:', product); // Check product data
    if (!product.id) {
      console.error('Product ID is undefined:', product);
      return; // Prevent opening the dialog for invalid products
    }
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete || !productToDelete.id) {
      console.error('Product ID is undefined:', productToDelete);
      return;
    }

    setLoading(true); // <-- Start loading

    try {
      const res = await deleteGroceryProduct(productToDelete.id);
      if (res.status === 200) {
        toast.success("Product deleted!");
        setProducts(products.filter((product) => product.id !== productToDelete.id));
      } else {
        toast.error("Deletion failed!");
      }
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setLoading(false); // <-- End loading
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="body2" color="textSecondary">
          Dashboard &gt; Product List
        </Typography>
        <Button
          variant="contained"

          onClick={handleAddProduct}
          sx={{ backgroundColor: "#1E1E2D", "&:hover": { backgroundColor: "#333" }, boxShadow: 3 }}      >
          + Add Product
        </Button>
      </Box>


      <TableContainer sx={{ borderRadius: 1, boxShadow: 10, overflow: "hidden", mt: 3 }} component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          {/* Table Header */}
          <TableHead sx={{ backgroundColor: '' }}>
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

          {/* Table Body */}
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product, index) => (
                <TableRow hover key={product.id}>
                  <TableCell>
                    {index + 1}                    </TableCell>
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
                        sx={{
                          '& td, & th': { borderBottom: 'none', padding: '4px 8px' },
                        }}
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
                        <Typography
                          key={index}
                        >
                          {weight.weight}: <Typography color={weight.is_in_stock ? "green" : "red"}
                          >{weight.is_in_stock ? "In Stock" : "Out of Stock"}</Typography>
                        </Typography>
                      ))
                    ) : (
                      <Typography color="textSecondary">No Weights Available</Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {/* <IconButton color='info' onClick={() => handleEditClick(product)}>
                      <Edit />
                    </IconButton> */}
                    <IconButton color='error' onClick={() => handleDeleteClick(product)}>
                      <Delete />
                    </IconButton>
                    <IconButton color='info' onClick={() => navigate(`/view-groceryproduct/${product.id}`)}>
                      <Visibility />
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


      {/* Edit Modal */}
      <EditGroceryProductModal
        open={isEditModalOpen}
        onReload={fetchProducts}
        onClose={() => setEditModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteProduct}
            color="primary"
          >
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

export default GroceryProductList;
