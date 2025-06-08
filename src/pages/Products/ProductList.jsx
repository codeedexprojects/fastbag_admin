import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton, TablePagination,
  Avatar,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { viewProducts, productsCount } from '../../services/allApi';
import EditProductModal from './EditProduct';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await viewProducts();
        setProducts(data);
        console.log(data)
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalProducts = async () => {
      try {
        const countData = await productsCount();
        setTotalProducts(countData.total_products);
      } catch (error) {
        console.error('Failed to fetch total products count:', error);
      }
    };

    fetchProducts();
    fetchTotalProducts();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddProduct = () => {
    navigate('/add-product');
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

  return (
    <Box sx={{ padding: 3 }}>
      <Box mb={3}>
        <Typography variant="h4">Fashion Products</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body2" color="textSecondary">
          Dashboard &gt; Product List
        </Typography>
        <Box display="flex" gap={2}>
          <Typography variant="body1" color="textSecondary">
            <b>Total Products:</b> {totalProducts}
          </Typography>
          <Button variant="outlined">Export</Button>
          <Button variant="contained" sx={{backgroundColor:"#1e1e2d"}} onClick={handleAddProduct}>
            + Add Product
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Typography variant="body1" align="center">
          Loading products...
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Offer Price</TableCell>
                <TableCell>Available Sizes</TableCell>
                <TableCell>Colors</TableCell>
                <TableCell>Images</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{product.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {product.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{product.category || 'N/A'}</TableCell>
                    <TableCell>{product.subcategory || 'N/A'}</TableCell>
                    <TableCell>{`${product.price?`Rs.${product.price}`: 'N/A'} `}</TableCell>
                    <TableCell>{`${product.offer_price?`Rs.${product.offer_price}`: 'N/A'} `}</TableCell>
                    <TableCell>
                      {product.available_sizes && product.available_sizes.length > 0 ? (
                        product.available_sizes.map((size, index) => (
                          <Typography key={index} variant="body2">
                            {size.size}: {size.quantity}
                          </Typography>
                        ))
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      {product.colors && product.colors.length > 0
                        ? product.colors.map((color) => (
                          <Avatar
                            key={color.id}
                            alt={color.name}
                            src={color.image}
                            sx={{ width: 30, height: 30, margin: 0.5 }}
                          />
                        ))
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {product.images && product.images.length > 0
                        ? product.images.map((image) => (
                          <Avatar
                            key={image.id}
                            alt="Product Image"
                            src={image.image_url}
                            sx={{ width: 50, height: 50, margin: 0.5 }}
                          />
                        ))
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <IconButton>
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => handleEditClick(product)}>
                        <Edit />
                      </IconButton>
                      <IconButton>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>

          </Table>
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
      <EditProductModal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        productData={selectedProduct}
        onSave={handleSaveProduct}
      />
    </Box>
  );
};

export default ProductList;
