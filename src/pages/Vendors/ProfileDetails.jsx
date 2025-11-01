import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  CircularProgress,
} from "@mui/material";
import { FileBadge, CheckCircle, CircleX } from "lucide-react";
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

  const hasPendingDetails = pendingDetails && (
    pendingDetails.pending_contact_number ||
    pendingDetails.pending_license ||
    pendingDetails.pending_fssai_certificate
  );

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<FileBadge size={18} />}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
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
            borderRadius: 3,
            maxWidth: 500,
            width: "90%",
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: 24,
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box>
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleClose}
              >
                Close
              </Button>
            </Box>
          ) : hasPendingDetails ? (
            <>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                Pending Details
              </Typography>

              {pendingDetails.pending_contact_number && (
                <Box sx={{ mb: 2, p: 2, backgroundColor: '#f9fafb', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Contact Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {pendingDetails.pending_contact_number}
                  </Typography>
                </Box>
              )}

              {pendingDetails.pending_license && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    License
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() =>
                      window.open(pendingDetails.pending_license, "_blank")
                    }
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    View License
                  </Button>
                </Box>
              )}

              {pendingDetails.pending_fssai_certificate && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    FSSAI Certificate
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() =>
                      window.open(pendingDetails.pending_fssai_certificate, "_blank")
                    }
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    View Certificate
                  </Button>
                </Box>
              )}

              <Box
                sx={{ 
                  display: "flex", 
                  justifyContent: "flex-end", 
                  gap: 2, 
                  mt: 4 
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  startIcon={<CircleX size={18} />}
                  disabled={approveLoading}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    minWidth: 100
                  }}
                >
                  Close
                </Button>
                
                <Button
                  variant="contained"
                  onClick={handleApprove}
                  disabled={approveLoading}
                  startIcon={!approveLoading && <CheckCircle size={18} />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    minWidth: 100
                  }}
                >
                  {approveLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Approve"
                  )}
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                No pending details available.
              </Typography>
              <Button
                variant="contained"
                onClick={handleClose}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Close
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default StatsAndTransactions;