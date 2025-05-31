import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem, Avatar,
  FormControlLabel, Switch, Grid, RadioGroup, Radio,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateGroceryProduct, viewCategory, viewsubCategory, viewVendors } from '../../services/allApi';

const EditGroceryProductModal = ({ open, onClose, productData, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    offer_price: '',
    discount: '',
    category: '',
    subcategory: '',
    vendor: '',
    weight_measurement: '',
    is_available: true,
    is_offer_product: false,
    is_popular_product: false,
    weights: [],
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [availableWeights, setAvailableWeights] = useState([]);

  // Fetch categories, subcategories, and vendors on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const categories = await viewCategory();
        const vendors = await viewVendors();
        const subcategoryData = await viewsubCategory();
        setCategories(categories);
        setVendors(vendors);

        // Flatten the subcategories data
        if (subcategoryData) {
          const allSubcategories = [
            ...subcategoryData.clothing_subcategories,
            ...subcategoryData.grocery_subcategories,
            ...subcategoryData.food_subcategories,
          ];
          setSubCategories(allSubcategories);
        } else {
          console.error('Subcategories API response is invalid:', subcategoryData);
          setSubCategories([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setSubCategories([]); // Handle errors gracefully
      }
    }
    fetchData();
  }, []);

  // Initialize formData and states when productData changes
  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || '',
        offer_price: productData.offer_price || '',
        discount: productData.discount || '',
        category: productData.category || '',
        subcategory: productData.sub_category || '',
        vendor: productData.vendor || '',
        weight_measurement: productData.weight_measurement || '',
        is_available: productData.Available ?? true,
        is_offer_product: productData.is_offer_product ?? false,
        is_popular_product: productData.is_popular_product ?? false,
        weights: productData.weights || [],
        images: productData.images || [],
      });

      // Set category and subcategory states
      setCategory(productData.category || "");
      setSubcategory(productData.sub_category || "");

      // Set available weights
      setAvailableWeights(productData.weights || []);
    }
  }, [productData]);

  // Filter subcategories based on selected category
  useEffect(() => {
    if (category && Array.isArray(subcategories)) {
      const filtered = subcategories.filter(sc => sc.category === category);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [category, subcategories]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSubcategory(""); // Reset subcategory when category changes
  };

  const handleSubcategoryChange = (e) => {
    const selectedSubcategory = e.target.value;
    setSubcategory(selectedSubcategory);
    setFormData((prev) => ({
      ...prev,
      subcategory: selectedSubcategory,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleAddWeight = () => {
    if (formData.weight && formData.price && formData.quantity && formData.weight_measurement) {
      const newWeight = {
        weight: formData.weight,
        weight_measurement: formData.weight_measurement,
        price: formData.price,
        quantity: formData.quantity,
        stockStatus: formData.stockStatus,
      };
      setAvailableWeights([...availableWeights, newWeight]);
      setFormData((prev) => ({
        ...prev,
        weight: "",
        price: "",
        quantity: "",
        stockStatus: true,
      }));
    }
  };

  const handleRemoveWeight = (index) => {
    const updatedWeights = availableWeights.filter((_, i) => i !== index);
    setAvailableWeights(updatedWeights);
  };

  const handleSave = async () => {
    try {
      const updatedFormData = new FormData();
      updatedFormData.append("vendor", formData.vendor);
      updatedFormData.append("category", formData.category);
      updatedFormData.append("sub_category", formData.subcategory);
      updatedFormData.append("name", formData.name);
      updatedFormData.append("description", formData.description);
      updatedFormData.append("price", formData.price);
      updatedFormData.append("offer_price", formData.offer_price || '');
      updatedFormData.append("discount", formData.discount || '');
      updatedFormData.append("weight_measurement", formData.weight_measurement);
      updatedFormData.append("is_available", formData.is_available ? 'true' : 'false');
      updatedFormData.append("is_offer_product", formData.is_offer_product ? 'true' : 'false');
      updatedFormData.append("is_popular_product", formData.is_popular_product ? 'true' : 'false');
      updatedFormData.append("weights", JSON.stringify(availableWeights));

      // Append only new images (file objects)
      newImages.forEach((image) => {
        updatedFormData.append("images", image);
      });

      const response = await updateGroceryProduct(updatedFormData, productData.id);
      onSave(response);
      onClose();
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Edit Product</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form Fields */}
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
              <Select
                name="vendor"
                value={formData.vendor || ""}
                onChange={handleChange}
              >
                {vendors.map((ven) => (
                  <MenuItem key={ven.id} value={ven.id}>
                    {ven.business_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category || ""}
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
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={subcategory || ""}
                onChange={handleSubcategoryChange}
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
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
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
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Offer Price"
              name="offer_price"
              value={formData.offer_price}
              onChange={handleChange}
              fullWidth
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Discount (%)"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              fullWidth
              type="number"
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
                  checked={formData.is_available}
                  onChange={handleToggle}
                  name="is_available"
                  color="primary"
                />
              }
              label="Available"
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_offer_product}
                  onChange={handleToggle}
                  name="is_offer_product"
                />
              }
              label="Offer Product"
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_popular_product}
                  onChange={handleToggle}
                  name="is_popular_product"
                />
              }
              label="Popular Product"
            />
          </Grid>

          {/* Weight Measurement */}
          <Grid item xs={12}>
            <TextField
              label="Weight Measurement"
              name="weight_measurement"
              value={formData.weight_measurement}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Weights */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Available Weights
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <TextField
                  label="Weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={formData.stockStatus ? "true" : "false"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stockStatus: e.target.value === "true",
                      }))
                    }
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="In Stock"
                    />
                    <FormControlLabel
                      value="false"
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
                      Weight: {item.weight} {formData.weight_measurement}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Price: {item.price}</Typography>
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
            <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
              {formData.images.map((image, index) => (
                <Box key={index} position="relative">
                  <Avatar
                    src={image.image}
                    alt={`Product Image ${index + 1}`}
                    sx={{ width: 75, height: 75, objectFit: "cover" }}
                  />
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={() => handleImageRemove(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {newImages.map((file, index) => (
                <Avatar
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`New Image ${index + 1}`}
                  sx={{ width: 75, height: 75 }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Save and Cancel Buttons */}
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditGroceryProductModal;