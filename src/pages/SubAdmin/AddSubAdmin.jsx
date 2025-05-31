import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { addSubadmin } from "../../services/allApi";

const AddSubAdmin = () => {
  const [formData, setFormData] = useState({
    mobile_number: "",
    password: "",
    permissions: [],
  });
  const [permissionInput, setPermissionInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePermissionAdd = () => {
    if (permissionInput.trim() && !formData.permissions.includes(permissionInput)) {
      setFormData((prev) => ({
        ...prev,
        permissions: [...prev.permissions, permissionInput.trim()],
      }));
      setPermissionInput("");
    }
  };

  const handlePermissionDelete = (permissionToDelete) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.filter(
        (permission) => permission !== permissionToDelete
      ),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await addSubadmin(formData);
      console.log("Sub-admin added successfully:", response);
      alert("Sub-admin added successfully!");
      setFormData({ mobile_number: "", password: "", permissions: [] }); // Reset form
    } catch (error) {
      console.error("Failed to add sub-admin:", error); // Log the error details
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: 3, boxShadow: 3, borderRadius: 2, bgcolor: "#fff" }}>
        <Typography variant="h5" mb={2}>
          Add Sub Admin
        </Typography>
        <TextField
          fullWidth
          label="Mobile Number"
          name="mobile_number"
          value={formData.mobile_number}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          margin="normal"
        />
        <Box mt={2}>
          <TextField
            label="Permission"
            value={permissionInput}
            onChange={(e) => setPermissionInput(e.target.value)}
            margin="normal"
            fullWidth
          />
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={handlePermissionAdd}
            disabled={!permissionInput.trim()}
          >
            Add Permission
          </Button>
        </Box>
        <List>
          {formData.permissions.map((permission, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handlePermissionDelete(permission)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={permission} />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSubmit}
          disabled={loading || !formData.mobile_number || !formData.password}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Container>
  );
};

export default AddSubAdmin;
