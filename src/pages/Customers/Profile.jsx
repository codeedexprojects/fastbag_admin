import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Avatar, CircularProgress, Modal,
  TextField, IconButton, Button
} from '@mui/material';
import { Email, Phone, LocationOn, Person, CalendarToday, Home, Apartment, LocationCity, Public, Map } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { Pencil, Save, CircleX } from 'lucide-react';
import {
  viewUsersById,
  updateUserDetails,
  updateUserAddress
} from '../../services/allApi';
import { toast } from 'react-toastify';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const data = await viewUsersById(id);
      setUser(data);
      setForm({
        name: data.name || '',
        email: data.email || '',
        mobile_number: data.mobile_number || '',
        address_line1: data.addresses[0]?.address_line1 || '',
        address_line2: data.addresses[0]?.address_line2 || '',
        city: data.addresses[0]?.city || '',
        state: data.addresses[0]?.state || '',
        country: data.addresses[0]?.country || '',
        address_id: data.addresses[0]?.id,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const resetFormFromUser = () => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        mobile_number: user.mobile_number || '',
        address_line1: user.addresses[0]?.address_line1 || '',
        address_line2: user.addresses[0]?.address_line2 || '',
        city: user.addresses[0]?.city || '',
        state: user.addresses[0]?.state || '',
        country: user.addresses[0]?.country || '',
        address_id: user.addresses[0]?.id,
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updates = [];

      if (
        form.name !== user.name ||
        form.email !== user.email ||
        form.mobile_number !== user.mobile_number
      ) {
        const userData = {
          name: form.name,
          email: form.email,
          mobile_number: form.mobile_number,
        };

        updates.push(
          updateUserDetails(userData, user.id).then(res => {
            toast.success("User details updated");
            return res;
          }).catch(err => {
            toast.error("Failed to update user details");
            throw err;
          })
        );
      }

      const original = user.addresses[0] || {};
      const addressChanged =
        form.address_line1 !== original.address_line1 ||
        form.address_line2 !== original.address_line2 ||
        form.city !== original.city ||
        form.state !== original.state ||
        form.country !== original.country;

      if (addressChanged && form.address_id) {
        const addressData = {
          address_line1: form.address_line1,
          address_line2: form.address_line2,
          city: form.city,
          state: form.state,
          country: form.country,
        };

        updates.push(
          updateUserAddress(addressData, user.id, form.address_id).then(res => {
            toast.success("Address updated");
            return res;
          }).catch(err => {
            toast.error("Failed to update address");
            throw err;
          })
        );
      }

      if (updates.length > 0) {
        await Promise.all(updates);
        await fetchUserDetails();
      }

      setEditOpen(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 5, position: 'relative', borderRadius: 3, boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)' }}>
      <Avatar sx={{ width: 100, height: 100, mx: 'auto', bgcolor: 'purple' }} />
      <Typography variant="h6" align="center" sx={{ mt: 2 }}>{user.name}</Typography>
      <Typography variant="body2" align="center" color="primary">
        {user.is_verified ? 'Verified' : 'Unverified'}
      </Typography>

      {/* User Info */}
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Person sx={{ mr: 1 }} />
          <Typography variant="body2">User ID: {user.id}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Email sx={{ mr: 1 }} />
          <Typography variant="body2">Email: {user.email}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Phone sx={{ mr: 1 }} />
          <Typography variant="body2">Phone: {user.mobile_number}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
  <LocationOn sx={{ mr: 1 }} />
  <Typography variant="body2">Address:</Typography>
</Box>

<Box sx={{ pl: 4, mb: 1 }}>
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <Home sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
    <Typography variant="body2">
      Address Line 1: {user.addresses[0]?.address_line1 || '-'}
    </Typography>
  </Box>

  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <Home sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
    <Typography variant="body2">
      Address Line 2: {user.addresses[0]?.address_line2 || '-'}
    </Typography>
  </Box>

  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <LocationCity sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
    <Typography variant="body2">
      City: {user.addresses[0]?.city || '-'}
    </Typography>
  </Box>

  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <Map sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
    <Typography variant="body2">
      State: {user.addresses[0]?.state || '-'}
    </Typography>
  </Box>

  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Public sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
    <Typography variant="body2">
      Country: {user.addresses[0]?.country || '-'}
    </Typography>
  </Box>
</Box>


        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarToday sx={{ mr: 1 }} />
          <Typography variant="body2">Joined: {user.date_joined}</Typography>
        </Box>
      </Box>

      {/* Edit Icon */}
      <IconButton
        onClick={() => setEditOpen(true)}
        color="primary"
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'primary.main',
            color: '#fff',
            svg: { color: '#fff' },
          },
        }}
      >
        <Pencil />
      </IconButton>

      {/* Edit Modal */}
      <Modal
        open={editOpen}
        onClose={() => {
          resetFormFromUser();
          setEditOpen(false);
        }}
      >
        <Box
          sx={{
            width: 420,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            mx: 'auto',
            mt: '10vh',
            outline: 'none',
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={2}>
            Edit User
          </Typography>

          {/* Basic Fields */}
          {['name', 'email', 'mobile_number'].map((field) => (
            <TextField
              key={field}
              label={field.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              name={field}
              fullWidth
              size="small"
              margin="dense"
              value={form[field]}
              onChange={handleChange}
              sx={{
                backgroundColor: '#f9fafb',
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
              }}
            />
          ))}

          {/* Address Fields */}
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Address</Typography>
          {['address_line1', 'address_line2', 'city', 'state', 'country'].map((field) => (
            <TextField
              key={field}
              label={field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              name={field}
              fullWidth
              size="small"
              margin="dense"
              value={form[field]}
              onChange={handleChange}
              sx={{
                backgroundColor: '#f9fafb',
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
              }}
            />
          ))}

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              startIcon={<CircleX size={20} />}
              variant="containedError"
              onClick={() => {
                resetFormFromUser();
                setEditOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              startIcon={<Save size={20} />}
              variant="contained"
              onClick={handleSave}
              sx={{ ml: 2 }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

export default UserDetails;
