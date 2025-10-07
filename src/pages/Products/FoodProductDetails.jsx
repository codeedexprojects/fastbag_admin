import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { getFoodProductById, deleteFoodProduct } from "../../services/allApi";
import EditFoodProductModal from "./EditFood";
import { ArrowLeft, CircleX, Pencil, Trash2 } from "lucide-react";

const FoodProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const fetchProductDetails = async () => {
    try {
      const res = await getFoodProductById(id);
      setProduct(res?.data);
    } catch (error) {
      console.error("Failed to fetch product details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteFoodProduct(id);
      navigate(-1); // Go back after deletion
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return <Typography color="error">Product not found</Typography>;
  }

  return (
    <Box p={3}>
      {/* Top Action Icons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">{product.name}</Typography>
        <Box>
          {/* <Tooltip title="Back">
            <IconButton onClick={() => navigate(-1)}>
              <ArrowLeft />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => setEditOpen(true)}>
              <Pencil />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => setDeleteConfirmOpen(true)}>
              <Trash2 />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          {product.images?.map((img, idx) => (
            <Card key={idx} sx={{ mb: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={img.image}
                alt={`Image ${idx + 1}`}
              />
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Basic Info</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography><strong>Category:</strong> {product.category_name}</Typography>
              <Typography><strong>Subcategory:</strong> {product.subcategory_name}</Typography>
              <Typography><strong>Store Type:</strong> {product.store_type}</Typography>
              <Typography><strong>Vendor:</strong> {product.vendor_name}</Typography>
              <Typography><strong>Description:</strong> {product.description}</Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Pricing</Typography>
              <Typography><strong>Price:</strong> ₹{product.price}</Typography>
              <Typography><strong>Offer Price:</strong> ₹{product.offer_price}</Typography>
              <Typography><strong>Wholesale Price:</strong> ₹{product.wholesale_price}</Typography>
              <Typography><strong>Discount:</strong> {product.discount}%</Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Variants</Typography>
              <Grid container spacing={1}>
                {product.variants?.map((variant, index) => (
                  <Grid item xs={6} key={index}>
                    <Chip
                      label={`${variant.name} - ₹${variant.price} (${variant.is_in_stock ? "In Stock" : "Out of Stock"})`}
                      color={variant.is_in_stock ? "success" : "default"}
                      variant="outlined"
                    />
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Status</Typography>
              <Chip label={product.is_available ? "Available" : "Unavailable"} color={product.is_available ? "success" : "default"} sx={{ mr: 1 }} />
              <Chip label="Popular" color={product.is_popular_product ? "primary" : "default"} sx={{ mr: 1 }} />
              <Chip label="Offer Product" color={product.is_offer_product ? "secondary" : "default"} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Modal */}
   <EditFoodProductModal
  open={editOpen}
  handleClose={() => setEditOpen(false)} // only closes modal on cancel
  product={product}
  
  onSave={() => {
    fetchProductDetails(); // refresh only on save
    setEditOpen(false);
  }}
/>


      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} sx={{p:2}}  onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
        <DialogActions>
          <Button startIcon={<CircleX/>} variant="contained" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button startIcon={<Trash2/>} variant="containedError" onClick={handleDelete} >Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FoodProductDetails;
