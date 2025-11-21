import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Alert } from "@mui/material";
import { addStore } from "../../services/allApi";
import { CircleX, Save } from "lucide-react";

const AddStore = () => {
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Store name is required";
        } else if (value.trim().length < 3) {
          error = "Store name must be at least 3 characters";
        } else if (/^\d+$/.test(value.trim())) {
          error = "Store name must contain letters, not just numbers";
        } else if (value.trim().length > 100) {
          error = "Store name must not exceed 100 characters";
        }
        break;

      case "description":
        if (!value.trim()) {
          error = "Description is required";
        } else if (value.trim().length < 10) {
          error = "Description must be at least 10 characters";
        } else if (/^\d+$/.test(value.trim())) {
          error = "Description must contain letters, not just numbers";
        } else if (value.trim().length > 500) {
          error = "Description must not exceed 500 characters";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData({ ...storeData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Real-time validation
    const error = validateField(name, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const validateAll = () => {
    const newErrors = {};

    Object.keys(storeData).forEach((key) => {
      const error = validateField(key, storeData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    return newErrors;
  };

  const handleSubmit = async () => {
    setSuccessMessage("");
    
    // Validate all fields
    const validationErrors = validateAll();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      setErrors({});
      const response = await addStore({
        name: storeData.name.trim(),
        description: storeData.description.trim(),
      });
      console.log("Store added successfully:", response);
      setSuccessMessage("Store added successfully!");
      setStoreData({
        name: "",
        description: "",
      });
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ submit: "An unexpected error occurred. Please try again." });
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStoreData({
      name: "",
      description: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <Box sx={{ padding: 4, maxWidth: "600px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Add Store
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {errors.non_field_errors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.non_field_errors[0]}
        </Alert>
      )}
      
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.submit}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Name Field */}
        <Grid item xs={12}>
          <TextField
            label="Store Name"
            name="name"
            value={storeData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={
              errors.name || 
              `${storeData.name.length}/100 characters`
            }
            fullWidth
            variant="outlined"
            required
            inputProps={{
              maxLength: 100
            }}
          />
        </Grid>

        {/* Description Field */}
        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            value={storeData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={
              errors.description || 
              `${storeData.description.length}/500 characters`
            }
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            required
            inputProps={{
              maxLength: 500
            }}
          />
        </Grid>
      </Grid>

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button
          startIcon={<CircleX />}
          variant="outlined"
          color="error"
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default AddStore;