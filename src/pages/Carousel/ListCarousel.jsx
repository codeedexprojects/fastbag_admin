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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { getAllCarouselAds, updateCarouselAd, deleteCarouselAd } from "../../services/allApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CarouselList() {
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [editAd, setEditAd] = useState(null);
  const [formValues, setFormValues] = useState({ 
    title: "",
    place_name: "",
    location_type: "point",
    latitude: "",
    longitude: "",
    radius_km: 0,
    ads_image: null 
  });
  const [imagePreview, setImagePreview] = useState("");
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Filter states
  const [searchLocation, setSearchLocation] = useState("");
  const [filterVendor, setFilterVendor] = useState("all"); // all, with_vendor, without_vendor
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    filterAds();
  }, [ads, searchLocation, filterVendor]);

  const fetchAds = async () => {
    try {
      const res = await getAllCarouselAds();
      if (res && res.results && Array.isArray(res.results)) {
        setAds(res.results);
      } else if (res && Array.isArray(res)) {
        setAds(res);
      } else {
        setAds([]);
        console.warn("Unexpected API response format:", res);
      }
    } catch (error) {
      console.error("Error fetching ads", error);
      setAds([]);
      toast.error("Failed to fetch carousel ads");
    } finally {
      setLoading(false);
    }
  };

  const filterAds = () => {
    let filtered = [...ads];

    // Filter by location search
    if (searchLocation.trim()) {
      filtered = filtered.filter(ad => 
        ad.place_name?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Filter by vendor
    if (filterVendor === "with_vendor") {
      filtered = filtered.filter(ad => ad.vendor !== null);
    } else if (filterVendor === "without_vendor") {
      filtered = filtered.filter(ad => ad.vendor === null);
    }

    setFilteredAds(filtered);
  };

  const handleAdd = () => {
    navigate("/add-carousel");
  };

  const handleEdit = (ad) => {
    setEditAd(ad);
    setFormValues({ 
      title: ad.title || "",
      place_name: ad.place_name || "",
      location_type: ad.location_type || "point",
      latitude: ad.latitude || "",
      longitude: ad.longitude || "",
      radius_km: ad.radius_km || 0,
      ads_image: null 
    });
    setImagePreview(ad.ads_image);
    setOpenEdit(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDeleteConfirm(true);
  };

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
      formData.append("place_name", formValues.place_name);
      formData.append("location_type", formValues.location_type);
      
      if (formValues.latitude) {
        formData.append("latitude", formValues.latitude);
      }
      if (formValues.longitude) {
        formData.append("longitude", formValues.longitude);
      }
      if (formValues.radius_km) {
        formData.append("radius_km", formValues.radius_km);
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
    setFormValues({ 
      title: "", 
      place_name: "",
      location_type: "point",
      latitude: "", 
      longitude: "", 
      radius_km: 0,
      ads_image: null 
    });
    setImagePreview("");
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `https://fastbag.pythonanywhere.com${imageUrl}`;
  };

  const getLocationTypeLabel = (type) => {
    const types = {
      'point': 'Specific Point',
      'radius': 'Point with Radius',
      'district': 'District/Area'
    };
    return types[type] || type;
  };

  return (
    <Box p={4}>
      {/* Top Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Carousel Advertisements</Typography>
        <Button variant="contained" onClick={handleAdd} startIcon={<AddIcon />}>
          Add Carousel
        </Button>
      </Box>

      {/* Filters */}
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by location name..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Vendor</InputLabel>
              <Select
                value={filterVendor}
                label="Filter by Vendor"
                onChange={(e) => setFilterVendor(e.target.value)}
                startAdornment={<FilterListIcon sx={{ ml: 1, mr: 1 }} />}
              >
                <MenuItem value="all">All Carousels</MenuItem>
                <MenuItem value="with_vendor">With Vendor</MenuItem>
                <MenuItem value="without_vendor">Platform Ads (No Vendor)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Loading or Empty */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : !filteredAds || filteredAds.length === 0 ? (
        <Typography variant="body1" mt={2}>
          No ads found matching your filters.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredAds.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.id}>
              <Card sx={{ height: "100%", position: "relative" }}>
                {ad.ads_image && (
                  <CardMedia 
                    component="img" 
                    height="180" 
                    image={getImageUrl(ad.ads_image)} 
                    alt={ad.title}
                    onError={(e) => {
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
                    Vendor: {ad.vendor_name || "Platform Ad"}
                  </Typography>

                  {/* Location Display */}
                  <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {ad.location_display || ad.place_name}
                    </Typography>
                  </Box>

                  {/* Location Type Chip */}
                  <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
                    <Chip 
                      label={getLocationTypeLabel(ad.location_type)} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                    {ad.radius_km > 0 && (
                      <Chip 
                        label={`${ad.radius_km} km`} 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                  </Box>

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

          <TextField
            margin="dense"
            label="Place Name"
            name="place_name"
            fullWidth
            required
            value={formValues.place_name}
            onChange={handleEditInputChange}
            helperText="e.g., Kozhikode, Beach Road, Downtown District"
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Location Type</InputLabel>
            <Select
              name="location_type"
              value={formValues.location_type}
              label="Location Type"
              onChange={handleEditInputChange}
            >
              <MenuItem value="point">Specific Point</MenuItem>
              <MenuItem value="radius">Point with Radius</MenuItem>
              <MenuItem value="district">District/Area</MenuItem>
            </Select>
          </FormControl>

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

          {(formValues.location_type === 'radius' || formValues.location_type === 'district') && (
            <TextField
              margin="dense"
              label="Radius (km)"
              name="radius_km"
              type="number"
              fullWidth
              value={formValues.radius_km}
              onChange={handleEditInputChange}
              inputProps={{ min: 0, step: 0.1 }}
              helperText="Coverage radius in kilometers"
            />
          )}

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