import React, { useEffect, useState } from "react";
import {
  Box, Button, Grid, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { addFashionProduct, viewCategory, viewsubCategory, viewVendors } from "../../services/allApi";

function AddProduct({ token }) {
  const [vendor, setVendor] = useState("");
  const [vendors, setVendors] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [material, setMaterial] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [colors, setColors] = useState([]); // Stores all colors with their sizes and images
  const [selectedColor, setSelectedColor] = useState(""); // Selected color name
  const [colorImage, setColorImage] = useState(null); // Image for the selected color
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sizePrice, setSizePrice] = useState("");

  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const vendorsData = await viewVendors();
        const categoriesData = await viewCategory();
        const subcategoriesData = await viewsubCategory();
        const allSubcategories = [
          ...subcategoriesData.clothing_subcategories,
          ...subcategoriesData.grocery_subcategories,
          ...subcategoriesData.food_subcategories,
        ];
        setVendors(vendorsData);
        setCategories(categoriesData);
        setSubcategories(allSubcategories);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    initializeData();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    if (Array.isArray(subcategories)) {
      const filtered = subcategories.filter(
        (sc) => sc.category === selectedCategory
      );
      setFilteredSubcategories(filtered);
    } else {
      console.error("Subcategories is not an array:", subcategories);
      setFilteredSubcategories([]);
    }
    setSubcategory("");
  };

  const SIZE_CHOICES = [
    { value: "XS", label: "Extra Small" },
    { value: "S", label: "Small" },
    { value: "M", label: "Medium" },
    { value: "L", label: "Large" },
    { value: "XL", label: "Extra Large" },
    { value: "XXL", label: "2x Large" },
  ];

  const handleAddSize = () => {
    if (selectedColor && size && quantity && sizePrice && colorImage) {
      const newSize = {
        size,
        price: parseFloat(sizePrice),
        stock: parseInt(quantity, 10),
      };

      // Check if the color already exists in the colors array
      const colorIndex = colors.findIndex((color) => color.name === selectedColor);

      if (colorIndex !== -1) {
        // If the color exists, update its sizes
        const updatedColors = [...colors];
        updatedColors[colorIndex].sizes = [...(updatedColors[colorIndex].sizes || []), newSize];
        setColors(updatedColors);
      } else {
        // If the color doesn't exist, add a new color object
        const newColor = {
          name: selectedColor,
          image: colorImage.preview, // Store the image preview URL
          sizes: [newSize],
        };
        setColors([...colors, newColor]);
      }

      // Reset form fields
      setSize("");
      setQuantity("");
      setSizePrice("");
      setColorImage(null);
      setSelectedColor("");
    } else {
      alert("Please fill in all fields: color, size, quantity, price, and upload an image.");
    }
  };

  const handleRemoveSize = (colorName, sizeIndex) => {
    const updatedColors = colors.map((color) => {
      if (color.name === colorName) {
        return {
          ...color,
          sizes: color.sizes.filter((_, i) => i !== sizeIndex),
        };
      }
      return color;
    });
    setColors(updatedColors);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleColorImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setColorImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleRemoveColorImage = () => {
    setColorImage(null);
  };

  const handleSaveProduct = async () => {
    if (colors.length === 0) {
      alert("Please add at least one color with sizes.");
      return;
    }

    const formData = new FormData();
    formData.append("vendor", vendor);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("gender", gender);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("material", material);
    formData.append("category_id", category);
    formData.append("subcategory_id", subcategory);
    formData.append("is_active", isActive);

    // Append colors with sizes
    colors.forEach((color, index) => {
      formData.append(`colors[${index}][color_name]`, color.name);
      formData.append(`colors[${index}][color_image]`, color.image);
      color.sizes.forEach((size, sizeIndex) => {
        formData.append(`colors[${index}][sizes][${sizeIndex}][size]`, size.size);
        formData.append(`colors[${index}][sizes][${sizeIndex}][price]`, size.price);
        formData.append(`colors[${index}][sizes][${sizeIndex}][stock]`, size.stock);
      });
    });

    // Append images
    images.forEach((image) => formData.append("image_files", image.file));

    try {
      const response = await addFashionProduct(formData, token);
      console.log("Product added successfully:", response);

      // Clear all fields after success
      setVendor("");
      setCategory("");
      setSubcategory("");
      setName("");
      setGender("");
      setDescription("");
      setImages([]);
      setPrice("");
      setDiscount("");
      setMaterial("");
      setIsActive(false);
      setColors([]);
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Add Product
      </Typography>

      <Grid container spacing={4}>
        {/* General Information Section */}
        <Grid item xs={12} md={8}>
          <Box mb={4} sx={{ backgroundColor: "#ECF4EE", padding: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              General Information
            </Typography>
            <FormControl fullWidth sx={{ mb: 2, backgroundColor: "white" }}>
              <InputLabel>Vendor</InputLabel>
              <Select value={vendor} onChange={(e) => setVendor(e.target.value)}>
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.business_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              sx={{ mb: 2, backgroundColor: "white" }}
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              variant="outlined"
              sx={{ backgroundColor: "white", mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                label="Gender"
                sx={{ backgroundColor: "white" }}
              >
                {[
                  { value: 'M', label: 'Men' },
                  { value: 'W', label: 'Women' },
                  { value: 'U', label: 'Unisex' },
                  { value: 'K', label: 'Kids' },
                ].map((choice) => (
                  <MenuItem key={choice.value} value={choice.value}>
                    {choice.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Media Section */}
          <Box mb={4} sx={{ backgroundColor: "#ECF4EE", padding: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Images</Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button variant="contained" component="span" sx={{ mt: 2 }}>
                Select Images
              </Button>
            </label>
            <Grid container spacing={2} mt={2}>
              {images.map((image, index) => (
                <Grid item xs={3} key={index} sx={{ position: "relative" }}>
                  <img
                    src={image.preview}
                    alt="Preview"
                    style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      backgroundColor: "white",
                      color: "red",
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Pricing Section */}
          <Box mb={4} sx={{ backgroundColor: "#ECF4EE", padding: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Pricing</Typography>
            <TextField
              fullWidth
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              variant="outlined"
              sx={{ mb: 2, backgroundColor: "white" }}
            />
            <TextField
              fullWidth
              label="Discount (%)"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              variant="outlined"
              sx={{ mb: 2, backgroundColor: "white" }}
            />
          </Box>

          {/* Inventory Section */}
          <Box mb={4} sx={{ backgroundColor: "#ECF4EE", padding: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Inventory</Typography>
            <TextField
              fullWidth
              label="Color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              variant="outlined"
              sx={{ mb: 2, backgroundColor: "white" }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleColorImageUpload}
              style={{ display: "none" }}
              id="color-image-upload"
            />
            <label htmlFor="color-image-upload">
              <Button variant="contained" component="span" sx={{ mt: 2 }}>
                Upload Color Image
              </Button>
            </label>
            {colorImage && (
              <Box mt={2} sx={{ position: "relative" }}>
                <img
                  src={colorImage.preview}
                  alt="Color Preview"
                  style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }}
                />
                <IconButton
                  onClick={handleRemoveColorImage}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    backgroundColor: "white",
                    color: "red",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
            <Grid container spacing={2} alignItems="center" mt={2}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Size</InputLabel>
                  <Select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    label="Size"
                    sx={{ backgroundColor: "white" }}
                  >
                    {SIZE_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  variant="outlined"
                  sx={{ backgroundColor: "white" }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Price"
                  value={sizePrice}
                  onChange={(e) => setSizePrice(e.target.value)}
                  variant="outlined"
                  sx={{ backgroundColor: "white" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleAddSize}>
                  Add 
                </Button>
              </Grid>
            </Grid>
            <Box mt={2}>
              {colors.map((color) => (
                <Box key={color.name} mb={2}>
                  <Typography variant="subtitle1">{color.name}</Typography>
                  <img
                    src={color.image}
                    alt={color.name}
                    style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover", marginBottom: "10px" }}
                  />
                  {color.sizes?.map((size, index) => (
                    <Grid container key={index} spacing={2} alignItems="center">
                      <Grid item xs={4}>
                        <Typography>Size: {size.size}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>Quantity: {size.stock}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>Price: ${size.price}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <IconButton color="error" onClick={() => handleRemoveSize(color.name, index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Right Sidebar Section */}
        <Grid item xs={12} md={4}>
          <Box mb={4} sx={{ padding: 2, backgroundColor: "#ECF4EE", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Category</Typography>
            <FormControl fullWidth sx={{ mb: 2, backgroundColor: "white" }}>
              <InputLabel>Category</InputLabel>
              <Select value={category} onChange={handleCategoryChange}>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2, backgroundColor: "white" }}>
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                disabled={!category}
              >
                {filteredSubcategories.map((sc) => (
                  <MenuItem key={sc.id} value={sc.id}>
                    {sc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box mb={4} sx={{ padding: 2, backgroundColor: "#ECF4EE", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Other Details</Typography>
            <TextField
              fullWidth
              label="Material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              variant="outlined"
              sx={{ mb: 2, backgroundColor: "white" }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label="Is Active"
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
        <Button variant="outlined" sx={{ marginRight: "10px" }}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSaveProduct}>
          Add Product
        </Button>
      </Grid>
    </Box>
  );
}

export default AddProduct;