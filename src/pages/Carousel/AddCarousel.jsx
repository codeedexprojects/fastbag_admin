import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { viewVendors, addCarouselAd } from "../../services/allApi";
import { toast } from "react-toastify";

// Styled input for file upload
const Input = styled("input")({
  display: "none",
});

function AddCarousel() {
  const [vendors, setVendors] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [latitude, setlatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 10.0261, lng: 76.3125 });
  const mapApi = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

  // Fetch vendor list
  useEffect(() => {
    const fetchVendors = async () => {
      const res = await viewVendors();
      console.log(res);

      if (res) {
        setVendors(res);
      }
    };
    fetchVendors();
  }, []);

  // Initialize map
  useEffect(() => {
    if (window.google) {
      initMap();
    } else {
      loadGoogleMapsScript();
    }
  }, []);

  const loadGoogleMapsScript = () => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapApi}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => initMap();
    document.head.appendChild(script);
  };

  const initMap = () => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const map = new window.google.maps.Map(mapElement, {
      center: mapCenter,
      zoom: 12,
    });

    let marker = new window.google.maps.Marker({
      position: mapCenter,
      map: map,
      draggable: true,
    });

    // Update coordinates when marker is dragged
    marker.addListener("dragend", (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setlatitude(lat.toString());
      setLongitude(lng.toString());
    });

    // Click on map to place marker
    map.addListener("click", (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      marker.setPosition(event.latLng);
      setlatitude(lat.toString());
      setLongitude(lng.toString());
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleManualLocationUpdate = () => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
        
        // Reinitialize map with new center
        setTimeout(() => {
          initMap();
        }, 100);
      }
    }
  };

  const handleSubmit = async () => {
    if (!vendorId || !title || !image || !latitude || !longitude) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("vendor", vendorId);
    formData.append("title", title);
    formData.append("ads_image", image);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    const res = await addCarouselAd(formData);
    if (res?.status === 201) {
      toast.success("Ad added successfully!");
      setVendorId("");
      setTitle("");
      setImage(null);
      setImagePreview("");
      setlatitude("");
      setLongitude("");
    } else {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        Add Carousel Advertisement
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select Vendor</InputLabel>
            <Select
              value={vendorId}
              label="Select Vendor"
              onChange={(e) => setVendorId(e.target.value)}
            >
              {vendors.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id}>
                  {vendor.business_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Ad Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Latitude"
            value={latitude}
            onChange={(e) => setlatitude(e.target.value)}
            type="number"
            inputProps={{ step: "any" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            type="number"
            inputProps={{ step: "any" }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={handleManualLocationUpdate}
            sx={{ mb: 2 }}
          >
            Update Map Location
          </Button>
          <Box
            id="map"
            sx={{
              width: "100%",
              height: "400px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Click on the map or drag the marker to set location
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <label htmlFor="upload-image">
            <Input
              accept="image/*"
              id="upload-image"
              type="file"
              onChange={handleImageChange}
            />
            <Button variant="contained" component="span">
              Upload Ad Image
            </Button>
          </label>
          {imagePreview && (
            <Card sx={{ mt: 2, maxWidth: 400 }}>
              <CardMedia
                component="img"
                height="200"
                image={imagePreview}
                alt="Ad Preview"
              />
              <CardContent>
                <Typography variant="body2">{title}</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Submit Ad
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddCarousel;