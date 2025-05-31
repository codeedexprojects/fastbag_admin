import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, IconButton, MenuItem, Select, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { AccessTime, Payment, LocalShipping, Person, Email, Phone, Description, Receipt, Settings, Place, ShoppingCart, Sync, CheckCircle, LocalMall } from '@mui/icons-material';

const OrderDetails = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Order Details
      </Typography>

      {/* Top Section: Breadcrumb and Buttons */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        {/* Breadcrumb */}
        <Typography variant="body2" color="textSecondary">
          Dashboard &gt; Order List &gt; Order Details
        </Typography>

        {/* Top-right Buttons */}
        <Box display="flex" alignItems="center" gap={2}>
          <Select defaultValue="Processing" size="small" variant="outlined">
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Canceled">Canceled</MenuItem>
          </Select>
          <Button variant="outlined">Export</Button>
          <Button variant="contained" color="primary">Invoice</Button>
        </Box>
      </Box>

      {/* Cards Section */}
      <Grid container spacing={3}>
        {/* Order Information Card */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Order #302011 <Button variant="contained" size="small" sx={{ ml: 1, bgcolor: 'orange', color: 'white' }}>Processing</Button></Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <AccessTime sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">Added</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>12 Dec 2022</Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <Payment sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">Payment Method</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>Visa</Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <LocalShipping sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">Shipping Method</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>Flat Shipping</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Information Card */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Customer</Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <Person sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">Customer</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>Josh Adam</Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <Email sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">Email</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>josh_adam@mail.com</Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <Phone sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">Phone</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>909 427 2910</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Document Information Card */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Document</Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <Description sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">Invoice</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>INV-32011</Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <LocalShipping sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">Shipping</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>SHP-2011REG</Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <Settings sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">Rewards</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>480 point</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order List and Address Section */}
      <Grid container spacing={3} mt={4}>
        {/* Order List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Order List <Typography component="span" color="green">2 Products</Typography></Typography>
              <TableContainer component={Paper} sx={{ mt: 2, bgcolor: '#f5f7f9' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>QTY</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography>Smartwatch E2</Typography>
                        <Typography variant="body2" color="textSecondary">Black</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="primary" sx={{ cursor: 'pointer' }}>302011</Typography>
                      </TableCell>
                      <TableCell>1 pcs</TableCell>
                      <TableCell>$400.00</TableCell>
                      <TableCell>$400.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography>Headphone G1 Pro</Typography>
                        <Typography variant="body2" color="textSecondary">Black Gray</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="primary" sx={{ cursor: 'pointer' }}>302011</Typography>
                      </TableCell>
                      <TableCell>1 pcs</TableCell>
                      <TableCell>$185.00</TableCell>
                      <TableCell>$185.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 3,textAlign: 'right' }}>
                <Typography>Subtotal: $585.00</Typography>
                <Typography>VAT (0%): $0</Typography>
                <Typography>Shipping Rate: $5.00</Typography>
                <Typography sx={{ fontWeight: 'bold', mt: 1 }}>Grand Total: $590.00</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Address and Order Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Address</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" alignItems="center" mt={2}>
                <Place sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">Billing</Typography>
              </Box>
              <Typography variant="body2" mt={1}>
                1833 Bel Meadow Drive, Fontana, California 92335, USA
              </Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <LocalShipping sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">Shipping</Typography>
              </Box>
              <Typography variant="body2" mt={1}>
                1833 Bel Meadow Drive, Fontana, California 92335, USA
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6">Order Status</Typography>
              <Divider sx={{ my: 1 }} />
              
              {/* Order Status Items */}
              <Box display="flex" alignItems="center" mt={2}>
                <ShoppingCart color="primary" sx={{ mr: 2 }} />
                <Typography variant="body2">Order Placed</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>12/12/2022, 03:00</Typography>
              </Box>

              <Box display="flex" alignItems="center" mt={2}>
                <Sync color="secondary" sx={{ mr: 2 }} />
                <Typography variant="body2">Processing</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>12/12/2022, 03:15</Typography>
              </Box>

              <Box display="flex" alignItems="center" mt={2}>
                <LocalMall sx={{ color: '#aaa', mr: 2 }} />
                <Typography variant="body2" color="textSecondary">Packed</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>DD/MM/YY, 00:00</Typography>
              </Box>

              <Box display="flex" alignItems="center" mt={2}>
                <LocalShipping sx={{ color: '#aaa', mr: 2 }} />
                <Typography variant="body2" color="textSecondary">Shipping</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>DD/MM/YY, 00:00</Typography>
              </Box>

              <Box display="flex" alignItems="center" mt={2}>
                <CheckCircle sx={{ color: '#aaa', mr: 2 }} />
                <Typography variant="body2" color="textSecondary">Delivered</Typography>
                <Typography variant="body2" sx={{ ml: 'auto' }}>DD/MM/YY, 00:00</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;
