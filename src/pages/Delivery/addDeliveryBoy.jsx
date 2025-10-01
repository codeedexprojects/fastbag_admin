import React, { useState } from 'react';
import {
  Container, Typography, TextField, Grid, Button, Paper,
  FormControl, InputLabel, Select, MenuItem, Box, Avatar,
  FormControlLabel, Switch, IconButton, Dialog, DialogTitle,
  DialogContent, Backdrop, CircularProgress
} from '@mui/material';
import { MapPin, Upload, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { addDeliveryBoy } from '../../services/allApi';
import { toast } from 'react-toastify';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    },
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
};

const AddDeliveryBoy = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile_number: '',
    email: '',
    address: '',
    vehicle_type: '',
    vehicle_number: '',
    gender: '',
    dob: '',
    is_active: true,
    latitude: null,
    longitude: null,
  });

  const [files, setFiles] = useState({
    photo: null,
    aadhar_card_image: null,
    driving_license_image: null,
  });

  const [previews, setPreviews] = useState({
    photo: null,
    aadhar_card_image: null,
    driving_license_image: null,
  });

  const [location, setLocation] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setFormData(prev => ({ ...prev, is_active: e.target.checked }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [fieldName]: file }));
      setPreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    }
  };

  const removeFile = (fieldName) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }));
    setPreviews(prev => ({ ...prev, [fieldName]: null }));
  };

  const handleLocationSelect = () => {
    if (location) {
      setFormData(prev => ({
        ...prev,
        latitude: location.lat,
        longitude: location.lng
      }));
      setMapOpen(false);
      toast.success('Location selected successfully');
    } else {
      toast.error('Please select a location on the map');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(pos);
          setFormData(prev => ({
            ...prev,
            latitude: pos.lat,
            longitude: pos.lng
          }));
          toast.success('Current location detected');
        },
        () => {
          toast.error('Unable to retrieve your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.mobile_number || !formData.email || 
        !formData.address || !formData.vehicle_type || !formData.vehicle_number || 
        !formData.gender || !formData.dob) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!files.photo || !files.aadhar_card_image || !files.driving_license_image) {
      toast.error('Please upload all required documents');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      toast.error('Please select location on map');
      return;
    }

    const reqBody = new FormData();
    reqBody.append('name', formData.name);
    reqBody.append('mobile_number', formData.mobile_number);
    reqBody.append('email', formData.email);
    reqBody.append('address', formData.address);
    reqBody.append('vehicle_type', formData.vehicle_type);
    reqBody.append('vehicle_number', formData.vehicle_number);
    reqBody.append('gender', formData.gender);
    reqBody.append('dob', formData.dob);
    reqBody.append('is_active', formData.is_active);
    reqBody.append('latitude', Number(formData.latitude?.toFixed(10)));
    reqBody.append('longitude', Number(formData.longitude?.toFixed(10)));
    reqBody.append('photo', files.photo);
    reqBody.append('aadhar_card_image', files.aadhar_card_image);
    reqBody.append('driving_license_image', files.driving_license_image);

    setLoading(true);
    try {
      await addDeliveryBoy(reqBody);
      toast.success('Delivery boy added successfully');
      navigate('/view-deliveryboyslist');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add delivery boy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/delivery-boys')} sx={{ mr: 2 }}>
          <ArrowLeft />
        </IconButton>
        <Typography variant="h4" fontWeight={600}>
          Add Delivery Boy
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Photo Upload */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box textAlign="center">
                <Avatar
                  src={previews.photo}
                  sx={{ width: 120, height: 120, mb: 2, mx: 'auto' }}
                />
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload size={18} />}
                >
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'photo')}
                  />
                </Button>
                {files.photo && (
                  <IconButton size="small" onClick={() => removeFile('photo')} sx={{ ml: 1 }}>
                    <X size={18} />
                  </IconButton>
                )}
              </Box>
            </Grid>

            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Mobile Number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  label="Gender"
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label="Active Status"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Vehicle Information */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} mt={2} mb={1}>
                Vehicle Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleInputChange}
                  label="Vehicle Type"
                >
                  <MenuItem value="Bike">Bike</MenuItem>
                  <MenuItem value="Scooter">Scooter</MenuItem>
                  <MenuItem value="Car">Car</MenuItem>
                  <MenuItem value="Van">Van</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Vehicle Number"
                name="vehicle_number"
                value={formData.vehicle_number}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Location Selection */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} mt={2} mb={1}>
                Location
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<MapPin size={18} />}
                  onClick={() => setMapOpen(true)}
                >
                  Select Location on Map
                </Button>
                <Button
                  variant="outlined"
                  onClick={getCurrentLocation}
                >
                  Use Current Location
                </Button>
                {formData.latitude && formData.longitude && (
                  <Typography variant="body2" color="success.main">
                    ✓ Location selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Document Uploads */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} mt={2} mb={1}>
                Documents
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" mb={1} fontWeight={500}>Aadhar Card Image *</Typography>
                {previews.aadhar_card_image && (
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
                    <img
                      src={previews.aadhar_card_image}
                      alt="Aadhar"
                      style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeFile('aadhar_card_image')}
                      sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'white' }}
                    >
                      <X size={18} />
                    </IconButton>
                  </Box>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload size={18} />}
                  fullWidth={!previews.aadhar_card_image}
                >
                  Upload Aadhar Card
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'aadhar_card_image')}
                  />
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" mb={1} fontWeight={500}>Driving License Image *</Typography>
                {previews.driving_license_image && (
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
                    <img
                      src={previews.driving_license_image}
                      alt="License"
                      style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeFile('driving_license_image')}
                      sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'white' }}
                    >
                      <X size={18} />
                    </IconButton>
                  </Box>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload size={18} />}
                  fullWidth={!previews.driving_license_image}
                >
                  Upload Driving License
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'driving_license_image')}
                  />
                </Button>
              </Box>
            </Grid>

            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/delivery-boys')}
                  size="large"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                >
                  Add Delivery Boy
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Map Dialog */}
      <Dialog
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Select Location
          <IconButton
            onClick={() => setMapOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Click on the map to select delivery boy's location
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <MapContainer
              center={location ? [location.lat, location.lng] : [11.2588, 75.7804]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker position={location} setPosition={setLocation} />
            </MapContainer>
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="outlined" onClick={() => setMapOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleLocationSelect}>
              Confirm Location
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AddDeliveryBoy;