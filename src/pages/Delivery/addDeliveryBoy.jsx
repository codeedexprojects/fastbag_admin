import React, { useState } from 'react';
import {
  Container, Typography, TextField, Grid, Button, Paper,
  FormControl, InputLabel, Select, MenuItem, Box, Avatar,
  FormControlLabel, Switch, IconButton, Backdrop, CircularProgress
} from '@mui/material';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addDeliveryBoy } from '../../services/allApi';
import { toast } from 'react-toastify';
import GoogleMapPicker from '../../components/LocationPicker';
import GoogleMapsWrapper from '../../components/GoogleMapsWrapper';

const AddDeliveryBoyForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    latitude: '',
    longitude: '',
    place: '',
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

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (e) => {
    setFormData(prev => ({ ...prev, is_active: e.target.checked }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          [fieldName]: 'Only image files (JPEG, PNG, GIF, WEBP) are allowed' 
        }));
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors(prev => ({ 
          ...prev, 
          [fieldName]: 'File size must be less than 5MB' 
        }));
        return;
      }

      setFiles(prev => ({ ...prev, [fieldName]: file }));
      setPreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const removeFile = (fieldName) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }));
    setPreviews(prev => ({ ...prev, [fieldName]: null }));
  };

  const truncateToDecimalPlaces = (value, places) => {
    if (!value || value === "") return "";
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    const multiplier = Math.pow(10, places);
    return (Math.floor(num * multiplier) / multiplier).toString();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile_number.trim()) newErrors.mobile_number = "Mobile number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.vehicle_type) newErrors.vehicle_type = "Vehicle type is required";
    if (!formData.vehicle_number.trim()) newErrors.vehicle_number = "Vehicle number is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const phoneRegex = /^\d{10}$/;
    if (formData.mobile_number && !phoneRegex.test(formData.mobile_number.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.mobile_number = "Invalid mobile number (should be 10 digits)";
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.location = "Please select location on map";
    } else {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = "Invalid latitude value";
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = "Invalid longitude value";
      }
    }

    if (!files.photo) newErrors.photo = "Photo is required";
    if (!files.aadhar_card_image) newErrors.aadhar_card_image = "Aadhar card image is required";
    if (!files.driving_license_image) newErrors.driving_license_image = "Driving license image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    const reqBody = new FormData();
    
    // Determine place value (use address as fallback if place is empty)
    const placeValue = formData.place || formData.address || '';
    
    reqBody.append('name', formData.name);
    reqBody.append('mobile_number', formData.mobile_number);
    reqBody.append('email', formData.email);
    reqBody.append('address', formData.address);
    reqBody.append('vehicle_type', formData.vehicle_type);
    reqBody.append('vehicle_number', formData.vehicle_number);
    reqBody.append('gender', formData.gender);
    reqBody.append('dob', formData.dob);
    reqBody.append('is_active', formData.is_active);
    
    const truncatedLat = truncateToDecimalPlaces(formData.latitude, 10);
    const truncatedLng = truncateToDecimalPlaces(formData.longitude, 10);
    if (truncatedLat) reqBody.append('latitude', truncatedLat);
    if (truncatedLng) reqBody.append('longitude', truncatedLng);
    
    // Place field is required by backend
    reqBody.append('place', placeValue);
    
    if (files.photo) reqBody.append('photo', files.photo);
    if (files.aadhar_card_image) reqBody.append('aadhar_card_image', files.aadhar_card_image);
    if (files.driving_license_image) reqBody.append('driving_license_image', files.driving_license_image);

    setLoading(true);
    try {
      const response = await addDeliveryBoy(reqBody);
      toast.success('Delivery boy added successfully');
      navigate('/view-deliveryboyslist');
    } catch (error) {
      console.error('Failed to add delivery boy', error);
      
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        const formattedErrors = {};
        
        Object.keys(backendErrors).forEach((key) => {
          if (Array.isArray(backendErrors[key])) {
            formattedErrors[key] = backendErrors[key][0];
          } else {
            formattedErrors[key] = backendErrors[key];
          }
        });
        
        setErrors(formattedErrors);
        toast.error('Please fix the errors and try again');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add delivery boy');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      mobile_number: '',
      email: '',
      address: '',
      vehicle_type: '',
      vehicle_number: '',
      gender: '',
      dob: '',
      is_active: true,
      latitude: '',
      longitude: '',
      place: '',
    });
    setFiles({
      photo: null,
      aadhar_card_image: null,
      driving_license_image: null,
    });
    setPreviews({
      photo: null,
      aadhar_card_image: null,
      driving_license_image: null,
    });
    setErrors({});
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
                  Upload Photo *
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
                {errors.photo && (
                  <Typography color="error" fontSize="12px" mt={1}>
                    {errors.photo}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} mb={1}>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
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
                error={!!errors.mobile_number}
                helperText={errors.mobile_number}
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
                error={!!errors.email}
                helperText={errors.email}
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
                error={!!errors.dob}
                helperText={errors.dob}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.gender}>
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
                {errors.gender && (
                  <Typography color="error" fontSize="12px" mt={1}>
                    {errors.gender}
                  </Typography>
                )}
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
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>

            {/* Vehicle Information */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} mt={2} mb={1}>
                Vehicle Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.vehicle_type}>
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
                {errors.vehicle_type && (
                  <Typography color="error" fontSize="12px" mt={1}>
                    {errors.vehicle_type}
                  </Typography>
                )}
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
                error={!!errors.vehicle_number}
                helperText={errors.vehicle_number}
              />
            </Grid>

            {/* Location Selection */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} mt={2} mb={1}>
                Location *
              </Typography>
              <GoogleMapPicker
                vendorData={formData}
                setVendorData={setFormData}
              />
              
              {Number.isFinite(Number(formData.latitude)) &&
                Number.isFinite(Number(formData.longitude)) && (
                  <Typography mt={2} fontSize="14px" color="text.secondary">
                    📍 <strong>Selected Location:</strong>
                    <br />
                    {formData.place && (
                      <>
                        <strong>Place:</strong> {formData.place}
                        <br />
                      </>
                    )}
                    <strong>Coordinates:</strong>{" "}
                    {truncateToDecimalPlaces(formData.latitude, 10)},{" "}
                    {truncateToDecimalPlaces(formData.longitude, 10)}
                  </Typography>
                )}
              
              {(errors.location || errors.latitude || errors.longitude) && (
                <Typography color="error" fontSize="12px" mt={1}>
                  {errors.location || errors.latitude || errors.longitude}
                </Typography>
              )}
            </Grid>

            {/* Document Uploads */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} mt={2} mb={1}>
                Documents
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" mb={1} fontWeight={500}>
                  Aadhar Card Image *
                </Typography>
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
                {errors.aadhar_card_image && (
                  <Typography color="error" fontSize="12px" mt={1}>
                    {errors.aadhar_card_image}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" mb={1} fontWeight={500}>
                  Driving License Image *
                </Typography>
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
                {errors.driving_license_image && (
                  <Typography color="error" fontSize="12px" mt={1}>
                    {errors.driving_license_image}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  disabled={loading}
                  size="large"
                >
                  Reset
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/delivery-boys')}
                  disabled={loading}
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
                  {loading ? 'Adding...' : 'Add Delivery Boy'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

// Wrap with GoogleMapsWrapper to ensure Google Maps API is loaded
const AddDeliveryBoy = () => {
  return (
    <GoogleMapsWrapper>
      <AddDeliveryBoyForm />
    </GoogleMapsWrapper>
  );
};

export default AddDeliveryBoy;


