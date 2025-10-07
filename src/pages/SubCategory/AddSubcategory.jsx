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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addsubCategory, viewCategory } from "../../services/allApi";

const AddSubCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    subcategory_image: null,
    category: "",
    is_active: true,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await viewCategory();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_active" ? value === "true" : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, subcategory_image: file }));
  };

  const handleSubmit = async () => {
    try {
      const reqBody = new FormData();
      reqBody.append("name", formData.name);
      reqBody.append("subcategory_image", formData.subcategory_image);
      reqBody.append("category", formData.category);

      const res = await addsubCategory(reqBody);
      console.log(res);

      toast.success("Subcategory added successfully!");
      setFormData({ name: "", subcategory_image: null, category: "", is_active: true });
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast.error("Failed to add subcategory.");
    }
  };

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
                border: "2px dashed #ccc",
                borderRadius: 2,
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                cursor: "pointer",
                transition: "border-color 0.3s",
                "&:hover": {
                  borderColor: "primary.main",
                },
              }}
            >
              {formData.subcategory_image ? (
                <img
                  src={URL.createObjectURL(formData.subcategory_image)}
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
            />

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Is Active</FormLabel>
              <RadioGroup
                name="is_active"
                value={formData.is_active.toString()}
                onChange={handleInputChange}
                row
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
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
        <Button variant="outlined" size="large">
          Cancel
        </Button>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          + Add Sub Category
        </Button>
      </Box>
    </Box>
  );
};

export default AddSubCategory;
