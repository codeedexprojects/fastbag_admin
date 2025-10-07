// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
    button: { fontWeight: 600 },
  },
  palette: {
    mode: "light",
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
    primary: {
      main: "#1e3a8a", // Indigo-900
      light: "#e0e7ff", // Indigo-100
      dark: "#1e40af", // Indigo-800
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#374151", // Gray-700
      light: "#6b7280", // Gray-500
      dark: "#1f2937", // Gray-900
      contrastText: "#ffffff",
    },
    error: {
      main: "#dc2626", // Red-600
      light: "#fecaca", // Red-200
      dark: "#b91c1c", // Red-700
      contrastText: "#ffffff",
    },
    success: {
      main: "#22c55e", // Green-500
      light: "#bbf7d0", // Green-200
      dark: "#15803d", // Green-700
    },
    warning: {
      main: "#facc15", // Yellow-400
      light: "#fef9c3",
      dark: "#ca8a04",
    },
    info: {
      main: "#3b82f6", // Blue-500
      light: "#dbeafe",
      dark: "#1d4ed8",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          paddingInline: "20px",
          fontWeight: 600,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
        },
        containedPrimary: {
          backgroundColor: "#e0e7ff", // Light indigo
          color: "#1e3a8a", // Indigo-900 text
          "&:hover": {
            backgroundColor: "#1e40af", // Indigo-800 hover
            color: "#ffffff",
          },
        },

        containedSecondary: {
          backgroundColor: "#f3f4f6", // Gray-100
          color: "#374151", // Gray-700 text
          "&:hover": {
            backgroundColor: "#374151", // Gray-900 hover
            color: "#f3f4f6",
          },
        },

        containedError: {
          backgroundColor: "#fee2e2", // Red-100
          color: "#b91c1c", // Red-700 text
          "&:hover": {
            backgroundColor: "#b91c1c",
            color: "#ffffff",
          },
        },

        outlinedPrimary: {
          borderColor: "#1e3a8a",
          color: "#1e3a8a",
          backgroundColor: "#e0e7ff",
          "&:hover": {
            borderColor: "#1e40af",
            backgroundColor: "#f0f4ff",
            color: "#1e40af",
          },
        },

        outlinedSecondary: {
          borderColor: "#374151",
          color: "#374151",
          backgroundColor: "#f9fafb",
          "&:hover": {
            borderColor: "#1f2937",
            backgroundColor: "#e5e7eb",
            color: "#1f2937",
          },
        },

        outlinedError: {
          borderColor: "#dc2626",
          color: "#dc2626",
          backgroundColor: "#fee2e2",
          "&:hover": {
            backgroundColor: "#fecaca",
            borderColor: "#b91c1c",
            color: "#b91c1c",
          },
        },
      },
    },
  },
});

export default theme;
