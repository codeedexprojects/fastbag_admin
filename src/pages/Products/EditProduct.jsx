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
  RadioGroup,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  viewCategory,
  viewsubCategory,
  viewVendors,
  // add your update API import here
  updateFashionProduct,
  updateProduct,
} from "../../services/allApi";
import { toast } from "react-toastify";

const Input = styled("input")({
  display: "none",
});

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

function EditFashionProductModal({ product, open, onClose, onUpdated }) {
  // Initialize form state from passed product prop
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    vendor: "",
    category_id: "",
    subcategory_id: "",
    name: "",
    description: "",
    gender: "",
    wholesale_price: "",
    price: "",
    discount: "",
    material: "",
    is_active: true,
    colors: [], // colors with sizes
  });

  useEffect(() => {
    // Fetch vendors, categories, subcategories once modal opens
    if (open) {
      const fetchData = async () => {
        try {
          const vendorRes = await viewVendors();
          const categoryRes = await viewCategory();
          const subcategoryRes = await viewsubCategory();
          setVendors(vendorRes.filter((v) => v.store_type === 3));
          setCategories(categoryRes.filter((c) => c.store_type === 3));
          setSubcategories(subcategoryRes);
        } catch (err) {
          console.error("Error fetching data", err);
        }
      };
      fetchData();
    }
  }, [open]);
  

  useEffect(() => {
    if (product) {
      setFormData({
        vendor: product.vendor || "",
        category_id: product.categoryid || "",
        subcategory_id: product.subcategoryid || "",
        name: product.name || "",
        description: product.description || "",
        gender: product.gender || "",
        wholesale_price: product.wholesale_price || "",
        price: product.price || "",
        discount: product.discount || "",
        material: product.material || "",
        is_active: product.is_active !== undefined ? product.is_active : true,
        colors:
          product.colors?.map((color) => ({
            color_name: color.color_name || "",
            color_code: color.color_code || "",
            sizes: sizes.map((size) => {
              // Find matching size details or default empty
              const sizeData =
                color.sizes?.find((s) => s.size === size) || {};
              return {
                size,
                price: sizeData.price || "",
                offer_price: sizeData.offer_price || "",
                stock: sizeData.stock || "",
              };
            }),
          })) || [],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleColorChange = (index, field, value) => {
    const updatedColors = [...formData.colors];
    updatedColors[index][field] = value;
    setFormData({ ...formData, colors: updatedColors });
  };

  const handleSizeChange = (colorIndex, sizeIndex, field, value) => {
    const updatedColors = [...formData.colors];
    updatedColors[colorIndex].sizes[sizeIndex][field] = value;
    setFormData({ ...formData, colors: updatedColors });
  };

  const addColor = () => {
    const newColor = {
      color_name: "",
      color_code: "",
      sizes: sizes.map((size) => ({
        size,
        price: "",
        offer_price: "",
        stock: "",
      })),
    };
    setFormData((prev) => ({ ...prev, colors: [...prev.colors, newColor] }));
  };

  const removeColor = (index) => {
    const updatedColors = [...formData.colors];
    updatedColors.splice(index, 1);
    setFormData({ ...formData, colors: updatedColors });
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === parseInt(formData.category_id)
  );
  const filteredSubcategories = selectedCategory
    ? subcategories.filter((sc) => sc.category_name === selectedCategory.name)
    : [];

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Clean and structure colors
    const cleanedColors = formData.colors.map((color) => ({
      color_name: color.color_name,
      color_code: color.color_code,
      sizes: color.sizes
        .filter(
          (size) =>
            size.price !== "" &&
            size.offer_price !== "" &&
            size.stock !== ""
        )
        .map((size) => ({
          size: size.size,
          price: size.price,
          offer_price: size.offer_price,
          stock: size.stock,
        })),
    }));

    // Construct JSON payload
    const payload = {
      vendor: formData.vendor,
      category_id: formData.category_id,
      subcategory_id: formData.subcategory_id,
      name: formData.name,
      description: formData.description,
      gender: formData.gender,
      wholesale_price: formData.wholesale_price,
      price: formData.price,
      discount: formData.discount,
      material: formData.material,
      is_active: formData.is_active,
      colors: cleanedColors,
    };

    // Submit via API with JSON
    const res = await updateProduct(product.id, payload);

    console.log("Update response:", res);
    toast.success("Product updated successfully!");
    if (onUpdated) onUpdated();
    onClose();
onUpdated()
  } catch (err) {
    console.error("Update error:", err);
    toast.error("Failed to update product.");
  }
};

//   console.log(product)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Fashion Product</DialogTitle>
      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Vendor */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Vendor</InputLabel>
                <Select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                >
                  {vendors.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.business_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Subcategory */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  name="subcategory_id"
                  value={formData.subcategory_id}
                  onChange={handleChange}
                  disabled={!formData.category_id}
                >
                  {filteredSubcategories.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
            </Grid>

            {/* Prices */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Wholesale Price"
                name="wholesale_price"
                value={formData.wholesale_price}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Discount and Material */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Discount (%)"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Material"
                name="material"
                value={formData.material}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12}>
              <Typography>Gender</Typography>
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <FormControlLabel value="M" control={<Radio />} label="Men" />
                <FormControlLabel value="W" control={<Radio />} label="Women" />
                <FormControlLabel value="U" control={<Radio />} label="Unisex" />
                <FormControlLabel value="K" control={<Radio />} label="Kids" />
              </RadioGroup>
            </Grid>

            {/* Active Toggle */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                  />
                }
                label="Is Active"
              />
            </Grid>

            {/* Colors Section */}
            <Grid item xs={12}>
              <Typography variant="h6">Colors</Typography>
              {formData.colors.map((color, index) => (
                <Box
                  key={index}
                  mb={3}
                  p={2}
                  border="1px solid #ccc"
                  borderRadius={2}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <TextField
                        label="Color Name"
                        value={color.color_name}
                        onChange={(e) =>
                          handleColorChange(index, "color_name", e.target.value)
                        }
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={10} sm={5}>
                      <TextField
                        label="Color Code"
                        value={color.color_code}
                        onChange={(e) =>
                          handleColorChange(index, "color_code", e.target.value)
                        }
                        fullWidth
                        required
                        placeholder="#FFFFFF"
                      />
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeColor(index)}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>

                  {/* Sizes inputs */}
                  <Typography variant="subtitle1" mt={2} mb={1}>
                    Sizes & Prices
                  </Typography>
                  {color.sizes.map((size, sIdx) => (
                    <Grid
                      container
                      spacing={1}
                      key={sIdx}
                      alignItems="center"
                      mb={1}
                    >
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body2">{size.size}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Price"
                          value={size.price}
                          onChange={(e) =>
                            handleSizeChange(index, sIdx, "price", e.target.value)
                          }
                          fullWidth
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Offer Price"
                          value={size.offer_price}
                          onChange={(e) =>
                            handleSizeChange(
                              index,
                              sIdx,
                              "offer_price",
                              e.target.value
                            )
                          }
                          fullWidth
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Stock"
                          value={size.stock}
                          onChange={(e) =>
                            handleSizeChange(index, sIdx, "stock", e.target.value)
                          }
                          fullWidth
                          type="number"
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Box>
              ))}
              <Button variant="outlined" onClick={addColor}>
                Add Color
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditFashionProductModal;
