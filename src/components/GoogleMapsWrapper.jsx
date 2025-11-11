import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

const libraries = ["places"];
const GoogleMapsWrapper = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    language: "en",
    region: "IN",
  });

  // Debug: Check if API key is loaded
  React.useEffect(() => {
    console.log("API Key:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? "Loaded" : "Missing");
  }, []);

  if (loadError) {
    console.error("Map Load Error:", loadError);
    return (
      <Backdrop open sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Typography variant="h6" color="error">
          Failed to load Google Maps: {loadError.message}
        </Typography>
      </Backdrop>
    );
  }

  if (loadError) {
    return (
      <Backdrop open sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Typography variant="h6" color="error">
          Failed to load Google Maps. Check API key or internet.
        </Typography>
      </Backdrop>
    );
  }

  if (!isLoaded) {
    return (
      <Backdrop open sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return <>{children}</>;
};

export default GoogleMapsWrapper;
