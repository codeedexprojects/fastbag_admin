import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Alert } from "@mui/material";
import { addStore } from "../../services/allApi";

const AddStore = () => {
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData({ ...storeData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setErrors({});
      setSuccessMessage("");
      const response = await addStore(storeData);
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
        console.error("An unexpected error occurred:", error);
      }
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

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errors.non_field_errors && <Alert severity="error">{errors.non_field_errors[0]}</Alert>}

      <Grid container spacing={3}>
        {/* Name Field */}
        <Grid item xs={12}>
          <TextField
            label="Store Name"
            name="name"
            value={storeData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name && errors.name[0]}
            fullWidth
            variant="outlined"
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
            helperText={errors.description && errors.description[0]}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
          />
        </Grid>
      </Grid>

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default AddStore;
