import React, { useEffect, useState } from "react";
import {Box,Button,TextField,Typography,Grid,Switch,FormControlLabel,Select,MenuItem,InputLabel,FormControl,} from "@mui/material";
import { styled } from "@mui/material/styles";
import { addProduct, viewCategory, viewsubCategory, viewVendors } from "../../services/allApi";

// Styled preview container
const PreviewContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  flexWrap: "wrap",
  marginTop: theme.spacing(2),
}));

const AddFoodProduct = () => {
  const [images, setImages] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isOfferProduct, setIsOfferProduct] = useState(false);
  const [isPopularProduct, setIsPopularProduct] = useState(false);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // Fetch Vendors, Categories, and Subcategories
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("vendor", vendor);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("offer_price", offerPrice);
    formData.append("discount", discount);
    formData.append("is_available", isAvailable);
    formData.append("is_offer_product", isOfferProduct);
    formData.append("is_popular_product", isPopularProduct);
    images.forEach((image) => formData.append("images", image));
  
    try {
      await addProduct(formData);
      alert("Product added successfully");
  
      // Reset all form fields
      setVendor("");
      setCategory("");
      setSubcategory("");
      setProductName("");
      setDescription("");
      setPrice("");
      setOfferPrice("");
      setDiscount("");
      setIsAvailable(true);
      setIsOfferProduct(false);
      setIsPopularProduct(false);
      setImages([]);
      setFilteredSubcategories([]);
  
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Error adding product");
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Add Product
        </Typography>
        <Box>
          <Button variant="outlined" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Form Section */}
      <Box
        sx={{
          backgroundColor: "#ECF4EE",
          borderRadius: 2,
          p: 3,
        }}
      >
        <Grid container spacing={3}>
          {/* General Information */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              General Information
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Vendor</InputLabel>
              <Select value={vendor} onChange={(e) => setVendor(e.target.value)}>
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.business_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={handleCategoryChange}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Subcategory Selection */}
          <Grid item xs={6}>
            <FormControl fullWidth>
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
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Product Name"
              variant="outlined"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          {/* Pricing */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Pricing
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              variant="outlined"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Offer Price"
              type="number"
              variant="outlined"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Discount (%)"
              type="number"
              variant="outlined"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </Grid>

          {/* Inventory */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Inventory
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                />
              }
              label="Available"
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={isOfferProduct}
                  onChange={(e) => setIsOfferProduct(e.target.checked)}
                />
              }
              label="Offer Product"
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={isPopularProduct}
                  onChange={(e) => setIsPopularProduct(e.target.checked)}
                />
              }
              label="Popular Product"
            />
          </Grid>

          {/* Media */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Media
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Upload Images
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </Button>
            <PreviewContainer>
              {images.map((image, index) => (
                <Box key={index}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 4,
                      marginRight: 10,
                    }}
                  />
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </PreviewContainer>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AddFoodProduct;