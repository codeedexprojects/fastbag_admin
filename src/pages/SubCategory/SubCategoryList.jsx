import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField, IconButton, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Modal, Select, MenuItem,
  InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  CircularProgress, Backdrop,
  InputAdornment
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  viewsubCategory,
  updateSubCategory,
  viewCategory,
  deleteSubCategory
} from "../../services/allApi";
import { toast } from "react-toastify";

const SubCategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    is_active: false,
    subcategory_image: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subData = await viewsubCategory();
        const catData = await viewCategory();
        setSubCategories(subData);
        setCategories(catData);
        setFilteredSubCategories(subData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle Search
  useEffect(() => {
    const filtered = subcategories.filter((sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubCategories(filtered);
    setPage(0); // reset to first page when searching
  }, [searchTerm, subcategories]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddCategory = () => navigate("/add-subcategory");

  const handleEditClick = (subcategory) => {
    const matchedCategory = categories.find((cat) => cat.name === subcategory.category_name);
    setSelectedSubCategory(subcategory);
    setFormData({
      name: subcategory.name,
      category: matchedCategory ? matchedCategory.id : "",
      is_active: subcategory.is_active || false,
      subcategory_image: subcategory.sub_category_image || "",
    });
    setIsEditModalOpen(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, subcategory_image: file });
    }
  };

  const handleImageDelete = () => {
    setFormData({ ...formData, subcategory_image: "" });
  };

  const handleEditSave = async () => {
    try {
      const reqBody = new FormData();
      reqBody.append("name", formData.name);
      reqBody.append("category", formData.category);
      reqBody.append("is_active", formData.is_active);

      if (formData.subcategory_image instanceof File) {
        reqBody.append("sub_category_image", formData.subcategory_image);
      } else if (formData.subcategory_image === "") {
        reqBody.append("sub_category_image", "");
      }

      const updatedSubCategory = await updateSubCategory(reqBody, selectedSubCategory.id);

      if (updatedSubCategory.status === 200) {
        toast.success("Successfully edited");
      }

      const updatedList = subcategories.map((sub) =>
        sub.id === selectedSubCategory.id ? { ...sub, ...updatedSubCategory } : sub
      );

      setSubCategories(updatedList);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update subcategory:", error);
    }
  };

  const handleDeleteClick = (subcategory) => {
    setSubCategoryToDelete(subcategory);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteSubCategory(subCategoryToDelete.id);
      if (response.status === 204) {
        toast.success("Subcategory deleted successfully");
        const updatedList = subcategories.filter((sub) => sub.id !== subCategoryToDelete.id);
        setSubCategories(updatedList);
      } else {
        toast.error("Failed to delete subcategory");
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("An error occurred while deleting");
    }
    setDeleteDialogOpen(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Loading Backdrop */}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h4" sx={{ marginBottom: "20px" }}>Sub Categories</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        {/* Search Box on the left */}
        <TextField
          label="Search Subcategories"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
           InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
        />

        {/* Buttons on right */}
        <Box display="flex" gap={2}>
          <Button variant="outlined" >Export</Button>
          <Button variant="contained" sx={{ backgroundColor: "#1e1e2d", "&:hover": { backgroundColor: "#333" } ,boxShadow:3 }} onClick={handleAddCategory}>
            + Add SubCategory
          </Button>
        </Box>
      </Box>

     <TableContainer component={Paper} sx={{ borderRadius: 1, overflow: "hidden", boxShadow: 10 }}>
  <Table>
    <TableHead>
      <TableRow sx={{ backgroundColor: "" }}>
        <TableCell sx={{  fontWeight: "bold" }}>No</TableCell>
        <TableCell sx={{  fontWeight: "bold" }}>Image</TableCell>
        <TableCell sx={{  fontWeight: "bold" }}>Name</TableCell>
        <TableCell sx={{  fontWeight: "bold" }}>Category</TableCell>
        <TableCell sx={{  fontWeight: "bold" }}>Active Status</TableCell>
        <TableCell sx={{  fontWeight: "bold" }}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredSubCategories
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((subcategory, index) => (
          <TableRow
            key={subcategory.id}
            sx={{
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
              "&:hover": { backgroundColor: "#f1f1f1" },
            }}
          >
            <TableCell>{index+1}</TableCell>
            <TableCell>
              <img
                src={subcategory.sub_category_image}
                alt={subcategory.name}
                style={{ width: 50, height: 50, borderRadius: "8px", objectFit: "cover" }}
              />
            </TableCell>
            <TableCell>{subcategory.name}</TableCell>
            <TableCell>{subcategory.category_name}</TableCell>
            <TableCell>
              <Chip
                label={subcategory.is_active ? "Active" : "Inactive"}
                color={subcategory.is_active ? "success" : "default"}
                size="small"
              />
            </TableCell>
            <TableCell>
              <IconButton color="info" onClick={() => handleEditClick(subcategory)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => handleDeleteClick(subcategory)}>
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
        count={filteredSubCategories.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the subcategory "{subCategoryToDelete?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
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
          <Typography variant="h6" sx={{ mb: 2 }}>Edit Subcategory</Typography>
          <TextField
            label="Subcategory Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={2}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.subcategory_image && (
              <Box display="flex" alignItems="center" mt={1}>
                <img
                  src={
                    formData.subcategory_image instanceof File
                      ? URL.createObjectURL(formData.subcategory_image)
                      : formData.subcategory_image
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
            <Button variant="outlined" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSave} sx={{ ml: 2 }}>Save</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SubCategoryPage;
