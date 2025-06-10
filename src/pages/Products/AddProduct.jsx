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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  addFashionProduct,
  viewCategory,
  viewsubCategory,
  viewVendors,
  addImage_fashion,
} from "../../services/allApi";

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
    colors: [], // each with: { color_name, color_code, sizes: [{ size, price, offer_price, stock }] }
  });

  const [imageFiles, setImageFiles] = useState({}); // { colorIndex: File }
  const [previewImages, setPreviewImages] = useState({}); // { colorIndex: ObjectURL }

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
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
  }, []);

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

    const newImageFiles = { ...imageFiles };
    delete newImageFiles[index];
    setImageFiles(newImageFiles);

    const newPreviews = { ...previewImages };
    delete newPreviews[index];
    setPreviewImages(newPreviews);
  };

  const handleImageFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles((prev) => ({
        ...prev,
        [index]: file,
      }));
      setPreviewImages((prev) => ({
        ...prev,
        [index]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Filter sizes with valid data
      const payload = { ...formData };
      payload.colors = payload.colors.map((color) => ({
        ...color,
        sizes: color.sizes.filter(
          (size) =>
            size.price !== "" && size.offer_price !== "" && size.stock !== ""
        ),
      }));

      // 1) Create the product
      const res = await addFashionProduct(payload);
      const productId = res.data.id;
      console.log(res)

      // 2) Upload images with only clothing and image fields
      for (const file of Object.values(imageFiles)) {
        const formDataImg = new FormData();
        formDataImg.append("clothing", productId);
        formDataImg.append("image", file);

       const res2= await addImage_fashion(formDataImg);
       console.log(res2)
      }

      alert("Product and images uploaded successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit product or upload images.");
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === parseInt(formData.category_id)
  );
  const filteredSubcategories = selectedCategory
    ? subcategories.filter((sc) => sc.category_name === selectedCategory.name)
    : [];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Add Fashion Product
      </Typography>
      <form onSubmit={handleSubmit}>
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

                {/* Image upload */}
                <Box mt={2} mb={2}>
                  <Input
                    accept="image/*"
                    id={`color-image-upload-${index}`}
                    type="file"
                    onChange={(e) => handleImageFileChange(e, index)}
                  />
                  <label htmlFor={`color-image-upload-${index}`}>
                    <Button variant="contained" component="span">
                      Upload Color Image
                    </Button>
                  </label>
                  {previewImages[index] && (
                    <Box mt={1}>
                      <img
                        src={previewImages[index]}
                        alt={`Color Preview ${index}`}
                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                      />
                    </Box>
                  )}
                </Box>

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

          {/* Submit */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Submit Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default AddFashionProduct;  