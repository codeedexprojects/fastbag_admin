import React, { useEffect, useState } from "react";
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
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ImageUp, Trash2, CirclePlus, Save } from "lucide-react";
import { addProduct, viewCategory, viewsubCategory, viewVendors } from "../../services/allApi";

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
  const [discount, setDiscount] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isOfferProduct, setIsOfferProduct] = useState(false);
  const [isPopularProduct, setIsPopularProduct] = useState(false);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [variants, setVariants] = useState([{ name: "", price: "", is_in_stock: true }]);

  useEffect(() => {
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
        alert("Failed to load data. Please refresh the page.");
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    const filtered = subcategories.filter((sc) => sc.category === selectedCategory);
    setFilteredSubcategories(filtered);
    setSubcategory("");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { name: "", price: "", is_in_stock: true }]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length > 1) {
      const updated = variants.filter((_, i) => i !== index);
      setVariants(updated);
    }
  };

  const handleSubmit = async () => {
    if (!vendor || !category || !subcategory || !productName) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("vendor", vendor);  // Changed back to 'vendor'
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("is_available", isAvailable);
    formData.append("is_offer_product", isOfferProduct);
    formData.append("is_popular_product", isPopularProduct);
    images.forEach((image) => formData.append("image_files", image));
    formData.append("variants", JSON.stringify(variants));

    // Debug: Log what we're sending
    console.log("Form Data being sent:");
    console.log("vendor:", vendor);
    console.log("category:", category);
    console.log("subcategory:", subcategory);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await addProduct(formData);
      console.log("Response:", response);
      alert("Product added successfully");
      // Reset form
      setVendor("");
      setCategory("");
      setSubcategory("");
      setProductName("");
      setDescription("");
      setPrice("");
      setDiscount("");
      setIsAvailable(true);
      setIsOfferProduct(false);
      setIsPopularProduct(false);
      setImages([]);
      setFilteredSubcategories([]);
      setVariants([{ name: "", price: "", is_in_stock: true }]);
    } catch (error) {
      console.error("Failed to add product:", error);
      console.error("Error details:", error.response?.data);
      alert("Error adding product: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Add Food Product
      </Typography>

      <Box 
        sx={{ 
          backgroundColor: "#fff", 
          borderRadius: 2, 
          p: 3,
          boxShadow: "0 1px 10px rgba(0, 0, 0, 0.1)" 
        }}
      >
        <Grid container spacing={3}>
          {/* Vendor / Category / Subcategory */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Vendor</InputLabel>
              <Select value={vendor} onChange={(e) => setVendor(e.target.value)} label="Vendor">
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
              <InputLabel>Category</InputLabel>
              <Select value={category} onChange={handleCategoryChange} label="Category">
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
                disabled={filteredSubcategories.length === 0}
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

          {/* Product Info */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          {/* Pricing */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Discount (%)"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </Grid>

          {/* Toggles */}
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={<Switch checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />}
              label="Available"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={<Switch checked={isOfferProduct} onChange={(e) => setIsOfferProduct(e.target.checked)} />}
              label="Offer Product"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={<Switch checked={isPopularProduct} onChange={(e) => setIsPopularProduct(e.target.checked)} />}
              label="Popular Product"
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ImageUp size={20} />}
              component="label"
              sx={{ borderRadius: 2 }}
            >
              Upload Images
              <input hidden multiple accept="image/*" type="file" onChange={handleImageUpload} />
            </Button>
            <PreviewContainer>
              {images.map((img, idx) => (
                <Box key={idx} position="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview ${idx + 1}`}
                    style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveImage(idx)}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      bgcolor: "white",
                      boxShadow: 1,
                      "&:hover": {
                        bgcolor: "white",
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              ))}
            </PreviewContainer>
          </Grid>

          {/* Variants */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Variants
            </Typography>
            {variants.map((variant, idx) => (
              <Grid container spacing={2} key={idx} alignItems="center" mb={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Variant Name"
                    value={variant.name}
                    onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                  />
                </Grid>
                <Grid item xs={10} sm={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={variant.is_in_stock}
                        onChange={(e) =>
                          handleVariantChange(idx, "is_in_stock", e.target.checked)
                        }
                      />
                    }
                    label="In Stock"
                  />
                </Grid>
                <Grid item xs={2} sm={2}>
                  <IconButton 
                    color="error" 
                    onClick={() => handleRemoveVariant(idx)}
                    disabled={variants.length === 1}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              startIcon={<CirclePlus size={18} />}
              onClick={handleAddVariant}
              sx={{ mt: 1 }}
              variant="outlined"
              color="secondary"
            >
              Add Variant
            </Button>
          </Grid>

          {/* Submit */}
          <Grid item xs={12} textAlign="right">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save size={18} />}
              onClick={handleSubmit}
              size="large"
            >
              Submit Product
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AddFoodProduct;