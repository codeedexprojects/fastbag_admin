import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getAllCarouselAds, updateCarouselAd, deleteCarouselAd } from "../../services/allApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CarouselList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [editAd, setEditAd] = useState(null);
  const [formValues, setFormValues] = useState({ 
    title: "", 
    latitude: "",
    longitude: "",
    ads_image: null 
  });
  const [imagePreview, setImagePreview] = useState("");
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await getAllCarouselAds();
      // Add proper null/undefined checking and array validation
      if (res && res.results && Array.isArray(res.results)) {
        setAds(res.results);
      } else if (res && Array.isArray(res)) {
        // Handle case where API returns array directly
        setAds(res);
      } else {
        setAds([]);
        console.warn("Unexpected API response format:", res);
      }
    } catch (error) {
      console.error("Error fetching ads", error);
      setAds([]); // Set to empty array on error
      toast.error("Failed to fetch carousel ads");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate("/add-carousel");
  };

  const handleEdit = (ad) => {
    setEditAd(ad);
    setFormValues({ 
      title: ad.title || "", 
      latitude: ad.latitude || "",
      longitude: ad.longitude || "",
      ads_image: null 
    });
    setImagePreview(ad.ads_image); // Show old image initially
    setOpenEdit(true);
  };

  // Open confirmation dialog on delete click
  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDeleteConfirm(true);
  };

  // Confirm delete handler
  const confirmDelete = async () => {
    try {
      await deleteCarouselAd(deleteId);
      toast.success("Deleted successfully");
      fetchAds();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setOpenDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormValues((prev) => ({ ...prev, ads_image: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(editAd?.ads_image || "");
    }
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", formValues.title);
      
      // Only append lat/long if they have values
      if (formValues.latitude) {
        formData.append("latitude", formValues.latitude);
      }
      if (formValues.longitude) {
        formData.append("longitude", formValues.longitude);
      }
      
      if (formValues.ads_image) {
        formData.append("ads_image", formValues.ads_image);
      }

      await updateCarouselAd(editAd.id, formData);
      toast.success("Updated successfully");
      setOpenEdit(false);
      fetchAds();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditAd(null);
    setFormValues({ title: "", latitude: "", longitude: "", ads_image: null });
    setImagePreview("");
  };

  // Helper function to get image URL with fallback
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, return it
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Otherwise, construct the full URL (adjust base URL as needed)
    return `https://fastbag.pythonanywhere.com${imageUrl}`;
  };

  return (
    <Box p={4}>
      {/* Top Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Carousel Advertisements</Typography>
        <Tooltip title="Add Carousel">
          <Button variant="contained" onClick={handleAdd} startIcon={<AddIcon />}>
            Add Carousel
          </Button>
        </Tooltip>
      </Box>

      {/* Loading or Empty */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : !ads || ads.length === 0 ? (
        <Typography variant="body1" mt={2}>
          No ads found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {ads.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.id}>
              <Card sx={{ height: "100%", position: "relative" }}>
                {ad.ads_image && (
                  <CardMedia 
                    component="img" 
                    height="180" 
                    image={getImageUrl(ad.ads_image)} 
                    alt={ad.title}
                    onError={(e) => {
                      // Fallback for broken images
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x180?text=No+Image';
                    }}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                {!ad.ads_image && (
                  <Box 
                    sx={{ 
                      height: 180, 
                      bgcolor: 'grey.300', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No Image
                    </Typography>
                  </Box>
                )}
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {ad.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Vendor: {ad.vendor_name || "N/A"}
                  </Typography>

                  {/* Coordinates Display */}
                  {(ad.latitude || ad.longitude) && (
                    <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
                      {ad.latitude && (
                        <Chip 
                          label={`Lat: ${ad.latitude}`} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                      {ad.longitude && (
                        <Chip 
                          label={`Long: ${ad.longitude}`} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                  )}

                  {/* Edit & Delete Buttons */}
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Tooltip title="Edit">
                      <IconButton color="primary" size="small" onClick={() => handleEdit(ad)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" size="small" onClick={() => handleDelete(ad.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Carousel Ad</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={formValues.title}
            onChange={handleEditInputChange}
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Latitude"
                name="latitude"
                type="number"
                fullWidth
                value={formValues.latitude}
                onChange={handleEditInputChange}
                inputProps={{ step: "any" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Longitude"
                name="longitude"
                type="number"
                fullWidth
                value={formValues.longitude}
                onChange={handleEditInputChange}
                inputProps={{ step: "any" }}
              />
            </Grid>
          </Grid>

          {/* Image Upload */}
          <Box mt={2}>
            <input
              accept="image/*"
              id="upload-image-file"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-image-file">
              <Button 
                variant="contained" 
                color="primary" 
                component="span" 
                startIcon={<UploadFileIcon />}
              >
                Upload Image
              </Button>
            </label>
          </Box>

          {/* Image Preview */}
          {imagePreview && (
            <Box mt={2} textAlign="center">
              <img
                src={getImageUrl(imagePreview)}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Available';
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirm} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this carousel ad?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CarouselList;