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
  const headers = ["Name", "Store"];
  const csvRows = [
    headers.join(","),
    ...data.map((row) => [
      `"${row.name}"`,
      `"${row.StoreType_name}"`
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
};

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, storeData] = await Promise.all([viewCategory(), viewStores()]);
        setCategories(catData);
        setStores(storeData);
        setFilteredCategories(catData);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
    setPage(0);
  }, [searchTerm, categories]);

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
    setIsEditModalOpen(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setFormData({ ...formData, category_image: file });
  };

  const handleImageDelete = () => setFormData({ ...formData, category_image: "" });

  const handleEditSave = async () => {
    try {
      const body = new FormData();
      body.append("name", formData.name);
      body.append("store_type", formData.store);
      if (formData.category_image instanceof File) {
        body.append("category_image", formData.category_image);
      }
      const updated = await updateCategory(body, selectedCategory.id);
      toast.success("Category updated");
      const updatedList = categories.map((cat) =>
        cat.id === selectedCategory.id ? { ...cat, ...updated } : cat
      );
      setCategories(updatedList);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("Failed to update");
    }
  };

  const handleDeleteClick = (cat) => {
    setSelectedCategory(cat);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory({}, selectedCategory.id);
      toast.success("Category deleted");
      const updatedList = categories.filter((cat) => cat.id !== selectedCategory.id);
      setCategories(updatedList);
    } catch (err) {
      toast.error("Delete failed");
    }
    setDeleteDialogOpen(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h4" sx={{ mb: 3 }}>Categories</Typography>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          label="Search Categories"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: 300,
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

        <Box display="flex" gap={2}>
          <Button variant="contained" startIcon={<IosShare />} onClick={() => exportToCSV(filteredCategories)}>Export</Button>
          <Button variant="containedSecondary" startIcon={<CirclePlus />} onClick={handleAddCategory}>Add Category</Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cat, index) => (
              <TableRow key={cat.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <img src={cat.category_image} alt={cat.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                </TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.StoreType_name}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditClick(cat)}><Pencil /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(cat)}><Trash2 /></IconButton>
                </TableCell>
              </TableRow>
            ))}
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
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete category "{selectedCategory?.name}"?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" startIcon={<CircleX />} onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="containedError" startIcon={<Trash2 />} onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box sx={{ width: 420, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 24, p: 4, mx: 'auto', mt: '10vh', outline: 'none' }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Edit Category</Typography>
          <TextField
            label="Category Name"
            fullWidth
            size="small"
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ backgroundColor: '#f9fafb', borderRadius: 1, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' } }}
          />

          <FormControl fullWidth size="small" margin="dense">
            <InputLabel>Store</InputLabel>
            <Select
              value={formData.store}
              label="Store"
              onChange={(e) => setFormData({ ...formData, store: e.target.value })}
              sx={{ backgroundColor: '#f9fafb', borderRadius: 1, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' } }}
            >
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>{store.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={2}>
            <Button component="label" startIcon={<ImageUp size={20} />} variant="containedSecondary" size="small">
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {formData.category_image && (
              <Box display="flex" alignItems="center" mt={2}>
                <Box
                  component="img"
                  src={formData.category_image instanceof File ? URL.createObjectURL(formData.category_image) : formData.category_image}
                  alt="Preview"
                  sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover', border: '1px solid #e5e7eb' }}
                />
                <IconButton color="error" onClick={handleImageDelete} sx={{ ml: 1 }}>
                  <Trash2 size={20} />
                </IconButton>
              </Box>
            )}
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button startIcon={<CircleX />} variant="containedError" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button startIcon={<Save size={20} />} variant="contained" onClick={handleEditSave} sx={{ ml: 2 }}>Save</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CategoryPage;
