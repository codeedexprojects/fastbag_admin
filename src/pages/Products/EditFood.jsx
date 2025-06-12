import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import {
  updateFoodProduct,
  viewCategory,
  viewsubCategory,
  viewVendors,
} from "../../services/allApi";

const EditFoodProductModal = ({ open, handleClose, product, onSave }) => {
  const [vendorList, setVendorList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isOfferProduct, setIsOfferProduct] = useState(false);
  const [isPopularProduct, setIsPopularProduct] = useState(false);

  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    loadVendors();
    loadCategories();
  }, []);

  const loadVendors = async () => {
    const res = await viewVendors();
    setVendorList(res);
  };

  const loadCategories = async () => {
    const res = await viewCategory();
    const filtered = res.filter((cat) => cat.store_type === 1); // Only food
    setCategories(filtered);
  };

  const loadSubcategories = async (categoryId) => {
    const res = await viewsubCategory(categoryId);
    setSubcategories(res);
  };

  useEffect(() => {
    if (product) {
      setVendor(product.vendor || "");
      setCategory(product.category || "");
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setOfferPrice(product.offer_price || "");
      setWholesalePrice(product.wholesale_price || "");
      setDiscount(product.discount || "");
      setIsAvailable(product.is_available ?? true);
      setIsOfferProduct(product.is_offer_product ?? false);
      setIsPopularProduct(product.is_popular_product ?? false);

      if (Array.isArray(product.variants)) {
        setVariants(
          product.variants.map((v) => ({
            name: v.name,
            price: v.price,
            is_in_stock: v.is_in_stock ?? true,
          }))
        );
      }

      const oldImages = (product.images || []).map((img) => ({
        preview: img.image,
        id: img.id,
      }));
      setImages(oldImages);
    }
  }, [product]);

  useEffect(() => {
    if (category) {
      loadSubcategories(category).then(() => {
        setSubcategory(product?.subcategory || "");
      });
    }
  }, [category]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages([]); // clear old
    setNewImages(previews);
  };

  const removeImage = (index, isNew) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleVariantChange = (index, key, value) => {
    setVariants((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { name: "", price: "", is_in_stock: true }]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("vendor", vendor);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("offer_price", offerPrice);
    formData.append("wholesale_price", wholesalePrice);
    formData.append("discount", discount);
    formData.append("is_available", isAvailable);
    formData.append("is_offer_product", isOfferProduct);
    formData.append("is_popular_product", isPopularProduct);
    formData.append("variants", JSON.stringify(variants));

    newImages.forEach((img) => {
      formData.append("image_files", img.file);
    });

    try {
      const res = await updateFoodProduct(formData, product.id);
      if (res.status === 200) {
        toast.success("Food product updated!");
        onSave();
        handleClose(); // ✅ Close modal on success
      }
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update product.");
    }
  };
  console.log(product)

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Food Product</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Vendor</InputLabel>
              <Select value={vendor} onChange={(e) => setVendor(e.target.value)}>
                {vendorList.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.business_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory("");
                }}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              >
                {subcategories.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Offer Price"
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Wholesale Price"
              type="number"
              value={wholesalePrice}
              onChange={(e) => setWholesalePrice(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              value={description}
              multiline
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="outlined" onClick={addVariant}>
              + Add Variant
            </Button>
            {variants.map((v, i) => (
              <Grid container spacing={1} alignItems="center" mt={1} key={i}>
                <Grid item xs={4}>
                  <TextField
                    label="Variant Name"
                    value={v.name}
                    onChange={(e) =>
                      handleVariantChange(i, "name", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Price"
                    type="number"
                    value={v.price}
                    onChange={(e) =>
                      handleVariantChange(i, "price", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={v.is_in_stock}
                        onChange={(e) =>
                          handleVariantChange(i, "is_in_stock", e.target.checked)
                        }
                      />
                    }
                    label="In Stock"
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => removeVariant(i)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Button component="label" variant="outlined">
              Upload New Images
              <input
                hidden
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            <Box mt={1} display="flex" gap={1} flexWrap="wrap">
              {images.map((img, index) => (
                <Box key={index} position="relative">
                  <img src={img.preview} width={80} height={80} alt="" />
                </Box>
              ))}
              {newImages.map((img, index) => (
                <Box key={index} position="relative">
                  <img src={img.preview} width={80} height={80} alt="" />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(index, true)}
                    style={{ position: "absolute", top: -8, right: -8 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFoodProductModal;
