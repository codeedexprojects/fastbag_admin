import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
  Modal, MenuItem, Select, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import { Search, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { viewCategory, updateCategory, deleteCategory, viewStores } from "../../services/allApi";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category_image: "",
    store_type: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await viewCategory();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
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

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Categories
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search category..."
          size="small"
          sx={{ width: "300px" }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
        />
        <Button variant="contained" sx={{backgroundColor:"#1e1e2d"}}  onClick={handleAddCategory}>
          + Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <img
                    src={category.category_image}
                    alt={category.name}
                    style={{ width: 50, height: 50, borderRadius: "8px" }}
                  />
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.StoreType_name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(category)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(category)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={categories.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{selectedCategory?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box
          sx={{
            width: "400px",
            backgroundColor: "white",
            padding: 3,
            margin: "100px auto",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Category
          </Typography>
          <TextField
            label="Category Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Store</InputLabel>
            <Select
              value={formData.store}
              onChange={(e) => setFormData({ ...formData, store: e.target.value })}
            >
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={2}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.category_image && (
              <Box display="flex" alignItems="center" mt={1}>
                <img
                  src={
                    formData.category_image instanceof File
                      ? URL.createObjectURL(formData.category_image)
                      : formData.category_image
                  }
                  alt="Preview"
                  style={{ width: 100, height: 100, objectFit: "cover", borderRadius: "8px" }}
                />
                <IconButton onClick={handleImageDelete} sx={{ marginLeft: 1 }}>
                  <Delete />
                </IconButton>
              </Box>
            )}
          </Box>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleEditSave} sx={{ ml: 2 }}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CategoryPage;
