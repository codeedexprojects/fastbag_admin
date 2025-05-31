import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, IconButton, Checkbox, Badge, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from '@mui/material';
import { ShoppingCart, AttachMoney, Inventory, AccountBalanceWallet, MoreVert } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';

// Initialize chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const Dashboard = () => {
    const [activeButton, setActiveButton] = useState('All Time'); // State to track the active button
    const [selectedDate, setSelectedDate] = useState('');
    const filterOptions = ['All Time', '12 Months', '30 Days', '7 Days', '24 Hour'];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const orders = [
        { id: '#302012', product: 'Handmade Pouch', productsCount: 3, date: '1 min ago', customer: 'John Bushmill', email: 'Johnb@mail.com', total: '$121.00', payment: 'Mastercard', status: 'Processing' },
        { id: '#302011', product: 'Smartwatch E2', productsCount: 1, date: '1 min ago', customer: 'Ilham Budi A', email: 'ilhambudi@mail.com', total: '$590.00', payment: 'Visa', status: 'Processing' },
        { id: '#302002', product: 'Smartwatch E1', productsCount: 1, date: '5 hours ago', customer: 'Mohammad Karim', email: 'm_karim@mail.com', total: '$125.00', payment: 'Transfer', status: 'Shipped' },
        { id: '#301901', product: 'Headphone G1 Pro', productsCount: 1, date: '1 day ago', customer: 'Linda Blair', email: 'lindablair@mail.com', total: '$348.00', payment: 'Paypal', status: 'Shipped' },
        { id: '#301900', product: 'Iphone X', productsCount: 1, date: '2 days ago', customer: 'Josh Adam', email: 'josh.adam@mail.com', total: '$607.00', payment: 'Visa', status: 'Delivered' },
        // Add more orders here
    ];

    const products = [
        { name: 'Handmade Pouch', sales: 401, amount: '$84,611', price: '$121.00', status: 'Low Stock' },
        { name: 'Smartwatch E2', sales: 301, amount: '$177,000', price: '$590.00', status: 'Published' },
        { name: 'Smartwatch E1', sales: 300, amount: '$37,500', price: '$125.00', status: 'Low Stock' },
        { name: 'Headphone G1 Pro', sales: 298, amount: '$103,704', price: '$348.00', status: 'Published' },
        { name: 'Iphone X', sales: 256, amount: '$150,000', price: '$607.00', status: 'Published' },
        // Add more products here
    ];

    // Sample sales by location data
    const salesByLocation = [
        { country: 'United Kingdom', sales: 340, amount: '$17,678', change: '+12%' },
        { country: 'Spain', sales: 100, amount: '$5,500', change: '-5%' },
        { country: 'Indonesia', sales: 50, amount: '$2,500', change: '0%' },
        { country: 'France', sales: 147, amount: '$7,456', change: '+19%' },
        { country: 'Germany', sales: 540, amount: '$24,189', change: '-25%' },
        // Add more sales locations here
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    // Chart Data
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Revenue',
                data: [1000, 1200, 1100, 1300, 1400, 1250, 1350, 1500, 1600, 1550, 1650, 1700],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
            },
            {
                label: 'Sales',
                data: [900, 1100, 1000, 1150, 1250, 1050, 1200, 1350, 1450, 1350, 1500, 1550],
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                fill: true,
            },
        ],
    };

    return (
        <Box sx={{ padding: '20px' }}>
            {/* Time range buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {/* Filter Buttons inside a Box */}
                <Box
                    sx={{
                        display: 'flex',
                        p: 1,
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                    }}
                >
                    {filterOptions.map((option) => (
                        <Button
                            key={option}
                            variant="outlined"
                            sx={{
                                mr: 1,
                                borderColor: activeButton === option ? '#1e1e2d' : 'transparent', // Blue border when active
                                color: activeButton === option ? '#1e1e2d' : '#000', // Blue text when active
                                backgroundColor: activeButton === option ? '#e0e7ff' : 'transparent', // Light blue background for active button
                                '&:hover': {
                                    backgroundColor: activeButton === option ? '#e0e7ff' : '#f3f4f6', // Keep background on hover
                                },
                            }}
                            onClick={() => setActiveButton(option)} // Set active button on click
                        >
                            {option}
                        </Button>
                    ))}
                </Box>


                {/* Action Buttons */}
                <Box>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)} // Update the selected date
                        style={{ marginRight: '10px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <Button variant="contained" sx={{ backgroundColor: "#1e1e2d" }}>+ Add Product</Button>
                </Box>
            </Box>


            {/* Stats Cards */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <AttachMoney sx={{ fontSize: 40, color: '#4f46e5' }} />
                                <Badge badgeContent={10} color="success" />
                            </Box>
                            <Typography variant="h6">Total Revenue</Typography>
                            <Typography variant="h5">₹75,500</Typography>
                            <Typography color="green">+10%</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <ShoppingCart sx={{ fontSize: 40, color: '#16a34a' }} />
                                <Badge badgeContent={15} color="success" />
                            </Box>
                            <Typography variant="h6">Total Sales</Typography>
                            <Typography variant="h5">31,500</Typography>
                            <Typography color="green">+15%</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Inventory sx={{ fontSize: 40, color: '#f97316' }} />
                                <Badge badgeContent={0} color="secondary" />
                            </Box>
                            <Typography variant="h6">Product SKU</Typography>
                            <Typography variant="h5">247</Typography>
                            <Typography color="textSecondary">0%</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <AccountBalanceWallet sx={{ fontSize: 40, color: '#ef4444' }} />
                                <Badge badgeContent={-25} color="error" />
                            </Box>
                            <Typography variant="h6">Balance</Typography>
                            <Typography variant="h5">₹24,500</Typography>
                            <Typography color="error">-25%</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sales Progress */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6">Sales Progress</Typography>
                                <IconButton>
                                    <MoreVert />
                                </IconButton>
                            </Box>
                            <Typography variant="h4" sx={{ mt: 2 }}>75.55%</Typography>
                            <Typography color="green">+10%</Typography>
                            <Typography>You succeeded to earn ₹240 today, it’s higher than yesterday</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Line Chart */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Statistics</Typography>
                            <Box sx={{ height: '250px' }}> {/* Set a fixed height for the chart */}
                                <Line
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
            <Box sx={{ mt: 5 }}>
                <Grid container spacing={3}>
                    {/* Top Selling Product Table */}
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6">Top Selling Products</Typography>
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            startIcon={<FilterListIcon />}
                                            sx={{ mr: 2 }}>
                                            Filters
                                        </Button>

                                    </Box>
                                </Box>
                                <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell>Sales</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {products
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((product, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{product.name}</TableCell>
                                                        <TableCell>{product.sales}</TableCell>
                                                        <TableCell>{product.amount}</TableCell>
                                                        <TableCell>{product.price}</TableCell>
                                                        <TableCell>
                                                            <span
                                                                style={{
                                                                    color: product.status === 'Low Stock' ? 'red' : 'green',
                                                                }}
                                                            >
                                                                {product.status}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={products.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 15]}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Sales by Location */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Sales by Location</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Country</TableCell>
                                                <TableCell>Sales</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Change</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {salesByLocation.map((location, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{location.country}</TableCell>
                                                    <TableCell>{location.sales}</TableCell>
                                                    <TableCell>{location.amount}</TableCell>
                                                    <TableCell>
                                                        <span
                                                            style={{
                                                                color: location.change.includes('-') ? 'red' : 'green',
                                                            }}
                                                        >
                                                            {location.change}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 5 }}>
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Recent Orders</Typography>
                            <Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterListIcon />}
                                    sx={{ mr: 2 }}>
                                    Filters
                                </Button>
                                <Button variant="contained" sx={{backgroundColor:"#1e1e2d"}}>
                                    See More
                                </Button>
                            </Box>
                        </Box>
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Checkbox />
                                        </TableCell>
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
                                    {orders
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((order, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Checkbox />
                                                </TableCell>
                                                <TableCell>
                                                    <Button>{order.id}</Button>
                                                </TableCell>
                                                <TableCell>
                                                    {order.product} {order.productsCount > 1 && `+${order.productsCount - 1} other products`}
                                                </TableCell>
                                                <TableCell>{order.date}</TableCell>
                                                <TableCell>{order.customer}<br />{order.email}</TableCell>
                                                <TableCell>{order.total}</TableCell>
                                                <TableCell>{order.payment}</TableCell>
                                                <TableCell>
                                                    <span
                                                        style={{
                                                            color: order.status === 'Processing' ? 'orange' :
                                                                order.status === 'Shipped' ? 'blue' :
                                                                    order.status === 'Delivered' ? 'green' :
                                                                        'red',
                                                        }}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton>
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                    <IconButton>
                                                        <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={orders.length}
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
