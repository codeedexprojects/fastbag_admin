import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Link,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Business,
  Store,
  Article,
  Edit,
  Description,
} from "@mui/icons-material";
import { viewSingleVendor, updateVendor, viewStores } from "../../services/allApi";

const FileInput = ({ label, name, onChange }) => (
  <Button
    variant="outlined"
    component="label"
    fullWidth
    sx={{
      mb: 2,
      borderColor: "primary.main",
      "&:hover": { borderColor: "primary.dark" },
    }}
  >
    {label}
    <input type="file" name={name} onChange={onChange} hidden />
  </Button>
);

const ProfileSection = ({ vendorId }) => {
  const [storeDetails, setStoreDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [storeTypes, setStoreTypes] = useState([]);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const data = await viewSingleVendor(vendorId);
        setStoreDetails(data);
        setFormData(data);
      } catch (err) {
        setError("Failed to load vendor details");
      } finally {
        setLoading(false);
      }
    };

    const fetchStoreTypes = async () => {
      try {
        const data = await viewStores();
        setStoreTypes(data);
      } catch (err) {
        console.error("Failed to load store types", err);
      }
    };

    fetchVendorDetails();
    fetchStoreTypes();
  }, [vendorId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  console.log(storeDetails)

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData({ ...formData, [name]: e.target.files[0] });
  };

  const handleFormSubmit = async () => {
    try {
      const updatedData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          key === "store_logo" ||
          key === "fssai_certificate" ||
          key === "license" ||
          key === "display_image"
        ) {
          if (formData[key] instanceof File) {
            updatedData.append(key, formData[key]);
          }
        } else {
          updatedData.append(key, formData[key]);
        }
      });

for (let pair of updatedData.entries()) {
  console.log(`${pair[0]}:`, pair[1]);
}
      const res=await updateVendor(updatedData, vendorId);
      setIsEditing(false);

      const updatedVendor = await viewSingleVendor(vendorId);
       console.log(res)
      setStoreDetails(updatedVendor);
      setFormData(updatedVendor);
    } catch (error) {
      console.error("Error updating vendor:", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 3, position: "relative" }}>
      <IconButton
        onClick={handleEditClick}
        sx={{ position: "absolute", top: 16, right: 16, color: "text.secondary" }}
        aria-label="edit vendor details"
      >
        <Edit />
      </IconButton>
      <Avatar
        src={storeDetails.store_logo}
        alt={storeDetails.business_name}
        sx={{ width: 100, height: 100, mx: "auto" }}
      />
      <Typography variant="h6" align="center" sx={{ mt: 2 }}>
        {storeDetails.business_name}
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary">
        Store ID: {storeDetails.store_id}
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
        Store Type: {storeDetails.store_type_name}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Store sx={{ mr: 1 }} />
          <Typography variant="body2"><b>Owner</b>: {storeDetails.owner_name}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Email sx={{ mr: 1 }} />
          <Typography variant="body2"><b>Email</b>: {storeDetails.email}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Email sx={{ mr: 1 }} />
          <Typography variant="body2"><b>Alternative Email</b>: {storeDetails.alternate_email}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Phone sx={{ mr: 1 }} />
          <Typography variant="body2"><b>Contact</b>: {storeDetails.contact_number}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationOn sx={{ mr: 1 }} />
          <Typography variant="body2">
            <b>Address</b>: {storeDetails.address}, {storeDetails.city}, {storeDetails.state} - {storeDetails.pincode}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Business sx={{ mr: 1 }} />
          <Typography variant="body2"><b>Landmark</b>: {storeDetails.business_landmark}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationOn sx={{ mr: 1 }} />
          <Typography variant="body2"><b>Latitude</b>: {storeDetails.latitude || "N/A"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationOn sx={{ mr: 1 }} />
          <Typography variant="body2"><b>Longitude</b>: {storeDetails.longitude || "N/A"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <AccessTime sx={{ mr: 1 }} />
          <Typography variant="body2"><b>Operating Hours</b>: {storeDetails.opening_time} - {storeDetails.closing_time}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Article sx={{ mr: 1 }} />
          <Typography variant="body2">
            <b>FSSAI No</b>: {storeDetails.fssai_no}
            <Link href={storeDetails.fssai_certificate} target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
              (View Certificate)
            </Link>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Article sx={{ mr: 1 }} />
          <Typography variant="body2">
            <b>License</b>:
            <Link href={storeDetails.license} target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
              (View License)
            </Link>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Article sx={{ mr: 1 }} />
          <Typography variant="body2">
            <b>Display Image</b>:
            <Link href={storeDetails.display_image} target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
              (View Image)
            </Link>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Description sx={{ mr: 1 }} />
          <Typography variant="body2"><b>Description</b>: {storeDetails.store_description}</Typography>
        </Box>
      </Box>

      {/* Edit Modal */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Vendor Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Business Name" name="business_name" value={formData.business_name || ""} onChange={handleFormChange} fullWidth />
           
            <TextField label="Owner Name" name="owner_name" value={formData.owner_name || ""} onChange={handleFormChange} fullWidth />
            <TextField label="Email" name="email" value={formData.email || ""} onChange={handleFormChange} fullWidth />
            <TextField label="Alternative Email" name="alternate_email" value={formData.alternate_email || ""} onChange={handleFormChange} fullWidth />
            <TextField label="Contact Number" type="text" name="contact_number" value={formData.contact_number || ""} onChange={handleFormChange} fullWidth />
            <TextField label="Address" name="address" value={formData.address || ""} onChange={handleFormChange} fullWidth />
            <TextField label="City" name="city" value={formData.city || ""} onChange={handleFormChange} fullWidth />
            <TextField label="State" name="state" value={formData.state || ""} onChange={handleFormChange} fullWidth />
            <TextField label="Pincode" name="pincode" value={formData.pincode || ""} onChange={handleFormChange} fullWidth />
            <TextField label="Business Landmark" name="business_landmark" value={formData.business_landmark || ""} onChange={handleFormChange} fullWidth />
            <TextField label="Latitude" name="latitude" value={formData.latitude || ""} onChange={handleFormChange} fullWidth />
            <TextField label="Longitude" name="longitude" value={formData.longitude || ""} onChange={handleFormChange} fullWidth />
            <TextField label="Opening Time" name="opening_time" type="time" value={formData.opening_time || ""} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true }} />
            <TextField label="Closing Time" name="closing_time" type="time" value={formData.closing_time || ""} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true }} />
            <TextField label="FSSAI Number" name="fssai_no" value={formData.fssai_no || ""} onChange={handleFormChange} fullWidth />
            <FileInput label="Store Logo" name="store_logo" onChange={handleFileChange} />
            <FileInput label="FSSAI Certificate" name="fssai_certificate" onChange={handleFileChange} />
            <FileInput label="License" name="license" onChange={handleFileChange} />
            <FileInput label="Display Image" name="display_image" onChange={handleFileChange} />
            <TextField label="Store Description" name="store_description" value={formData.store_description || ""} onChange={handleFormChange} multiline rows={3} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProfileSection;
