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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { deleteStore, viewStores, editStore } from "../../services/allApi";

const ViewStores = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentStore, setCurrentStore] = useState({ id: null, name: "", description: "" });
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
    setCurrentStore(store); // Set the current store to edit
    setOpenModal(true); // Open the modal
  };

  const handleModalClose = () => {
    setOpenModal(false); // Close the modal
    setCurrentStore({ id: null, name: "", description: "" }); // Reset the form
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
      alert("Store updated successfully!");
      handleModalClose();
    } catch (error) {
      console.error("Failed to update store:", error);
      alert("Failed to update the store. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("Deleting store with ID:", id);
      await deleteStore(id);
      setStores((prevStores) => prevStores.filter((store) => store.id !== id));
      console.log("Store deleted successfully");
    } catch (error) {
      console.error("Error while deleting store:", error);
      alert("Failed to delete the store. Please try again.");
    }
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <TextField
          label="Search Stores"
          value={searchQuery}
          onChange={handleSearch}
          variant="outlined"
          sx={{ width: "70%" }}
        />
        <Button variant="contained" sx={{backgroundColor:"#1e1e2d"}} onClick={handleAddStore}>
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
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">{store.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {store.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => handleEdit(store)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(store.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Modal */}
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="edit-store-modal"
        aria-describedby="edit-store-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="edit-store-modal" variant="h6" component="h2" mb={2}>
            Edit Store
          </Typography>
          <TextField
            label="Store Name"
            fullWidth
            margin="normal"
            value={currentStore.name}
            onChange={(e) =>
              setCurrentStore({ ...currentStore, name: e.target.value })
            }
          />
          <TextField
            label="Store Description"
            fullWidth
            margin="normal"
            value={currentStore.description}
            onChange={(e) =>
              setCurrentStore({ ...currentStore, description: e.target.value })
            }
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            <Button onClick={handleModalClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewStores;
