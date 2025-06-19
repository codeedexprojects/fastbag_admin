// GroceryProductDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import { Edit, Delete, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { getGroceryProductById, deleteGroceryProduct } from '../../services/allApi';
import { toast } from 'react-toastify';
import EditProductModal from './EditGrocery';

const GroceryProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchProduct = async () => {
    try {
      const res = await getGroceryProductById(id);
      setProduct(res.data);
      setCurrentImageIndex(0); // reset image index on load
    } catch (error) {
      toast.error("Failed to fetch product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleSaveProduct = (updatedProduct) => {
    setProduct((prev) => ({ ...prev, ...updatedProduct }));
  };

  const handleDeleteClick = (product) => {
    if (!product.id) return;
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete?.id) return;

    setLoading(true);
    try {
      const res = await deleteGroceryProduct(productToDelete.id);
      if (res.status === 200) {
        toast.success("Product deleted!");
        navigate(-1);
      } else {
        toast.error("Deletion failed!");
      }
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error("Error deleting product.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Product not found or failed to load.
        </Typography>
      </Container>
    );
  }

  const currentImage = product.images?.[currentImageIndex]?.image || '';

  return (
    <Container sx={{ mt: 4 }}>
      <Card sx={{ p: 2, boxShadow: 4, borderRadius: 1 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" fontWeight={600}>{product.name}</Typography>
            <Box>
              <IconButton color="primary" onClick={() => handleEditClick(product)}><Edit /></IconButton>
              <IconButton color="error" onClick={() => handleDeleteClick(product)}><Delete /></IconButton>
            </Box>
          </Box>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={4}>
              <Box position="relative" display="flex" justifyContent="center" alignItems="center">
                {product.images?.length > 1 && (
                  <>
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{ position: 'absolute', left: 0, zIndex: 2, bgcolor: 'rgba(255,255,255,0.6)' }}
                    >
                      <ArrowBackIos fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={handleNextImage}
                      sx={{ position: 'absolute', right: 0, zIndex: 2, bgcolor: 'rgba(255,255,255,0.6)' }}
                    >
                      <ArrowForwardIos fontSize="small" />
                    </IconButton>
                  </>
                )}
                <CardMedia
                  component="img"
                  image={currentImage}
                  alt={product.name}
                  sx={{ height: 220, borderRadius: 2, objectFit: 'contain', width: '100%' }}
                />
              </Box>
              <Typography variant="caption" display="block" align="center" mt={1}>
                {product.images?.length > 1 ? `Image ${currentImageIndex + 1} of ${product.images.length}` : ''}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Typography variant="body1" mb={1}><b>Description:</b> {product.description}</Typography>
              <Typography variant="body1"><b>Category:</b> {product.category_name} / {product.sub_category_name}</Typography>
              <Typography variant="body1"><b>Price:</b> ₹{product.price}</Typography>
              <Typography variant="body1"><b>Offer Price:</b> ₹{product.offer_price}</Typography>
              <Typography variant="body1"><b>Wholesale Price:</b> ₹{product.wholesale_price}</Typography>
              <Typography variant="body1"><b>Discount:</b> {product.discount}%</Typography>
              <Typography variant="body1"><b>Store Type:</b> {product.store_type}</Typography>
              <Typography variant="body1"><b>Created:</b> {product.created_at}</Typography>
              <Typography variant="body1">
                <b>Status:</b>{' '}
                <Chip
                  label={product.is_available ? 'Available' : 'Not Available'}
                  color={product.is_available ? 'success' : 'default'}
                  size="small"
                />
              </Typography>
              <Typography variant="body1">
                {product.is_offer_product && <Chip label="On Offer" color="secondary" size="small" sx={{ mr: 1 }} />}
                {product.is_popular_product && <Chip label="Popular" color="primary" size="small" />}
              </Typography>
            </Grid>
          </Grid>

          <Box mt={3}>
            <Typography variant="h6" fontWeight={500}>Weight Variants</Typography>
            <Box component="ul" pl={2}>
              {product.weights.map((w, i) => (
                <li key={i}>
                  <Typography variant="body2">
                    {w.weight} - ₹{w.price} (Qty: {w.quantity}) {w.is_in_stock ? '✅ In Stock' : '❌ Out of Stock'}
                  </Typography>
                </li>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditProductModal
        open={isEditModalOpen}
        onReload={fetchProduct}
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
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteProduct} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GroceryProductDetailsPage;
