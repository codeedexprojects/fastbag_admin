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
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isOfferProduct, setIsOfferProduct] = useState(true);
  const [isPopularProduct, setIsPopularProduct] = useState(false);
  const [measurment, setMeasurment] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [weightMeasurment, setWeightMeasurment] = useState("");
  const [weightPrice, setWeightPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stockStatus, setStockStatus] = useState(true);
  const [availableWeights, setAvailableWeights] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const vendorsData = await viewVendors();
        const filteredVendors = vendorsData.filter(ven => ven.store_type === 2);
        setVendors(filteredVendors);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };
    const fetchSubCategories = async () => {
      const subcategoriesData = await viewsubCategory();
      setSubcategories(subcategoriesData);
    };
    const fetchCategories = async () => {
      const categoriesData = await viewCategory();
      const filteredCategories = categoriesData.filter(cat => cat.store_type === 2);
      setCategories(filteredCategories);
    };

    fetchVendors();
    fetchCategories();
    fetchSubCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    if (Array.isArray(subcategories)) {
      const filtered = subcategories.filter(sc => sc.category === selectedCategory);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
    setSubcategory("");
  };

  const handleAddWeight = () => {
    if (weight && weightMeasurment && weightPrice && quantity) {
      const newWeight = {
        weight,
        weightMeasurment,
        weightPrice,
        quantity,
        stockStatus,
      };
      setAvailableWeights([...availableWeights, newWeight]);
      setWeight("");
      setWeightMeasurment("");
      setWeightPrice("");
      setQuantity("");
      setStockStatus(true);
    }
  };

  const handleRemoveWeight = (index) => {
    setAvailableWeights(availableWeights.filter((_, i) => i !== index));
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

      images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      // For debugging:
      for (let [key, value] of formData.entries()) {
        if (key === "images") {
          console.log(`${key}:`, value.name);
        } else {
          console.log(`${key}:`, value);
        }
      }

      const result = await addGroceryProduct(formData);
      console.log("Product added successfully:", result);

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

  const PreviewContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(2),
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
  }));

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
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

      <Box sx={{ backgroundColor: "#ECF4EE", borderRadius: 2, p: 3 }}>
        <Grid container spacing={3}>
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
              <Select value={category} onChange={handleCategoryChange}>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

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

                    <Grid xs={3}></Grid>
                    


             <Grid item xs={6}>
              
            <FormControlLabel
              control={
                <Switch
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                />
              }
              label="Available"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isOfferProduct}
                  onChange={(e) => setIsOfferProduct(e.target.checked)}
                />
              }
              label="Offer Product"
            />
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
                    <Grid xs={3}></Grid>


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
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Weights & Stock
            </Typography>
          </Grid>

          {/* Add weight inputs */}
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Weight"
              variant="outlined"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Weight Measurment"
              variant="outlined"
              value={weightMeasurment}
              onChange={(e) => setWeightMeasurment(e.target.value)}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Weight Price"
              type="number"
              variant="outlined"
              value={weightPrice}
              onChange={(e) => setWeightPrice(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={2}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Grid>

          <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={stockStatus}
                  onChange={(e) => setStockStatus(e.target.checked)}
                  color="primary"
                />
              }
              label="In Stock"
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleAddWeight}>
              Add Weight
            </Button>
          </Grid>

          {/* List of added weights */}
          {availableWeights.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold">
                Added Weights:
              </Typography>
              {availableWeights.map((weightItem, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "#fff",
                    p: 1,
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Typography>
                    {weightItem.weight} {weightItem.weightMeasurment} | ₹{weightItem.weightPrice} | Qty: {weightItem.quantity} |{" "}
                    {weightItem.stockStatus ? "In Stock" : "Out of Stock"}
                  </Typography>
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => handleRemoveWeight(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Product Images
            </Typography>
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              accept="image/*"
            />
          </Grid>

          {images.length > 0 && (
            <Grid item xs={12}>
              <PreviewContainer>
                {images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={image instanceof File ? URL.createObjectURL(image) : image}
                      alt={`preview-${index}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      sx={{ position: "absolute", top: 0, right: 0 }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </PreviewContainer>
            </Grid>
          )}

       
        </Grid>
      </Box>
    </Box>
  );
};

export default AddGroceryProduct;
