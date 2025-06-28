import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
  Modal, MenuItem, Select, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  CircularProgress, Backdrop, InputAdornment,
} from "@mui/material";
import { Search, Edit, Delete, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { viewCategory, updateCategory, deleteCategory, viewStores } from "../../services/allApi";
import { CircleX, ImageUp, Pencil, Plus, PlusCircle, Save, Trash, Trash2, Upload } from "lucide-react";

const CategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category_image: "",
    store: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await viewCategory();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStores = async () => {
      try {
        const data = await viewStores();
        if (Array.isArray(data)) {
          setStores(data);
        } else {
          console.error("Invalid store data format:", data);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchCategories();
    fetchStores();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddCategory = () => {
    navigate("/add-category");
  };

  const handleEditClick = (category) => {
    const store = stores.find((store) => store.name === category.StoreType_name);
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      category_image: category.category_image || "",
      store: store ? store.id : "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory({}, selectedCategory.id);
      setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, category_image: file });
    }
  };

  const handleImageDelete = () => {
    setFormData({ ...formData, category_image: "" });
  };

  const handleEditSave = async () => {
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("store_type", formData.store);
      if (formData.category_image && formData.category_image instanceof File) {
        formDataToSubmit.append("category_image", formData.category_image);
      }
      const updatedCategory = await updateCategory(formDataToSubmit, selectedCategory.id);
      const updatedCategories = categories.map((cat) =>
        cat.id === selectedCategory.id ? { ...cat, ...updatedCategory } : cat
      );
      setCategories(updatedCategories);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" sx={{ marginBottom: "20px" }}>
          Categories
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            // variant="outlined"
            label="Search Subcategories"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: 300, boxShadow: '0 1px 10px rgba(0, 0, 0, 0.19)',

              backgroundColor: '#f9fafb',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                 border:"none" ,
                },
                
              },
              '& .MuiInputLabel-root': {
                color: '#6b7280',
                fontSize: 14,
              },
              '& .MuiInputBase-input': {
                fontSize: 14,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} style={{ color: '#374151' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button variant="containedSecondary"
            startIcon={<PlusCircle />} onClick={handleAddCategory}>
            Add Category
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 3 ,boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',overflow: "hidden", mt: 3 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="category table">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow >

                <TableCell sx={{ fontWeight: "bold" }}>No.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Category Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Store</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category, index) => (
                    <TableRow
                      key={category.id}
                      hover
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <img
                          src={category.category_image}
                          alt={category.name}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.StoreType_name}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleEditClick(category)}>
                          <Pencil />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteClick(category)}>
                          <Trash2 />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>


        <TablePagination
          component="div"
          count={filteredCategories.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the category "{selectedCategory?.name}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" startIcon={<CircleX/>} onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button  variant="containedError" startIcon={<Trash2 size={20}/>} onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Modal */}
        <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <Box
            sx={{
              width: 420,
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              mx: 'auto',
              mt: '10vh',
              outline: 'none',
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Edit Category
            </Typography>

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
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e5e7eb',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#9ca3af',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6366f1',
                },
              }}
            />

            <FormControl fullWidth size="small" margin="dense">
              <InputLabel>Store</InputLabel>
              <Select
                value={formData.store}
                label="Store"
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                sx={{
                  backgroundColor: '#f9fafb',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#9ca3af',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#6366f1',
                  },
                }}
              >
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box mt={2}>
              <Button
                component="label"
                startIcon={<ImageUp size={20} />}
                variant="containedSecondary"
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
                <Box display="flex" alignItems="center" mt={2}>
                  <Box
                    component="img"
                    src={
                      formData.category_image instanceof File
                        ? URL.createObjectURL(formData.category_image)
                        : formData.category_image
                    }
                    alt="Preview"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      objectFit: 'cover',
                      border: '1px solid #e5e7eb',
                    }}
                  />
                  <IconButton color="error" onClick={handleImageDelete} sx={{ ml: 1 }}>
                    <Trash2 size={20} />
                  </IconButton>
                </Box>
              )}
            </Box>


            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button startIcon={<CircleX />} variant="containedError" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button startIcon={<Save size={20} />} variant="contained" onClick={handleEditSave} sx={{ ml: 2 }}>
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

      </Box>
    </>
  );
};

export default CategoryPage;
