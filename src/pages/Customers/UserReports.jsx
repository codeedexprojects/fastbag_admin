import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Paper,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import { viewReports } from "../../services/allApi";

// Report Section Component
const ReportSection = ({ reports, categoryName }) => {
  return (
    <Box>
      {reports.map((report) => (
        <Paper
          key={report.id}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            backgroundColor: '#fff',
            boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {categoryName}: {report.dish_name || report.product_name || report.cloth_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {report.user_name || "Anonymous"} | {new Date(report.created_at).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Reason:</strong> {report.reason || "No reason provided"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: report.is_resolved ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                Resolved: {report.is_resolved ? "Yes" : "No"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

// Main Report Page Component
const ReportPage = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reportsData, setReportsData] = useState({
    grocery_reports: [],
    dish_reports: [],
    fashion_reports: [],
  });

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await viewReports();
        setReportsData(data.data || {});
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Reports
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          variant="standard"
          sx={{
            display: 'inline-flex',
            backgroundColor: "#f9fafb",
            borderRadius: 2,
            boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
            px: 1,
            "& .MuiTabs-flexContainer": {
              gap: 1,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minWidth: 'auto',
              px: 2,
            },
            "& .Mui-selected": {
              color: "#1d4ed8",
            },
          }}
        >
          <Tab label="Grocery" />
          <Tab label="Dishes" />
          <Tab label="Fashion" />
        </Tabs>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {value === 0 && (
        <ReportSection reports={reportsData.grocery_reports} categoryName="Grocery" />
      )}
      {value === 1 && (
        <ReportSection reports={reportsData.dish_reports} categoryName="Dish" />
      )}
      {value === 2 && (
        <ReportSection reports={reportsData.fashion_reports} categoryName="Fashion" />
      )}
    </Box>
  );
};

export default ReportPage;
