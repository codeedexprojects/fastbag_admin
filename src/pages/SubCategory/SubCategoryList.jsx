import React, { useState, useEffect } from "react";
import {Box,Typography,Button,TextField,IconButton,Checkbox,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
  TablePagination,Chip,Modal,Select,MenuItem,InputLabel,FormControl,} from "@mui/material";
import {  Edit, Delete, FilterList } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { viewsubCategory, updateSubCategory, viewCategory, viewVendors } from "../../services/allApi"; // Add the viewVendors function

const SubCategoryPage = () => {
  const [subcategories, setSubCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    vendor_id: "", // Add vendor_id to the formData
    is_active: false,
    enable_subcategory: false,
    subcategory_image: "",
  });
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]); // State for vendors
  const navigate = useNavigate();
  const [previousImage, setPreviousImage] = useState("");

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await viewsubCategory();
        // Combine all subcategories into one array
        const allSubCategories = [
          ...data.clothing_subcategories,
          ...data.grocery_subcategories,
          ...data.food_subcategories,
          // Add other subcategories if necessary
        ];
        setSubCategories(allSubCategories); // Set the combined subcategories list
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
  }, []);
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await viewCategory();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await viewVendors(); 
        setVendors(data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };
    fetchVendors();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddCategory = () => {
    navigate("/add-subcategory");
  };

  const handleEditClick = (subcategory) => {
    setSelectedSubCategory(subcategory);
    setFormData({
      name: subcategory.name,
      description: subcategory.description || "", // Add description if available
      category: subcategory.category || "",
      vendor_id: subcategory.vendor || "", // Use 'vendor' instead of 'vendor_id' based on the response
      is_active: subcategory.is_active || false, // Add is_active if available
      enable_subcategory: subcategory.enable_subcategory || false,
      subcategory_image: subcategory.subcategory_image || "",
    });
    setPreviousImage(subcategory.subcategory_image || "");
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
      reqBody.append("subcategory_image", formData.subcategory_image);
      reqBody.append("enable_subcategory", formData.enable_subcategory);
      reqBody.append("category", formData.category);
      reqBody.append("vendor_id", formData.vendor_id); // Append vendor_id to FormData
      if (formData.subcategory_image && formData.subcategory_image instanceof File) {
        reqBody.append("subcategory_image", formData.subcategory_image);
      }
      const updatedSubCategory = await updateSubCategory(reqBody, selectedSubCategory.id);
      const updatedSubCategories = subcategories.map((sub) =>
        sub.id === selectedSubCategory.id ? { ...sub, ...updatedSubCategory } : sub
      );
      setSubCategories(updatedSubCategories);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update subcategory:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Sub Categories
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body2" color="textSecondary">
          Dashboard &gt; Sub Categories
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined">Export</Button>
          <Button variant="contained" sx={{backgroundColor:"#1e1e2d"}} onClick={handleAddCategory}>
            + Add SubCategory
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
             
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Active Status</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subcategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subcategory) => (
              <TableRow key={subcategory.id}>
                <TableCell>
                  <img
                    src={subcategory.subcategory_image}
                    alt={subcategory.name}
                    style={{ width: 50, height: 50, borderRadius: "8px" }}
                  />
                </TableCell>
                <TableCell>{subcategory.name}</TableCell>
                <TableCell>{subcategory.category_name}</TableCell>
                <TableCell>{subcategory.vendor_name}</TableCell>
                <TableCell>
                  <Chip
                    label={subcategory.is_active ? "Active" : "Inactive"}
                    color={subcategory.is_active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={subcategory.enable_subcategory ? "Enabled" : "Disabled"}
                    color={subcategory.enable_subcategory ? "primary" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(subcategory)}>
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
      </TableContainer>

      <TablePagination
        component="div"
        count={subcategories.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
  <Box
    sx={{
      width: "400px",
      maxHeight: "80vh",
      overflowY: "auto",
      backgroundColor: "white",
      padding: 3,
      margin: "100px auto",
      borderRadius: "8px",
    }}
  >
    <Typography variant="h6" sx={{ mb: 2 }}>
      Edit SubCategory
    </Typography>
    <TextField
      label="Sub Category Name"
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
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl fullWidth margin="normal">
      <InputLabel>Vendor</InputLabel>
      <Select
        value={formData.vendor_id}
        onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
      >
        {vendors.map((vendor) => (
          <MenuItem key={vendor.id} value={vendor.id}>
            {vendor.business_name}
          </MenuItem>
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
          <Button color="error" onClick={handleImageDelete}>
            Remove
          </Button>
        </Box>
      )}
    </Box>
    <Box display="flex" justifyContent="space-between" mt={3}>
      <Button variant="contained" color="primary" onClick={handleEditSave}>
        Save
      </Button>
      <Button variant="outlined" onClick={() => setIsEditModalOpen(false)}>
        Cancel
      </Button>
    </Box>
  </Box>
</Modal>
    </Box>
  );
};

export default SubCategoryPage;
