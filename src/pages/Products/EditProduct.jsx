import React, { useState, useEffect } from 'react';
import {Modal,Box,Typography,TextField,Button,IconButton,FormControl,InputLabel,Select,MenuItem,Avatar,ListItemText,Checkbox,
    FormControlLabel,Switch,Grid,} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateProduct, viewCategory, viewColours, viewsubCategory, viewVendors } from '../../services/allApi';

const EditProductModal = ({ open, onClose, productData, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        category: '',
        subcategory: '',
        color: '',
        material: '',
        stock: '',
        vendor: '',
        images: [], 
        is_active: true,
    });

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [colors, setColors] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [size, setSize] = useState("");
    const [quantity, setQuantity] = useState("");


    const SIZE_CHOICES = [
        { value: "XS", label: "Extra Small" },
        { value: "S", label: "Small" },
        { value: "M", label: "Medium" },
        { value: "L", label: "Large" },
        { value: "XL", label: "Extra Large" },
        { value: "XXL", label: "2x Large" },
    ];


 useEffect(() => {
    async function fetchData() {
        try {
            const categories = await viewCategory();
            const vendors = await viewVendors();
            const subcategoryData = await viewsubCategory();
            const colors = await viewColours();

            setCategories(categories);
            setVendors(vendors);
            setColors(colors);

            // Ensure subcategories is an array
            if (Array.isArray(subcategoryData)) {
                setSubCategories(subcategoryData);
            } else {
                console.error('Subcategories API did not return an array:', subcategoryData);
                setSubCategories([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setSubCategories([]); // Handle errors gracefully
        }
    }
    fetchData();
}, []);


    useEffect(() => {
        if (productData) {
            setFormData({
                name: productData.name || '',
                description: productData.description || '',
                price: productData.price || '',
                discount: productData.discount || '',
                category: productData.category?.id || productData.category || '',
                subcategory: productData.subcategory?.id || productData.subcategory || '',
                color: productData.colors?.map((color) => color.id) || [], // Use IDs for multiple colors
                stock: productData.stock || '',
                material: productData.material || '',
                vendor: productData.vendor?.id || productData.vendor || '',
                images: productData.images || [],
                is_active: productData.is_active ?? true,
            });
            setAvailableSizes(productData.available_sizes || []);
        }
    }, [productData]);

    const handleAddSize = () => {
        if (size && quantity && SIZE_CHOICES.some((choice) => choice.value === size)) {
            setAvailableSizes((prev) => [...prev, { size, quantity: parseInt(quantity, 10) }]);
            setSize("");
            setQuantity("");
        } else {
            alert("Please select a valid size and provide a quantity.");
        }
    };

    const handleRemoveSize = (index) => {
        setAvailableSizes((prev) => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle is_active toggle
    const handleToggle = (e) => {
        setFormData((prev) => ({
            ...prev,
            is_active: e.target.checked,
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

    const handleSave = async () => {
        try {
            const updatedProduct = {
                ...formData,
                available_sizes: availableSizes, // Include available sizes
                newImages, // Handle new images
            };
            const response = await updateProduct(updatedProduct, productData.id);
            onSave(response); // Notify parent component with updated product
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
                    maxWidth: 600,
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
                <Box display="flex" flexDirection="column" gap={2}>
                    <FormControl fullWidth>
                        <InputLabel>Vendor</InputLabel>
                        <Select
                            name="vendor"
                            value={formData.vendor}
                            onChange={handleChange}
                        >
                            {vendors.map((ven) => (
                                <MenuItem key={ven.id} value={ven.id}>
                                    {ven.business_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                    />
                    <TextField
                        label="Price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Discount"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={formData.category} // This should be the category ID
                            onChange={handleChange}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Sub Category</InputLabel>
                        <Select
                            name="subcategory"
                            value={formData.subcategory} // This should be the category ID
                            onChange={handleChange}
                        >
                            {subcategories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Color</InputLabel>
                        <Select
                            multiple
                            name="color"
                            value={formData.color || []} // Ensure it is always an array
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    color: e.target.value, // `e.target.value` will be an array
                                }))
                            }
                            renderValue={(selected) =>
                                colors
                                    .filter((color) => selected.includes(color.id))
                                    .map((color) => color.name)
                                    .join(', ')
                            }
                        >
                            {colors.map((color) => (
                                <MenuItem key={color.id} value={color.id}>
                                    <Checkbox checked={(formData.color || []).includes(color.id)} />
                                    <ListItemText primary={color.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Material"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        fullWidth
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.is_active}
                                onChange={handleToggle}
                                color="primary"
                            />
                        }
                        label="Active"/>
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>Available Sizes</Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={5}>
                                <FormControl fullWidth>
                                    <InputLabel>Size</InputLabel>
                                    <Select
                                        value={size}
                                        onChange={(e) => setSize(e.target.value)}
                                        label="Size"
                                        sx={{ backgroundColor: "white" }}
                                    >
                                        {SIZE_CHOICES.map((choice) => (
                                            <MenuItem key={choice.value} value={choice.value}>
                                                {choice.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    variant="outlined"
                                    sx={{ backgroundColor: "white" }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" color="primary" onClick={handleAddSize}>
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                        <Box mt={2}>
                            {availableSizes.map((item, index) => (
                                <Grid container key={index} spacing={2} alignItems="center">
                                    <Grid item xs={5}>
                                        <Typography>Size: {item.size}</Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography>Quantity: {item.quantity}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton color="error" onClick={() => handleRemoveSize(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    </Box>
                    {/* Existing Images Section */}
                    <Box>
                        <Typography variant="subtitle1">Existing Images</Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {formData.images.map((image, index) => (
                                <Box key={index} position="relative">
                                    <Avatar
                                        src={image.image_url}
                                        alt={`Product Image ${index + 1}`}
                                        sx={{ width: 75, height: 75 }}
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
                        </Box>
                    </Box>
                    {/* Add New Images */}
                    <Box>
                        <Typography variant="subtitle1">Add New Images</Typography>
                        <Button variant="contained" component="label">
                            Upload
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </Button>
                        <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                            {newImages.map((file, index) => (
                                <Avatar
                                    key={index}
                                    src={URL.createObjectURL(file)}
                                    alt={`New Image ${index + 1}`}
                                    sx={{ width: 75, height: 75 }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
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

export default EditProductModal;