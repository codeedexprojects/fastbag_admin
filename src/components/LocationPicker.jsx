import React, { useState, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { 
  TextField, 
  InputAdornment, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const fallbackCenter = { lat: 11.247689, lng: 75.803559 };

const GoogleMapPicker = ({ vendorData, setVendorData }) => {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(() => {
    if (vendorData?.latitude && vendorData?.longitude) {
      return {
        lat: parseFloat(vendorData.latitude),
        lng: parseFloat(vendorData.longitude),
      };
    }
    return fallbackCenter;
  });

  const [predictions, setPredictions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);

  // Initialize Autocomplete Service
  React.useEffect(() => {
    if (window.google && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  // Initialize Places Service when map loads
  React.useEffect(() => {
    if (map && !placesServiceRef.current) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(map);
    }
  }, [map]);

  const updatePosition = (lat, lng, zoomLevel = null) => {
    setMarkerPosition({ lat, lng });
    setVendorData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));

    if (map) {
      map.panTo({ lat, lng });

      if (zoomLevel !== null) {
        const currentZoom = map.getZoom();
        const step = zoomLevel > currentZoom ? 1 : -1;
        let zoom = currentZoom;
        const interval = setInterval(() => {
          zoom += step;
          map.setZoom(zoom);
          if ((step > 0 && zoom >= zoomLevel) || (step < 0 && zoom <= zoomLevel)) {
            clearInterval(interval);
          }
        }, 100);
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

        let city = "";
        let state = "";
        let pincode = "";

        components.forEach((component) => {
          const types = component.types;

          if (types.includes("locality")) {
            city = component.long_name;
          }

          if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }

          if (types.includes("postal_code")) {
            pincode = component.long_name;
          }
        });

        setVendorData((prev) => ({
          ...prev,
          address,
          city,
          state,
          pincode,
        }));
      } else {
        console.error("Geocoder failed:", status);
      }
    });
  };

  // Handle search input change
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

    // Use AutocompleteService for predictions
    if (autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: "in" }, // Restrict to India
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

  // Handle suggestion click
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
            updatePosition(lat, lng, 17);
            setSearchValue(place.formatted_address);
            setShowSuggestions(false);
            setPredictions([]);
          }
        }
      }
    );
  };

  return (
    <Box sx={{ borderRadius: 2, p: 2, boxShadow: 2, position: "relative" }}>
      {/* Search Input */}
      <Box sx={{ position: "relative" }}>
        <TextField
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search a location (e.g., India, Mumbai, landmark)"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            mb: 1.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
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

        {/* Suggestions Dropdown */}
        {showSuggestions && predictions.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1000,
              maxHeight: "300px",
              overflowY: "auto",
              mt: 0.5,
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
      </Box>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={16}
        onClick={(e) => {
          updatePosition(e.latLng.lat(), e.latLng.lng());
          setShowSuggestions(false);
        }}
        onLoad={(mapInstance) => setMap(mapInstance)}
        options={{
          disableDefaultUI: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker
          position={markerPosition}
          draggable
          onDragEnd={(e) => updatePosition(e.latLng.lat(), e.latLng.lng())}
        />
      </GoogleMap>
    </Box>
  );
};

export default GoogleMapPicker;