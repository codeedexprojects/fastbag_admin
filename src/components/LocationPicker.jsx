import React, { useState, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const fallbackCenter = { lat: 11.247689, lng: 75.803559 };

const GoogleMapPicker = ({ setVendorData }) => {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(
    fallbackCenter
  );

  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const updatePosition = (lat, lng, zoomLevel = null) => {
    setMarkerPosition({ lat, lng });
    setVendorData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
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



  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      updatePosition(lat, lng, 17);
    }
  };

  return (
    <Box sx={{ borderRadius: 2, p: 2, boxShadow: 2 }}>
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={onPlaceChanged}
      >
        <TextField
          inputRef={inputRef}
          placeholder="Search a location"
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
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Autocomplete>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={16}
        onClick={(e) => updatePosition(e.latLng.lat(), e.latLng.lng())}
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
