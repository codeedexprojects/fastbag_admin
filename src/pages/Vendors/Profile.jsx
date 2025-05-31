import React, { useState, useEffect } from "react";
import { Box, Paper, Avatar, Typography, Link, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, } from "@mui/material";
import { LocationOn, Phone, Email, AccessTime, Business, Store, Description, Article, Edit, Delete, } from "@mui/icons-material";
import { viewSingleVendor, updateVendor } from "../../services/allApi";

const ProfileSection = ({ vendorId }) => {
  const [storeDetails, setStoreDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

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
    fetchVendorDetails();
  }, [vendorId]);

  const handleEditClick = () => {
    setIsEditing(true);
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
      const updatedData = new FormData();

      // Append only fields that are not null or have been updated
      Object.keys(formData).forEach((key) => {
        if (
          key === "store_logo" ||
          key === "fssai_certificate" ||
          key === "license" ||
          key === "display_image"
        ) {
          if (formData[key] instanceof File) {
            updatedData.append(key, formData[key]); // Append only if it's a new file
          }
        } else {
          updatedData.append(key, formData[key]);
        }
      });

      await updateVendor(updatedData, vendorId);
      setIsEditing(false);

      // Fetch the updated vendor details
      const updatedVendor = await viewSingleVendor(vendorId);
      setStoreDetails(updatedVendor);
    } catch (error) {
      console.error("Error updating vendor:", error);
    }
  };


  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper sx={{ p: 3, position: "relative" }}>
      <IconButton
        onClick={handleEditClick}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          color: "text.secondary",
        }}
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
      <Typography variant="body2" align="center" color="textSecondary">
        Store ID: {storeDetails.store_id}
      </Typography>
      <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 2 }}>
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
          <Typography variant="body2">
            <b>Landmark</b>: {storeDetails.business_landmark}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <AccessTime sx={{ mr: 1 }} />
          <Typography variant="body2">
            <b>Operating Hours</b>: {storeDetails.opening_time} - {storeDetails.closing_time}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Article sx={{ mr: 1 }} />
          <Typography variant="body2">
            <b>FSSAI No</b>: {storeDetails.fssai_no}{" "}
            <Link href={storeDetails.fssai_certificate} target="_blank" rel="noopener">
              (View Certificate)
            </Link>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Article sx={{ mr: 1 }} />
          <Typography variant="body2">
            <b>License</b>:{" "}
            <Link href={storeDetails.license} target="_blank" rel="noopener">
              (View License)
            </Link>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Article sx={{ mr: 1 }} />
          <Typography variant="body2">
            <b>Dsiplay Image</b>:{" "}
            <Link href={storeDetails.display_image} target="_blank" rel="noopener">
              (View Image)
            </Link>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Description sx={{ mr: 1 }} />
          <Typography variant="body2">
            <b>Description</b>: {storeDetails.store_description}
          </Typography>
        </Box>
      </Box>

      {/* Edit Modal */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Vendor Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Business Name"
              name="business_name"
              value={formData.business_name || ""}
              onChange={handleFormChange}
              style={{marginTop:"5px"}}
            />
            <TextField
              label="Owner Name"
              name="owner_name"
              value={formData.owner_name || ""}
              onChange={handleFormChange}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleFormChange}
            />
            <TextField
              label="Alternative Email"
              name="alternate_email"
              value={formData.alternate_email || ""}
              onChange={handleFormChange}
            />
            <TextField
              label="Contact Number"
              name="contact_number"
              value={formData.contact_number || ""}
              onChange={handleFormChange}
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address || ""}
              onChange={handleFormChange}
            />
            <TextField
              label="City"
              name="city"
              value={formData.city || ""}
              onChange={handleFormChange}
            />
            <TextField
              label="State"
              name="state"
              value={formData.state || ""}
              onChange={handleFormChange}
            />
            <TextField
              label="Pincode"
              name="pincode"
              value={formData.pincode || ""}
              onChange={handleFormChange}
            />
            <TextField
              label="Landmark"
              name="business_landmark"
              value={formData.business_landmark || ""}
              onChange={handleFormChange}
            />
            <TextField
              label="Opening Time"
              name="opening_time"
              value={formData.opening_time || ""}
              onChange={handleFormChange}
            />
            <TextField
              label="Closing Time"
              name="closing_time"
              value={formData.closing_time || ""}
              onChange={handleFormChange}
            />
            <TextField
              label="Description"
              name="store_description"
              multiline
              rows={4}
              value={formData.store_description || ""}
              onChange={handleFormChange}
            />
            <TextField
              label="FSSAI Number"
              name="fssai_no"
              value={formData.fssai_no || ""}
              onChange={handleFormChange}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Store Logo:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {formData.store_logo && (
                  <Box sx={{ position: "relative", width: 100, height: 100 }}>
                    <img
                      src={typeof formData.store_logo === "string" ? formData.store_logo : URL.createObjectURL(formData.store_logo)}
                      alt="Store Logo"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                    />
                    <IconButton
                      onClick={() => setFormData({ ...formData, store_logo: null })}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "red",
                        backgroundColor: "white",
                        "&:hover": { backgroundColor: "white" },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                )}
                <input
                  type="file"
                  name="store_logo"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ marginTop: "8px" }}
                />
              </Box>
            </Box>

            {/* FSSAI Certificate */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                FSSAI Certificate:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {formData.fssai_certificate && (
                  <Box sx={{ position: "relative", width: 100, height: 100 }}>
                    <img
                      src={typeof formData.fssai_certificate === "string" ? formData.fssai_certificate : URL.createObjectURL(formData.fssai_certificate)}
                      alt="FSSAI Certificate"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                    />
                    <IconButton
                      onClick={() => setFormData({ ...formData, fssai_certificate: null })}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "red",
                        backgroundColor: "white",
                        "&:hover": { backgroundColor: "white" },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                )}
                <input
                  type="file"
                  name="fssai_certificate"
                  onChange={handleFileChange}
                  accept=".pdf, image/*"
                  style={{ marginTop: "8px" }}
                />
              </Box>
            </Box>

            {/* License */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                License:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {formData.license && (
                  <Box sx={{ position: "relative", width: 100, height: 100 }}>
                    <img
                      src={typeof formData.license === "string" ? formData.license : URL.createObjectURL(formData.license)}
                      alt="License"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                    />
                    <IconButton
                      onClick={() => setFormData({ ...formData, license: null })}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "red",
                        backgroundColor: "white",
                        "&:hover": { backgroundColor: "white" },
                      }}>
                      <Delete />
                    </IconButton>
                  </Box>
                )}
                <input
                  type="file"
                  name="license"
                  onChange={handleFileChange}
                  accept=".pdf, image/*"
                  style={{ marginTop: "8px" }}
                />
              </Box>
            </Box>

            {/* Display Image */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Display Image:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {formData.display_image && (
                  <Box sx={{ position: "relative", width: 100, height: 100 }}>
                    <img
                      src={
                        typeof formData.display_image === "string"
                          ? formData.display_image
                          : URL.createObjectURL(formData.display_image)
                      }
                      alt="Display Image"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                    />
                    <IconButton
                      onClick={() => setFormData({ ...formData, display_image: null })}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "red",
                        backgroundColor: "white",
                        "&:hover": { backgroundColor: "white" },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                )}
                <input
                  type="file"
                  name="display_image"
                  onChange={handleFileChange}
                  accept=".pdf, image/*"
                  style={{ marginTop: "8px" }}
                />
              </Box>
            </Box>
          </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProfileSection;