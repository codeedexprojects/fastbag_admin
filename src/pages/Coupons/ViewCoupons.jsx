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
import { Edit, Delete, Add, BorderColor, Done, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { viewCoupons, editCoupons, deleteCoupon } from "../../services/allApi";
import { toast } from "react-toastify";
import { CirclePlus, CircleX, Pencil, Plus, Save, Trash2 } from "lucide-react";

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
          variant="containedSecondary"
         
          startIcon={<CirclePlus/>}        >
          Add Coupon
        </Button>
      </Box>

      <TableContainer
               component={Paper}
               elevation={3}
               sx={{ borderRadius: 3 ,boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',overflow: "hidden", mt: 3 }}
             >
               <Table sx={{ minWidth: 650 }} aria-label="category table">
                 <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow >
              <TableCell sx={{  fontWeight: 'bold' }}>No</TableCell>
              <TableCell sx={{  fontWeight: 'bold' }}>Code</TableCell>
              <TableCell sx={{  fontWeight: 'bold' }}>Vendor</TableCell>
              <TableCell sx={{  fontWeight: 'bold' }}>Discount Type</TableCell>
              <TableCell sx={{  fontWeight: 'bold' }}>Discount Value</TableCell>
              <TableCell sx={{  fontWeight: 'bold' }}>Min Order</TableCell>
              <TableCell sx={{  fontWeight: 'bold' }}>Max Discount</TableCell>
              <TableCell sx={{  fontWeight: 'bold' }}>Valid From</TableCell>
              <TableCell sx={{  fontWeight: 'bold' }}>Valid To</TableCell>
              <TableCell sx={{  fontWeight: 'bold' }} style={{ textAlign: "center" }}>New Customer Only</TableCell>
              <TableCell sx={{  fontWeight: 'bold' }} style={{ textAlign: "center" }}>Usage Limit</TableCell>
              <TableCell sx={{  fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody    >
            {coupons.length > 0 ? (
              coupons
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((coupon,index) => (
                  <TableRow hover   key={coupon.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell sx={{textTransform:'capitalize'}}>{coupon.vendor_name || "N/A"}</TableCell>
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
                      {coupon.is_new_customer ? <Done fontSize="large" color="primary"/> : <Close fontSize="large" color="error"/>}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {coupon.usage_limit ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditCoupon(coupon)}>
                        <Pencil />
                      </IconButton>
                      <IconButton color="error" onClick={() => openDeleteDialog(coupon)}>
                        <Trash2 />
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
  <Box
    sx={{
      bgcolor: 'background.paper',
      borderRadius: 3,
      boxShadow: 24,
      p: 4,
      outline: 'none',
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6" fontWeight={600}>
        Edit Coupon
      </Typography>
      <IconButton onClick={handleClose} color="error">
        <CircleX size={20} />
      </IconButton>
    </Box>

    {editCoupon && (
      <Box component="form" noValidate autoComplete="off">
        {[
          { label: 'Coupon Code', name: 'code' },
          { label: 'Discount Value', name: 'discount_value', type: 'number' },
          { label: 'Minimum Order Amount', name: 'min_order_amount', type: 'number' },
          { label: 'Maximum Discount', name: 'max_discount', type: 'number' },
          { label: 'Valid From', name: 'valid_from', type: 'date' },
          { label: 'Valid To', name: 'valid_to', type: 'date' },
          { label: 'Usage Limit', name: 'usage_limit', type: 'number' },
        ].map(({ label, name, type = 'text' }) => (
          <TextField
            key={name}
            fullWidth
            size="small"
            margin="dense"
            label={label}
            name={name}
            type={type}
            value={editCoupon[name] || ''}
            onChange={handleInputChange}
            InputLabelProps={type === 'date' ? { shrink: true } : undefined}
            sx={{
              backgroundColor: '#f9fafb',
              borderRadius: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e5e7eb',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9ca3af',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366f1',
              },
            }}
          />
        ))}

        <TextField
          select
          fullWidth
          size="small"
          margin="dense"
          label="Discount Type"
          name="discount_type"
          value={editCoupon.discount_type}
          onChange={handleInputChange}
          sx={{
            backgroundColor: '#f9fafb',
            borderRadius: 1,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e5e7eb',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#9ca3af',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6366f1',
            },
          }}
        >
          <MenuItem value="percentage">Percentage</MenuItem>
          <MenuItem value="fixed">Fixed Amount</MenuItem>
        </TextField>

        <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Checkbox
              name="is_new_customer"
              checked={!!editCoupon.is_new_customer}
              onChange={handleInputChange}
            />
          }
          label="New Customer Only"
        />
      </Box>
    )}

    <Box display="flex" justifyContent="flex-end" mt={3}>
      <Button
        onClick={handleClose}
        startIcon={<CircleX size={20} />}
        variant="containedError"
      >
        Cancel
      </Button>
      <Button
        onClick={handleSave}
        startIcon={<Save size={20} />}
        variant="contained"
        sx={{ ml: 2 }}
      >
        Save
      </Button>
    </Box>
  </Box>
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
