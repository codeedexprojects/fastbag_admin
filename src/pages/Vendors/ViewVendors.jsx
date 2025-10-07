import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  InputAdornment,
} from "@mui/material";
import { Search, FileDownload, Delete, Visibility, IosShare, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  viewVendors,
  acceptRejectVendor,
  enableDisableVendor,
  deleteVendor,
} from "../../services/allApi";
import { Backdrop, CircularProgress } from "@mui/material";
import { ChevronDown, CirclePlus, Eye, Filter, Trash2 } from "lucide-react";


const ViewVendors = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, enabled, disabled, approved, not_approved

  // Fetch Vendors
  const fetchVendorsData = async () => {
    try {
      setLoading(true);
      const vendorsData = await viewVendors();
      setVendors(vendorsData);
          console.log(vendorsData)

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorsData();
  }, []);

  // Filter & Search Logic (memoized)
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      // Search check (business_name, owner_name, store_type_name)
      const searchMatch =
        vendor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.store_type_name.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status
      let filterMatch = true;
      if (filterStatus === "enabled") filterMatch = vendor.is_active === true;
      else if (filterStatus === "disabled") filterMatch = vendor.is_active === false;
      else if (filterStatus === "approved") filterMatch = vendor.is_approved === true;
      else if (filterStatus === "not_approved") filterMatch = vendor.is_approved === false;

      return searchMatch && filterMatch;
    });
  }, [vendors, searchTerm, filterStatus]);

  // Export CSV helper
  const exportToCSV = () => {
    if (filteredVendors.length === 0) return;

    const headers = ["Business Name", "Owner Name", "Store Type", "Active", "Approved"];
    const rows = filteredVendors.map((v) => [
      v.business_name,
      v.owner_name,
      v.store_type_name,
      v.is_active ? "Enabled" : "Disabled",
      v.is_approved ? "Approved" : "Not Approved",
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "vendors_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      await acceptRejectVendor(vendorId, action);

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

  const handleEnableDisable = async (vendorId, isActive) => {
    try {
      setLoading(true);
      const action = isActive ? "disable" : "enable";
      await enableDisableVendor(vendorId, action);

      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, is_active: !isActive } : vendor
        )
      );
      console.log(`Vendor ${action}d successfully.`);
    } catch (error) {
      console.error(`Failed to ${isActive ? "disable" : "enable"} vendor:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (vendor) => {
    setVendorToDelete(vendor);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setVendorToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteVendor = async () => {
    if (vendorToDelete) {
      try {
        setLoading(true);
        await deleteVendor({}, vendorToDelete.id);

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
      {/* Header */}
      <Typography variant="h4" mb={3} sx={{ fontWeight: "bold", color: "#1e1e2d" }}>
        Vendors 
      </Typography>

      {/* Top Controls */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <TextField
  variant="outlined"
  label="Search vendors"
  // placeholder="Search vendors by name, owner or store type..."
  size="small"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  sx={{
    width: { xs: '100%', sm: 300 },
    backgroundColor: '#f9fafb',
    borderRadius: 2,
    boxShadow: '0 1px 8px rgba(0, 0, 0, 0.1)',
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '& fieldset': {
        border: 'none',
      },
     
    },
    '& .MuiInputBase-input': {
      color: '#111827',
      fontSize: 14,
    },
    '& .MuiSvgIcon-root': {
      color: '#374151',
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


        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">

<FormControl size="small" sx={{
  minWidth: 160,
  backgroundColor: '#f9fafb',
  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: 2,
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '& fieldset': {
      border: 'none',
    },
   
  },
  '& .MuiInputBase-input': {
    color: '#111827',
    fontSize: 14,
  },
  '& .MuiSvgIcon-root': {
    color: '#374151',
  },
}}>
  <InputLabel>Status Filter</InputLabel>
  <Select
    value={filterStatus}
    label="Status Filter"
    
    onChange={(e) => setFilterStatus(e.target.value)}
    IconComponent={ChevronDown}
    startAdornment={
      <InputAdornment position="start">
        <Filter size={18} style={{ color: '#374151' }} />
      </InputAdornment>}
  >
    <MenuItem value="all">All</MenuItem>
    <MenuItem value="enabled">Enabled</MenuItem>
    <MenuItem value="disabled">Disabled</MenuItem>
    <MenuItem value="approved">Approved</MenuItem>
    <MenuItem value="not_approved">Not Approved</MenuItem>
  </Select>
</FormControl>


          <Button
            variant="contained"
            startIcon={<IosShare />}
            onClick={exportToCSV}
            disabled={filteredVendors.length === 0}
            sx={{ whiteSpace: "nowrap" }}
          >
            Export 
          </Button>

          <Button
            variant="containedSecondary"
            startIcon={<CirclePlus/>}
            onClick={handleAddVendor}
          >
            Add Vendor
          </Button>
        </Box>
      </Stack>

      {/* Vendors Grid */}
      {loading ? (
        <Typography variant="h6" align="center" sx={{ mt: 10 }}>
          Loading vendors...
        </Typography>
      ) : filteredVendors.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 10 }}>
          No vendors found.
        </Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          }}
          gap={3}
        >
          {filteredVendors.map((vendor) => (
            <Card
              key={vendor.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: 3,
                position: "relative",
                backgroundColor: "#fff",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.01)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                },
              }}
              elevation={2}
            >
              {/* Enable/Disable Toggle */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ mb: 1 }}
              >
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {vendor.is_active ? "Enabled" : "Disabled"}
                </Typography>
                <Switch
                  checked={vendor.is_active}
                  onChange={() => handleEnableDisable(vendor.id, vendor.is_active)}
                  color="primary"
                />
              </Box>

              {/* Vendor Image */}
              <CardMedia
                component="img"
                image={vendor.store_logo || "https://via.placeholder.com/150"}
                alt={`${vendor.business_name}'s logo`}
                sx={{ width: 140, height: 140, borderRadius: "50%", mb: 2 }}
              />

              {/* Vendor Info */}
              <CardContent sx={{ textAlign: "center", p: 1, pt: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1e1e2d",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                  title={vendor.business_name}
                >
                  {vendor.business_name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  Owner: {vendor.owner_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Store Type: {vendor.store_type_name}
                </Typography>
              </CardContent>

              {/* Action Buttons */}
             {/* Action Buttons */}
<Box
  display="flex"
  flexDirection="column"
  gap={1}
  width="100%"
  px={2}
  mt={1}
>
  {vendor.is_approved === false ? (
    <Box display="flex" justifyContent="space-between" mb={1} gap={1}>
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={() => handleAcceptReject(vendor.id, "accept")}
        startIcon={<span style={{ fontWeight: "bold" }}>✔</span>}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Accept
      </Button>
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={() => handleAcceptReject(vendor.id, "reject")}
        startIcon={<span style={{ fontWeight: "bold" }}>✖</span>}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Reject
      </Button>
    </Box>
  ) : null}

  <Box display="flex" justifyContent="space-between" gap={1}>
    <Button
      variant="contained"
      color="primary"
      fullWidth
      onClick={() => handleViewVendor(vendor.id)}
     
      sx={{
        borderRadius: "20px",
        textTransform: "none",
        fontWeight: 600,
      }}
    >
      <Eye/>
    </Button>

    <Button
      color="error"
      variant="contained"
      fullWidth
      onClick={() => handleOpenDeleteDialog(vendor)}
      sx={{
        borderRadius: "20px",
        textTransform: "none",
        fontWeight: 600,
      }}
    >
      <Trash2/>
    </Button>
  </Box>
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
            <strong>{vendorToDelete?.business_name}</strong>? This action cannot be
            undone.
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
      <Backdrop
  sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={loading}
>
  <CircularProgress color="inherit" />
</Backdrop>

    </Box>
  );
};

export default ViewVendors;
