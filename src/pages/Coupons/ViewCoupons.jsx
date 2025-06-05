import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { viewCoupons, editCoupons, deleteCoupon } from "../../services/allApi";
import { toast } from "react-toastify";

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch coupons from API
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await viewCoupons();
      setCoupons(data.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddCoupon = () => {
    navigate("/add-coupons");
  };

  // Convert "dd/mm/yyyy" to "yyyy-mm-dd" for date input fields
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    if (parts.length !== 3) return "";
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  };

  const handleEditCoupon = (coupon) => {
    const valid_from = formatDateForInput(coupon.valid_from);
    const valid_to = formatDateForInput(coupon.valid_to);

    setEditCoupon({
      ...coupon,
      valid_from,
      valid_to,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCoupon(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditCoupon((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await editCoupons(editCoupon, editCoupon.id);
      if (res.status === 200) {
        await fetchCoupons();
        toast.success("Coupon edited successfully!");
      } else {
        console.error("Failed to update coupon:", res);
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
    setOpen(false);
    setEditCoupon(null);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setCouponToDelete(null);
    setDeleteDialogOpen(false);
  };

  // Confirm and perform deletion
  const confirmDeleteCoupon = async () => {
    if (!couponToDelete) return;

    try {
      const res = await deleteCoupon(couponToDelete.id);
      if (res.status === 204) {
        toast.success("Coupon deleted!");
        fetchCoupons();
      } else {
        toast.error("Failed to delete coupon");
      }
    } catch (error) {
      toast.error("Error deleting coupon");
    }
    closeDeleteDialog();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Coupon Management
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body2" color="textSecondary">
          Dashboard &gt; Coupon Management
        </Typography>
        <Button
          onClick={handleAddCoupon}
          variant="contained"
          startIcon={<Add />}
          sx={{ backgroundColor: "#1e1e2d" }}
        >
          Add Coupon
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Discount Type</TableCell>
              <TableCell>Discount Value</TableCell>
              <TableCell>Min Order</TableCell>
              <TableCell>Max Discount</TableCell>
              <TableCell>Valid From</TableCell>
              <TableCell>Valid To</TableCell>
              <TableCell style={{ textAlign: "center" }}>New Customer Only</TableCell>
              <TableCell style={{ textAlign: "center" }}>Usage Limit</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.length > 0 ? (
              coupons
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.vendor_name || "N/A"}</TableCell>
                    <TableCell>
                      {coupon.discount_type === "fixed" ? "Fixed Amount" : coupon.discount_type}
                    </TableCell>
                    <TableCell>
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}%`
                        : `₹${coupon.discount_value}`}
                    </TableCell>
                    <TableCell>{coupon.min_order_amount ? `₹${coupon.min_order_amount}` : "N/A"}</TableCell>
                    <TableCell>{coupon.max_discount ? `₹${coupon.max_discount}` : "N/A"}</TableCell>
                    <TableCell>{coupon.valid_from || "N/A"}</TableCell>
                    <TableCell>{coupon.valid_to || "N/A"}</TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {coupon.is_new_customer ? "✔️" : "❌"}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {coupon.usage_limit ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditCoupon(coupon)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => openDeleteDialog(coupon)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  {loading ? "Loading..." : "No coupons available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={coupons.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />

      {/* Edit Coupon Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Coupon</DialogTitle>
        <DialogContent>
          {editCoupon && (
            <>
              <TextField
                margin="dense"
                label="Code"
                name="code"
                fullWidth
                variant="outlined"
                value={editCoupon.code}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                select
                label="Discount Type"
                name="discount_type"
                fullWidth
                variant="outlined"
                value={editCoupon.discount_type}
                onChange={handleInputChange}
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </TextField>
              <TextField
                margin="dense"
                label="Discount Value"
                name="discount_value"
                type="number"
                fullWidth
                variant="outlined"
                value={editCoupon.discount_value}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Minimum Order Amount"
                name="min_order_amount"
                type="number"
                fullWidth
                variant="outlined"
                value={editCoupon.min_order_amount || ""}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Maximum Discount"
                name="max_discount"
                type="number"
                fullWidth
                variant="outlined"
                value={editCoupon.max_discount || ""}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Valid From"
                name="valid_from"
                type="date"
                fullWidth
                variant="outlined"
                value={editCoupon.valid_from || ""}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                label="Valid To"
                name="valid_to"
                type="date"
                fullWidth
                variant="outlined"
                value={editCoupon.valid_to || ""}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!editCoupon.is_new_customer}
                    onChange={handleInputChange}
                    name="is_new_customer"
                  />
                }
                label="New Customer Only"
              />
              <TextField
                margin="dense"
                label="Usage Limit"
                name="usage_limit"
                type="number"
                fullWidth
                variant="outlined"
                value={editCoupon.usage_limit ?? ""}
                onChange={handleInputChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete coupon "{couponToDelete?.code}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteCoupon} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CouponList;
