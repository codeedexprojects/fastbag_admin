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

  // Fetch vendor list
  useEffect(() => {
    const fetchVendors = async () => {
      const res = await viewVendors();
      console.log(res)

      if (res) {
                setVendors(res);

      }
    };
    fetchVendors();
  }, []);
  console.log(vendors)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!vendorId || !title || !image) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("vendor", vendorId);
    formData.append("title", title);
    formData.append("ads_image", image);

    const res = await addCarouselAd(formData);
    if (res?.status === 201) {
      toast.success("Ad added successfully!");
      setVendorId("");
      setTitle("");
      setImage(null);
      setImagePreview("");
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
