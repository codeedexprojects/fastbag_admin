import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, TextField, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Modal, Select, MenuItem,
  InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  CircularProgress, Backdrop, InputAdornment
} from "@mui/material";
import { IosShare, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { viewCategory, updateCategory, deleteCategory, viewStores } from "../../services/allApi";
import { toast } from "react-toastify";
import { CirclePlus, CircleX, ImageUp, Pencil, Save, Trash2 } from "lucide-react";

// CSV Export Helper
const exportToCSV = (data, filename = "categories.csv") => {
  if (!data || data.length === 0) {
    toast.warning("No data to export");
    return;
  }

  const headers = ["Name", "Store"];
  const csvRows = [
    headers.join(","),
    ...data.map((row) => [
      `"${row.name || ""}"`,
      `"${row.StoreType_name || ""}"`
    ].join(","))
  ];
  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success("Categories exported successfully");
};

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", category_image: "", store: "" });
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catData, storeData] = await Promise.all([viewCategory(), viewStores()]);
        
        // Handle paginated response - extract results array
        const categoriesArray = catData?.results 
          ? (Array.isArray(catData.results) ? catData.results : [])
          : (Array.isArray(catData) ? catData : []);
        
        // Handle stores - might also be paginated
        const storesArray = storeData?.results
          ? (Array.isArray(storeData.results) ? storeData.results : [])
          : (Array.isArray(storeData) ? storeData : []);
        
        setCategories(categoriesArray);
        setStores(storesArray);
        setFilteredCategories(categoriesArray);
      } catch (err) {
        console.error("Failed to fetch:", err);
        toast.error("Failed to load categories");
        setCategories([]);
        setStores([]);
        setFilteredCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Ensure categories is an array before filtering
    if (!Array.isArray(categories)) {
      setFilteredCategories([]);
      return;
    }

    const filtered = categories.filter((cat) => {
      // Safety check for category name
      const categoryName = cat?.name || '';
      return categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredCategories(filtered);
    setPage(0);
  }, [searchTerm, categories]);

  // Cleanup image preview on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddCategory = () => navigate("/add-category");

  const handleEditClick = (category) => {
    const matchedStore = stores.find((store) => store.name === category.StoreType_name);
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      category_image: category.category_image || "",
      store: matchedStore ? matchedStore.id : ""
    });
    setImagePreview(null);
    setIsEditModalOpen(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Cleanup previous preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setFormData({ ...formData, category_image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageDelete = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setFormData({ ...formData, category_image: "" });
    setImagePreview(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleEditSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (!formData.store) {
      toast.error("Please select a store");
      return;
    }

    try {
      setSaving(true);
      const body = new FormData();
      body.append("name", formData.name);
      body.append("store_type", formData.store);
      
      if (formData.category_image instanceof File) {
        body.append("category_image", formData.category_image);
      }

      const updated = await updateCategory(body, selectedCategory.id);
      toast.success("Category updated successfully");
      
      // Find the store name for the updated category
      const selectedStore = stores.find(store => store.id === formData.store);
      
      // Update local state with proper field mapping
      const updatedList = categories.map((cat) =>
        cat.id === selectedCategory.id 
          ? { 
              ...cat, 
              name: updated.name || formData.name,
              category_image: updated.category_image || cat.category_image,
              store_type: updated.store_type || formData.store,
              StoreType_name: selectedStore?.name || cat.StoreType_name
            } 
          : cat
      );
      setCategories(updatedList);
      
      // Cleanup and close modal
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error(err.response?.data?.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (cat) => {
    setSelectedCategory(cat);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await deleteCategory({}, selectedCategory.id);
      toast.success("Category deleted successfully");
      const updatedList = categories.filter((cat) => cat.id !== selectedCategory.id);
      setCategories(updatedList);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  const handleModalClose = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setIsEditModalOpen(false);
  };

  const getImageSource = () => {
    if (imagePreview) {
      return imagePreview;
    }
    if (formData.category_image instanceof File) {
      return URL.createObjectURL(formData.category_image);
    }
    return formData.category_image;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>Categories</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <TextField
          label="Search Categories"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 300 },
            backgroundColor: '#f9fafb',
            boxShadow: '0 1px 10px rgba(0,0,0,0.19)',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { border: 'none' } },
            '& .MuiInputLabel-root': { color: '#6b7280', fontSize: 14 },
            '& .MuiInputBase-input': { fontSize: 14 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} style={{ color: '#374151' }} />
              </InputAdornment>
            )
          }}
        />

        <Box display="flex" gap={2} flexWrap="wrap">
          <Button 
            variant="outlined" 
            startIcon={<IosShare />} 
            onClick={() => exportToCSV(filteredCategories)}
            disabled={!Array.isArray(filteredCategories) || filteredCategories.length === 0}
          >
            Export
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<CirclePlus />} 
            onClick={handleAddCategory}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>No</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Store</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!Array.isArray(filteredCategories) || filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {searchTerm ? "No categories found" : "No categories available"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cat, index) => (
                  <TableRow key={cat.id || index} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      {cat.category_image ? (
                        <img 
                          src={cat.category_image} 
                          alt={cat.name || 'Category'} 
                          style={{ 
                            width: 50, 
                            height: 50, 
                            borderRadius: 8, 
                            objectFit: 'cover',
                            border: '1px solid #e0e0e0'
                          }} 
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect fill="%23ddd" width="50" height="50"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 2,
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            No Image
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{cat.name || 'N/A'}</TableCell>
                    <TableCell>{cat.StoreType_name || 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditClick(cat)}
                        size="small"
                      >
                        <Pencil size={18} />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteClick(cat)}
                        size="small"
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={Array.isArray(filteredCategories) ? filteredCategories.length : 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15, 25]}
      />

      {/* Delete Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete category <strong>"{selectedCategory?.name}"</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<CircleX />} 
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <Trash2 />} 
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Modal 
        open={isEditModalOpen} 
        onClose={() => !saving && handleModalClose()}
      >
        <Box sx={{ 
          width: { xs: '90%', sm: 420 }, 
          bgcolor: 'background.paper', 
          borderRadius: 3, 
          boxShadow: 24, 
          p: 4, 
          mx: 'auto', 
          mt: '10vh', 
          outline: 'none',
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <Typography variant="h6" fontWeight={600} mb={3}>Edit Category</Typography>
          
          <TextField
            label="Category Name"
            fullWidth
            size="small"
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ 
              backgroundColor: '#f9fafb', 
              borderRadius: 1, 
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
              mb: 2
            }}
            required
          />

          <FormControl fullWidth size="small" margin="dense" required>
            <InputLabel>Store</InputLabel>
            <Select
              value={formData.store}
              label="Store"
              onChange={(e) => setFormData({ ...formData, store: e.target.value })}
              sx={{ 
                backgroundColor: '#f9fafb', 
                borderRadius: 1, 
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' } 
              }}
            >
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>{store.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={3}>
            <Button 
              component="label" 
              startIcon={<ImageUp size={20} />} 
              variant="outlined" 
              size="small"
            >
              Upload Image
              <input 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </Button>
            
            {formData.category_image && (
              <Box display="flex" alignItems="center" mt={2} gap={2}>
                <Box
                  component="img"
                  src={getImageSource()}
                  alt="Preview"
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: 2, 
                    objectFit: 'cover', 
                    border: '1px solid #e5e7eb' 
                  }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3C/svg%3E';
                  }}
                />
                <IconButton 
                  color="error" 
                  onClick={handleImageDelete} 
                  size="small"
                  disabled={saving}
                >
                  <Trash2 size={20} />
                </IconButton>
              </Box>
            )}
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
            <Button 
              startIcon={<CircleX />} 
              variant="outlined" 
              color="error"
              onClick={handleModalClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save size={20} />} 
              variant="contained" 
              onClick={handleEditSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CategoryPage;