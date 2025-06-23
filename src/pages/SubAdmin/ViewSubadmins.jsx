import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  DialogContentText,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

import { viewSubadmins, editSubadmin, deleteSubadmin } from "../../services/allApi";

const permissionOptions = [
  // Removed "Dashboard" from dropdown options
   "Orders",
  "Customers",
  "Coupons",
  "Notifications",
  "Stores",
  "Sellers",
  "Vendors Product",
  "Big Buy Orders",
  "Delivery",
  "Carousel",
];

const ViewSubAdmin = () => {
  const [loading, setLoading] = useState(false);

  const [subAdmins, setSubAdmins] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentSubAdmin, setCurrentSubAdmin] = useState(null);
  const [formData, setFormData] = useState({ mobile_number: "", permissions: [] });
  const [permissionInput, setPermissionInput] = useState("");

  const navigate = useNavigate();

 const fetchSubAdmins = async () => {
  try {
    setLoading(true);
    const response = await viewSubadmins();
    const updatedResponse = response.map((subAdmin) => {
      if (!subAdmin.permissions?.includes("Dashboard")) {
        return {
          ...subAdmin,
          permissions: ["Dashboard", ...(subAdmin.permissions || [])],
        };
      }
      return subAdmin;
    });
    setSubAdmins(updatedResponse);
  } catch (error) {
    console.error("Error fetching sub-admins:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(()=>{
  fetchSubAdmins()
},[])


  const handleAddSubAdmin = () => {
    navigate("/add-subadmin");
  };

  const handleEditClick = (subAdmin) => {
    // Ensure "Dashboard" is included on edit form too
    const permissionsWithDashboard = subAdmin.permissions.includes("Dashboard")
      ? subAdmin.permissions
      : ["Dashboard", ...(subAdmin.permissions || [])];

    setCurrentSubAdmin(subAdmin);
    setFormData({
      mobile_number: subAdmin.mobile_number,
      permissions: permissionsWithDashboard,
    });
    setPermissionInput("");
    setEditModalOpen(true);
  };

 const handleEditSave = async () => {
  try {
    setLoading(true);
    let permissionsToSave = formData.permissions.includes("Dashboard")
      ? formData.permissions
      : ["Dashboard", ...formData.permissions];
    const reqBody = { permissions: permissionsToSave };
    const updatedSubAdmin = await editSubadmin(reqBody, currentSubAdmin.mobile_number);
    setSubAdmins((prev) =>
      prev.map((subAdmin) =>
        subAdmin.mobile_number === currentSubAdmin.mobile_number ? updatedSubAdmin : subAdmin
      )
    );
    setEditModalOpen(false);
    setCurrentSubAdmin(null);
  } catch (error) {
    console.error("Error updating sub-admin:", error);
  } finally {
    setLoading(false);
  }
};


  const handlePermissionAdd = () => {
    if (
      permissionInput &&
      !formData.permissions.includes(permissionInput)
    ) {
      setFormData((prev) => ({
        ...prev,
        permissions: [...prev.permissions, permissionInput],
      }));
      setPermissionInput("");
    }
  };

  const handlePermissionDelete = (permission) => {
    // Prevent deleting Dashboard
    if (permission === "Dashboard") return;

    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.filter((p) => p !== permission),
    }));
  };

  const handleDeleteClick = (subAdmin) => {
    setCurrentSubAdmin(subAdmin);
    setDeleteModalOpen(true);
  };

 const handleDeleteConfirm = async () => {
  try {
    setLoading(true);
    await deleteSubadmin({}, currentSubAdmin.mobile_number);
    setSubAdmins((prev) =>
      prev.filter((subAdmin) => subAdmin.mobile_number !== currentSubAdmin.mobile_number)
    );
    setDeleteModalOpen(false);
    setCurrentSubAdmin(null);
  } catch (error) {
    console.error("Error deleting sub-admin:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">View Sub Admins</Typography>
        <Button variant="contained" sx={{ backgroundColor: "#1e1e2d", "&:hover": { backgroundColor: "#333" } }}  onClick={handleAddSubAdmin}>
          Add Sub Admin
        </Button>
      </Box>

      <TableContainer   sx={{ borderRadius: 1, boxShadow:2, overflow: "hidden", mt: 3 }}
 component={Paper}>
        <Table  sx={{ minWidth: 650 }} >
          <TableHead sx={{ backgroundColor: "" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Mobile Number</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Permissions</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Is Superuser</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subAdmins.map((subAdmin, index) => (
              <TableRow key={index}>
                <TableCell>{index+1}</TableCell>
                <TableCell>{subAdmin.mobile_number}</TableCell>
                <TableCell>
                  {subAdmin.permissions && subAdmin.permissions.length > 0
                    ? subAdmin.permissions.join(", ")
                    : "No Permissions"}
                </TableCell>
                <TableCell>{subAdmin.is_superuser ? "Yes" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEditClick(subAdmin)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(subAdmin)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Sub Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Mobile Number"
            value={formData.mobile_number}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, mobile_number: e.target.value }))
            }
            fullWidth
            margin="normal"
            disabled
          />
          <Box mt={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Permission</InputLabel>
              <Select
                value={permissionInput}
                onChange={(e) => setPermissionInput(e.target.value)}
                label="Select Permission"
              >
                {permissionOptions.map((permission) => (
                  <MenuItem key={permission} value={permission}>
                    {permission}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={handlePermissionAdd}
              disabled={!permissionInput || formData.permissions.includes(permissionInput)}
            >
              Add Permission
            </Button>
          </Box>
          <List>
            {formData.permissions.map((permission, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  permission !== "Dashboard" && (
                    <IconButton edge="end" onClick={() => handlePermissionDelete(permission)}>
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText primary={permission} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this sub-admin with mobile number{" "}
            <strong>{currentSubAdmin?.mobile_number}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
  open={loading}
  sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
>
  <CircularProgress color="inherit" />
</Backdrop>

    </Container>
  );
};

export default ViewSubAdmin;
