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
  MenuItem,
  Select,
} from "@mui/material";
import { CloudUploadOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addsubCategory, viewCategory } from "../../services/allApi";
import { useNavigate } from "react-router-dom";

const AddSubCategory = () => {
  const MAX_SUBCATEGORY_NAME_LENGTH = 50;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    subcategory_image: null,
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await viewCategory();
        setCategories(categoryData.results || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  const validateSubcategoryName = (value) => {
    // Check if empty
    if (!value.trim()) {
      setNameError("");
      return false;
    }

    // Check for numbers
    if (/\d/.test(value)) {
      setNameError("Subcategory name should not contain numbers");
      return false;
    }

    // Check for special characters (allow only letters, spaces, hyphens, and apostrophes)
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      setNameError("Subcategory name should only contain letters, spaces, hyphens, and apostrophes");
      return false;
    }

    // Check max length
    if (value.length > MAX_SUBCATEGORY_NAME_LENGTH) {
      setNameError(`Subcategory name should not exceed ${MAX_SUBCATEGORY_NAME_LENGTH} characters`);
      return false;
    }

    setNameError("");
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "name") {
      // Prevent input if it would exceed max length
      if (value.length > MAX_SUBCATEGORY_NAME_LENGTH) {
        return;
      }
      
      // Validate the name
      validateSubcategoryName(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB.");
        return;
      }

      setFormData((prev) => ({ ...prev, subcategory_image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    navigate("/subcategory");
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter a subcategory name.");
      setNameError("Subcategory name is required");
      return;
    }

    // Validate subcategory name format
    if (!validateSubcategoryName(formData.name)) {
      toast.error("Please enter a valid subcategory name.");
      return;
    }

    if (!formData.subcategory_image) {
      toast.error("Please upload a subcategory image.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    try {
      setLoading(true);
      const reqBody = new FormData();
      reqBody.append("name", formData.name.trim());
      reqBody.append("sub_category_image", formData.subcategory_image);
      reqBody.append("category", formData.category);
      reqBody.append("is_active", true);

      const res = await addsubCategory(reqBody);
      console.log(res);

      toast.success("Subcategory added successfully!");
      
      // Redirect to subcategory listing page
      navigate("/view-subcategory");
    } catch (error) {
      console.error("Error adding subcategory:", error);
      
      // Handle duplicate subcategory error
      if (error.response?.data?.non_field_errors) {
        const errorMessage = error.response.data.non_field_errors[0];
        if (errorMessage.includes("must make a unique set")) {
          toast.error("This subcategory already exists in the selected category!");
        } else {
          toast.error(errorMessage);
        }
      } else if (error.response?.data?.name) {
        // Handle name-specific errors
        toast.error(error.response.data.name[0]);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add subcategory. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Box sx={{ px: 4, py: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Add Sub Category
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={4}>
        Dashboard &gt; Categories &gt; Add Sub Category
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
              onClick={() => document.getElementById("image-upload").click()}
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
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Thumbnail"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <>
                  <CloudUploadOutlined sx={{ fontSize: 40, color: "#999" }} />
                  <Typography variant="body2" mt={1} color="text.secondary">
                    Click to upload image
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

        {/* Form Fields Section */}
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
            <Typography variant="subtitle1" fontWeight={500} mb={3}>
              General Information
            </Typography>

            <TextField
              label="Sub Category Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{ mb: 3 }}
              placeholder="Type subcategory name here..."
              required
              error={!!nameError}
              helperText={
                nameError || 
                `${formData.name.length}/${MAX_SUBCATEGORY_NAME_LENGTH} characters (only letters allowed)`
              }
              inputProps={{
                maxLength: MAX_SUBCATEGORY_NAME_LENGTH,
              }}
            />

            <FormControl fullWidth sx={{ mb: 3 }} required>
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
          </Paper>
        </Grid>
      </Grid>

      {/* Footer Buttons */}
      <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
        <Button 
          variant="outlined" 
          size="large"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          onClick={handleSubmit}
          disabled={loading || !!nameError}
        >
          {loading ? "Adding..." : "+ Add Sub Category"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddSubCategory;