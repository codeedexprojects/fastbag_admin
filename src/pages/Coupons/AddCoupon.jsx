import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Grid,
  Paper,
  Alert,
} from "@mui/material";
import { addCoupon } from "../../services/allApi";

const AddEditCoupon = () => {
  const [coupon, setCoupon] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_amount: "",
    max_discount: "",
    valid_from: "",
    valid_to: "",
    usage_limit: "",
    is_new_customer: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "code":
        if (!value.trim()) {
          error = "Coupon code is required";
        } else if (value.length < 3) {
          error = "Coupon code must be at least 3 characters";
        } else if (!/^[A-Z0-9]+$/.test(value)) {
          error = "Coupon code must contain only uppercase letters and numbers";
        }
        break;

      case "discount_value":
        if (!value) {
          error = "Discount value is required";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = "Discount value must be greater than 0";
        } else if (coupon.discount_type === "percentage" && parseFloat(value) > 100) {
          error = "Percentage discount cannot exceed 100%";
        }
        break;

      case "min_order_amount":
        if (!value) {
          error = "Minimum order amount is required";
        } else if (isNaN(value) || parseFloat(value) < 0) {
          error = "Minimum order amount must be 0 or greater";
        }
        break;

      case "max_discount":
        if (!value) {
          error = "Maximum discount is required";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = "Maximum discount must be greater than 0";
        } else if (parseFloat(value) > parseFloat(coupon.min_order_amount)) {
          error = "Maximum discount cannot exceed minimum order amount";
        }
        break;

      case "usage_limit":
        if (!value && value !== 0) {
          error = "Usage limit is required";
        } else if (isNaN(value) || parseInt(value) < 0) {
          error = "Usage limit must be 0 or greater";
        } else if (!Number.isInteger(parseFloat(value))) {
          error = "Usage limit must be a whole number";
        }
        break;

      case "valid_from":
        if (!value) {
          error = "Valid from date is required";
        }
        break;

      case "valid_to":
        if (!value) {
          error = "Valid to date is required";
        } else if (coupon.valid_from && new Date(value) <= new Date(coupon.valid_from)) {
          error = "Valid to date must be after valid from date";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For code field, convert to uppercase automatically
    const newValue = name === "code" ? value.toUpperCase() : value;
    
    setCoupon({ ...coupon, [name]: newValue });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    
    // Validate on change
    const error = validateField(name, newValue);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setCoupon({ ...coupon, [name]: checked });
  };

  const validateAll = () => {
    const newErrors = {};
    
    Object.keys(coupon).forEach((key) => {
      if (key !== "is_new_customer") {
        const error = validateField(key, coupon[key]);
        if (error) {
          newErrors[key] = error;
        }
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
    
    const formattedCoupon = {
      ...coupon,
      valid_from: `${coupon.valid_from}T00:00:00`,
      valid_to: `${coupon.valid_to}T00:00:00`,
      discount_value: parseFloat(coupon.discount_value),
      min_order_amount: parseFloat(coupon.min_order_amount),
      max_discount: parseFloat(coupon.max_discount),
      usage_limit: parseInt(coupon.usage_limit),
    };

    try {
      const { id, ...reqBody } = formattedCoupon;
      const response = await addCoupon(reqBody);
      console.log("Coupon added successfully:", response);
      setSuccessMessage("Coupon added successfully!");
      
      // Reset form
      setCoupon({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        min_order_amount: "",
        max_discount: "",
        valid_from: "",
        valid_to: "",
        usage_limit: "",
        is_new_customer: false,
      });
      setErrors({});
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ submit: "An error occurred while adding the coupon" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: "600px", mx: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {coupon.id ? "Edit Coupon" : "Add Coupon"}
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.submit}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Coupon Code"
            name="code"
            value={coupon.code}
            onChange={handleChange}
            error={!!errors.code}
            helperText={errors.code || "Use uppercase letters and numbers only"}
            required
            inputProps={{ 
              maxLength: 20,
              style: { textTransform: 'uppercase' }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.discount_type}>
            <InputLabel>Discount Type</InputLabel>
            <Select
              name="discount_type"
              value={coupon.discount_type}
              onChange={handleChange}
              required
            >
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="fixed">Fixed Amount</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={`Discount Value ${coupon.discount_type === 'percentage' ? '(%)' : '(₹)'}`}
            name="discount_value"
            type="number"
            value={coupon.discount_value}
            onChange={handleChange}
            error={!!errors.discount_value}
            helperText={errors.discount_value}
            required
            inputProps={{ 
              min: 0,
              max: coupon.discount_type === 'percentage' ? 100 : undefined,
              step: coupon.discount_type === 'percentage' ? 1 : 0.01
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Minimum Order Amount (₹)"
            name="min_order_amount"
            type="number"
            value={coupon.min_order_amount}
            onChange={handleChange}
            error={!!errors.min_order_amount}
            helperText={errors.min_order_amount}
            required
            inputProps={{ 
              min: 0,
              step: 0.01
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Maximum Discount (₹)"
            name="max_discount"
            type="number"
            value={coupon.max_discount}
            onChange={handleChange}
            error={!!errors.max_discount}
            helperText={errors.max_discount}
            required
            inputProps={{ 
              min: 0,
              step: 0.01
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Usage Limit"
            name="usage_limit"
            type="number"
            value={coupon.usage_limit}
            onChange={handleChange}
            error={!!errors.usage_limit}
            helperText={errors.usage_limit || "Set to 0 for unlimited usage"}
            required
            inputProps={{ 
              min: 0,
              step: 1
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Valid From"
            name="valid_from"
            type="date"
            value={coupon.valid_from}
            onChange={handleChange}
            error={!!errors.valid_from}
            helperText={errors.valid_from}
            InputLabelProps={{ shrink: true }}
            required
            inputProps={{
              min: new Date().toISOString().split('T')[0]
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Valid To"
            name="valid_to"
            type="date"
            value={coupon.valid_to}
            onChange={handleChange}
            error={!!errors.valid_to}
            helperText={errors.valid_to}
            InputLabelProps={{ shrink: true }}
            required
            inputProps={{
              min: coupon.valid_from || new Date().toISOString().split('T')[0]
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>New Customer Only</Typography>
            <Switch
              name="is_new_customer"
              checked={coupon.is_new_customer}
              onChange={handleSwitchChange}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : coupon.id ? "Update Coupon" : "Add Coupon"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AddEditCoupon;