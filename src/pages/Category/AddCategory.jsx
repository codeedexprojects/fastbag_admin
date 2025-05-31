import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { CloudUploadOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addCategory } from "../../services/allApi";
import { viewStores } from "../../services/allApi";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    category_image: null,
    store_type: "",
  });

  const [storeTypes, setStoreTypes] = useState([]);

  // Fetch store types on component mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const stores = await viewStores();
        setStoreTypes(stores);
      } catch (error) {
        console.error("Failed to fetch store types:", error);
        toast.error("Failed to load store types.");
      }
    };

    fetchStores();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, category_image: file });
  };

  const handleSubmit = async () => {
    try {
      const reqBody = new FormData();
      reqBody.append("name", formData.name);
      reqBody.append("category_image", formData.category_image);
      reqBody.append("store_type", formData.store_type);

      await addCategory(reqBody);

      // Display success toast
      toast.success("Category added successfully!");

      // Clear form fields
      setFormData({
        name: "",
        category_image: null,
        store_type: "",
      });
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category.");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Add Category
      </Typography>

      {/* Breadcrumbs */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="body2" color="textSecondary">
          Dashboard &gt; Categories &gt; Add Category
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
              {formData.category_image ? (
                <img
                  src={URL.createObjectURL(formData.category_image)}
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

        {/* Right: Form Fields */}
        <Grid item xs={12} sm={8}>
          <Paper sx={{ padding: 3, backgroundColor: "#f5faf5" }}>
            <Typography variant="h6" gutterBottom>
              Category Details
            </Typography>
            <TextField
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Type category name here..."
              sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Store Type</InputLabel>
              <Select
                name="store_type"
                value={formData.store_type}
                onChange={handleInputChange}
                displayEmpty
                variant="outlined"
              >
                
                {storeTypes.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name}
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
          + Add Category
        </Button>
      </Box>

      {/* Toast Notifications */}
      <ToastContainer />
    </Box>
  );
};

export default AddCategory;
