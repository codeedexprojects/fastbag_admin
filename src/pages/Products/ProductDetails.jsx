import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import {
  viewProduct,
  deleteProduct,
  deleteProductImage,
  addImage_fashion,
} from "../../services/allApi";
import EditProductModal from "./EditProduct";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editImagesOpen, setEditImagesOpen] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [imageToDeleteConfirm, setImageToDeleteConfirm] = useState(null);
  const [backdropOpen, setBackdropOpen] = useState(false); // Backdrop state

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await viewProduct(productId);
      setProduct(data);
    } catch {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setBackdropOpen(true);
      const res = await deleteProduct(productId);
      setDeleteDialogOpen(false);
      if (res.status === 204) {
        toast.success("Product deleted");
        navigate(-1);
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Delete error");
    } finally {
      setBackdropOpen(false);
    }
  };

  const handleSave = async (updatedForm) => {
    // Your edit logic here if needed
  };

  const confirmDeleteExistingImage = async () => {
    if (!imageToDeleteConfirm) return;

    try {
      setBackdropOpen(true);
      const res = await deleteProductImage(imageToDeleteConfirm.id);
      if (res.status === 204 || res.status === 200) {
        toast.success("Image deleted");
        setProduct((prev) => ({
          ...prev,
          images: prev.images.filter((img) => img.id !== imageToDeleteConfirm.id),
        }));
      } else {
        toast.error("Failed to delete image");
      }
    } catch {
      toast.error("Error deleting image");
    } finally {
      setConfirmDeleteOpen(false);
      setImageToDeleteConfirm(null);
      setBackdropOpen(false);
    }
  };

  const openConfirmDelete = (img) => {
    setImageToDeleteConfirm(img);
    setConfirmDeleteOpen(true);
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const handleDeleteNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateImages = async () => {
    if (!newImages.length) {
      toast.warn("Please select images to upload.");
      return;
    }

    const reqBody = new FormData();
    const clothingId = product?.images?.[0]?.clothing || product?.id;
    reqBody.append("clothing", clothingId);
    newImages.forEach((file) => {
      reqBody.append("image", file);
    });

    try {
      setBackdropOpen(true);
      const res = await addImage_fashion(reqBody);
      if (res.status === 200 || res.status === 201) {
        toast.success("Images uploaded successfully");
        await fetchProduct();
        setNewImages([]);
        setEditImagesOpen(false);
      } else {
        toast.error("Failed to upload images");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Error uploading images");
    } finally {
      setBackdropOpen(false);
    }
  };

if (loading) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="60vh"
    >
      <CircularProgress />
    </Box>
  );
}
  if (!product) return <Typography align="center">Product not found</Typography>;

  return (
    <Box p={3} maxWidth={900} mx="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">{product.name}</Typography>
        <Box>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => setEditOpen(true)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => setDeleteDialogOpen(true)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Back">
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Typography color="text.secondary" gutterBottom>{product.description}</Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          {[["Category", product.category],
            ["Subcategory", product.subcategory],
            ["Store Type", product.store_type],
            ["Material", product.material],
            ["Gender", product.gender],
            ["Wholesale Price", `Rs. ${product.wholesale_price}`],
            ["Price", `Rs. ${product.price}`],
            ["Discount", product.discount ? `${product.discount}%` : "N/A"],
            ["Total Stock", product.total_stock],
            ["Status", product.is_active ? "Active" : "Inactive"],
            ["Created At", product.created_at],
            ["Updated At", product.updated_at]].map(([label, value]) => (
              <Typography key={label} variant="body1">
                <strong>{label}:</strong> {value || "N/A"}
              </Typography>
            ))}
        </Grid>

        <Grid item xs={12} md={5} sx={{ position: "relative" }}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              maxHeight: 400,
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: 1,
              position: "relative",
            }}
          >
            {product.images?.length > 0 ? (
              product.images.map((img, idx) => (
                <Avatar
                  key={idx}
                  src={img.image_url}
                  variant="rounded"
                  sx={{ width: 150, height: 150 }}
                />
              ))
            ) : (
              <Typography>No images</Typography>
            )}

            <IconButton
              onClick={() => setEditImagesOpen(true)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "background.paper",
                boxShadow: 2,
                zIndex: 10,
                "&:hover": { bgcolor: "grey.200" },
              }}
              size="small"
              color="primary"
              aria-label="edit images"
            >
              <EditIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Colors & Sizes</Typography>
        {product.colors?.map((color, idx) => (
          <Box key={idx} p={1} mb={1} border="1px solid #ddd" borderRadius={1}>
            <Box display="flex" alignItems="center" mb={1}>
              <Box
                width={24}
                height={24}
                bgcolor={color.color_code || "#ccc"}
                border="1px solid #000"
                mr={1}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {color?.color_name || color.color_code}
              </Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {color?.sizes?.map((sz, i) => (
                <Chip
                  key={i}
                  label={`${sz.size} (${sz.stock})${sz.offer_price ? ` • Rs. ${sz.offer_price}` : ""}`}
                  color={sz.stock > 0 ? "primary" : "default"}
                  variant={sz.stock > 0 ? "filled" : "outlined"}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Product?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{product.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <EditProductModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        product={product}
        onSave={handleSave}
        onUpdated={fetchProduct}
      />

      <Dialog open={editImagesOpen} onClose={() => setEditImagesOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Images</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" mb={1}>Existing Images</Typography>
          <Grid container spacing={2}>
            {product.images?.length > 0 ? (
              product.images.map((img) => (
                <Grid item key={img.id} xs={6} sm={4} md={3} sx={{ position: "relative" }}>
                  <img src={img.image_url} alt="existing" style={{ width: "100%", borderRadius: 4 }} />
                  <IconButton
                    size="small"
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "rgba(255,255,255,0.7)",
                    }}
                    onClick={() => openConfirmDelete(img)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              ))
            ) : (
              <Typography>No existing images</Typography>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" gutterBottom>Add New Images</Typography>
          <Button variant="contained" component="label" sx={{ mb: 2 }}>
            Upload Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleNewImagesChange}
            />
          </Button>

          {newImages.length > 0 && (
            <>
              <Typography variant="subtitle2" gutterBottom>Preview of new images</Typography>
              <Grid container spacing={2}>
                {newImages.map((file, idx) => {
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <Grid item key={idx} xs={6} sm={4} md={3} sx={{ position: "relative" }}>
                      <img src={previewUrl} alt="new" style={{ width: "100%", borderRadius: 4 }} />
                      <IconButton
                        size="small"
                        color="error"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          bgcolor: "rgba(255,255,255,0.7)",
                        }}
                        onClick={() => handleDeleteNewImage(idx)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditImagesOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateImages}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Delete Image?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this image?</Typography>
          {imageToDeleteConfirm && (
            <Box mt={2}>
              <img
                src={imageToDeleteConfirm.image_url}
                alt="to delete"
                style={{ width: "100%", borderRadius: 4 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDeleteExistingImage}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
