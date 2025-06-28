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
import { Add, CloudUploadOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addCategory, viewStores } from "../../services/allApi";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    category_image: null,
    store_type: "",
  });

  const [storeTypes, setStoreTypes] = useState([]);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, category_image: file }));
    }
  };

  const handleSubmit = async () => {
    try {
      const reqBody = new FormData();
      reqBody.append("name", formData.name);
      reqBody.append("category_image", formData.category_image);
      reqBody.append("store_type", formData.store_type);

      await addCategory(reqBody);

      toast.success("Category added successfully!");
      setFormData({ name: "", category_image: null, store_type: "" });
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category.");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Add New Category
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={4}>
        Dashboard &gt; Categories &gt; Add Category
      </Typography>

      <Grid container spacing={4}>
        {/* Thumbnail Section */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              backgroundColor: "#fcfcfc",
            }}
          >
            <Typography variant="subtitle1" fontWeight={500} mb={1}>
              Upload Thumbnail
            </Typography>
            <Box
              sx={{
                border: "2px dashed #c4c4c4",
                borderRadius: 2,
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                cursor: "pointer",
                transition: "border-color 0.3s",
                "&:hover": {
                  borderColor: "#1976d2",
                },
              }}
              onClick={() => document.getElementById("image-upload").click()}
            >
              {formData.category_image ? (
                <img
                  src={URL.createObjectURL(formData.category_image)}
                  alt="Thumbnail"
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                />
              ) : (
                <>
                  <CloudUploadOutlined sx={{ fontSize: 40, color: "#999" }} />
                  <Typography variant="body2" mt={1} color="text.secondary">
                    Click to upload
                  </Typography>
                </>
              )}
            </Box>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </Paper>
        </Grid>

        {/* Form Section */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              backgroundColor: "#fcfcfc",
            }}
          >
            <Typography variant="subtitle1" fontWeight={500} mb={2}>
              Category Details
            </Typography>

            <TextField
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth>
              <InputLabel>Store Type</InputLabel>
              <Select
                name="store_type"
                value={formData.store_type}
                onChange={handleInputChange}
                label="Store Type"
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

      {/* Buttons */}
      <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
        <Button variant="containedError"  size="large">
          Cancel
        </Button>
        <Button variant="contained" startIcon={<Add/>} size="large" onClick={handleSubmit}>
           Add Category
        </Button>
      </Box>
    </Box>
  );
};

export default AddCategory;
