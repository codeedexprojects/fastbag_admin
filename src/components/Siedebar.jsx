import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Box,
  Collapse,
  Divider
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import CategoryIcon from '@mui/icons-material/Category';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import InventoryIcon from '@mui/icons-material/Inventory';  // <-- This is the updated icon for BigBuyOrders
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { getNotificationCounts } from '../services/allApi';

const Sidebar = () => {
  const location = useLocation();
  const [openProducts, setOpenProducts] = useState(false);
  const [openSellers, setOpenSellers] = useState(false);
  const [openCustomers, setOpenCustomers] = useState(false);
  const [openVendorsProduct, setOpenVendorsProduct] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [permissions, setPermissions] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");
    if (storedPermissions) {
      try {
        setPermissions(JSON.parse(storedPermissions));
      } catch {
        setPermissions([]);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getNotificationCounts();
        setUnreadCount(data.unread_count || 0);
      } catch (error) {
        console.error("Failed to fetch unread notification count:", error);
      }
    };
    fetchUnreadCount();
  }, []);

  const handleProductsClick = () => setOpenProducts(!openProducts);
  const handleSellersClick = () => setOpenSellers(!openSellers);
  const handleCustomerClick = () => setOpenCustomers(!openCustomers);
  const handleVendorsProductClick = () => setOpenVendorsProduct(!openVendorsProduct);

  const menuItems = [
    {
      key: 'Dashboard',
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      key: 'Category',
      text: 'Category',
      icon: <CategoryIcon />,
      subItems: [
        { text: 'Category', icon: <CategoryIcon />, path: '/category-list' },
        { text: 'Sub Category', icon: <CategoryIcon />, path: '/view-subcategory' },
      ],
      isOpen: openProducts,
      handleClick: handleProductsClick,
    },
    {
      key: 'Orders',
      text: 'Orders',
      icon: <ShoppingCartIcon />,
      path: '/order-list',
    },
    {
      key: 'Customers',
      text: 'Customers',
      icon: <PeopleIcon />,
      subItems: [
        { text: 'Customers List', icon: <ListAltIcon />, path: '/customers-list' },
        { text: 'Product Reviews', icon: <ListAltIcon />, path: '/reviews-list' },
        { text: 'Product Reportings', icon: <ListAltIcon />, path: '/reports-list' },
      ],
      isOpen: openCustomers,
      handleClick: handleCustomerClick,
    },
    {
      key: 'Coupons',
      text: 'Coupons',
      icon: <LocalOfferIcon />,
      path: '/view-coupons',
    },
    {
      key: 'Notifications',
      text: 'Notifications',
      icon: (
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      ),
      path: '/view-notifications',
    },
    {
      key: 'Stores',
      text: 'Stores',
      icon: <StorefrontIcon />,
      path: '/view-stores',
    },
    {
      key: 'Sub Admins',
      text: 'Sub Admins',
      icon: <AdminPanelSettingsIcon />,
      path: '/view-subadmin',
    },
    {
      key: 'Sellers',
      text: 'Sellers',
      icon: <StorefrontIcon />,
      subItems: [
        { text: 'View Vendors', icon: <ListAltIcon />, path: '/view-vendors' },
      ],
      isOpen: openSellers,
      handleClick: handleSellersClick,
    },
    {
      key: 'Vendors Product',
      text: 'Vendors Product',
      icon: <InventoryIcon />,
      subItems: [
        { text: 'Grocery', icon: <InventoryIcon />, path: '/view-groceryproducts' },
        { text: 'Fashion', icon: <InventoryIcon />, path: '/product-list' },
        { text: 'Food', icon: <InventoryIcon />, path: '/view-foodproducts' },
        { text: 'Colours', icon: <InventoryIcon />, path: '/colours' },
      ],
      isOpen: openVendorsProduct,
      handleClick: handleVendorsProductClick,
    },
   
    {
      key: 'Big Buy Orders',
      text: 'Big Buy Orders',
      icon: <WarehouseIcon />,   // <-- Updated icon here
      path: '/view-bigbuyorders',
    },{
      key: 'Delivery',
      text: 'Delivery',
      icon: <WarehouseIcon />,   // <-- Updated icon here
      path: '/view-deliveryboyslist',
    },
    //  {
    //   key: 'Analytics',
    //   text: 'Analytics',
    //   icon: <BarChartIcon />,
    //   path: '/analytics',
    // },
  ];

  // Filter based on role and permissions
  const visibleItems = role === 'admin'
    ? menuItems
    : menuItems.filter(item =>
        permissions.includes(item.key)
      );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1e1e2d',
          color: '#a4a6b3',
        },
      }}
    >
      <Box sx={{ padding: '16px', textAlign: 'center' }}>
        <img
          src="https://i.postimg.cc/qqhWvvN2/6f05cef92da77e8f946c303920fa8a7e.png"
          alt="Logo"
          style={{ width: '100%', maxWidth: '120px', height: '50px' }}
        />
      </Box>
      <Divider sx={{ borderColor: '#393946' }} />
      <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1 }}>
        <List>
          {visibleItems.map(item =>
            item.subItems ? (
              <React.Fragment key={item.key}>
                <ListItem
                  button
                  onClick={item.handleClick}
                  sx={{
                    borderRadius: '4px',
                    backgroundColor: item.isOpen ? '#393946' : 'transparent',
                    color: item.isOpen ? '#ffffff' : '#a4a6b3',
                    '&:hover': {
                      backgroundColor: '#393946',
                      color: '#ffffff',
                    },
                    padding: '8px 16px',
                    margin: '4px 8px',
                  }}
                >
                  <ListItemIcon sx={{ color: item.isOpen ? '#ffffff' : '#a4a6b3' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map(subItem => (
                      <ListItem
                        button
                        component={Link}
                        to={subItem.path}
                        key={subItem.text}
                        selected={location.pathname === subItem.path}
                        sx={{
                          paddingLeft: '32px',
                          borderRadius: '4px',
                          backgroundColor: location.pathname === subItem.path ? '#393946' : 'transparent',
                          color: location.pathname === subItem.path ? '#ffffff' : '#a4a6b3',
                          '&:hover': {
                            backgroundColor: '#393946',
                            color: '#ffffff',
                          },
                          margin: '4px 8px',
                        }}
                      >
                        <ListItemIcon sx={{ color: location.pathname === subItem.path ? '#ffffff' : '#a4a6b3' }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ) : (
              <ListItem
                button
                component={Link}
                to={item.path}
                key={item.key}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: '4px',
                  backgroundColor: location.pathname === item.path ? '#393946' : 'transparent',
                  color: location.pathname === item.path ? '#ffffff' : '#a4a6b3',
                  '&:hover': {
                    backgroundColor: '#393946',
                    color: '#ffffff',
                  },
                  padding: '8px 16px',
                  margin: '4px 8px',
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? '#ffffff' : '#a4a6b3' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            )
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
