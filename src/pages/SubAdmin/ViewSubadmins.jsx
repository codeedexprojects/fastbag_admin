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
  Stack
} from "@mui/material";
import { Add, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

import { viewSubadmins, editSubadmin, deleteSubadmin } from "../../services/allApi";
import { CirclePlus, CircleX, Pencil, Save, Trash2 } from "lucide-react";

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

  useEffect(() => {
    fetchSubAdmins()
  }, [])


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
        <Button variant="containedSecondary" startIcon={<CirclePlus />} onClick={handleAddSubAdmin}>
          Add Sub Admin
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 3, boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)', overflow: "hidden", mt: 3 }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="category table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Mobile Number</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Permissions</TableCell>
              {/* <TableCell sx={{ fontWeight: "bold" }}>Is Superuser</TableCell> */}
              <TableCell sx={{ fontWeight: "bold" }} >Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subAdmins.map((subAdmin, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{subAdmin.mobile_number}</TableCell>
                <TableCell>
                  {subAdmin.permissions && subAdmin.permissions.length > 0
                    ? subAdmin.permissions.join(", ")
                    : "No Permissions"}
                </TableCell>
                {/* <TableCell>{subAdmin.is_superuser ? "Yes" : "No"}</TableCell> */}
                <TableCell >
                  <IconButton color="primary" onClick={() => handleEditClick(subAdmin)}>
                    <Pencil />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(subAdmin)}>
                    <Trash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            bgcolor: '#fff',
            boxShadow: 10,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Edit Sub Admin</DialogTitle>

        <DialogContent dividers sx={{ borderColor: '#e5e7eb' }}>
          <Stack spacing={3}>
            <TextField
              label="Mobile Number"
              value={formData.mobile_number}
              fullWidth
              disabled
              size="small"
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

            <FormControl fullWidth size="small">
              <InputLabel
                id="permission-label"
                sx={{ color: '#6b7280', fontSize: 14, '&.Mui-focused': { color: '#6366f1' } }}
              >
                Select Permission
              </InputLabel>
              <Select
                labelId="permission-label"
                value={permissionInput}
                label="Select Permission"
                onChange={(e) => setPermissionInput(e.target.value)}
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
                    borderWidth: 2,
                  },
                }}
              >
                {permissionOptions.map((permission) => (
                  <MenuItem key={permission} value={permission}>
                    {permission}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="containedSecondary"
              onClick={handlePermissionAdd}
              startIcon={<CirclePlus size={20} />}
              disabled={!permissionInput || formData.permissions.includes(permissionInput)}

            >
              Add Permission
            </Button>

            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Current Permissions
              </Typography>
              <List dense sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 1 }}>
                {formData.permissions.map((permission, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      permission !== 'Dashboard' && (
                        <IconButton edge="end" onClick={() => handlePermissionDelete(permission)} color="error">
                          <Trash2 fontSize="small" />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemText primary={permission} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setEditModalOpen(false)}
            startIcon={<CircleX size={20} />}
            variant="containedError"

          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            startIcon={<Save size={20} />}
            variant="contained"

          >
            Save Changes
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
          <Button startIcon={<CircleX />} onClick={() => setDeleteModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button startIcon={<Trash2 />} onClick={handleDeleteConfirm} variant="contained" color="error">
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
