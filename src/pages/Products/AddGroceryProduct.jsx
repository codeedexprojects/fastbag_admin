import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addGroceryProduct,
  viewCategory,
  viewsubCategory,
  viewVendors,
} from "../../services/allApi";
import { useNavigate } from "react-router-dom";
import { CirclePlus, CircleX, ImageUp } from "lucide-react";

const AddGroceryProduct = () => {
  const [images, setImages] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isOfferProduct, setIsOfferProduct] = useState(false);
  const [isPopularProduct, setIsPopularProduct] = useState(false);
  const [measurement, setMeasurement] = useState("");

  // Weight & stock management fields
  const [weight, setWeight] = useState("");
  const [weightPrice, setWeightPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stockStatus, setStockStatus] = useState(true);
  const [availableWeights, setAvailableWeights] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const imagePreviewsRef = useRef([]);
  const nav = useNavigate();

  useEffect(() => {
    // Fetch vendors, categories and subcategories on mount
    const fetchData = async () => {
      try {
        const [vendorsData, categoriesData, subcategoriesData] = await Promise.all([
          viewVendors(),
          viewCategory(),
          viewsubCategory(),
        ]);
        
        // Set all vendors (removed store_type filter)
        setVendors(vendorsData || []);
        
        // Handle categories - check if it has results array (paginated) or direct array
        const categoryList = categoriesData?.results || categoriesData || [];
        setCategories(categoryList);
        
        // Set subcategories
        setSubcategories(subcategoriesData || []);
      } catch (error) {
        console.error("Error loading data:", error);
        setErrorMsg("Failed to load vendors/categories data.");
      }
    };
    fetchData();

    // Cleanup image URLs on unmount
    return () => {
      imagePreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  console.log(vendors);

  // Update filtered subcategories when category changes
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    setFilteredSubcategories(subcategories.filter((sc) => sc.category === selected));
    setSubcategory("");
  };

  // Add weight & stock entry
  const handleAddWeight = () => {
    if (!weight || !weightPrice || !quantity) {
      setErrorMsg("Please fill all weight, price, and quantity fields.");
      return;
    }
    setAvailableWeights((prev) => [
      ...prev,
      { weight, weightPrice, quantity, stockStatus },
    ]);
    setWeight("");
    setWeightPrice("");
    setQuantity("");
    setStockStatus(true);
    setErrorMsg("");
  };

  // Remove weight entry by index
  const handleRemoveWeight = (index) => {
    setAvailableWeights((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle image upload and generate preview URLs
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Avoid duplicate filenames
    const filteredNewFiles = files.filter(
      (file) => !images.some((img) => img.file.name === file.name)
    );

    const newPreviews = filteredNewFiles.map((file) => {
      const url = URL.createObjectURL(file);
      imagePreviewsRef.current.push(url);
      return { file, preview: url };
    });

    setImages((prev) => [...prev, ...newPreviews]);
  };

  // Remove image and revoke URL
  const handleRemoveImage = (index) => {
    const removed = images[index];
    if (removed.preview) {
      URL.revokeObjectURL(removed.preview);
      imagePreviewsRef.current = imagePreviewsRef.current.filter(
        (url) => url !== removed.preview
      );
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset form fields to initial
  const resetFormFields = () => {
    setVendor("");
    setCategory("");
    setSubcategory("");
    setProductName("");
    setProductDescription("");
    setPrice("");
    setDiscount("");
    setIsAvailable(true);
    setIsOfferProduct(false);
    setIsPopularProduct(false);
    setMeasurement("");
    setAvailableWeights([]);
    imagePreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    imagePreviewsRef.current = [];
    setImages([]);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleWeightChange = (e) => {
    const val = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(val)) {
      setWeight(val);
    }
  };

  // Submit form data
  const handleSubmit = async () => {
    if (!vendor || !category || !productName || !price) {
      setErrorMsg(
        "Please fill all required fields: Vendor, Category, Product Name, and Price."
      );
      setSuccessMsg("");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      formData.append("vendor", vendor);
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("Available", isAvailable);
      formData.append("is_offer_product", isOfferProduct);
      formData.append("is_popular_product", isPopularProduct);
      formData.append("weight_measurement", measurement);

      // Convert array to desired object format
      const weights = availableWeights.map((item) => ({
        price: parseFloat(item.weightPrice),
        weight: `${item.weight}${measurement}`,
        quantity: parseInt(item.quantity),
        is_in_stock: item.stockStatus,
      }));

      formData.append("weights", JSON.stringify(weights));

      // Attach image files
      images.forEach((imgObj) => {
        if (imgObj.file instanceof File) {
          formData.append("images", imgObj.file);
        }
      });

      // Debug: Log form data
      console.log("Form Data being sent:");
      console.log("vendor:", vendor);
      console.log("category:", category);
      console.log("subcategory:", subcategory);
      
      const formDataObject = {};
      formData.forEach((value, key) => {
        if (formDataObject[key]) {
          if (!Array.isArray(formDataObject[key])) {
            formDataObject[key] = [formDataObject[key]];
          }
          formDataObject[key].push(value);
        } else {
          formDataObject[key] = value;
        }
      });
      console.log("FormData contents:", formDataObject);

      const res = await addGroceryProduct(formData);
      console.log("Response:", res);
      setSuccessMsg("Product added successfully!");
      resetFormFields();
    } catch (error) {
      console.error("Submit error:", error);
      console.error("Error details:", error.response?.data);
      setErrorMsg(
        "Failed to submit product: " + (error.response?.data?.detail || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Styled container for image previews
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
          <Button
            variant="outlined"
            color="error"
            startIcon={<CircleX />}
            sx={{ mr: 2 }}
            onClick={resetFormFields}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CirclePlus />}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </Box>
      </Box>

      {errorMsg && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Typography>
      )}
      {successMsg && (
        <Typography color="success.main" sx={{ mb: 2 }}>
          {successMsg}
        </Typography>
      )}

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          boxShadow: "0 1px 10px rgba(0, 0, 0, 0.1)",
          p: 3,
        }}
      >
        <Grid container spacing={3}>
          {/* General Info */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold">
              General Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Vendor *</InputLabel>
              <Select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                disabled={loading}
                label="Vendor *"
              >
                {vendors.length === 0 ? (
                  <MenuItem disabled value="">
                    No vendors available
                  </MenuItem>
                ) : (
                  vendors.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.business_name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select
                value={category}
                onChange={handleCategoryChange}
                disabled={loading}
                label="Category *"
              >
                {categories.length === 0 ? (
                  <MenuItem disabled value="">
                    No categories available
                  </MenuItem>
                ) : (
                  categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                disabled={filteredSubcategories.length === 0 || loading}
                label="Subcategory"
              >
                {filteredSubcategories.length === 0 ? (
                  <MenuItem disabled value="">
                    No subcategories available
                  </MenuItem>
                ) : (
                  filteredSubcategories.map((sc) => (
                    <MenuItem key={sc.id} value={sc.id}>
                      {sc.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Name *"
              variant="outlined"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              disabled={loading}
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
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Available"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isOfferProduct}
                  onChange={(e) => setIsOfferProduct(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Offer Product"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isPopularProduct}
                  onChange={(e) => setIsPopularProduct(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Popular Product"
            />
          </Grid>

          {/* Pricing */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Price *"
              type="number"
              variant="outlined"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Measurement</InputLabel>
              <Select
                value={measurement}
                onChange={(e) => setMeasurement(e.target.value)}
                disabled={loading}
                label="Measurement"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="mg">mg</MenuItem>
                <MenuItem value="l">l</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
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
              disabled={loading}
            />
          </Grid>

          {/* Weight & Stock */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold">
              Weights & Stock
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Weight"
              value={weight}
              onChange={handleWeightChange}
              disabled={loading}
              placeholder="Enter weight"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{measurement}</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Weight Price"
              type="number"
              value={weightPrice}
              onChange={(e) => setWeightPrice(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={stockStatus}
                  onChange={(e) => setStockStatus(e.target.checked)}
                  disabled={loading}
                />
              }
              label="In Stock"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              startIcon={<CirclePlus />}
              onClick={handleAddWeight}
              disabled={loading}
              fullWidth
            >
              Add Weight
            </Button>
          </Grid>

          {availableWeights.map((item, i) => (
            <Grid item xs={12} key={i}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  background: "#f5f5f5",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography sx={{ flex: 1 }}>
                  {item.weight}{measurement} | ₹{item.weightPrice} | Qty: {item.quantity} |{" "}
                  {item.stockStatus ? "In Stock" : "Out of Stock"}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveWeight(i)}
                  disabled={loading}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}

          {/* Images */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Product Images
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              component="label"
              startIcon={<ImageUp size={20} />}
              disabled={loading}
            >
              Upload Images
              <input
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
          </Grid>

          {images.length > 0 && (
            <Grid item xs={12}>
              <PreviewContainer>
                {images.map((imgObj, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      borderRadius: 1,
                      overflow: "hidden",
                      boxShadow: 1,
                    }}
                  >
                    <img
                      src={imgObj.preview}
                      alt={`preview-${i}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      sx={{ position: "absolute", top: 2, right: 2, bgcolor: "#fff" }}
                      onClick={() => handleRemoveImage(i)}
                      disabled={loading}
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