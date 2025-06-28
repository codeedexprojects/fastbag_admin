import React, { useState } from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Modal,
  CircularProgress,
} from "@mui/material";
import {
  AccountBalanceWallet,
  ShoppingCart,
  Star,
} from "@mui/icons-material";
import { CheckCircle, X, FileBadge, CircleX } from "lucide-react";
import {
  approvePendingDetails,
  getVendorsPendingDetails,
} from "../../services/allApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const StatsAndTransactions = ({ onApprove }) => {
  const [open, setOpen] = useState(false);
  const [pendingDetails, setPendingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [approveLoading, setApproveLoading] = useState(false);
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
      toast.success("Vendor details approved successfully!");
      if (onApprove) onApprove();
      handleClose();
    } catch (error) {
      toast.error("Failed to approve vendor details. Please try again.");
      console.error(error);
    } finally {
      setApproveLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, position: "relative" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<FileBadge size={18} />}
        >
          Pending Details
        </Button>
      </Box>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            p: 4,
            borderRadius: 2,
            maxWidth: 420,
            width: "100%",
            boxShadow: 5,
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 100,
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : pendingDetails ? (
            <>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Pending Details
              </Typography>

              {pendingDetails.pending_contact_number && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Contact:</strong> {pendingDetails.pending_contact_number}
                </Typography>
              )}

              {pendingDetails.pending_license && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    License
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() =>
                      window.open(pendingDetails.pending_license, "_blank")
                    }
                    sx={{ mt: 1 }}
                  >
                    View License
                  </Button>
                </Box>
              )}

              {pendingDetails.pending_fssai_certificate && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    FSSAI Certificate
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() =>
                      window.open(pendingDetails.pending_fssai_certificate, "_blank")
                    }
                    sx={{ mt: 1 }}
                  >
                    View Certificate
                  </Button>
                </Box>
              )}

              <Box
                sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
              >
                <Button
                  variant="contained"
                  onClick={handleApprove}
                  disabled={approveLoading}
                  startIcon={<CheckCircle size={18} />}
                >
                  {approveLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Approve"
                  )}
                </Button>

                <Button
                  variant="containedError"
                  color="error"
                  onClick={handleClose}
                  startIcon={<CircleX size={18} />}
                >
                  Close
                </Button>
              </Box>
            </>
          ) : (
            <Typography
              variant="body2"
              sx={{ mt: 2, textAlign: "center", fontStyle: "italic" }}
            >
              No pending details.
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default StatsAndTransactions;
