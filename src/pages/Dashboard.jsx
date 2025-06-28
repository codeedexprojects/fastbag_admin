import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, IconButton,
  Badge, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper
} from '@mui/material';
import {
  ShoppingCart, AttachMoney, Inventory, AccountBalanceWallet,
  CurrencyRupee
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
import { CalendarSearch, Eye } from 'lucide-react';

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
        <Box sx={{
          display: 'flex', flexWrap: 'wrap', p: 1, borderRadius: 2, gap: 1, backgroundColor: '#fff', boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',


        }}>
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
          slots={{
            openPickerIcon: CalendarSearch,
          }}
          slotProps={{
            textField: {
              size: 'small',

              variant: 'outlined',
              sx: {
                minWidth: 180,
                boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',

                backgroundColor: '#f9fafb',
                borderRadius: 2,
                fontSize: 14,
                '& .MuiOutlinedInput-root': {
                  paddingRight: '10px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d1d5db',
                  borderRadius: '8px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#9ca3af',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6366f1',
                  borderWidth: 2,
                },
                '& .MuiInputBase-input': {
                  padding: '10px 12px',
                  color: '#111827',
                },
                '& .MuiSvgIcon-root': {
                  color: '#4b5563',
                },
              },
            },
            openPickerButton: {
              sx: {
                color: '#4b5563',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              },
            },
          }}
        />


      </Box>

      <Grid container spacing={2}>
        {[
          {
            title: 'Total Revenue',
            value: `₹${currentStats?.revenue?.toFixed(2)}`,
            iconColor: '#6366f1',
            icon: <CurrencyRupee sx={{ fontSize: 20, color: '#fff' }} />,
          },
          {
            title: 'Total Sales',
            value: currentStats?.orders,
            iconColor: '#22c55e',
            icon: <ShoppingCart sx={{ fontSize: 20, color: '#fff' }} />,
          },
          {
            title: 'Total Products',
            value: productsAndVendors.total_products,
            iconColor: '#f97316',
            icon: <Inventory sx={{ fontSize: 20, color: '#fff' }} />,
          },
          {
            title: 'Total Vendors',
            value: productsAndVendors.vendors,
            iconColor: '#ef4444',
            icon: <AccountBalanceWallet sx={{ fontSize: 20, color: '#fff' }} />,
          },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              sx={{
                borderRadius: 3,
                backgroundColor: '#fff',
                boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
                p: 2,
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                  <Typography variant="h4" fontWeight={700}>
                    {item.value}
                  </Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: item.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </Box>
                </Box>
                {/* Optional trend indicator can be added here */}
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              backgroundColor: '#fff',
              boxShadow: '0 1px 10px rgba(0, 0, 0, 0.08)',
              p: 2,
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                    Sales Progress
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    {salesProgress?.percentage_change?.toFixed(2) || 0}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                    {salesProgress?.today_revenue > salesProgress?.yesterday_revenue
                      ? `You earned ₹${salesProgress?.today_revenue} today, higher than yesterday`
                      : salesProgress.today_revenue < salesProgress.yesterday_revenue
                        ? `Revenue dropped to ₹${salesProgress?.today_revenue} today, lower than yesterday`
                        : `Same as yesterday: ₹${salesProgress?.today_revenue}`}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor:
                      salesProgress?.today_revenue > salesProgress?.yesterday_revenue
                        ? '#22c55e'
                        : salesProgress?.today_revenue < salesProgress?.yesterday_revenue
                          ? '#ef4444'
                          : '#a1a1aa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 2v8h8" />
                    <path d="M21 3l-9 9-7-7-4 4" />
                  </svg>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              backgroundColor: '#fff',
              boxShadow: '0 1px 10px rgba(0, 0, 0, 0.08)',
              p: 2,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                Statistics
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-bar-chart-2"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Insights
            </Typography>
            <Box sx={{ height: '230px' }}>
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Box>
          </Card>
        </Grid>

      </Grid>
      <Box sx={{ mt: 5 }}>
        <Card sx={{
          borderRadius: 3, backgroundColor: '#fff', boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
        }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Recent Orders</Typography>
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{ borderRadius: 3, boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)', overflow: "hidden", mt: 3 }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="category table">
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
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
                      <TableCell>{order.order_id}</TableCell>
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
                          <Eye />
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
