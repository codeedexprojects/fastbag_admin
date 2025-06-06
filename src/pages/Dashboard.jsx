import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, IconButton,
  Checkbox, Badge, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper
} from '@mui/material';
import {
  ShoppingCart, AttachMoney, Inventory, AccountBalanceWallet
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {
  Chart as ChartJS, LineElement, CategoryScale, LinearScale,
  PointElement, Legend, Tooltip
} from 'chart.js';
import {
  getGraphData, getProduct_Vendor_Count, getSalesProgress, getStatsOverview,
  viewOrders
} from '../services/allApi';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const Dashboard = () => {
  const nav=useNavigate()  
  const filterOptions = ['All Time', '12 Months', '30 Days', '7 Days', '24 Hour'];

  const [activeButton, setActiveButton] = useState('All Time');
  const [selectedDate, setSelectedDate] = useState('');
  const [isCustomDateSelected, setIsCustomDateSelected] = useState(false);

  const [graphData, setGraphData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productsAndVendors, setProductsAndVendors] = useState([]);
  const [salesProgress, setSalesProgress] = useState({});
  const [statsOverview, setStatsOverview] = useState({
    all_time: { orders: 0, revenue: 0 },
    last_12_months: { orders: 0, revenue: 0 },
    last_30_days: { orders: 0, revenue: 0 },
    last_7_days: { orders: 0, revenue: 0 },
    last_24_hours: { orders: 0, revenue: 0 },
    selected_date: { orders: 0, revenue: 0 },
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const keyMap = {
          'All Time': 'all_time',
          '12 Months': 'last_12_months',
          '30 Days': 'last_30_days',
          '7 Days': 'last_7_days',
          '24 Hour': 'last_24_hours',
        };


        const [graph, sales, stats, orders,productAndVendors] = await Promise.all([
          getGraphData(),
          getSalesProgress(),
          getStatsOverview(selectedDate), 
          viewOrders(),
          getProduct_Vendor_Count()
        ]);

        setGraphData(graph);
        setSalesProgress(sales);
        setStatsOverview(stats);
        setRecentOrders(orders);
        setProductsAndVendors(productAndVendors)
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchAllData();
  }, [activeButton, selectedDate, isCustomDateSelected]);

  // Determine which stats to show
  const currentStats = (() => {
    if (isCustomDateSelected && selectedDate) {
      return statsOverview.selected_date || { orders: 0, revenue: 0 };
    }
    const keyMap = {
      'All Time': 'all_time',
      '12 Months': 'last_12_months',
      '30 Days': 'last_30_days',
      '7 Days': 'last_7_days',
      '24 Hour': 'last_24_hours',
    };
    return statsOverview[keyMap[activeButton]] || { orders: 0, revenue: 0 };
  })();

  const chartData = {
    labels: graphData.map(item => item.month || item.date || ''),
    datasets: [
      {
        label: 'Total Orders',
        data: graphData.map(item => item.total_orders),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.1,
      },
      {
        label: 'Total Revenue',
        data: graphData.map(item => item.total_revenue),
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.1,
      }
    ]
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Filter Buttons + Date Picker */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{
          display: 'flex',
          p: 1,
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9fafb',
        }}>
          {filterOptions.map((option) => (
            <Button
              key={option}
              variant="outlined"
              onClick={() => {
                setActiveButton(option);
                setIsCustomDateSelected(false);  // Reset custom date when toggling filter
              }}
              sx={{
                mr: 1,
                borderColor: activeButton === option ? '#1e1e2d' : 'transparent',
                color: activeButton === option ? '#1e1e2d' : '#000',
                backgroundColor: activeButton === option ? '#e0e7ff' : 'transparent',
                '&:hover': {
                  backgroundColor: activeButton === option ? '#e0e7ff' : '#f3f4f6',
                },
              }}
            >
              {option}
            </Button>
          ))}
        </Box>

        <DatePicker
          label="Select Date"
          value={selectedDate ? dayjs(selectedDate) : null}
          onChange={(newValue) => {
            if (newValue) {
              setSelectedDate(newValue.format('YYYY-MM-DD'));
              setIsCustomDateSelected(true);
            } else {
              setSelectedDate('');
              setIsCustomDateSelected(false);
            }
          }}
          slotProps={{
            textField: {
              size: 'small',
              variant: 'outlined',
              sx: { mr: 2, backgroundColor: 'white' },
            },
          }}
        />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <AttachMoney sx={{ fontSize: 40, color: '#4f46e5' }} />
                <Badge color="success" />
              </Box>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h5">₹{currentStats?.revenue?.toFixed(2) || '0.00'}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <ShoppingCart sx={{ fontSize: 40, color: '#16a34a' }} />
                <Badge color="success" />
              </Box>
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h5">{currentStats?.orders || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Inventory sx={{ fontSize: 40, color: '#f97316' }} />
                <Badge badgeContent={0} color="secondary" />
              </Box>
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h5">{productsAndVendors.total_products}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <AccountBalanceWallet sx={{ fontSize: 40, color: '#ef4444' }} />
                <Badge color="error" />
              </Box>
              <Typography variant="h6">Total Vendors</Typography>
              <Typography variant="h5">{productsAndVendors.vendors}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Sales Progress</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {salesProgress?.percentage_change?.toFixed(2) || 0}%
              </Typography>
              {salesProgress.today_revenue > salesProgress.yesterday_revenue ? (
                <Typography color="green">
                  You earned ₹{salesProgress.today_revenue} today, higher than yesterday
                </Typography>
              ) : salesProgress.today_revenue < salesProgress.yesterday_revenue ? (
                <Typography color="error">
                  Revenue dropped to ₹{salesProgress.today_revenue} today, lower than yesterday
                </Typography>
              ) : (
                <Typography color="text.secondary">
                  Same as yesterday: ₹{salesProgress.today_revenue}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Statistics</Typography>
              <Box sx={{ height: '250px' }}>
                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders Table */}
      <Box sx={{ mt: 5 }}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Recent Orders</Typography>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Checkbox /></TableCell>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => (
                    <TableRow key={index}>
                      <TableCell><Checkbox /></TableCell>
                      <TableCell><Button>{order.order_id}</Button></TableCell>
                      <TableCell>{order.product_details?.[0]?.product_name || '-'}</TableCell>
                      <TableCell>{order.created_at}</TableCell>
                      <TableCell>{order.user_name}</TableCell>
                      <TableCell>₹{order.final_amount}</TableCell>
                      <TableCell>{order.payment_method}</TableCell>
                      <TableCell>
                        <span style={{
                          color:
                            order.order_status === 'Processing' ? 'orange' :
                              order.order_status === 'Shipped' ? 'blue' :
                                order.order_status === 'Delivered' ? 'green' : 'red',
                        }}>
                          {order.order_status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => { nav(`/order-details/${order.id}`) }}><VisibilityIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={recentOrders.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 15]}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
