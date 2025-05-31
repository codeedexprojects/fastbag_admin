import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { addColour, viewColours } from "../../services/allApi";

const ColorManagement = () => {
  const [colors, setColors] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newColor, setNewColor] = useState({ name: "", image: null });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchColors();
  }, []);

  // Fetch colors from API
  const fetchColors = async () => {
    try {
      setLoading(true);
      const data = await viewColours();
      setColors(data);
    } catch (error) {
      console.error("Error fetching colors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    setOpenModal(false);
    setNewColor({ name: "", image: null });
    setPreviewImage(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewColor({ ...newColor, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddColor = async () => {
    if (!newColor.name || !newColor.image) {
      alert("Please provide both name and image.");
      return;
    }
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Authentication token is missing");
        return;
      }
      const formData = new FormData();
      formData.append("name", newColor.name);
      formData.append("image", newColor.image);

      const response = await addColour(formData, token);
      setColors((prevColors) => [...prevColors, response]);
      handleModalClose();
    } catch (error) {
      console.error("Error adding color:", error);
      alert("Failed to add color. Please try again.");
    }
  };

  const handleDeleteColor = (id) => {
    console.log(`Delete functionality for color with ID: ${id}`);
    // Implement delete functionality here
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Typography variant="h4"><b>Colors</b></Typography>
        <Button
          variant="contained"
          sx={{backgroundColor:"#1e1e2d"}}
          startIcon={<Add />}
          onClick={handleModalOpen}
        >
          Add Color
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              colors.map((color) => (
                <TableRow key={color.id}>
                  <TableCell>{color.name}</TableCell>
                  <TableCell>
                    <img
                      src={color.image}
                      alt={color.name}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteColor(color.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Color Modal */}
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="add-color-modal"
        aria-describedby="add-color-description"
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
          <Typography variant="h6" component="h2" mb={2}>
            Add Color
          </Typography>
          <TextField
            label="Color Name"
            fullWidth
            margin="normal"
            value={newColor.name}
            onChange={(e) =>
              setNewColor({ ...newColor, name: e.target.value })
            }
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          {previewImage && (
            <Box
              sx={{
                marginTop: 2,
                textAlign: "center",
              }}
            >
              <img
                src={previewImage}
                alt="Preview"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 3,
            }}
          >
            <Button onClick={handleModalClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleAddColor} variant="contained" color="primary">
              Add Color
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ColorManagement;
