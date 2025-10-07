import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { getAllCarouselAds, updateCarouselAd, deleteCarouselAd } from "../../services/allApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CarouselList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [editAd, setEditAd] = useState(null);
  const [formValues, setFormValues] = useState({ title: "", ads_image: null });
  const [imagePreview, setImagePreview] = useState("");
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await getAllCarouselAds();
      if (res) setAds(res.results);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate("/add-carousel");
  };

  const handleEdit = (ad) => {
    setEditAd(ad);
    setFormValues({ title: ad.title, ads_image: null });
    setImagePreview(ad.ads_image); // Show old image initially
    setOpenEdit(true);
  };

  // Open confirmation dialog on delete click
  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDeleteConfirm(true);
  };

  // Confirm delete handler
  const confirmDelete = async () => {
    try {
      await deleteCarouselAd(deleteId);
      toast.success("Deleted successfully");
      fetchAds();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setOpenDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormValues((prev) => ({ ...prev, ads_image: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(editAd?.ads_image || "");
    }
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", formValues.title);
      if (formValues.ads_image) {
        formData.append("ads_image", formValues.ads_image);
      }

      await updateCarouselAd(editAd.id, formData);
      toast.success("Updated successfully");
      setOpenEdit(false);
      fetchAds();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditAd(null);
    setFormValues({ title: "", ads_image: null });
    setImagePreview("");
  };

  return (
    <Box p={4}>
      {/* Top Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Carousel Advertisements</Typography>
        <Tooltip title="Add Carousel">
          <Button variant="containedSecondary"  onClick={handleAdd} startIcon={<AddIcon />}>Add Carousel
          </Button>
        </Tooltip>
      </Box>

      {/* Loading or Empty */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : ads.length === 0 ? (
        <Typography variant="body1" mt={2}>
          No ads found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {ads.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.id}>
              <Card sx={{ height: "100%", position: "relative" }}>
                <CardMedia component="img" height="180" image={ad.ads_image} alt={ad.title} />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {ad.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vendor: {ad.vendor?.name || "N/A"}
                  </Typography>
                  {/* Edit & Delete Buttons */}
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Tooltip title="Edit">
                      <IconButton color="primary" size="small" onClick={() => handleEdit(ad)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" size="small" onClick={() => handleDelete(ad.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Carousel Ad</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={formValues.title}
            onChange={handleEditInputChange}
          />

          {/* Image Upload */}
          <Box mt={2}>
            <input
              accept="image/*"
              id="upload-image-file"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-image-file">
              <Button variant="contained" color="primary" component="span" startIcon={<UploadFileIcon />}>
                Upload Image
              </Button>
            </label>
          </Box>

          {/* Image Preview */}
          {imagePreview && (
            <Box mt={2} textAlign="center">
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirm} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this carousel ad?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CarouselList;
