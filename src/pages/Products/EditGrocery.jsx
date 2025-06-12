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
        const parsedWeights = product.weights.map((w) => ({
          weight: w.weight?.replace(/[^\d.]/g, "") || "",
          weightPrice: w.price || "",
          quantity: w.quantity || "",
          stockStatus: w.is_in_stock ?? true,
        }));
        setAvailableWeights(parsedWeights);
      }

      const initialImages = (product.images || []).map((img) => ({
        preview: img.image,
        id: img.id,
      }));
      setImages(initialImages);
    }
  }, [product]);

const handleImageChange = (e) => {
  const selected = Array.from(e.target.files);
  const newImagePreviews = selected.map((file) => ({
    preview: URL.createObjectURL(file),
    file,
  }));

  // Clear existing old images and set only the new ones
  setImages([]);
  setNewImages(newImagePreviews);
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

  const addWeightRow = () => {
    setAvailableWeights((prev) => [
      ...prev,
      { weight: "", weightPrice: "", quantity: "", stockStatus: true },
    ]);
  };

  const removeWeightRow = (index) => {
    setAvailableWeights((prev) => prev.filter((_, i) => i !== index));
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

    newImages.forEach((img) => {
      formData.append("images", img.file);
    });

    try {
      const res = await updateGroceryProduct(formData, product.id);
     if (res.status === 200) {
  toast.success("Product Updated!");

  const updated = res.data;
  setVendor(updated.vendor ?? "");
  setCategory(updated.category ?? "");
  setSubcategory(updated.subcategory ?? "");
  setProductName(updated.name ?? "");
  setProductDescription(updated.description ?? "");
  setPrice(updated.price ?? "");
  setDiscount(updated.discount ?? "");
  setIsAvailable(updated.is_available ?? true);
  setIsOfferProduct(updated.is_offer_product ?? false);
  setIsPopularProduct(updated.is_popular_product ?? false);
  setMeasurement(updated.weight_measurement ?? "");

  if (Array.isArray(updated.weights)) {
    const parsedWeights = updated.weights.map((w) => ({
      weight: w.weight?.replace(/[^\d.]/g, "") || "",
      weightPrice: w.price || "",
      quantity: w.quantity || "",
      stockStatus: w.is_in_stock ?? true,
    }));
    setAvailableWeights(parsedWeights);
  }

  const updatedImages = (updated.images || []).map((img) => ({
    preview: img.image,
    id: img.id,
  }));
  setImages(updatedImages);
  setNewImages([]);

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
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Grid>
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
              label="Discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Measurement</InputLabel>
              <Select
                value={measurement}
                onChange={(e) => setMeasurement(e.target.value)}
              >
                <MenuItem value="Kg">Kg</MenuItem>
                <MenuItem value="g">g</MenuItem>
                <MenuItem value="L">L</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
                <MenuItem value="pcs">pcs</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button onClick={addWeightRow} variant="outlined">
              + Add Weight Variant
            </Button>
            {availableWeights.map((w, index) => (
              <Grid container spacing={1} key={index} alignItems="center" sx={{ mt: 1 }}>
                <Grid item xs={3}>
                  <TextField
                    label="Weight"
                    value={`${w.weight} ${measurement}`}
                    onChange={(e) => {
                      const stripped = e.target.value.replace(measurement, "").trim();
                      handleWeightChange(index, "weight", stripped);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Price"
                    value={w.weightPrice}
                    onChange={(e) =>
                      handleWeightChange(index, "weightPrice", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Quantity"
                    value={w.quantity}
                    onChange={(e) =>
                      handleWeightChange(index, "quantity", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={w.stockStatus}
                        onChange={(e) =>
                          handleWeightChange(index, "stockStatus", e.target.checked)
                        }
                      />
                    }
                    label="In Stock"
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={() => removeWeightRow(index)} color="error">
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
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
              {images.map((img, index) => (
                <Box key={index} position="relative">
                  <img
                    src={img.preview}
                    alt={`img-${index}`}
                    width={80}
                    height={80}
                    style={{ borderRadius: 4 }}
                  />
                  {/* <IconButton
                    size="small"
                    onClick={() => removeImage(index, false)}
                    style={{ position: "absolute", top: -8, right: -8 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton> */}
                </Box>
              ))}
              {newImages.length > 0 &&
                newImages.map((img, index) => (
                  <Box key={`new-${index}`} position="relative">
                    <img
                      src={img.preview}
                      alt={`new-img-${index}`}
                      width={80}
                      height={80}
                      style={{ borderRadius: 4 }}
                    />
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

          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
