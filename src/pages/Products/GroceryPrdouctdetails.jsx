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
import {
  Pencil,
  Trash2,
  ArrowLeftCircle,
  ArrowRightCircle,
  CircleX,
} from 'lucide-react';
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
      setCurrentImageIndex(0);
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
      <Card sx={{ p: 2,  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" fontWeight={600}>{product.name}</Typography>
            <Box>
              <IconButton color='primary' onClick={() => handleEditClick(product)}>
                <Pencil size={20} />
              </IconButton>
              <IconButton color="error" onClick={() => handleDeleteClick(product)}>
                <Trash2 size={20} />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={4}>
              <Box position="relative" display="flex" justifyContent="center" alignItems="center">
                {product.images?.length > 1 && (
                  <>
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{
                        position: 'absolute',
                        left: 8,
                        zIndex: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                      }}
                    >
                      <ArrowLeftCircle size={20} />
                    </IconButton>
                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        zIndex: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                      }}
                    >
                      <ArrowRightCircle size={20} />
                    </IconButton>
                  </>
                )}
                <CardMedia
                  component="img"
                  image={currentImage}
                  alt={product.name}
                  sx={{
                    height: 220,
                    borderRadius: 2,
                    objectFit: 'contain',
                    width: '100%',
                    border: '1px solid #eee',
                  }}
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
              <Box mt={1}>
                <Chip
                  label={product.is_available ? 'Available' : 'Not Available'}
                  color={product.is_available ? 'success' : 'default'}
                  size="small"
                  sx={{ mr: 1 }}
                />
                {product.is_offer_product && (
                  <Chip label="On Offer" color="secondary" size="small" sx={{ mr: 1 }} />
                )}
                {product.is_popular_product && (
                  <Chip label="Popular" color="primary" size="small" />
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Weight Variants */}
          <Box mt={4}>
            <Typography variant="h6" fontWeight={500} gutterBottom>
              Weight Variants
            </Typography>
            <Grid container spacing={1}>
              {product.weights.map((w, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={1}
                    border="1px solid #eee"
                    borderRadius={2}
                  >
                    <Typography fontWeight={500}>{w.weight}</Typography>
                    <Box
                      component="span"
                      sx={{
                        px: 1.5,
                        py: 0.3,
                        borderRadius: 999,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: w.is_in_stock ? 'success.main' : 'error.main',
                        backgroundColor: w.is_in_stock ? 'success.light' : 'error.light',
                        textAlign: 'center',
                        width: '80px',
                      }}
                    >
                      {w.is_in_stock ? 'In Stock' : 'Out of Stock'}
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                    ₹{w.price} • Qty: {w.quantity}
                  </Typography>
                </Grid>
              ))}
            </Grid>
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

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} startIcon={<CircleX/>} variant="contained">
            Cancel
          </Button>
          <Button onClick={confirmDeleteProduct} color="error" startIcon={<Trash2/>} variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GroceryProductDetailsPage;
