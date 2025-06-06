import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TablePagination, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getFoodProducts, deleteFoodProduct } from '../../services/allApi';
import EditFoodProductModal from './EditFood';

const FoodProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getFoodProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAddProduct = () => {
        navigate('/add-foodproduct');
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    };

    const handleSaveProduct = (updatedProduct) => {
        const updatedProducts = products.map((product) =>
            product.id === selectedProduct.id ? { ...product, ...updatedProduct } : product
        );
        setProducts(updatedProducts);
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const handleDeleteProduct = async () => {
        try {
            await deleteFoodProduct(null, productToDelete.id);
            setProducts(products.filter(product => product.id !== productToDelete.id));
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            {/* Header Section */}
            <Box mb={3}>
                <Typography variant="h4" gutterBottom>
                    Food Products
                </Typography>
            </Box>

            {/* Breadcrumb and Add Product Button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="body2" color="textSecondary">
                    Dashboard &gt; Product List
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleAddProduct}
                    sx={{ textTransform: 'none', backgroundColor: "#1e1e2d" }}
                >
                    + Add Product
                </Button>
            </Box>

            {/* Loading Indicator */}
            {loading ? (
                <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        {/* Table Header */}
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Product</b></TableCell>
                                <TableCell><b>Category</b></TableCell>
                                <TableCell><b>Subcategory</b></TableCell>
                                <TableCell><b>Images</b></TableCell>
                                <TableCell><b>Price</b></TableCell>
                                <TableCell><b>Offer Price</b></TableCell>
                                <TableCell><b>Discount</b></TableCell>
                                <TableCell><b>Availability</b></TableCell>
                                <TableCell><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                            {Array.isArray(products) && products
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <Typography variant="body1">{product.name}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {product.description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{product.category_name}</TableCell>
                                        <TableCell>{product.subcategory_name}</TableCell>
                                        <TableCell>
                                            {product.image_urls?.length > 0 ? (
                                                product.image_urls.map((img) => (
                                                    <img
                                                        key={img.id}
                                                        src={img.image}
                                                        alt={product.name}
                                                        style={{ width: 50, height: 50, marginRight: 5 }}
                                                    />
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="textSecondary">No images</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>₹{product.price}</TableCell>
                                        <TableCell>₹{product.offer_price}</TableCell>
                                        <TableCell>{product.discount}%</TableCell>
                                        <TableCell>
                                            {product.is_available ? (
                                                <Typography color="green">Available</Typography>
                                            ) : (
                                                <Typography color="red">Out of Stock</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEditClick(product)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(product)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <TablePagination
                        component="div"
                        count={products.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            )}

            {/* Edit Product Modal */}
            <EditFoodProductModal
                open={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                productData={selectedProduct}
                onSave={handleSaveProduct}
            />

            {/* Delete Confirmation Modal */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                aria-labelledby="delete-product-dialog-title"
            >
                <DialogTitle id="delete-product-dialog-title">{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to delete this product?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteProduct} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FoodProductList;
