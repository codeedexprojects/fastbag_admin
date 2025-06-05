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
        <Paper key={report.id} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6">
                {categoryName}: {report.dish_name || report.product_name || report.cloth_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {report.user_name || "Anonymous"} |{" "}
                {new Date(report.created_at).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">Reason: {report.reason || "No reason provided"}</Typography>
              <Typography
                variant="body2"
                color={report.is_resolved ? "success.main" : "error.main"}
              >
                Resolved: {report.is_resolved ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              {/* Add additional UI elements like action buttons here if needed */}
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
        console.log(data)
        setReportsData(data.data); // Assuming the API response matches the dummy structure
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    };
    fetchReports();
  }, []);
      // console.log(reportsData)


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

      <Tabs value={value} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Grocery Reports" />
        <Tab label="Dish Reports" />
        <Tab label="Fashion Reports" />
      </Tabs>

      <Divider sx={{ my: 2 }} />

      {value === 0 && (
        <ReportSection reports={reportsData.grocery_reports} categoryName="Grocery" />
      )}
      {value === 1 && <ReportSection reports={reportsData.dish_reports} categoryName="Dish" />}
      {value === 2 && <ReportSection reports={reportsData.fashion_reports} categoryName="Fashion" />}
    </Box>
  );
};

export default ReportPage;
