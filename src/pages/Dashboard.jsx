import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, IconButton,
  Badge, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper
} from '@mui/material';
import {
  ShoppingCart, AttachMoney, Inventory, AccountBalanceWallet
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
  const nav = useNavigate();
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
        const [graph, sales, stats, orders, productAndVendors] = await Promise.all([
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
        setProductsAndVendors(productAndVendors);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchAllData();
  }, [activeButton, selectedDate, isCustomDateSelected]);

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
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.1,
      },
      {
        label: 'Total Revenue',
        data: graphData.map(item => item.total_revenue),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.1,
      }
    ]
  };

  return (
    <Box sx={{ padding: '24px', minHeight: '100vh' }}>
      <Box
        sx={{
          display: 'flex', flexWrap: 'wrap', gap: 2,
          justifyContent: 'space-between', alignItems: 'center', mb: 3
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 1, borderRadius: 2,boxShadow:1, gap: 1, backgroundColor: '#fff' }}>
          {filterOptions.map((option) => (
            <Button
              key={option}
              onClick={() => { setActiveButton(option); setIsCustomDateSelected(false); }}
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: activeButton === option ? '#e0e7ff' : 'transparent',
                color: activeButton === option ? '#1e3a8a' : '#4b5563',
                '&:hover': {
                  backgroundColor: '#e0e7ff',
                }
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
              sx: { backgroundColor: '#fff', borderRadius: 2 },
            },
          }}
        />
      </Box>

      <Grid container spacing={2}>
        {[
          { title: 'Total Revenue', value: `₹${currentStats?.revenue?.toFixed(2)}`, icon: <AttachMoney sx={{ fontSize: 36, color: '#6366f1' }} /> },
          { title: 'Total Sales', value: currentStats?.orders, icon: <ShoppingCart sx={{ fontSize: 36, color: '#22c55e' }} /> },
          { title: 'Total Products', value: productsAndVendors.total_products, icon: <Inventory sx={{ fontSize: 36, color: '#f97316' }} /> },
          { title: 'Total Vendors', value: productsAndVendors.vendors, icon: <AccountBalanceWallet sx={{ fontSize: 36, color: '#ef4444' }} /> }
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ borderRadius: 3, boxShadow: 1, backgroundColor: '#fff' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  {item.icon}
                </Box>
                <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>{item.title}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Sales Progress</Typography>
              <Typography variant="h4" sx={{ mt: 2 }}>{salesProgress?.percentage_change?.toFixed(2) || 0}%</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {salesProgress.today_revenue > salesProgress.yesterday_revenue ?
                  `You earned ₹${salesProgress.today_revenue} today, higher than yesterday` :
                  salesProgress.today_revenue < salesProgress.yesterday_revenue ?
                    `Revenue dropped to ₹${salesProgress.today_revenue} today, lower than yesterday` :
                    `Same as yesterday: ₹${salesProgress.today_revenue}`
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Statistics</Typography>
              <Box sx={{ height: '250px' }}>
                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Card sx={{ borderRadius: 3, backgroundColor: '#fff' }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Recent Orders</Typography>
            <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
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
                    <TableRow key={index} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell><Button>{order.order_id}</Button></TableCell>
                      <TableCell>{order.product_details?.[0]?.product_name || '-'}</TableCell>
                      <TableCell>{order.created_at}</TableCell>
                      <TableCell>{order.user_name}</TableCell>
                      <TableCell>₹{order.final_amount}</TableCell>
                      <TableCell>{order.payment_method}</TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1.2, py: 0.4, borderRadius: '8px', fontWeight: 600,
                            color: getStatusColor(order.order_status).color,
                            backgroundColor: getStatusColor(order.order_status).bg,
                            display: 'inline-block'
                          }}
                        >
                          {order.order_status || 'Pending'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton color='info' onClick={() => nav(`/order-details/${order.id}`)}>
                          <VisibilityIcon />
                        </IconButton>
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

const getStatusColor = (status) => {
  const map = {
    processing: { color: '#ef6c00', bg: '#ffe0b2' },
    shipped: { color: '#1565c0', bg: '#bbdefb' },
    'out for delivery': { color: '#283593', bg: '#c5cae9' },
    delivered: { color: '#2e7d32', bg: '#c8e6c9' },
    cancelled: { color: '#ad1457', bg: '#f8bbd0' },
    rejected: { color: '#b71c1c', bg: '#ffcdd2' },
    return: { color: '#6a1b9a', bg: '#e1bee7' },
    default: { color: '#c62828', bg: '#ffcdd2' }
  };
  return map[status] || map.default;
};

export default Dashboard;
