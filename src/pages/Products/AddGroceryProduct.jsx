import React, { useEffect, useState } from "react";
import {
  Box, Button, TextField, Typography, Grid, Switch, FormControlLabel, Select, MenuItem, InputLabel, FormControl, InputAdornment, IconButton, RadioGroup,
  Radio
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from '@mui/icons-material/Delete';
import { addGroceryProduct, viewCategory, viewsubCategory, viewVendors } from "../../services/allApi";

const AddGroceryProduct = () => {
  const [images, setImages] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [productName, setProductName] = useState();
  const [productDescription, setProductDescription] = useState();
  const [offerPrice, setOfferPrice] = useState();
  const [discount, setDiscount] = useState();
  const [isAvailable, setIsAvailable] = useState(true);
  const [isOfferProduct, setIsOfferProduct] = useState(true);
  const [isPopularProduct, setIsPopularProduct] = useState(false);
  const [weight, setWeight] = useState('');
  const [weightPrice, setWeightPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [measurment, setMeasurment] = useState('')
  const [weightMeasurment, setWeightMeasurment] = useState('')
  const [stockStatus, setStockStatus] = useState(true);
  const [availableWeights, setAvailableWeights] = useState([]);

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

  const handleAddWeight = () => {
    if (weightPrice && weight && price && quantity) {
      const newWeight = {
        weightPrice,
        weightMeasurment,
        price,
        quantity,
        stockStatus,
      };
      setAvailableWeights([...availableWeights, newWeight]);
      setWeightPrice("");
      setWeightMeasurment("");
      setPrice("");
      setQuantity("");
      setStockStatus(true); // Reset stock status
    }
  };

  const handleRemoveWeight = (index) => {
    const updatedWeights = availableWeights.filter((_, i) => i !== index);
    setAvailableWeights(updatedWeights);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => {
      const newImages = files.filter(
        (file) => !prev.some((img) => img instanceof File && img.name === file.name)
      );
      return [...prev, ...newImages];
    });
  };
  
  


  // Remove selected image
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("vendor", vendor);
      formData.append("category", category);
      formData.append("sub_category", subcategory);
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("price", price);
      formData.append("offer_price", offerPrice);
      formData.append("discount", discount);
      formData.append("Available", isAvailable);
      formData.append("is_offer_product", isOfferProduct);
      formData.append("is_popular_product", isPopularProduct);
      formData.append("weight_measurement", measurment);
      formData.append("weights", JSON.stringify(availableWeights));
  
      // Append images
      images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append("images", image); // Use "images" instead of "images[]"
          console.log(`Appending image ${index}:`, image);
        }
      });
  
      // Debug FormData
      for (let [key, value] of formData.entries()) {
        if (key === "images") {
          console.log(`${key}:`, value.name); // Debug image names
        } else {
          console.log(`${key}:`, value);
        }
      }
  
      const result = await addGroceryProduct(formData); // Assuming addGroceryProduct handles the API call
      console.log("Product added successfully:", result);
  
      // Reset fields after successful submission
      resetFormFields();
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };
  
  
  const resetFormFields = () => {
    setVendor("");
    setCategory("");
    setSubcategory("");
    setProductName("");
    setProductDescription("");
    setPrice("");
    setOfferPrice("");
    setDiscount("");
    setIsAvailable(false);
    setIsOfferProduct(false);
    setIsPopularProduct(false);
    setMeasurment("");
    setAvailableWeights([]);
    setImages([]);
  };
  




  // Styled preview container
  const PreviewContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(2),
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
  }));

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }} >
        <Typography variant="h5" fontWeight="bold">
          Add Grocery Product
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
        }}>
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
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
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
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Measurment"
              type="text"
              variant="outlined"
              value={measurment}
              onChange={(e) => setMeasurment(e.target.value)}

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
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
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

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Available Weights
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  variant="outlined"
                  sx={{ backgroundColor: "white" }}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Weight</InputLabel>
                  <Select
                    value={weightMeasurment}
                    onChange={(e) => setWeightMeasurment(e.target.value)}
                    label="Weight"
                    sx={{ backgroundColor: "white" }}
                  >
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="ltr">ltr</MenuItem>
                    <MenuItem value="g">g</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Price"
                  value={weightPrice}
                  onChange={(e) => setWeightPrice(e.target.value)}
                  variant="outlined"
                  sx={{ backgroundColor: "white" }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  variant="outlined"
                  sx={{ backgroundColor: "white" }}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value === "true")}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="In Stock"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="Out of Stock"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" color="primary" onClick={handleAddWeight}>
                  Add
                </Button>
              </Grid>
            </Grid>
            <Box mt={2}>
              {availableWeights.map((item, index) => (
                <Grid container key={index} spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <Typography>
                      Weight: {item.weightPrice} - {item.weight}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Price: {item.weightMeasurment}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Quantity: {item.quantity}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      Stock Status: {item.stockStatus ? "In Stock" : "Out of Stock"}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveWeight(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Grid>
          {/* Media */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Media
            </Typography>
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
                    src={typeof image === "string" ? image : URL.createObjectURL(image)}
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

export default AddGroceryProduct;
