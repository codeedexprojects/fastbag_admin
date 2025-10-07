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
    latitude: "",
    longitude: "",
    address: "",
  });

  const [storeTypes, setStoreTypes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({});

  useEffect(() => {
    const fetchStoreTypes = async () => {
      try {
        const response = await viewStores();
        setStoreTypes(response);
      } catch (error) {
        console.error("Failed to fetch store types", error);
      }
    };
    fetchStoreTypes();
  }, []);
const nav=useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setVendorData({ ...vendorData, [name]: files[0] });
      setImagePreviews({
        ...imagePreviews,
        [name]: URL.createObjectURL(files[0]),
      });
    }
  };

  const handleRemoveImage = (name) => {
    setVendorData({ ...vendorData, [name]: null });
    setImagePreviews({ ...imagePreviews, [name]: null });
  };

  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(":");
    const isPM = hour >= 12;
    const formattedHour = isPM ? hour % 12 || 12 : hour;
    const period = isPM ? "PM" : "AM";
    return `${formattedHour}:${minute} ${period}`;
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.entries(vendorData).forEach(([key, value]) => {

      if ((key === "opening_time" || key === "closing_time") && value) {
        value = convertTo12HourFormat(value);
      }

      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    try {
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }

       const response = await addVendor(formData);
       if(response.status===201){
        toast.success("Vendor added successfully!")
        nav(-1)
       }else{
        toast.error("Vendor adding failed!")
       }
       console.log("Vendor added successfully:", response);
    } catch (error) {
      console.error("Failed to add vendor", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add Vendor
      </Typography>

      <Grid container spacing={3}>
        {[
          { label: "Owner Name", name: "owner_name" },
          { label: "Email", name: "email" },
          { label: "Business Name", name: "business_name" },
          { label: "Business Location", name: "business_location" },
          { label: "Business Landmark", name: "business_landmark" },
          { label: "Contact Number", name: "contact_number" },
          { label: "FSSAI Number", name: "fssai_no" },
          { label: "Alternate Email", name: "alternate_email" },
        ].map((field, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              label={field.label}
              name={field.name}
              value={vendorData[field.name]}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
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
            />
          </Grid>
        ))}

        <Grid item xs={12} sm={6}>
          <InputLabel>Store Type</InputLabel>
          <TextField
            select
            name="store_type"
            value={vendorData.store_type}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          >
            {storeTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {[ 
          { label: "FSSAI Certificate", name: "fssai_certificate" },
          { label: "Store Logo", name: "store_logo" },
          { label: "Display Image", name: "display_image" },
          { label: "License", name: "license" },
        ].map((field, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <InputLabel>{field.label}</InputLabel>
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                type="file"
                name={field.name}
                onChange={handleFileChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
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
                {Number(vendorData.latitude).toFixed(6)},{" "}
                {Number(vendorData.longitude).toFixed(6)}
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
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Reset
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AddVendor;
