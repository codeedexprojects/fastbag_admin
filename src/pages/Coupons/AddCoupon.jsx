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
    usage_limit: 0,
    is_new_customer: false

  });

  // const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchVendors = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await viewVendors();
  //       setVendors(data);
  //     } catch (error) {
  //       console.error("Error fetching vendors:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchVendors();
  // }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoupon({ ...coupon, [name]: value });
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setCoupon({ ...coupon, [name]: checked });
  };

  const handleSubmit = async () => {
    if (!coupon.code || !coupon.discount_value || !coupon.valid_from || !coupon.valid_to || !coupon.max_discount || !coupon.min_order_amount || !coupon.usage_limit) {
      alert("Please fill in all required fields.");

    } else {
      const formattedCoupon = {
        ...coupon,
        valid_from: `${coupon.valid_from}T00:00:00`,
        valid_to: `${coupon.valid_to}T00:00:00`,
      };

   try {
       const { id, ...reqBody } = formattedCoupon;
      // console.log(formattedCoupon)
      const response = await addCoupon(reqBody);
      console.log("Coupon added successfully:", response);
      alert("Coupon added successfully!");
      setCoupon({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        min_order_amount: "",
        max_discount: "",
        valid_from: "",
        valid_to: "",
        usage_limit: 0,
        is_new_customer: false

       });
    
   } catch (error) {
    console.log(error)
   }
    }

    
  };


  return (
    <Paper sx={{ p: 3, maxWidth: "600px", mx: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {coupon.id ? "Edit Coupon" : "Add Coupon"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Coupon Code"
            name="code"
            value={coupon.code}
            onChange={handleChange}
            required
          />
        </Grid> <Grid item xs={12}>
          <TextField
            fullWidth
            label="Minimum Order Amount"
            name="min_order_amount"
            type="number"
            value={coupon.min_order_amount}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Maximum Discount"
            name="max_discount"
            type="number"
            value={coupon.max_discount}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Usage limit"
            name="usage_limit"
            type="number"
            value={coupon.usage_limit}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>

        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
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
            label="Discount Value"
            name="discount_value"
            type="number"
            value={coupon.discount_value}
            onChange={handleChange}
            required
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
            InputLabelProps={{ shrink: true }}
            required
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
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
       
        <Grid item xs={6}>
          <Typography>New Customer</Typography>
          <Switch
            name="is_new_customer"
            checked={coupon.is_new_customer}
            onChange={handleSwitchChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            {coupon.id ? "Update Coupon" : "Add Coupon"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AddEditCoupon;
