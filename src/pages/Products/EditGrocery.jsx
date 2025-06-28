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
import { Trash2, Upload, Save, CircleX, Plus, CirclePlus } from "lucide-react";
import { updateGroceryProduct } from "../../services/allApi";
import { toast } from "react-toastify";

const EditProductModal = ({ open, onClose, product, onReload }) => {
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
  const [measurement, setMeasurement] = useState("Kg");
  const [availableWeights, setAvailableWeights] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (product) {
      setVendor(product.vendor ?? "");
      setCategory(product.category ?? "");
      setSubcategory(product.subcategory ?? "");
      setProductName(product.name ?? "");
      setProductDescription(product.description ?? "");
      setPrice(product.price ?? "");
      setDiscount(product.discount ?? "");
      setIsAvailable(product.is_available ?? true);
      setIsOfferProduct(product.is_offer_product ?? false);
      setIsPopularProduct(product.is_popular_product ?? false);
      setMeasurement(product.weight_measurement ?? "");

      if (Array.isArray(product.weights)) {
        setAvailableWeights(
          product.weights.map((w) => ({
            weight: w.weight?.replace(/[^\d.]/g, "") || "",
            weightPrice: w.price || "",
            quantity: w.quantity || "",
            stockStatus: w.is_in_stock ?? true,
          }))
        );
      }

      setImages(
        (product.images || []).map((img) => ({
          preview: img.image,
          id: img.id,
        }))
      );
    }
  }, [product]);

  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files);
    const previews = selected.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }));
    setImages([]);
    setNewImages(previews);
  };

  const removeImage = (index, isNew) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleWeightChange = (index, key, value) => {
    setAvailableWeights((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleSubmit = async () => {
    const formattedWeights = availableWeights.map((w) => ({
      weight: `${w.weight} ${measurement}`,
      price: w.weightPrice,
      quantity: w.quantity,
      is_in_stock: w.stockStatus,
    }));

    const formData = new FormData();
    formData.append("vendor", vendor);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("is_available", isAvailable);
    formData.append("is_offer_product", isOfferProduct);
    formData.append("is_popular_product", isPopularProduct);
    formData.append("weight_measurement", measurement);
    formData.append("weights", JSON.stringify(formattedWeights));
    newImages.forEach((img) => formData.append("images", img.file));

    try {
      const res = await updateGroceryProduct(formData, product.id);
      if (res.status === 200) {
        toast.success("Product Updated!");
        onReload();
        onClose();
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Grocery Product</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField fullWidth label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField fullWidth label="Discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Description" multiline rows={3} value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Measurement</InputLabel>
              <Select value={measurement} onChange={(e) => setMeasurement(e.target.value)} label="Measurement">
                <MenuItem value="Kg">Kg</MenuItem>
                <MenuItem value="g">g</MenuItem>
                <MenuItem value="L">L</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
                <MenuItem value="pcs">pcs</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button variant="containedSecondary" startIcon={<CirclePlus size={20} />} onClick={() => setAvailableWeights((prev) => [...prev, { weight: "", weightPrice: "", quantity: "", stockStatus: true }])}>
              Add Weight Variant
            </Button>
            {availableWeights.map((w, index) => (
              <Grid container spacing={1} key={index} sx={{ mt: 1 }}>
                <Grid item xs={3}><TextField fullWidth label="Weight" value={w.weight} onChange={(e) => handleWeightChange(index, "weight", e.target.value)} /></Grid>
                <Grid item xs={3}><TextField fullWidth label="Price" value={w.weightPrice} onChange={(e) => handleWeightChange(index, "weightPrice", e.target.value)} /></Grid>
                <Grid item xs={3}><TextField fullWidth label="Qty" value={w.quantity} onChange={(e) => handleWeightChange(index, "quantity", e.target.value)} /></Grid>
                <Grid item xs={2}>
                  <FormControlLabel control={<Switch checked={w.stockStatus} onChange={(e) => handleWeightChange(index, "stockStatus", e.target.checked)} />} label="In Stock" />
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={() => setAvailableWeights(prev => prev.filter((_, i) => i !== index))} color="error"><Trash2 size={18} /></IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Button component="label" variant="containedSecondary" startIcon={<Upload size={20} />}>
              Upload New Images
              <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
            </Button>
            <Box mt={3} display="flex" flexWrap="wrap" gap={1}>
              {[...images, ...newImages].map((img, index) => (
                <Box key={index} position="relative">
                  <img src={img.preview} alt={`img-${index}`} width={80} height={80} style={{ borderRadius: 6 }} />
                  <IconButton
                    size="medium"
                    color="error"
                    onClick={() => removeImage(index, Boolean(img.file))}
                    sx={{ position: "absolute", top: -6, right: -6, bgcolor: "#fff" }}
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControlLabel control={<Switch checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />} label="Available" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel control={<Switch checked={isOfferProduct} onChange={(e) => setIsOfferProduct(e.target.checked)} />} label="Offer Product" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel control={<Switch checked={isPopularProduct} onChange={(e) => setIsPopularProduct(e.target.checked)} />} label="Popular Product" />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" color="error" startIcon={<CircleX size={18} />}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" startIcon={<Save size={18} />}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
