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
        <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6">
                {categoryName}: {review.dish_name || review.product_name || review.cloth_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {review.user_name || "Anonymous"} |{" "}
                {new Date(review.created_at).toLocaleDateString()}
              </Typography>
              <Rating
                name={`rating-${review.id}`}
                value={parseFloat(review.rating)}
                precision={0.1}
                readOnly
              />
              <Typography variant="body1">{review.review || "No review provided"}</Typography>
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Reviews
      </Typography>

      <Tabs value={value} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Dishes" />
        <Tab label="Grocery" />
        <Tab label="Fashion" />
      </Tabs>

      <Divider sx={{ my: 2 }} />

      {value === 0 && (
        <ReviewSection reviews={reviewsData.dish_reviews} categoryName="Dish" />
      )}
      {value === 1 && (
        <ReviewSection reviews={reviewsData.grocery_reviews} categoryName="Grocery" />
      )}
      {value === 2 && (
        <ReviewSection reviews={reviewsData.fashion_reviews} categoryName="Fashion" />
      )}
    </Box>
  );
};

export default ReviewPage;
