import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Switch,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { viewCoupons } from "../../services/allApi";

const CouponList = () => {
    const [coupons, setCoupons] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoupons = async () => {
            setLoading(true);
            try {
                const data = await viewCoupons();
                setCoupons(data);
            } catch (error) {
                console.error("Error fetching coupons:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAddCoupon = () => {
        navigate("/add-coupons");
    };

    const handleEditCoupon = (id) => {
        navigate(`/edit-coupon/${id}`);
    };

    const handleDeleteCoupon = (id) => {
        // Implement delete functionality
        console.log("Delete coupon with ID:", id);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Coupon Management
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="body2" color="textSecondary">
                    Dashboard &gt; Coupon Management
                </Typography>
                <Button
                    onClick={handleAddCoupon}
                    variant="contained"
                    startIcon={<Add />}
                    sx={{backgroundColor:"#1e1e2d"}}
                >
                     Add Coupon
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Vendor</TableCell>
                            <TableCell>Discount Type</TableCell>
                            <TableCell>Discount Value</TableCell>
                            <TableCell>Valid From</TableCell>
                            <TableCell>Valid To</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coupons.length > 0 ? (
                            coupons
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((coupon) => (
                                    <TableRow key={coupon.id}>
                                        <TableCell>{coupon.code}</TableCell>
                                        <TableCell>{coupon.vendor_name}</TableCell>
                                        <TableCell>{coupon.discount_type}</TableCell>
                                        <TableCell>
                                            {coupon.discount_type === "percentage"
                                                ? `${coupon.discount_value}%`
                                                : `RS.${coupon.discount_value}`}
                                        </TableCell>
                                        <TableCell>{new Date(coupon.valid_from).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(coupon.valid_to.split("/").reverse().join("-")).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {coupon.is_active ? "Active" : "Inactive"}
                                        </TableCell>

                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleEditCoupon(coupon.id)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteCoupon(coupon.id)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    {loading ? "Loading..." : "No coupons available."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={coupons.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 15]}
            />
        </Box>
    );
};

export default CouponList;
