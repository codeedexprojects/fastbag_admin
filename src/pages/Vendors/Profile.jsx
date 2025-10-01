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
  MenuItem,
} from "@mui/material";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Landmark,
  Clock,
  FileBadge,
  FileCheck,
  FileImage,
  Info,
  Pencil,
  Save,
  X
} from "lucide-react";

import { viewSingleVendor, updateVendor, viewStores } from "../../services/allApi";

const FileInput = ({ label, name, onChange, currentFile }) => (
  <Box sx={{ mb: 2 }}>
    <Button
      variant="outlined"
      component="label"
      fullWidth
      sx={{
        borderColor: "primary.main",
        "&:hover": { borderColor: "primary.dark" },
      }}
    >
      {label}
      <input type="file" name={name} onChange={onChange} hidden />
    </Button>
    {currentFile && (
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
        Current: {typeof currentFile === 'string' ? 'File uploaded' : currentFile.name}
      </Typography>
    )}
  </Box>
);

const ProfileSection = ({ vendorId }) => {
  const [storeDetails, setStoreDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [storeTypes, setStoreTypes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

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

  const handleCloseDialog = () => {
    setIsEditing(false);
    setFormData(storeDetails); // Reset form data
  };

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
      setSubmitting(true);
      const updatedData = new FormData();

      // List of file fields
      const fileFields = ["store_logo", "fssai_certificate", "license", "display_image", "id_proof", "passbook_image"];

      Object.keys(formData).forEach((key) => {
        // Only append file fields if they are new File objects
        if (fileFields.includes(key)) {
          if (formData[key] instanceof File) {
            updatedData.append(key, formData[key]);
          }
          // Skip if it's a string (existing URL) - don't append it
        } else {
          // Append all non-file fields
          if (formData[key] !== null && formData[key] !== undefined) {
            updatedData.append(key, formData[key]);
          }
        }
      });

      const res = await updateVendor(updatedData, vendorId);
      setIsEditing(false);

      const updatedVendor = await viewSingleVendor(vendorId);
      setStoreDetails(updatedVendor);
      setFormData(updatedVendor);
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert("Failed to update vendor details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Paper sx={{ p: 3, position: "relative", boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
        <IconButton
          onClick={handleEditClick}
          sx={{ position: "absolute", top: 16, right: 16 }}
          aria-label="edit vendor details"
        >
          <Pencil size={20} />
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
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Store Type: {storeDetails.store_type_name}
        </Typography>

        <Box sx={{ mt: 3 }}>
          {[
            { icon: <Store size={20} />, label: "Owner", value: storeDetails.owner_name },
            { icon: <Mail size={20} />, label: "Email", value: storeDetails.email },
            { icon: <Mail size={20} />, label: "Alternative Email", value: storeDetails.alternate_email },
            { icon: <Phone size={20} />, label: "Contact", value: storeDetails.contact_number },
            {
              icon: <MapPin size={20} />,
              label: "Address",
              value: `${storeDetails.address}, ${storeDetails.city}, ${storeDetails.state} - ${storeDetails.pincode}`,
            },
            { icon: <Landmark size={20} />, label: "Landmark", value: storeDetails.business_landmark },
            { icon: <MapPin size={20} />, label: "Latitude", value: storeDetails.latitude || "N/A" },
            { icon: <MapPin size={20} />, label: "Longitude", value: storeDetails.longitude || "N/A" },
            {
              icon: <Clock size={20} />,
              label: "Operating Hours",
              value: `${storeDetails.opening_time} - ${storeDetails.closing_time}`,
            },
          ].map((item, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box>{item.icon}</Box>
              <Typography variant="body2">
                <b>{item.label}</b>: {item.value}
              </Typography>
            </Box>
          ))}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FileBadge size={20} />
            <Typography variant="body2">
              <b>FSSAI No</b>: {storeDetails.fssai_no}
              <Link
                href={storeDetails.fssai_certificate}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ ml: 1 }}
              >
                (View Certificate)
              </Link>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <FileCheck size={20} />
            <Typography variant="body2">
              <b>License</b>:
              <Link
                href={storeDetails.license}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ ml: 1 }}
              >
                (View License)
              </Link>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <FileImage size={20} />
            <Typography variant="body2">
              <b>Display Image</b>:
              <Link
                href={storeDetails.display_image}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ ml: 1 }}
              >
                (View Image)
              </Link>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Info size={20} />
            <Typography variant="body2">
              <b>Description</b>: {storeDetails.store_description}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Store size={20} />
            <Typography variant="body2">
              <b>Commission</b>: {storeDetails.commission ? `${storeDetails.commission}%` : "N/A"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <FileImage size={20} />
            <Typography variant="body2">
              <b>Passbook Image</b>:
              {storeDetails.passbook_image ? (
                <Link
                  href={storeDetails.passbook_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ ml: 1 }}
                >
                  (View Image)
                </Link>
              ) : (
                " N/A"
              )}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Vendor Details
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Business Name"
            name="business_name"
            value={formData.business_name || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Owner Name"
            name="owner_name"
            value={formData.owner_name || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Alternative Email"
            name="alternate_email"
            type="email"
            value={formData.alternate_email || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Contact Number"
            name="contact_number"
            value={formData.contact_number || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={formData.pincode || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Landmark"
            name="business_landmark"
            value={formData.business_landmark || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Latitude"
            name="latitude"
            value={formData.latitude || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Longitude"
            name="longitude"
            value={formData.longitude || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Opening Time"
            name="opening_time"
            type="time"
            value={formData.opening_time || ""}
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Closing Time"
            name="closing_time"
            type="time"
            value={formData.closing_time || ""}
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="FSSAI No"
            name="fssai_no"
            value={formData.fssai_no || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Store Type"
            name="store_type"
            value={formData.store_type || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          >
            {storeTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Store Description"
            name="store_description"
            multiline
            rows={3}
            value={formData.store_description || ""}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Commission (%)"
            name="commission"
            type="number"
            value={formData.commission || ""}
            onChange={handleFormChange}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            sx={{ mb: 2 }}
          />

          <FileInput
            label="Upload Store Logo"
            name="store_logo"
            onChange={handleFileChange}
            currentFile={formData.store_logo}
          />
          <FileInput
            label="Upload FSSAI Certificate"
            name="fssai_certificate"
            onChange={handleFileChange}
            currentFile={formData.fssai_certificate}
          />
          <FileInput
            label="Upload License"
            name="license"
            onChange={handleFileChange}
            currentFile={formData.license}
          />
          <FileInput
            label="Upload Display Image"
            name="display_image"
            onChange={handleFileChange}
            currentFile={formData.display_image}
          />
          <FileInput
            label="Upload Passbook Image"
            name="passbook_image"
            onChange={handleFileChange}
            currentFile={formData.passbook_image}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            startIcon={<Save size={18} />}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileSection;