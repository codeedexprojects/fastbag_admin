import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Paper,
  Grid,
  Rating,
  Divider,
  CircularProgress,
} from "@mui/material";
import { viewReviews } from "../../services/allApi";

const ReviewSection = ({ reviews, categoryName }) => {
  return (
    <Box>
      {reviews.map((review) => (
        <Paper
          key={review.id}
          sx={{
            p: 3,
            mb: 2.5,
            borderRadius: 3,
            backgroundColor: "#fff",
            boxShadow: "0 1px 10px rgba(0, 0, 0, 0.06)",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {review.user_name || "Anonymous"} • {review.created_at}
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 1, color: "#1f2937" }}
              >
                {categoryName}:{" "}
                {review.dish_name || review.product_name || review.cloth_name}
              </Typography>

              <Rating
                name={`rating-${review.id}`}
                value={parseFloat(review.rating)}
                precision={0.1}
                readOnly
                sx={{ mb: 1 }}
              />

              <Typography
                variant="body1"
                sx={{ color: "#374151", fontSize: 14 }}
              >
                {review.review || "No review provided."}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

const ReviewPage = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reviewsData, setReviewsData] = useState({
    dish_reviews: [],
    grocery_reviews: [],
    fashion_reviews: [],
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await viewReviews();
        setReviewsData(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 700, color: "#1f2937" }}
      >
        Reviews
      </Typography>

    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
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
    <Tab label="Dishes" />
    <Tab label="Grocery" />
    <Tab label="Fashion" />
  </Tabs>
</Box>


      <Divider sx={{ my: 2 }} />

      {value === 0 && (
        <ReviewSection
          reviews={reviewsData.dish_reviews}
          categoryName="Dish"
        />
      )}
      {value === 1 && (
        <ReviewSection
          reviews={reviewsData.grocery_reviews}
          categoryName="Grocery"
        />
      )}
      {value === 2 && (
        <ReviewSection
          reviews={reviewsData.fashion_reviews}
          categoryName="Fashion"
        />
      )}
    </Box>
  );
};

export default ReviewPage;
