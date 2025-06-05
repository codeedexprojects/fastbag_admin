import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Button, Modal, IconButton } from '@mui/material';
import { AccountBalanceWallet, ShoppingCart, Star, Close } from '@mui/icons-material';
import { viewSpecificUserOrders, viewWishlist } from '../../services/allApi'; // Replace with actual API path
import { useParams } from 'react-router-dom';

const Stats = () => {
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [wishlistData, setWishlistData] = useState(null);
  const[orders,setOrders]=useState()
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);
  const [totalWishlistCount, setTotalWishlistCount] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const data = await viewWishlist(id); // Replace `2` with dynamic user ID
        setTotalWishlistCount(data.total_wishlist_count || 0);
      } catch (error) {
        console.error('Error fetching total wishlist count:', error);
      }
    };
    fetchWishlistCount();
  }, []);
   useEffect(() => {
      const fetchOrders = async () => {
        try {
          const data = await viewSpecificUserOrders(id);
          setOrders(data);
        } catch (err) {
          console.error('Failed to fetch orders', err);
        }
      };
      fetchOrders();
    }, [id]);
          const totalOrders=orders?.length


  const handleViewWishlist = async () => {
    try {
      setLoadingWishlist(true);
      setWishlistError(null);
      const wishlist = await viewWishlist(id); // Replace `2` with dynamic user ID
      setWishlistData(wishlist);
      setWishlistModalOpen(true);
    } catch (error) {
      setWishlistError('Failed to fetch wishlist data');
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleCloseModal = () => {
    setWishlistModalOpen(false);
    setWishlistData(null);
  };

  const stats = [
    { title: 'Total Wishlist', value: totalWishlistCount, icon: AccountBalanceWallet, color: 'primary' },
    { title: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'primary', change: '+10%' },
  ];

  return (
    <>
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={6} key={index}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" alignItems="center">
                <stat.icon sx={{ fontSize: 30, mr: 1 }} />
                <Box>
                  <Typography variant="subtitle1">{stat.title}</Typography>
                  <Typography variant="h6" color={stat.color}>{stat.value}</Typography>
                </Box>
              </Box>
              {stat.title === 'Total Wishlist' && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={handleViewWishlist}
                >
                  View Wishlist
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Wishlist Modal */}
      <Modal open={wishlistModalOpen} onClose={handleCloseModal}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            maxHeight: '80vh',
            overflowY: 'auto',
            p: 3,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">User Wishlist</Typography>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </Box>
          {loadingWishlist ? (
            <Typography>Loading...</Typography>
          ) : wishlistError ? (
            <Typography color="error">{wishlistError}</Typography>
          ) : (
            <Box>
              {/* Grocery Wishlist */}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Grocery Wishlist
              </Typography>
              {wishlistData?.grocery_wishlist?.length ? (
                wishlistData.grocery_wishlist.map((item) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <Typography variant="body2">{item.product_name}</Typography>
                    <Typography variant="caption">Price: Rs.{item.price}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No items in grocery wishlist
                </Typography>
              )}

              {/* Fashion Wishlist */}
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Fashion Wishlist
              </Typography>
              {wishlistData?.fashion_wishlist?.length ? (
                wishlistData.fashion_wishlist.map((item) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <Typography variant="body2">{item.cloth_name}</Typography>
                    <Typography variant="caption">Price: Rs.{item.cloth_price}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No items in fashion wishlist
                </Typography>
              )}

              {/* Food Wishlist */}
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Food Wishlist
              </Typography>
              {wishlistData?.food_wishlist?.length ? (
                wishlistData.food_wishlist.map((item) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <Typography variant="body2">{item.product_name}</Typography>
                    <Typography variant="caption">Price: Rs.{item.price}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No items in food wishlist
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Modal>
    </>
  );
};

export default Stats;
