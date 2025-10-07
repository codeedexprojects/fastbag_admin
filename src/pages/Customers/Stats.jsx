import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Box, Button, Modal, IconButton
} from '@mui/material';
import {
  Wallet,
  ShoppingCart,
  X,
  ListOrdered
} from 'lucide-react';
import { viewSpecificUserOrders, viewWishlist } from '../../services/allApi';
import { useParams } from 'react-router-dom';

const Stats = () => {
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [wishlistData, setWishlistData] = useState(null);
  const [orders, setOrders] = useState();
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);
  const [totalWishlistCount, setTotalWishlistCount] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const data = await viewWishlist(id);
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

  const totalOrders = orders?.length;

  const handleViewWishlist = async () => {
    try {
      setLoadingWishlist(true);
      setWishlistError(null);
      const wishlist = await viewWishlist(id);
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
    { title: 'Total Wishlist', value: totalWishlistCount, icon: Wallet, color: 'primary' },
    { title: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'primary' },
  ];

  return (
    <>
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={6} key={index}>
            <Paper sx={{ p: 3, height: 150, borderRadius: 3, boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)' }}>
              <Box display="flex" alignItems="center">
                <Box mr={2}>
                  <stat.icon size={28} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>{stat.title}</Typography>
                  <Typography variant="h6" color={stat.color}>{stat.value}</Typography>
                </Box>
              </Box>
              {stat.title === 'Total Wishlist' && (
                <Button
                startIcon={<ListOrdered/>}
                  variant="contained"
                  size="small"
                  sx={{ mt: 2, borderRadius: 2 }}
                  onClick={handleViewWishlist}
                >
                  View Wishlist
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

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
            borderRadius: 3,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>User Wishlist</Typography>
            <IconButton onClick={handleCloseModal}>
              <X size={20} />
            </IconButton>
          </Box>

          {loadingWishlist ? (
            <Typography>Loading...</Typography>
          ) : wishlistError ? (
            <Typography color="error">{wishlistError}</Typography>
          ) : (
            <Box>
              {['grocery', 'fashion', 'food'].map((type) => (
                <Box key={type} mt={2}>
                  <Typography variant="subtitle1" mb={1} textTransform="capitalize">
                    {type} Wishlist
                  </Typography>
                  {wishlistData?.[`${type}_wishlist`]?.length ? (
                    wishlistData[`${type}_wishlist`].map((item) => (
                      <Box key={item.id} mb={1}>
                        <Typography variant="body2">
                          {item.product_name || item.cloth_name}
                        </Typography>
                        <Typography variant="caption">
                          Price: Rs.{item.price || item.cloth_price}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No items in {type} wishlist
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Modal>
    </>
  );
};

export default Stats;