import React, { useState } from "react";
import { Grid, Paper, Box, Typography, Button, Modal, CircularProgress } from "@mui/material";
import { AccountBalanceWallet, ShoppingCart, Star } from "@mui/icons-material";
import { approvePendingDetails, getVendorsPendingDetails } from "../../services/allApi";
import { useParams } from "react-router-dom";



const StatsAndTransactions = () => {
  const [open, setOpen] = useState(false); // To control modal visibility
  const [pendingDetails, setPendingDetails] = useState(null); // Store API data
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [error, setError] = useState(null); // Error state
  const [approveLoading, setApproveLoading] = useState(false); // Approve button loading state
  const { vendorId } = useParams();

  const handleOpen = async () => {
    setLoading(true);
    setError(null);
    setOpen(true);

    try {
      const data = await getVendorsPendingDetails(vendorId);
      setPendingDetails(data);
    } catch (err) {
      setError("Failed to fetch pending details. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPendingDetails(null);
    setError(null);
  };

  const handleApprove = async () => {
    if (!pendingDetails) return;

    setApproveLoading(true);
    try {
      await approvePendingDetails(vendorId);
      alert("Vendor details approved successfully!");
      handleClose();
    } catch (error) {
      alert("Failed to approve vendor details. Please try again.");
      console.error(error);
    } finally {
      setApproveLoading(false);
    }
  };

  const stats = [
    {
      icon: <AccountBalanceWallet sx={{ fontSize: 30, mr: 1 }} />,
      label: "Total Balance",
      value: "$723.00",
      change: "-25%",
      color: "error",
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 30, mr: 1 }} />,
      label: "Total Orders",
      value: "1,296",
      change: "+10%",
      color: "success",
    },
    {
      icon: <Star sx={{ fontSize: 30, mr: 1 }} />,
      label: "Rewards Point",
      value: "1,400",
      change: "+10%",
      color: "success",
    },
  ];

  return (
    <Box sx={{ position: "relative", p: 2 }}>
      {/* Button to view pending details */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Pending Details
        </Button>
      </Box>

      {/* Stats cards */}
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" alignItems="center">
                {stat.icon}
                <Box>
                  <Typography variant="subtitle1">{stat.label}</Typography>
                  <Typography variant="h6" color="primary">
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color={stat.color}>
                    {stat.change}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Modal for Pending Details */}
     {/* Modal for Pending Details */}
<Modal
  open={open}
  onClose={handleClose}
  sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
>
  <Box sx={{ backgroundColor: "white", padding: 3, borderRadius: 2, maxWidth: 400, width: "100%" }}>
    {loading ? (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    ) : error ? (
      <Typography color="error">{error}</Typography>
    ) : pendingDetails ? (
      <>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Pending Details
        </Typography>
        {pendingDetails.pending_contact_number || pendingDetails.pending_license || pendingDetails.pending_fssai_certificate ? (
          <>
            {pendingDetails.pending_contact_number && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Pending Contact Number:</strong> {pendingDetails.pending_contact_number}
              </Typography>
            )}
            {pendingDetails.pending_license && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body2">Pending License</Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => window.open(pendingDetails.pending_license, "_blank")}
                >
                  View License
                </Button>
              </Box>
            )}
            {pendingDetails.pending_fssai_certificate && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body2">Pending FSSAI Certificate</Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => window.open(pendingDetails.pending_fssai_certificate, "_blank")}
                >
                  View FSSAI Certificate
                </Button>
              </Box>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleApprove}
                disabled={approveLoading}
              >
                {approveLoading ? <CircularProgress size={24} /> : "Approve"}
              </Button>
              <Button variant="contained" color="primary" onClick={handleClose} sx={{ ml: 2 }}>
                Close
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            No pending details.
          </Typography>
        )}
      </>
    ) : (
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        No pending details.
      </Typography>
    )}
  </Box>
</Modal>

    </Box>
  );
};

export default StatsAndTransactions;
