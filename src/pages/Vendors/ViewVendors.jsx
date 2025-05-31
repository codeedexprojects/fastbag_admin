import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Search, FilterList, FileDownload, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  viewVendors,
  acceptRejectVendor,
  enableDisableVendor,
  deleteVendor,
} from "../../services/allApi";

const ViewVendors = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  // Fetch Vendors
  const fetchVendorsData = async () => {
    try {
      setLoading(true);
      const vendorsData = await viewVendors();
      setVendors(vendorsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorsData();
  }, []);

  const handleViewVendor = (vendorId) => {
    if (vendorId) {
      navigate(`/vendors/${vendorId}`);
    } else {
      console.error("Vendor ID is undefined");
    }
  };

  const handleAddVendor = () => {
    navigate("/add-vendor");
  };

  const handleAcceptReject = async (vendorId, action) => {
    try {
      setLoading(true);
      const updatedVendor = await acceptRejectVendor(vendorId, action);

      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.id === vendorId
            ? { ...vendor, is_approved: action === "accept" ? true : false }
            : vendor
        )
      );

      console.log(`Vendor ${action === "accept" ? "accepted" : "rejected"} successfully.`);
    } catch (error) {
      console.error(`Failed to ${action} vendor:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Handle enable/disable vendor
  const handleEnableDisable = async (vendorId, isActive) => {
    try {
      setLoading(true);
      const action = isActive ? "disable" : "enable"; // Toggle between enable and disable
      const updatedVendor = await enableDisableVendor(vendorId, action);

      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.id === vendorId
            ? { ...vendor, is_active: !isActive }
            : vendor
        )
      );
      console.log(`Vendor ${action}d successfully.`);
    } catch (error) {
      console.error(`Failed to ${isActive ? "disable" : "enable"} vendor:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Open Delete Dialog
  const handleOpenDeleteDialog = (vendor) => {
    setVendorToDelete(vendor);
    setOpenDeleteDialog(true);
  };

  // Close Delete Dialog
  const handleCloseDeleteDialog = () => {
    setVendorToDelete(null);
    setOpenDeleteDialog(false);
  };

  // Delete Vendor
  const handleDeleteVendor = async () => {
    if (vendorToDelete) {
      try {
        setLoading(true);
        await deleteVendor({}, vendorToDelete.id);

        // Remove vendor from the list
        setVendors((prevVendors) =>
          prevVendors.filter((vendor) => vendor.id !== vendorToDelete.id)
        );

        console.log(`Vendor deleted successfully.`);
      } catch (error) {
        console.error(`Failed to delete vendor:`, error);
      } finally {
        setLoading(false);
        handleCloseDeleteDialog();
      }
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Top Section: Search Field and Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search vendor..."
          size="small"
          sx={{ width: "300px" }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
        />
        <Box display="flex" gap={2}>
          <Button variant="outlined" startIcon={<FileDownload />} disabled={loading}>
            Export
          </Button>
          <Button variant="outlined" startIcon={<FilterList />}>
            Filters
          </Button>
          <Button variant="contained" sx={{backgroundColor:"#1e1e2d"}} onClick={handleAddVendor}>
            + Add Vendor
          </Button>
        </Box>
      </Box>

      {/* Vendor Cards */}
      {loading ? (
        <Typography variant="h6" align="center">
          Loading vendors...
        </Typography>
      ) : (
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
          {vendors.map((vendor) => (
            <Card
              key={vendor.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                position: "relative",
              }}
            >
              {/* Enable/Disable Toggle */}
              <Box display="flex" alignItems="center">
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {vendor.is_active ? "Enabled" : "Disabled"}
                </Typography>
                <Switch
                  checked={vendor.is_active}
                  onChange={() => handleEnableDisable(vendor.id, vendor.is_active)}
                />
              </Box>

              {/* Vendor Image */}
              <CardMedia
                component="img"
                image={vendor.store_logo || "https://via.placeholder.com/150"}
                alt={`${vendor.business_name}'s logo`}
                sx={{ width: 150, height: 150, borderRadius: "50%", mb: 2 }}
              />
              {/* Vendor Info */}
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6">{vendor.business_name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Owner: {vendor.owner_name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Store Type: {vendor.store_type_name}
                </Typography>
              </CardContent>

              {/* Action Buttons */}
              <Box display="flex" flexDirection="column" gap={1} width="100%" px={2}>
                {vendor.is_approved === false ? (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      onClick={() => handleAcceptReject(vendor.id, "accept")}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      sx={{ ml: 1 }}
                      onClick={() => handleAcceptReject(vendor.id, "reject")}
                    >
                      Reject
                    </Button>
                  </Box>
                ) : null}
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleViewVendor(vendor.id)}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  fullWidth
                  onClick={() => handleOpenDeleteDialog(vendor)}
                >
                  Delete
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Vendor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete vendor{" "}
            <strong>{vendorToDelete?.business_name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteVendor} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewVendors;
