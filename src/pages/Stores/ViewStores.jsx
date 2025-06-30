import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import { Edit, Delete, Search, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { deleteStore, viewStores, editStore } from "../../services/allApi";
import { toast } from "react-toastify";
import { CirclePlus, CircleX, Pencil, Save, Trash2 } from "lucide-react";

const ViewStores = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentStore, setCurrentStore] = useState({ id: null, name: "", description: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const data = await viewStores();
        setStores(data);
      } catch (err) {
        setError("Failed to load stores. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleAddStore = () => {
    navigate("/add-store");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (store) => {
    setCurrentStore(store);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setCurrentStore({ id: null, name: "", description: "" });
  };

  const handleEditSubmit = async () => {
    try {
      const updatedStore = {
        name: currentStore.name,
        description: currentStore.description,
      };
      await editStore(updatedStore, currentStore.id);
      setStores((prevStores) =>
        prevStores.map((store) =>
          store.id === currentStore.id ? { ...store, ...updatedStore } : store
        )
      );
      toast.success("Store updated successfully!");
      handleModalClose();
    } catch (error) {
      console.error("Failed to update store:", error);
      toast.error("Failed to update the store. Please try again.");
    }
  };

  const openDeleteDialog = (store) => {
    setStoreToDelete(store);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setStoreToDelete(null);
    setDeleteDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (!storeToDelete) return;

    try {
      await deleteStore(storeToDelete.id);
      setStores((prevStores) => prevStores.filter((s) => s.id !== storeToDelete.id));
      toast.success("Store deleted successfully!");
    } catch (error) {
      console.error("Error while deleting store:", error);
      toast.error("Failed to delete the store. Please try again.");
    }
    closeDeleteDialog();
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4 }}>
      {/* Top Search & Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
       <TextField
  label="Search Stores"
  value={searchQuery}
  onChange={handleSearch}
  variant="outlined"
  size="small"
  sx={{
    width: 300,
    backgroundColor: '#f9fafb',
    borderRadius: 2,
    fontSize: 14,
    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.1)',
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '& fieldset': {
        borderColor: '#d1d5db',
      },
      '&:hover fieldset': {
        borderColor: '#9ca3af',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',
        borderWidth: 2,
      },
    },
    '& .MuiInputBase-input': {
      padding: '10px 12px',
      color: '#111827',
    },
    '& .MuiSvgIcon-root': {
      color: '#4b5563',
    },
  }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Search />
      </InputAdornment>
    ),
  }}
/>
        <Button
          variant="containedSecondary"
          onClick={handleAddStore}
         startIcon={<CirclePlus/>}
        >
           Add Store
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Grid container spacing={3}>
          {filteredStores.map((store) => (
            <Grid item xs={12} sm={6} md={4} key={store.id}>
              <Card
                
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
                  height: "100%",
                  transition: "0.3s",
                  "&:hover": { boxShadow: '0 1px 10px rgba(0, 0, 0, 0.29)',},
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {store.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {store.description || "No description provided."}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", p: 3 }}>
                  <IconButton onClick={() => handleEdit(store)} color="primary">
                    <Pencil  />
                  </IconButton>
                  <IconButton onClick={() => openDeleteDialog(store)} color="error">
                    <Trash2 />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 300, sm: 400 },
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2} fontWeight={600}>
            Edit Store
          </Typography>
          <TextField
            label="Store Name"
            fullWidth
            margin="dense"
            value={currentStore.name}
            onChange={(e) => setCurrentStore({ ...currentStore, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={currentStore.description}
            onChange={(e) =>
              setCurrentStore({ ...currentStore, description: e.target.value })
            }
          />
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleModalClose} startIcon={<CircleX size={20}/>} variant="containedError" color="inherit">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} startIcon={<Save size={20}/>} variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Store</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete store{" "}
            <strong>{storeToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<CircleX size={20}/>} variant="contained" onClick={closeDeleteDialog} >
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" startIcon={<Trash2 size={20}/>} variant="containedError">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewStores;
