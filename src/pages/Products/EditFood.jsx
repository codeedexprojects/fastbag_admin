import React, { useState, useEffect } from 'react';
import {
    Modal, Box, Typography, TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem, Avatar,
    FormControlLabel, Switch,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateFoodProduct, viewCategory, viewsubCategory, viewVendors } from '../../services/allApi';

const EditFoodProductModal = ({ open, onClose, productData, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        offer_price: '',
        discount: '',
        category: '',
        subcategory: '',
        vendor: '',
        images: [],
        is_active: true,
        is_offer_product: false,
        is_popular_product: false,
    });

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);

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
                    const allSubcategories = Object.values(subcategoryData).flatMap((subArray) =>
                        Array.isArray(subArray) ? subArray : []
                    );
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
                category: productData.category?.id || productData.category || '',
                subcategory: productData.subcategory?.id || productData.subcategory || '',
                vendor: productData.vendor?.id || productData.vendor || '',
                images: productData.image_urls || [], // Use image_urls from API response
                is_active: productData.is_available ?? true,
                is_offer_product: productData.is_offer_product ?? false,
                is_popular_product: productData.is_popular_product ?? false,
            });

            // Set category and subcategory states
            setCategory(productData.category?.id || productData.category || "");
            setSubcategory(productData.subcategory?.id || productData.subcategory || "");
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
        setSubcategory(selectedSubcategory); // Store the ID of the subcategory
        setFormData((prev) => ({
            ...prev,
            subcategory: selectedSubcategory, // Make sure you're setting the ID
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

    const handleSave = async () => {
        try {
            const updatedFormData = new FormData();
            updatedFormData.append("vendor", formData.vendor);
            updatedFormData.append("category", formData.category);
            updatedFormData.append("subcategory", formData.subcategory);
            updatedFormData.append("name", formData.name);
            updatedFormData.append("description", formData.description);
            updatedFormData.append("price", formData.price);
            updatedFormData.append("offer_price", formData.offer_price || '');
            updatedFormData.append("discount", formData.discount || '');
            updatedFormData.append("is_available", formData.is_active ? 'true' : 'false');
            updatedFormData.append("is_offer_product", formData.is_offer_product ? 'true' : 'false');
            updatedFormData.append("is_popular_product", formData.is_popular_product ? 'true' : 'false');

            // Append only new images (file objects)
            newImages.forEach((image) => {
                updatedFormData.append("images", image);
            });

            const response = await updateFoodProduct(updatedFormData, productData.id);
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
                        label="Offer Price"
                        name="offer_price"
                        value={formData.offer_price}
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
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.is_active}
                                onChange={handleToggle}
                                name="is_active"
                                color="primary"
                            />
                        }
                        label="Active"
                    />
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

                    {/* Existing Images Section */}
                    <Box>
                        <Typography variant="subtitle1">Existing Images</Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {formData.images.length > 0 ? (
                                formData.images.map((image, index) => (
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
                                ))
                            ) : (
                                <Typography>No images available.</Typography>
                            )}
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

export default EditFoodProductModal;