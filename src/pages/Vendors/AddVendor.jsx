import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  InputLabel,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { addVendor, viewStores } from "../../services/allApi";
import GoogleMapPicker from "../../components/LocationPicker";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddVendor = () => {
  const [vendorData, setVendorData] = useState({
    owner_name: "",
    email: "",
    business_name: "",
    business_location: "",
    business_landmark: "",
    contact_number: "",
    city: "",
    state: "",
    pincode: "",
    fssai_no: "",
    alternate_email: "",
    store_description: "",
    store_type: "",
    opening_time: "",
    closing_time: "",
    fssai_certificate: null,
    store_logo: null,
    display_image: null,
    license: null,
    passbook_image: null,
    commission: "",
    latitude: "",
    longitude: "",
    address: "",
  });

  const [storeTypes, setStoreTypes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nav = useNavigate();

  // Default store types if API fails or for initial display
  const defaultStoreTypes = [
    { id: "restaurant", name: "Restaurant" },
    { id: "cafe", name: "Cafe" },
    { id: "bakery", name: "Bakery" },
    { id: "grocery", name: "Grocery Store" },
    { id: "supermarket", name: "Supermarket" },
    { id: "food_truck", name: "Food Truck" },
    { id: "juice_bar", name: "Juice Bar" },
    { id: "ice_cream", name: "Ice Cream Parlor" },
    { id: "sweet_shop", name: "Sweet Shop" },
    { id: "fast_food", name: "Fast Food" },
  ];

  useEffect(() => {
    const fetchStoreTypes = async () => {
      try {
        const response = await viewStores();
        setStoreTypes(response);
      } catch (error) {
        console.error("Failed to fetch store types", error);
        toast.error("Failed to load store types, using defaults");
        setStoreTypes(defaultStoreTypes);
      }
    };
    fetchStoreTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setVendorData({ ...vendorData, [name]: files[0] });
      setImagePreviews({
        ...imagePreviews,
        [name]: URL.createObjectURL(files[0]),
      });
      // Clear error for this field
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const handleRemoveImage = (name) => {
    setVendorData({ ...vendorData, [name]: null });
    setImagePreviews({ ...imagePreviews, [name]: null });
  };

  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const hourNum = parseInt(hour, 10);
    const isPM = hourNum >= 12;
    const formattedHour = isPM ? (hourNum === 12 ? 12 : hourNum - 12) : (hourNum === 0 ? 12 : hourNum);
    const period = isPM ? "PM" : "AM";
    return `${formattedHour}:${minute} ${period}`;
  };

  const truncateToDecimalPlaces = (value, places) => {
    if (!value || value === "") return "";
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    // Truncate to specified decimal places without rounding
    const multiplier = Math.pow(10, places);
    return (Math.floor(num * multiplier) / multiplier).toString();
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!vendorData.owner_name.trim()) newErrors.owner_name = "Owner name is required";
    if (!vendorData.email.trim()) newErrors.email = "Email is required";
    if (!vendorData.business_name.trim()) newErrors.business_name = "Business name is required";
    if (!vendorData.contact_number.trim()) newErrors.contact_number = "Contact number is required";
    if (!vendorData.store_type) newErrors.store_type = "Store type is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (vendorData.email && !emailRegex.test(vendorData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (vendorData.alternate_email && !emailRegex.test(vendorData.alternate_email)) {
      newErrors.alternate_email = "Invalid alternate email format";
    }

    // Contact number validation (basic check for numbers)
    const phoneRegex = /^\d{10}$/;
    if (vendorData.contact_number && !phoneRegex.test(vendorData.contact_number.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.contact_number = "Invalid contact number format (should be 10 digits)";
    }

    // Commission validation
    if (vendorData.commission) {
      const commissionValue = parseFloat(vendorData.commission);
      if (isNaN(commissionValue)) {
        newErrors.commission = "Commission must be a valid number";
      } else if (commissionValue < 0 || commissionValue > 100) {
        newErrors.commission = "Commission must be between 0 and 100";
      }
    }

    // Latitude and longitude validation
    if (vendorData.latitude) {
      const lat = parseFloat(vendorData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = "Invalid latitude value";
      }
    }
    if (vendorData.longitude) {
      const lng = parseFloat(vendorData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = "Invalid longitude value";
      }
    }

    // Required files validation
    if (!vendorData.store_logo) {
      newErrors.store_logo = "Store logo is required";
    }
    if (!vendorData.license) {
      newErrors.license = "License is required";
    }

    // File size validation (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    ['store_logo', 'fssai_certificate', 'display_image', 'license', 'passbook_image'].forEach(field => {
      if (vendorData[field] && vendorData[field].size > maxSize) {
        newErrors[field] = "File size must be less than 5MB";
      }
    });

    // File type validation (images only)
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    ['store_logo', 'fssai_certificate', 'display_image', 'license', 'passbook_image'].forEach(field => {
      if (vendorData[field] && !validImageTypes.includes(vendorData[field].type)) {
        newErrors[field] = "Only image files (JPEG, PNG, GIF, WEBP) are allowed";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    Object.entries(vendorData).forEach(([key, value]) => {
      // Handle file fields - must be File objects
      if (key === "store_logo" || key === "fssai_certificate" || 
          key === "display_image" || key === "license" || 
          key === "id_proof" || key === "passbook_image") {
        // Only append if it's actually a File object
        if (value instanceof File) {
          formData.append(key, value);
        }
        return;
      }

      // Convert time format
      if ((key === "opening_time" || key === "closing_time") && value) {
        const convertedTime = convertTo12HourFormat(value);
        formData.append(key, convertedTime);
        return;
      }

      // Truncate latitude and longitude to 10 decimal places
      if ((key === "latitude" || key === "longitude") && value) {
        const truncatedValue = truncateToDecimalPlaces(value, 10);
        if (truncatedValue) {
          formData.append(key, truncatedValue);
        }
        return;
      }

      // Only append non-empty values for other fields
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    // Debug: Log FormData contents
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }

    try {
      const response = await addVendor(formData);
      if (response.status === 201) {
        toast.success("Vendor added successfully!");
        nav(-1);
      } else {
        toast.error("Vendor adding failed!");
      }
    } catch (error) {
      console.error("Failed to add vendor", error);
      
      // Handle backend validation errors
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        const formattedErrors = {};
        
        Object.keys(backendErrors).forEach((key) => {
          if (Array.isArray(backendErrors[key])) {
            formattedErrors[key] = backendErrors[key][0];
          } else {
            formattedErrors[key] = backendErrors[key];
          }
        });
        
        setErrors(formattedErrors);
        toast.error("Please fix the errors and try again");
      } else {
        toast.error("Failed to add vendor. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setVendorData({
      owner_name: "",
      email: "",
      business_name: "",
      business_location: "",
      business_landmark: "",
      contact_number: "",
      city: "",
      state: "",
      pincode: "",
      fssai_no: "",
      alternate_email: "",
      store_description: "",
      store_type: "",
      opening_time: "",
      closing_time: "",
      fssai_certificate: null,
      store_logo: null,
      display_image: null,
      license: null,
      passbook_image: null,
      commission: "",
      latitude: "",
      longitude: "",
      address: "",
    });
    setImagePreviews({});
    setErrors({});
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add Vendor
      </Typography>

      <Grid container spacing={3}>
        {[
          { label: "Owner Name", name: "owner_name", required: true },
          { label: "Email", name: "email", type: "email", required: true },
          { label: "Business Name", name: "business_name", required: true },
          { label: "Business Location", name: "business_location" },
          { label: "Business Landmark", name: "business_landmark" },
          { label: "Contact Number", name: "contact_number", type: "tel", required: true },
          { label: "FSSAI Number", name: "fssai_no" },
          { label: "Alternate Email", name: "alternate_email", type: "email" },
        ].map((field, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              label={field.label}
              name={field.name}
              type={field.type || "text"}
              value={vendorData[field.name]}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              required={field.required}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
            />
          </Grid>
        ))}

        <Grid item xs={12}>
          <TextField
            label="Store Description"
            name="store_description"
            value={vendorData.store_description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            error={!!errors.store_description}
            helperText={errors.store_description}
          />
        </Grid>

        {[
          { label: "Opening Time", name: "opening_time" },
          { label: "Closing Time", name: "closing_time" },
        ].map((field, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              label={field.label}
              name={field.name}
              type="time"
              value={vendorData[field.name]}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
            />
          </Grid>
        ))}

        <Grid item xs={12} sm={6}>
          <InputLabel required>Store Type</InputLabel>
          <TextField
            select
            name="store_type"
            value={vendorData.store_type}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            error={!!errors.store_type}
            helperText={errors.store_type}
          >
            {storeTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Commission (%)"
            name="commission"
            type="number"
            value={vendorData.commission}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            error={!!errors.commission}
            helperText={errors.commission || "Enter commission percentage (0-100)"}
          />
        </Grid>

        {[
          { label: "FSSAI Certificate", name: "fssai_certificate", required: false },
          { label: "Store Logo", name: "store_logo", required: true },
          { label: "Display Image", name: "display_image", required: false },
          { label: "License", name: "license", required: true },
          { label: "Passbook Image", name: "passbook_image", required: false },
        ].map((field, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <InputLabel required={field.required}>{field.label}</InputLabel>
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                type="file"
                name={field.name}
                onChange={handleFileChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{ accept: "image/*" }}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
              />
              {imagePreviews[field.name] && (
                <Box display="flex" alignItems="center" gap={1}>
                  <img
                    src={imagePreviews[field.name]}
                    alt={field.label}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(field.name)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Select Store Location
          </Typography>

          <GoogleMapPicker
            vendorData={vendorData}
            setVendorData={setVendorData}
          />

          {Number.isFinite(Number(vendorData.latitude)) &&
            Number.isFinite(Number(vendorData.longitude)) && (
              <Typography mt={2} fontSize="14px" color="text.secondary">
                📍 <strong>Selected Location:</strong>
                <br />
                {vendorData.address && (
                  <>
                    <strong>Address:</strong> {vendorData.address}
                    <br />
                  </>
                )}
                <strong>Coordinates:</strong>{" "}
                {truncateToDecimalPlaces(vendorData.latitude, 10)},{" "}
                {truncateToDecimalPlaces(vendorData.longitude, 10)}
              </Typography>
            )}
          
          {(errors.latitude || errors.longitude) && (
            <Typography color="error" fontSize="12px" mt={1}>
              {errors.latitude || errors.longitude}
            </Typography>
          )}
        </Grid>

        <Grid container spacing={3} mt={2}>
          {[
            { label: "Address", name: "address" },
            { label: "City", name: "city" },
            { label: "State", name: "state" },
            { label: "Pincode", name: "pincode" },
          ].map((field, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <TextField
                label={field.label}
                name={field.name}
                value={vendorData[field.name]}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                error={!!errors[field.name]}
                helperText={errors[field.name]}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button 
          variant="outlined" 
          onClick={handleReset}
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddVendor;