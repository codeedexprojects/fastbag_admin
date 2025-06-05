import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container, Typography, Grid, Card, CardContent, Avatar,
    Divider, CircularProgress, Box, Chip
} from '@mui/material';
import { getDeliveryBoy } from '../../services/allApi';

const acceptedOrders = [
    { id: 'ORD123', customer: 'Alice', date: '2025-06-01', status: 'DELIVERED' },
    { id: 'ORD124', customer: 'Bob', date: '2025-06-02', status: 'IN TRANSIT' },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING': return 'warning';
        case 'CONFIRMED': return 'success';
        case 'CANCELLED': return 'error';
        case 'PREPARING': return 'info';
        case 'DELIVERED': return 'primary';
        default: return 'default';
    }
};

const DeliveryBoyDetails = () => {
    const [deliveryBoy, setDeliveryBoy] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchDeliveryBoy = async () => {
            try {
                const response = await getDeliveryBoy(id);
                setDeliveryBoy(response.data);
            } catch (error) {
                console.error("Error fetching delivery boy:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeliveryBoy();
    }, [id]);

    if (loading) {
        return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
    }

    if (!deliveryBoy) {
        return <Container sx={{ textAlign: 'center', mt: 4 }}><Typography color="error">Delivery boy not found.</Typography></Container>;
    }

    return (
        <Box sx={{ p: 4, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>{deliveryBoy.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Dashboard &gt; Delivery Boy &gt; {deliveryBoy.name}
            </Typography>

            <Grid container spacing={4}>
                {/* LEFT SECTION */}
                <Grid item xs={12} md={4}>
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                                height: '75vh',      
                                overflowY: 'auto',
                            },
                        }}
                    >
                        <CardContent sx={{ pt: 3 }}>
                            <Box display="flex" justifyContent="center" mb={3}>
                                <Avatar
                                    src={deliveryBoy.photo}
                                    alt={deliveryBoy.name}
                                    sx={{ width: 120, height: 120 }}
                                >
                                    {!deliveryBoy.photo && deliveryBoy.name?.charAt(0)}
                                </Avatar>
                            </Box>
                            <Typography variant="body1" fontWeight={600}>Mobile:</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>{deliveryBoy.mobile_number}</Typography>

                            <Typography variant="body1" fontWeight={600}>Email:</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>{deliveryBoy.email}</Typography>

                            <Typography variant="body1" fontWeight={600}>Address:</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>{deliveryBoy.address || 'N/A'}</Typography>

                            <Typography variant="body1" fontWeight={600}>Vehicle:</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {deliveryBoy.vehicle_type} - {deliveryBoy.vehicle_number}
                            </Typography>

                            <Typography variant="body1" fontWeight={600}>DOB:</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>{deliveryBoy.dob}</Typography>

                            <Typography variant="body1" fontWeight={600}>Gender:</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>{deliveryBoy.gender}</Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom>Documents</Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {deliveryBoy.aadhar_card_image && (
                                    <img src={deliveryBoy.aadhar_card_image} alt="Aadhar" width="120" style={{ borderRadius: 8 }} />
                                )}
                                {deliveryBoy.driving_license_image && (
                                    <img src={deliveryBoy.driving_license_image} alt="License" width="120" style={{ borderRadius: 8 }} />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* RIGHT SECTION */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Accepted Orders
                    </Typography>
                    <Grid container spacing={3}>
                        {acceptedOrders.map((order) => (
                            <Grid item xs={12} sm={6} key={order.id}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        borderRadius: 2,
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Order ID: #{order.id}
                                        </Typography>
                                        <Chip
                                            label={order.status}
                                            color={getStatusColor(order.status)}
                                            size="small"
                                            sx={{ mt: 1, mb: 2, fontWeight: 'bold', borderRadius: 1 }}
                                        />
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Customer:</strong> {order.customer}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Date:</strong> {order.date}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Status:</strong> {order.status}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DeliveryBoyDetails;
