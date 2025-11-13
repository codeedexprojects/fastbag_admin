import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Marker, Circle } from "@react-google-maps/api";
import { 
  TextField, 
  InputAdornment, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Slider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MyLocationIcon from "@mui/icons-material/MyLocation";

const containerStyle = {
  width: "100%",
  height: "450px",
};

const fallbackCenter = { lat: 11.247689, lng: 75.803559 }; // Kozhikode

const GoogleMapPickerWithRadius = ({ formData, setFormData }) => {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(() => {
    if (formData?.latitude && formData?.longitude) {
      return {
        lat: parseFloat(formData.latitude),
        lng: parseFloat(formData.longitude),
      };
    }
    return fallbackCenter;
  });

  const [predictions, setPredictions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [radius, setRadius] = useState(formData?.radius_km || 0);

  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);

  // Initialize services
  useEffect(() => {
    if (window.google && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  useEffect(() => {
    if (map && !placesServiceRef.current) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(map);
    }
  }, [map]);

  // Update radius when location type changes
  useEffect(() => {
    if (formData.location_type === 'point') {
      setRadius(0);
      setFormData(prev => ({ ...prev, radius_km: 0 }));
    }
  }, [formData.location_type]);

  const updatePosition = (lat, lng, zoomLevel = null) => {
    setMarkerPosition({ lat, lng });
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));

    if (map) {
      map.panTo({ lat, lng });
      if (zoomLevel !== null) {
        map.setZoom(zoomLevel);
      }
    }

    getAddressFromCoordinates(lat, lng);
  };

  const getAddressFromCoordinates = (lat, lng) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        const components = results[0].address_components;

        let placeName = "";
        let city = "";
        let state = "";
        let country = "";

        components.forEach((component) => {
          const types = component.types;

          if (types.includes("locality")) {
            city = component.long_name;
          }
          if (types.includes("administrative_area_level_2")) {
            if (!city) city = component.long_name;
          }
          if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (types.includes("country")) {
            country = component.long_name;
          }
        });

        // Create a readable place name
        placeName = [city, state, country].filter(Boolean).join(", ");

        setFormData((prev) => ({
          ...prev,
          place_name: placeName || address,
        }));

        setSearchValue(placeName || address);
      }
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (!value.trim()) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    setShowSuggestions(true);

    if (autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: "in" },
        },
        (predictions, status) => {
          setIsSearching(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions);
          } else {
            setPredictions([]);
          }
        }
      );
    }
  };

  const handleSuggestionClick = (placeId) => {
    if (!placesServiceRef.current) return;

    placesServiceRef.current.getDetails(
      {
        placeId: placeId,
        fields: ["geometry", "formatted_address", "address_components"],
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            updatePosition(lat, lng, 14);
            setShowSuggestions(false);
            setPredictions([]);
          }
        }
      }
    );
  };

  const handleRadiusChange = (event, newValue) => {
    setRadius(newValue);
    setFormData(prev => ({ ...prev, radius_km: newValue }));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updatePosition(lat, lng, 15);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  // Circle options for radius visualization
  const circleOptions = {
    strokeColor: "#4285F4",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#4285F4",
    fillOpacity: 0.15,
  };

  return (
    <Box sx={{ borderRadius: 2, boxShadow: 2, position: "relative" }}>
      {/* Search Input */}
      <Box sx={{ position: "relative", p: 2, pb: 1 }}>
        <TextField
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search location (e.g., Kozhikode, Mumbai, Beach Road)"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            mb: 1.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              backgroundColor: "#fff",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
              </InputAdornment>
            ),
          }}
          onFocus={() => {
            if (predictions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />

        {/* Current Location Button */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip
            icon={<MyLocationIcon />}
            label="Use Current Location"
            onClick={handleGetCurrentLocation}
            color="primary"
            variant="outlined"
            size="small"
          />
          {markerPosition.lat !== fallbackCenter.lat && (
            <Chip
              label={`${markerPosition.lat.toFixed(6)}, ${markerPosition.lng.toFixed(6)}`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {/* Suggestions Dropdown */}
        {showSuggestions && predictions.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: "80px",
              left: 16,
              right: 16,
              zIndex: 1000,
              maxHeight: "250px",
              overflowY: "auto",
            }}
          >
            <List dense>
              {predictions.map((prediction) => (
                <ListItem
                  key={prediction.place_id}
                  button
                  onClick={() => handleSuggestionClick(prediction.place_id)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <LocationOnIcon sx={{ mr: 1, color: "#666" }} />
                  <ListItemText
                    primary={prediction.structured_formatting.main_text}
                    secondary={prediction.structured_formatting.secondary_text}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Radius Slider - Show only for radius and district types */}
        {(formData.location_type === 'radius' || formData.location_type === 'district') && (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="body2" gutterBottom>
              Coverage Radius: {radius} km
            </Typography>
            <Slider
              value={radius}
              onChange={handleRadiusChange}
              min={0}
              max={50}
              step={0.5}
              marks={[
                { value: 0, label: '0' },
                { value: 5, label: '5km' },
                { value: 10, label: '10km' },
                { value: 25, label: '25km' },
                { value: 50, label: '50km' },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value} km`}
            />
          </Box>
        )}
      </Box>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={13}
        onClick={(e) => {
          updatePosition(e.latLng.lat(), e.latLng.lng());
          setShowSuggestions(false);
        }}
        onLoad={(mapInstance) => setMap(mapInstance)}
        options={{
          disableDefaultUI: false,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {/* Marker */}
        <Marker
          position={markerPosition}
          draggable
          onDragEnd={(e) => updatePosition(e.latLng.lat(), e.latLng.lng())}
        />

        {/* Circle for radius visualization */}
        {radius > 0 && (formData.location_type === 'radius' || formData.location_type === 'district') && (
          <Circle
            center={markerPosition}
            radius={radius * 1000} // Convert km to meters
            options={circleOptions}
          />
        )}
      </GoogleMap>

      {/* Info Box */}
      <Box sx={{ p: 2, pt: 1, bgcolor: '#f5f5f5' }}>
        <Typography variant="caption" color="text.secondary">
          💡 Click on the map or drag the marker to select a location. 
          {(formData.location_type === 'radius' || formData.location_type === 'district') && 
            ' Adjust the slider to set the coverage radius.'}
        </Typography>
      </Box>
    </Box>
  );
};

export default GoogleMapPickerWithRadius;