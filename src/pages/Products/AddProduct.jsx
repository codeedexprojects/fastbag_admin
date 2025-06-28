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
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { PlusCircle, ImageUp, Trash2, Save } from "lucide-react";
import {
  addFashionProduct,
  viewCategory,
  viewsubCategory,
  viewVendors,
  addImage_fashion,
} from "../../services/allApi";

// Styled file input
const Input = styled("input")({
  display: "none",
});

function AddFashionProduct() {
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
    colors: [],
  });

  const [imageFiles, setImageFiles] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorRes, categoryRes, subcategoryRes] = await Promise.all([
          viewVendors(),
          viewCategory(),
          viewsubCategory(),
        ]);
        setVendors(vendorRes.filter((v) => v.store_type === 3));
        setCategories(categoryRes.filter((c) => c.store_type === 3));
        setSubcategories(subcategoryRes);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleColorChange = (index, field, value) => {
    const updated = [...formData.colors];
    updated[index][field] = value;
    setFormData({ ...formData, colors: updated });
  };

  const handleSizeChange = (colorIndex, sizeIndex, field, value) => {
    const updated = [...formData.colors];
    updated[colorIndex].sizes[sizeIndex][field] = value;
    setFormData({ ...formData, colors: updated });
  };

  const addColor = () => {
    const newColor = {
      color_name: "",
      color_code: "",
      sizes: sizes.map((s) => ({ size: s, price: "", offer_price: "", stock: "" })),
    };
    setFormData((prev) => ({ ...prev, colors: [...prev.colors, newColor] }));
  };

  const removeColor = (index) => {
    const updated = [...formData.colors];
    updated.splice(index, 1);
    setFormData({ ...formData, colors: updated });
    const newImg = { ...imageFiles };
    delete newImg[index];
    setImageFiles(newImg);
    const newPrev = { ...previewImages };
    delete newPrev[index];
    setPreviewImages(newPrev);
  };

  const handleImageFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles((prev) => ({ ...prev, [index]: file }));
      setPreviewImages((prev) => ({ ...prev, [index]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      payload.colors = payload.colors.map((color) => ({
        ...color,
        sizes: color.sizes.filter((s) => s.price && s.offer_price && s.stock),
      }));
      const res = await addFashionProduct(payload);
      const productId = res.data.id;
      for (const file of Object.values(imageFiles)) {
        const fd = new FormData();
        fd.append("clothing", productId);
        fd.append("image", file);
        await addImage_fashion(fd);
      }
      alert("Product and images uploaded successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit product or images.");
    }
  };

  const selectedCategory = categories.find((c) => c.id === parseInt(formData.category_id));
  const filteredSubcategories = selectedCategory
    ? subcategories.filter((sc) => sc.category_name === selectedCategory.name)
    : [];

  return (
    <Box p={4} sx={{ background: "#F9FAFB", borderRadius: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Add Fashion Product
      </Typography>
      <form style={{padding:20,boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',borderRadius:10}} onSubmit={handleSubmit} sx>
        <Grid container spacing={3}>
          {/* Vendor & Category */}
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Vendor</InputLabel>
              <Select name="vendor" value={formData.vendor} onChange={handleChange}>
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>{v.business_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select name="category_id" value={formData.category_id} onChange={handleChange}>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Subcategory */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Subcategory</InputLabel>
              <Select
                name="subcategory_id"
                value={formData.subcategory_id}
                onChange={handleChange}
                disabled={!formData.category_id}
              >
                {filteredSubcategories.map((sc) => (
                  <MenuItem key={sc.id} value={sc.id}>{sc.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Product Name, Description */}
          <Grid item xs={6}>
            <TextField name="name" label="Product Name" value={formData.name} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField name="description" label="Description" multiline rows={3} value={formData.description} onChange={handleChange} fullWidth />
          </Grid>

          {/* Pricing */}
          <Grid item xs={4}><TextField name="wholesale_price" label="Wholesale Price" value={formData.wholesale_price} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={4}><TextField name="price" label="Price" value={formData.price} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={4}><TextField name="discount" label="Discount (%)" value={formData.discount} onChange={handleChange} fullWidth /></Grid>

          {/* Material & Gender */}
          <Grid item xs={6}><TextField name="material" label="Material" value={formData.material} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={6}>
            <Typography sx={{ mb: 1 }}>Gender</Typography>
            <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
              <FormControlLabel value="M" control={<Radio />} label="Men" />
              <FormControlLabel value="W" control={<Radio />} label="Women" />
              <FormControlLabel value="U" control={<Radio />} label="Unisex" />
              <FormControlLabel value="K" control={<Radio />} label="Kids" />
            </RadioGroup>
          </Grid>

          {/* Is Active */}
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />}
              label="Active"
            />
          </Grid>

          {/* Colors + Sizes */}
          <Grid item xs={12}><Typography variant="h6" fontWeight="bold">Colors & Sizes</Typography></Grid>
          {formData.colors.map((color, index) => (
            <Grid item xs={12} key={index}>
              <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}><TextField label="Color Name" value={color.color_name} onChange={(e) => handleColorChange(index, "color_name", e.target.value)} fullWidth /></Grid>
                  <Grid item xs={4}><TextField label="Color Code" value={color.color_code} onChange={(e) => handleColorChange(index, "color_code", e.target.value)} fullWidth /></Grid>
                  <Grid item xs={2}>
                    <label htmlFor={`upload-image-${index}`}>
                      <Input id={`upload-image-${index}`} type="file" accept="image/*" onChange={(e) => handleImageFileChange(e, index)} />
                      <Button variant="containedSecondary" component="span" startIcon={<ImageUp size={20} />}>
                        Upload
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton color="error" onClick={() => removeColor(index)}>
                      <Trash2 size={20} />
                    </IconButton>
                  </Grid>
                </Grid>

                {previewImages[index] && (
                  <Box mt={1}><img src={previewImages[index]} alt="" style={{ width: 100, height: 100, borderRadius: 8 }} /></Box>
                )}

                {color.sizes.map((s, sIdx) => (
                  <Grid container spacing={1} mt={1} key={sIdx}>
                    <Grid item xs={2}><Typography>{s.size}</Typography></Grid>
                    <Grid item xs={3}><TextField label="Price" type="number" value={s.price} onChange={(e) => handleSizeChange(index, sIdx, "price", e.target.value)} fullWidth /></Grid>
                    <Grid item xs={3}><TextField label="Offer Price" type="number" value={s.offer_price} onChange={(e) => handleSizeChange(index, sIdx, "offer_price", e.target.value)} fullWidth /></Grid>
                    <Grid item xs={3}><TextField label="Stock" type="number" value={s.stock} onChange={(e) => handleSizeChange(index, sIdx, "stock", e.target.value)} fullWidth /></Grid>
                  </Grid>
                ))}
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="containedSecondary" startIcon={<PlusCircle size={20} />} onClick={addColor}>
              Add Color
            </Button>
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Button variant="contained" startIcon={<Save size={20} />} color="primary" type="submit">
              Submit Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default AddFashionProduct;
