import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, IconButton,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper, Skeleton
} from '@mui/material';
import {
  ShoppingCart, Inventory, AccountBalanceWallet, CurrencyRupee,
  TrendingUp, TrendingDown, Remove
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Eye, CalendarSearch } from 'lucide-react';
import {
  Chart as ChartJS, LineElement, CategoryScale, LinearScale,
  PointElement, Legend, Tooltip, Filler
} from 'chart.js';
import {
  getGraphData, getProduct_Vendor_Count, getSalesProgress, getStatsOverview,
  viewOrders
} from '../services/allApi';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Filler);

const Dashboard = () => {
  const nav = useNavigate();
  const filterOptions = ['All Time', '12 Months', '30 Days', '7 Days', '24 Hour'];

  // State management
  const [activeButton, setActiveButton] = useState('All Time');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCustomDateSelected, setIsCustomDateSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productsAndVendors, setProductsAndVendors] = useState({});
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

  // Handlers
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleFilterChange = useCallback((option) => {
    setActiveButton(option);
    setIsCustomDateSelected(false);
    setSelectedDate(null);
  }, []);

  const handleDateChange = useCallback((newValue) => {
    if (newValue) {
      setSelectedDate(newValue);
      setIsCustomDateSelected(true);
      setActiveButton('');
    } else {
      setSelectedDate(null);
      setIsCustomDateSelected(false);
      setActiveButton('All Time');
    }
  }, []);

  // Fetch data
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const dateParam = selectedDate ? selectedDate.format('YYYY-MM-DD') : '';
        
        const [graph, sales, stats, orders, productAndVendors] = await Promise.all([
          getGraphData(),
          getSalesProgress(),
          getStatsOverview(dateParam),
          viewOrders(),
          getProduct_Vendor_Count()
        ]);

        if (isMounted) {
          setGraphData(Array.isArray(graph) ? graph : []);
          setSalesProgress(sales || {});
          setStatsOverview(stats || {
            all_time: { orders: 0, revenue: 0 },
            last_12_months: { orders: 0, revenue: 0 },
            last_30_days: { orders: 0, revenue: 0 },
            last_7_days: { orders: 0, revenue: 0 },
            last_24_hours: { orders: 0, revenue: 0 },
            selected_date: { orders: 0, revenue: 0 },
          });
          setRecentOrders(Array.isArray(orders) ? orders : []);
          setProductsAndVendors(productAndVendors || {});
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        if (isMounted) {
          setGraphData([]);
          setSalesProgress({});
          setRecentOrders([]);
          setProductsAndVendors({});
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [activeButton, selectedDate, isCustomDateSelected]);

  // Memoized calculations
  const currentStats = useMemo(() => {
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
  }, [activeButton, isCustomDateSelected, selectedDate, statsOverview]);

  const chartData = useMemo(() => ({
    labels: graphData.map(item => item.month || item.date || ''),
    datasets: [
      {
        label: 'Total Orders',
        data: graphData.map(item => item.total_orders || 0),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Total Revenue',
        data: graphData.map(item => item.total_revenue || 0),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  }), [graphData]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 1) {
                label += '₹' + context.parsed.y.toFixed(2);
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6b7280'
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6b7280'
        }
      }
    }
  }), []);

  const paginatedOrders = useMemo(() => {
    return recentOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [recentOrders, page, rowsPerPage]);

  const salesTrendIcon = useMemo(() => {
    if (!salesProgress?.today_revenue || !salesProgress?.yesterday_revenue) {
      return <Remove sx={{ fontSize: 20, color: '#fff' }} />;
    }
    if (salesProgress.today_revenue > salesProgress.yesterday_revenue) {
      return <TrendingUp sx={{ fontSize: 20, color: '#fff' }} />;
    }
    if (salesProgress.today_revenue < salesProgress.yesterday_revenue) {
      return <TrendingDown sx={{ fontSize: 20, color: '#fff' }} />;
    }
    return <Remove sx={{ fontSize: 20, color: '#fff' }} />;
  }, [salesProgress]);

  const salesTrendColor = useMemo(() => {
    if (!salesProgress?.today_revenue || !salesProgress?.yesterday_revenue) {
      return '#a1a1aa';
    }
    if (salesProgress.today_revenue > salesProgress.yesterday_revenue) {
      return '#22c55e';
    }
    if (salesProgress.today_revenue < salesProgress.yesterday_revenue) {
      return '#ef4444';
    }
    return '#a1a1aa';
  }, [salesProgress]);

  const statsCards = useMemo(() => [
    {
      title: 'Total Revenue',
      value: `₹${currentStats?.revenue?.toFixed(2) || '0.00'}`,
      iconColor: '#6366f1',
      icon: <CurrencyRupee sx={{ fontSize: 22, color: '#fff' }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Total Sales',
      value: currentStats?.orders || 0,
      iconColor: '#22c55e',
      icon: <ShoppingCart sx={{ fontSize: 22, color: '#fff' }} />,
      gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    },
    {
      title: 'Total Products',
      value: productsAndVendors.total_products || 0,
      iconColor: '#f97316',
      icon: <Inventory sx={{ fontSize: 22, color: '#fff' }} />,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      title: 'Total Vendors',
      value: productsAndVendors.vendors || 0,
      iconColor: '#ef4444',
      icon: <AccountBalanceWallet sx={{ fontSize: 22, color: '#fff' }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  ], [currentStats, productsAndVendors]);

  return (
    <Box sx={{
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, sm: 3, md: 4 },
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
    }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Welcome back! Here's what's happening with your store today.
        </Typography>
      </Box>

      {/* Filter Controls */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          p: 1,
          borderRadius: 2,
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}>
          {filterOptions.map((option) => (
            <Button
              key={option}
              onClick={() => handleFilterChange(option)}
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 2.5,
                py: 1,
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'none',
                backgroundColor: activeButton === option && !isCustomDateSelected ? '#6366f1' : 'transparent',
                color: activeButton === option && !isCustomDateSelected ? '#fff' : '#64748b',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: activeButton === option && !isCustomDateSelected ? '#5558e3' : '#f1f5f9',
                },
                '&.Mui-disabled': {
                  color: '#94a3b8',
                }
              }}
            >
              {option}
            </Button>
          ))}
        </Box>

        <DatePicker
          label="Select Custom Date"
          value={selectedDate}
          onChange={handleDateChange}
          disabled={loading}
          slots={{
            openPickerIcon: CalendarSearch,
          }}
          slotProps={{
            textField: {
              size: 'small',
              variant: 'outlined',
              sx: {
                minWidth: 200,
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: isCustomDateSelected ? '#6366f1' : '#e2e8f0',
                    borderWidth: isCustomDateSelected ? 2 : 1,
                  },
                  '&:hover fieldset': {
                    borderColor: '#6366f1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              },
            },
          }}
        />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statsCards.map((item, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Card
              sx={{
                borderRadius: 3,
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: `0 8px 20px ${item.iconColor}25`,
                  transform: 'translateY(-4px)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: item.gradient,
                }
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {loading ? (
                  <>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
                  </>
                ) : (
                  <>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>
                        {item.title}
                      </Typography>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          background: item.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 4px 12px ${item.iconColor}30`,
                        }}
                      >
                        {item.icon}
                      </Box>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {item.value}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sales Progress & Chart */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Sales Progress Card */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              borderRadius: 3,
              backgroundColor: '#fff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {loading ? (
                <>
                  <Skeleton variant="text" width="50%" height={20} />
                  <Skeleton variant="text" width="30%" height={40} sx={{ mt: 2 }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2 }} />
                </>
              ) : (
                <>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 1.5 }}>
                        Sales Progress
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {salesProgress?.percentage_change?.toFixed(1) || 0}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2.5,
                        backgroundColor: salesTrendColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${salesTrendColor}40`,
                      }}
                    >
                      {salesTrendIcon}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mt: 3,
                      pt: 3,
                      borderTop: '1px solid #e2e8f0',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                      {salesProgress?.today_revenue > salesProgress?.yesterday_revenue
                        ? `🎉 Great work! Revenue increased to ₹${salesProgress?.today_revenue?.toFixed(2) || 0} today`
                        : salesProgress?.today_revenue < salesProgress?.yesterday_revenue
                          ? `📉 Revenue dropped to ₹${salesProgress?.today_revenue?.toFixed(2) || 0} today`
                          : `➖ Revenue stable at ₹${salesProgress?.today_revenue?.toFixed(2) || 0}`}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Chart Card */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              borderRadius: 3,
              backgroundColor: '#fff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Revenue & Orders Overview
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
              ) : (
                <Box sx={{ height: '300px' }}>
                  <Line data={chartData} options={chartOptions} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders Table */}
      <Card
        sx={{
          borderRadius: 3,
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
            Recent Orders
          </Typography>
          
          {loading ? (
            <Box>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 1, borderRadius: 1 }} />
              ))}
            </Box>
          ) : (
            <>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                }}
              >
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>No.</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Payment</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedOrders.length > 0 ? (
                      paginatedOrders.map((order, index) => (
                        <TableRow
                          key={order.id}
                          hover
                          sx={{
                            '&:hover': {
                              backgroundColor: '#f8fafc',
                            },
                          }}
                        >
                          <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#6366f1' }}>
                            {order.order_id}
                          </TableCell>
                          <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {order.product_details?.[0]?.product_name || '-'}
                          </TableCell>
                          <TableCell sx={{ color: '#64748b' }}>
                            {order.created_at}
                          </TableCell>
                          <TableCell>{order.user_name}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            ₹{order.final_amount}
                          </TableCell>
                          <TableCell sx={{ color: '#64748b' }}>
                            {order.payment_method}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="caption"
                              sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                color: getStatusColor(order.order_status).color,
                                backgroundColor: getStatusColor(order.order_status).bg,
                                display: 'inline-block',
                              }}
                            >
                              {order.order_status || 'Pending'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => nav(`/order-details/${order.id}`)}
                              sx={{
                                color: '#6366f1',
                                '&:hover': {
                                  backgroundColor: '#eef2ff',
                                },
                              }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            No orders found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
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
                rowsPerPageOptions={[5, 10, 15, 20]}
                sx={{
                  borderTop: '1px solid #e2e8f0',
                  '.MuiTablePagination-select': {
                    borderRadius: 1,
                  }
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase() || '';
  const map = {
    processing: { color: '#ea580c', bg: '#fed7aa' },
    shipped: { color: '#0284c7', bg: '#bae6fd' },
    'out for delivery': { color: '#7c3aed', bg: '#ddd6fe' },
    delivered: { color: '#16a34a', bg: '#bbf7d0' },
    cancelled: { color: '#dc2626', bg: '#fecaca' },
    rejected: { color: '#991b1b', bg: '#fecaca' },
    return: { color: '#9333ea', bg: '#f3e8ff' },
    pending: { color: '#ca8a04', bg: '#fef08a' },
    default: { color: '#64748b', bg: '#e2e8f0' }
  };
  return map[statusLower] || map.default;
};

export default Dashboard;