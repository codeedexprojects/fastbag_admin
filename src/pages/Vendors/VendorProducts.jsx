import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Select,
  MenuItem,
} from '@mui/material';
import { getVendorsProducts } from '../../services/allApi';
import { useNavigate } from 'react-router-dom';

const Products = ({ vendorId }) => {
  const [productsData, setProductsData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const data = await getVendorsProducts(vendorId);
        if (data?.response?.data?.detail === 'No products found for the given vendor ID.') {
          setProductsData([]);
        } else {
          setProductsData(data.data.results || []);
        }
      } catch (error) {
        console.error('Error fetching vendor products:', error);
        if (
          error?.response?.status === 404 &&
          error?.response?.data?.detail === 'No products found for the given vendor ID.'
        ) {
          setProductsData([]);
        } else {
          setError(true);
        }
      }
    };
    if (vendorId) fetchVendorProducts();
  }, [vendorId]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };

  if (error) return <Typography color="error">Failed to load vendor products.</Typography>;
  if (productsData === null) return <Typography>Loading vendor products...</Typography>;

  const filteredProducts = categoryFilter
    ? productsData.filter((p) => {
        const catName = typeof p.category === 'string' ? p.category : p.category_name || '';
        return catName === categoryFilter;
      })
    : productsData;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortConfig.key === 'price') {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      return sortConfig.direction === 'asc' ? priceA - priceB : priceB - priceA;
    }
    return 0;
  });

  const uniqueCategories = [
    ...new Set(
      productsData.map((p) =>
        typeof p.category === 'string' ? p.category : p.category_name || ''
      )
    ),
  ].filter((c) => c !== '');

  const renderImages = (images) => {
    if (!images || images.length === 0) {
      return (
        <Box
          sx={{
            width: 60,
            height: 60,
            bgcolor: '#f0f0f0',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            color: '#888',
            border: '1px solid #ddd',
          }}
        >
          No Image
        </Box>
      );
    }

    const imageCount = images.length;

    if (imageCount === 1 || imageCount === 2) {
      return (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {images.map((img, idx) => (
            <Box
              key={idx}
              component="img"
              src={img.image}
              alt={`product-${idx}`}
              sx={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 1,
                border: '1px solid #ccc',
              }}
            />
          ))}
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1,
          width: 150,
        }}
      >
        {images.map((img, idx) => (
          <Box
            key={idx}
            component="img"
            src={img.image}
            alt={`product-${idx}`}
            sx={{
              width: '100%',
              height: 70,
              objectFit: 'cover',
              borderRadius: 1,
              border: '1px solid #ccc',
            }}
          />
        ))}
      </Box>
    );
  };

  const renderVariantTable = (product) => {
  const tableStyle = {
    fontSize: 13,
    '& .MuiTableCell-root': {
      padding: '6px 4px',
      fontSize: 13,
      whiteSpace: 'nowrap',
    },
  };

  const ScrollBox = ({ children }) => (
    <Box sx={{ overflowX: 'auto', maxWidth: 330 }}>{children}</Box>
  );

  // Handle Fashion products with variants (new structure)
  if (product.store_type === 'fashion' && product.variants) {
    return (
      <ScrollBox>
        <Table size="small" sx={tableStyle}>
          <TableHead>
            <TableRow>
              <TableCell>Size</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {product.variants.map((v, i) => (
              <TableRow key={i}>
                <TableCell>{v.name}</TableCell>
                <TableCell>Rs.{v.price}</TableCell>
                <TableCell sx={{ color: v.is_in_stock ? 'success.main' : 'error.main' }}>
                  {v.is_in_stock ? 'Available' : 'Out of Stock'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollBox>
    );
  }

  // Handle Fashion products with colors (old structure - keep for backward compatibility)
  if (product.store_type === 'Fashion' && product.colors) {
    return (
      <ScrollBox>
        <Table size="small" sx={tableStyle}>
          <TableHead>
            <TableRow>
              <TableCell>Color</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Offer Price</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {product.colors.map((color) =>
              color.sizes.map((s, i) => (
                <TableRow key={`${color.color_name}-${i}`}>
                  <TableCell>{color.color_name}</TableCell>
                  <TableCell>{s.size}</TableCell>
                  <TableCell>Rs.{s.price}</TableCell>
                  <TableCell>Rs.{s.offer_price}</TableCell>
                  <TableCell sx={{ color: s.stock > 0 ? 'success.main' : 'error.main' }}>
                    {s.stock > 0 ? `${s.stock} Available` : 'Out of Stock'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollBox>
    );
  }

  if (product.store_type === 'grocery' && product.weights) {
    return (
      <ScrollBox>
        <Table size="small" sx={tableStyle}>
          <TableHead>
            <TableRow>
              <TableCell>Weight</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {product.weights.map((w, i) => (
              <TableRow key={i}>
                <TableCell>{w.weight}</TableCell>
                <TableCell>Rs.{w.price}</TableCell>
                <TableCell>{w.quantity}</TableCell>
                <TableCell sx={{ color: w.is_in_stock ? 'success.main' : 'error.main' }}>
                  {w.is_in_stock ? 'Available' : 'Out of Stock'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollBox>
    );
  }

  // Handle Grocery products with variants instead of weights
  if (product.store_type === 'Grocery' && product.variants) {
    return (
      <ScrollBox>
        <Table size="small" sx={tableStyle}>
          <TableHead>
            <TableRow>
              <TableCell>Variant</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {product.variants.map((v, i) => (
              <TableRow key={i}>
                <TableCell>{v.name || '-'}</TableCell>
                <TableCell>Rs.{v.price}</TableCell>
                <TableCell sx={{ color: v.is_in_stock ? 'success.main' : 'error.main' }}>
                  {v.is_in_stock ? 'Available' : 'Out of Stock'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollBox>
    );
  }

  if (product.store_type === 'restaurant' && product.variants) {
    return (
      <ScrollBox>
        <Table size="small" sx={tableStyle}>
          <TableHead>
            <TableRow>
              <TableCell>Variant</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {product.variants.map((v, i) => (
              <TableRow key={i}>
                <TableCell>{v.name}</TableCell>
                <TableCell>Rs.{v.price}</TableCell>
                <TableCell sx={{ color: v.is_in_stock ? 'success.main' : 'error.main' }}>
                  {v.is_in_stock ? 'Available' : 'Out of Stock'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollBox>
    );
  }

  return <Typography variant="body2" color="text.secondary">-</Typography>;
};


  return (
    <Box sx={{ mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>Vendor Products</Typography>
        <Box sx={{ maxWidth: 220 }}>
          <Select
            fullWidth
            value={categoryFilter}
            onChange={handleCategoryChange}
            displayEmpty
            size="small"
            sx={{
              bgcolor: '#f9fafb',
              borderRadius: 2,
              boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
              fontSize: 14,
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
          >
            <MenuItem value="" sx={{ fontWeight: 500 }}>All Categories</MenuItem>
            {uniqueCategories.map((cat) => (
              <MenuItem key={cat} value={cat} sx={{ fontWeight: 500 }}>{cat}</MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Sub Category</TableCell>
              <TableCell>Stock Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products added yet.
                </TableCell>
              </TableRow>
            ) : (
              sortedProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{renderImages(product.images)}</TableCell>
                    <TableCell>{product.category_name || product.category || '-'}</TableCell>
                    <TableCell>
                      {product.store_type === 'Grocery'
                        ? product.sub_category_name || '-'
                        : product.subcategory_name || product.subcategory || '-'}
                    </TableCell>
                    <TableCell>{renderVariantTable(product)}</TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedProducts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default Products;