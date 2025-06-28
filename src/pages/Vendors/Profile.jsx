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
  Pencil
} from "lucide-react";

import { BadgeCheck, CircleX,FileSignature,FileText,ImageUp,Save } from "lucide-react";
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
 <Paper sx={{ p: 3, position: "relative" ,boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)', borderRadius:3}}>
  <IconButton
    onClick={handleEditClick}
    sx={{ position: "absolute", top: 16, right: 16,  }}
    aria-label="edit vendor details"
  >
    <Pencil  size={20} />
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
        <Box >{item.icon}</Box>
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

    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Info size={20} />
      <Typography variant="body2">
        <b>Description</b>: {storeDetails.store_description}
      </Typography>
    </Box>
  </Box>
</Paper>


  );
};

export default ProfileSection;
