import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Autocomplete,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addCarouselAd, viewVendors } from "../../services/allApi";
import GoogleMapPickerWithRadius from "../../components/GoogleMapPickerWithRadius";

function AddCarousel() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    place_name: "",
    location_type: "point",
    latitude: "",
    longitude: "",
    radius_km: 0,
    vendor: null,
    ads_image: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await viewVendors();
      setVendors(res.results || res || []);
    } catch (error) {
      console.error("Error fetching vendors", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, ads_image: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!formData.place_name.trim()) {
      toast.error("Please select a location on the map");
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      toast.error("Please select a location on the map");
      return;
    }

    if ((formData.location_type === 'radius') && formData.radius_km <= 0) {
      toast.error("Please set a radius greater than 0 km");
      return;
    }

    if (!formData.ads_image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("place_name", formData.place_name);
      data.append("location_type", formData.location_type);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      data.append("radius_km", formData.radius_km);
      
      if (formData.vendor) {
        data.append("vendor", formData.vendor);
      }
      
      data.append("ads_image", formData.ads_image);

      await addCarouselAd(data);
      toast.success("Carousel ad created successfully");
      navigate("/view-carousel");
    } catch (error) {
      toast.error("Failed to create carousel ad");
      console.error(error);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        Add New Carousel Advertisement
      </Typography>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                helperText="Enter a catchy title for your advertisement"
              />
            </Grid>

            {/* Location Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Location Type</InputLabel>
                <Select
                  name="location_type"
                  value={formData.location_type}
                  label="Location Type"
                  onChange={handleInputChange}
                >
                  <MenuItem value="point">📍 Specific Point</MenuItem>
                  <MenuItem value="radius">🎯 Point with Radius</MenuItem>
                  <MenuItem value="district">🗺️ District/Area</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Vendor Selection (Optional) */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={vendors}
                getOptionLabel={(option) => option.owner_name || ""}
                onChange={(event, newValue) => {
                  setFormData((prev) => ({ ...prev, vendor: newValue?.id || null }));
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Vendor (Optional)" 
                    helperText="Leave empty for platform ads"
                  />
                )}
              />
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Divider>
                <Typography variant="body2" color="text.secondary">
                  Select Location on Map
                </Typography>
              </Divider>
            </Grid>

            {/* Google Map Picker with Radius */}
            <Grid item xs={12}>
              <GoogleMapPickerWithRadius 
                formData={formData} 
                setFormData={setFormData} 
              />
            </Grid>

            {/* Place Name (Auto-filled from map) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Place Name"
                name="place_name"
                value={formData.place_name}
                onChange={handleInputChange}
                required
                helperText="Automatically filled from map selection (you can edit it)"
              />
            </Grid>

            {/* Coordinates Display (Read-only) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Latitude"
                value={formData.latitude}
                InputProps={{
                  readOnly: true,
                }}
                helperText="Auto-filled from map"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Longitude"
                value={formData.longitude}
                InputProps={{
                  readOnly: true,
                }}
                helperText="Auto-filled from map"
              />
            </Grid>

            {/* Radius Display (Read-only for point type) */}
            {(formData.location_type === 'radius' || formData.location_type === 'district') && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Coverage Radius (km)"
                  value={formData.radius_km}
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Adjust using the slider on the map"
                />
              </Grid>
            )}

            {/* Divider */}
            <Grid item xs={12}>
              <Divider>
                <Typography variant="body2" color="text.secondary">
                  Advertisement Image
                </Typography>
              </Divider>
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <input
                accept="image/*"
                id="carousel-image-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
                required
              />
              <label htmlFor="carousel-image-upload">
                <Button variant="contained" component="span" fullWidth>
                  {formData.ads_image ? "Change Image" : "Upload Image *"}
                </Button>
              </label>
              {imagePreview && (
                <Box mt={2} textAlign="center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: 300, 
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                  />
                </Box>
              )}
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button 
                  variant="outlined" 
                  onClick={() => navigate("/view-carousel")}
                  size="large"
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  size="large"
                >
                  Create Carousel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddCarousel;