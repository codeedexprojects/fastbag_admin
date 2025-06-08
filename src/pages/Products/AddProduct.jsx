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
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {
  viewVendors,
  viewCategory,
  viewsubCategory,
  addFashionProduct,
} from "../../services/allApi";

function AddFashionProduct() {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [formData, setFormData] = useState({
    vendor: "",
    category_id: "",
    subcategory: "",
    name: "",
    description: "",
    gender: "",
    wholesale_price: "",
    price: "",
    offer_price: "",
    discount: "",
    material: "",
    is_active: true,
    colors: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsData, categoriesData, subcategoriesData] = await Promise.all([
          viewVendors(),
          viewCategory(),
          viewsubCategory(),
        ]);
        setVendors(vendorsData.filter((v) => v.store_type === 3));
        setCategories(categoriesData.filter((c) => c.store_type === 3));
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category_id: selectedCategory,
      subcategory: "",
    }));
    const filtered = subcategories.filter((sc) => sc.category === selectedCategory);
    setFilteredSubcategories(filtered);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { color_name: "", color_image: null, sizes: [] }],
    }));
    setPreviews((prev) => [...prev, ""]);
  };

  const removeColor = (index) => {
    setFormData((prev) => {
      const newColors = [...prev.colors];
      newColors.splice(index, 1);
      return { ...prev, colors: newColors };
    });
    setPreviews((prev) => {
      const newPreviews = [...prev];
      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleColorChange = (index, field, value) => {
    if (field === "color_image" && value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreviews((prev) => {
        const newPreviews = [...prev];
        if (newPreviews[index]) {
          URL.revokeObjectURL(newPreviews[index]);
        }
        newPreviews[index] = objectUrl;
        return newPreviews;
      });
    }

    setFormData((prev) => {
      const newColors = [...prev.colors];
      newColors[index][field] = value;
      return { ...prev, colors: newColors };
    });
  };

  const addSize = (colorIndex) => {
    setFormData((prev) => {
      const newColors = [...prev.colors];
      if (!newColors[colorIndex].sizes) newColors[colorIndex].sizes = [];
      newColors[colorIndex].sizes.push({ size: "", price: "", stock: "" });
      return { ...prev, colors: newColors };
    });
  };

  const removeSize = (colorIndex, sizeIndex) => {
    setFormData((prev) => {
      const newColors = [...prev.colors];
      newColors[colorIndex].sizes.splice(sizeIndex, 1);
      return { ...prev, colors: newColors };
    });
  };

  const handleSizeChange = (colorIndex, sizeIndex, field, value) => {
    setFormData((prev) => {
      const newColors = [...prev.colors];
      newColors[colorIndex].sizes[sizeIndex] = {
        ...newColors[colorIndex].sizes[sizeIndex],
        [field]: value,
      };
      return { ...prev, colors: newColors };
    });
  };

  // Convert nested formData to FormData for submission
  const buildFormData = (data) => {
    const fd = new FormData();

    fd.append("vendor", data.vendor);
    fd.append("category_id", data.category_id);
    fd.append("subcategory", data.subcategory);
    fd.append("name", data.name);
    fd.append("description", data.description);
    fd.append("gender", data.gender);
    fd.append("wholesale_price", data.wholesale_price);
    fd.append("price", data.price);
    fd.append("offer_price", data.offer_price || "");
    fd.append("discount", data.discount || "");
    fd.append("material", data.material || "");
    fd.append("is_active", data.is_active);

    data.colors.forEach((color, colorIndex) => {
      fd.append(`colors[${colorIndex}][color_name]`, color.color_name);

      if (color.color_image instanceof File) {
        fd.append(`colors[${colorIndex}][color_image]`, color.color_image);
      }

      if (color.sizes && color.sizes.length > 0) {
        color.sizes.forEach((size, sizeIndex) => {
          fd.append(`colors[${colorIndex}][sizes][${sizeIndex}][size]`, size.size);
          fd.append(`colors[${colorIndex}][sizes][${sizeIndex}][price]`, size.price);
          fd.append(`colors[${colorIndex}][sizes][${sizeIndex}][stock]`, size.stock);
        });
      }
    });

    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = buildFormData(formData);
      for (const pair of dataToSend.entries()) {
    console.log(pair[0], ":", pair[1]);
  }
      // console.log(formData)

      // Call your API method with FormData
      // Make sure addFashionProduct sends data as multipart/form-data
        const response = await addFashionProduct(formData)
        console.log("Product submitted successfully:", response);
      // You can reset the form or show a success message here if needed
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h5" mb={3}>Add Fashion Product</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="vendor-label">Vendor</InputLabel>
          <Select
            labelId="vendor-label"
            name="vendor"
            value={formData.vendor}
            label="Vendor"
            onChange={handleChange}
          >
            {vendors.map((v) => (
              <MenuItem key={v.id} value={v.id}>{v.business_name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="category_id"
            value={formData.category_id}
            label="Category"
            onChange={handleCategoryChange}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="subcategory-label">Subcategory</InputLabel>
          <Select
            labelId="subcategory-label"
            name="subcategory"
            value={formData.subcategory}
            label="Subcategory"
            onChange={handleChange}
            disabled={!formData.category_id}
          >
            {filteredSubcategories.map((sc) => (
              <MenuItem key={sc.id} value={sc.id}>{sc.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField label="Product Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={3} required />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            name="gender"
            value={formData.gender}
            label="Gender"
            onChange={handleChange}
          >
            <MenuItem value="M">Men</MenuItem>
            <MenuItem value="W">Women</MenuItem>
            <MenuItem value="U">Unisex</MenuItem>
            <MenuItem value="K">Kids</MenuItem>
          </Select>
        </FormControl>

        <TextField label="Wholesale Price" name="wholesale_price" value={formData.wholesale_price} onChange={handleChange} fullWidth margin="normal" type="number" required />
        <TextField label="Retail Price" name="price" value={formData.price} onChange={handleChange} fullWidth margin="normal" type="number" required />
        <TextField label="Offer Price" name="offer_price" value={formData.offer_price} onChange={handleChange} fullWidth margin="normal" type="number" />
        <TextField label="Discount %" name="discount" value={formData.discount} onChange={handleChange} fullWidth margin="normal" type="number" />
        <TextField label="Material" name="material" value={formData.material} onChange={handleChange} fullWidth margin="normal" />

        <FormControl fullWidth margin="normal">
          <InputLabel id="is_active-label">Status</InputLabel>
          <Select
            labelId="is_active-label"
            name="is_active"
            value={formData.is_active ? "active" : "inactive"}
            label="Status"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                is_active: e.target.value === "active",
              }))
            }
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <Box mt={4}>
          <Typography variant="h6">Colors & Sizes</Typography>
          {formData.colors.map((color, cIndex) => (
            <Paper key={cIndex} variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="Color Name"
                    value={color.color_name}
                    onChange={(e) => handleColorChange(cIndex, "color_name", e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={5}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleColorChange(cIndex, "color_image", e.target.files[0])}
                  />
                  {previews[cIndex] && (
                    <Box mt={1}>
                      <img src={previews[cIndex]} alt="Preview" height={150} style={{ borderRadius: 4 }} />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => removeColor(cIndex)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Typography>Sizes</Typography>
                {color.sizes.length > 0 ? (
                  color.sizes.map((size, sIndex) => (
                    <Grid container spacing={2} alignItems="center" key={sIndex} sx={{ mt: 1 }}>
                      <Grid item xs={3}>
                        <FormControl fullWidth required>
                          <InputLabel id={`size-label-${cIndex}-${sIndex}`}>Size</InputLabel>
                          <Select
                            labelId={`size-label-${cIndex}-${sIndex}`}
                            value={size.size}
                            label="Size"
                            onChange={(e) => handleSizeChange(cIndex, sIndex, "size", e.target.value)}
                          >
                            <MenuItem value="XS">Extra Small</MenuItem>
                            <MenuItem value="S">Small</MenuItem>
                            <MenuItem value="M">Medium</MenuItem>
                            <MenuItem value="L">Large</MenuItem>
                            <MenuItem value="XL">Extra Large</MenuItem>
                            <MenuItem value="XXL">2x Large</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField label="Price" type="number" value={size.price} onChange={(e) => handleSizeChange(cIndex, sIndex, "price", e.target.value)} fullWidth required />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField label="Stock" type="number" value={size.stock} onChange={(e) => handleSizeChange(cIndex, sIndex, "stock", e.target.value)} fullWidth required />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton onClick={() => removeSize(cIndex, sIndex)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))
                ) : (
                  <Typography>No sizes added yet.</Typography>
                )}
                <Button variant="outlined" size="small" startIcon={<AddIcon />} sx={{ mt: 1 }} onClick={() => addSize(cIndex)}>
                  Add Size
                </Button>
              </Box>
            </Paper>
          ))}
          <Button variant="contained" startIcon={<AddIcon />} onClick={addColor} sx={{ mt: 2 }}>
            Add Color
          </Button>
        </Box>

        <Box mt={4}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit Product
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default AddFashionProduct;
