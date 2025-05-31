import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
} from "@mui/material";
import { CloudUploadOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addsubCategory, viewCategory, viewVendors } from "../../services/allApi";

const AddSubCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    subcategory_image: null,
    enable_subcategory: "true",
    category: "",
    vendor_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndVendors = async () => {
      try {
        // Fetch categories
        const categoryData = await viewCategory();
        setCategories(categoryData);

        // Fetch vendors
        const vendorData = await viewVendors();
        setVendors(vendorData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCategoriesAndVendors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, subcategory_image: file });
  };

  const handleSubmit = async () => {
    try {
      const reqBody = new FormData();
      reqBody.append("name", formData.name);
      reqBody.append("subcategory_image", formData.subcategory_image);
      reqBody.append("enable_subcategory", formData.enable_subcategory);
      reqBody.append("category", formData.category);
      reqBody.append("vendor_id", formData.vendor_id);

      await addsubCategory(reqBody);

      // Display success toast
      toast.success("Subcategory added successfully!");

      // Clear form fields
      setFormData({
        name: "",
        subcategory_image: null,
        enable_subcategory: "true",
        category: "",
        vendor_id: "",
      });
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast.error("Failed to add subcategory.");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Add Sub Category
      </Typography>

      {/* Breadcrumbs */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="body2" color="textSecondary">
          Dashboard &gt; Categories &gt; Add Sub Category
        </Typography>
      </Box>

      {/* Main Form */}
      <Grid container spacing={3}>
        {/* Left: Thumbnail Section */}
        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 3, backgroundColor: "#f5faf5" }}>
            <Typography variant="h6" gutterBottom>
              Thumbnail
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Upload Image
            </Typography>
            <Box
              sx={{
                border: "2px dashed #d4d4d4",
                borderRadius: 2,
                textAlign: "center",
                padding: 4,
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("image-upload").click()}
            >
              {formData.subcategory_image ? (
                <img
                  src={URL.createObjectURL(formData.subcategory_image)}
                  alt="Thumbnail"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              ) : (
                <>
                  <CloudUploadOutlined sx={{ fontSize: 50, color: "#a0a0a0" }} />
                  <Typography>Drag and drop image here, or click to upload</Typography>
                </>
              )}
            </Box>
            <input
              id="image-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </Paper>
        </Grid>

        {/* Right: General Information Section */}
        <Grid item xs={12} sm={8}>
          <Paper sx={{ padding: 3, backgroundColor: "#f5faf5" }}>
            <Typography variant="h6" gutterBottom>
              General Information
            </Typography>
            <TextField
              label="Sub Category Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 3 }}
              placeholder="Type subcategory name here..."
            />
            <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
              <FormLabel component="legend">Is Active</FormLabel>
              <RadioGroup
                name="enable_subcategory"
                value={formData.enable_subcategory}
                onChange={handleInputChange}
                row
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 3 }}>
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 3 }}>
              <FormLabel>Vendor</FormLabel>
              <Select
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Vendor
                </MenuItem>
                {vendors.map((vendor) => (
                  <MenuItem key={vendor.id} value={vendor.id}>
                    {vendor.business_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>

      {/* Buttons at Bottom */}
      <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
        <Button variant="outlined">Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          + Add Sub Category
        </Button>
      </Box>

      {/* Toast Notifications */}
      <ToastContainer />
    </Box>
  );
};

export default AddSubCategory;
