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
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import { getNotificationCounts } from '../services/allApi';

const Sidebar = () => {
  const location = useLocation();
  const [openItems, setOpenItems] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [permissions, setPermissions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const handleToggle = key => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
    },
    {
      key: 'Vendors Product',
      text: 'Vendors Product',
      icon: <InventoryIcon />,
      subItems: [
        { text: 'Grocery', icon: <InventoryIcon />, path: '/view-groceryproducts' },
        { text: 'Fashion', icon: <InventoryIcon />, path: '/product-list' },
        { text: 'Food', icon: <InventoryIcon />, path: '/view-foodproducts' },
      ],
    },
    {
      key: 'Big Buy Orders',
      text: 'Big Buy Orders',
      icon: <WarehouseIcon />,
      path: '/view-bigbuyorders',
    },
    {
      key: 'Delivery',
      text: 'Delivery',
      icon: <DeliveryDiningIcon />,
      path: '/view-deliveryboyslist',
    },
    {
      key: 'Carousel',
      text: 'Carousel',
      icon: <ViewCarouselIcon />,
      path: '/view-carousel',
    },
  ];

  const visibleItems = role === 'admin'
    ? menuItems
    : menuItems.filter(item => permissions.includes(item.key));

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
      sx={{
        width: isSidebarOpen ? 240 : 72,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isSidebarOpen ? 240 : 72,
          backgroundColor: '#1f2937',
          color: '#d1d5db',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          boxSizing: 'border-box',
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
      {/* <Divider sx={{ borderColor: '#374151' }} /> */}
      <Box
        sx={{
          overflowY: 'auto',
          flexGrow: 1,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <List>
          {visibleItems.map(item => {
            const isOpen = openItems[item.key] || false;
            const isSelected =
              location.pathname === item.path ||
              (item.subItems && item.subItems.some(sub => location.pathname === sub.path));

            return (
              <React.Fragment key={item.key}>
                <ListItem
                  button
                  onClick={() => item.subItems ? handleToggle(item.key) : null}
                  component={item.subItems ? 'div' : Link}
                  to={item.subItems ? undefined : item.path}
                  selected={isSelected}
                  sx={{
                    borderRadius: '6px',
                    backgroundColor: isSelected ? '#4b5563' : 'transparent',
                    color: isSelected ? '#ffffff' : '#d1d5db',
                    '&:hover': {
                      backgroundColor: '#374151',
                      color: '#ffffff',
                    },
                    padding: '8px 16px',
                    margin: '4px 8px',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected ? '#ffffff' : '#d1d5db',
                      minWidth: 0,
                      mr: isSidebarOpen ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {isSidebarOpen && <ListItemText primary={item.text} />}
                  {isSidebarOpen && item.subItems && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>

                {item.subItems && isSidebarOpen && (
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
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
                            borderRadius: '6px',
                            backgroundColor: location.pathname === subItem.path ? '#4b5563' : 'transparent',
                            color: location.pathname === subItem.path ? '#ffffff' : '#d1d5db',
                            '&:hover': {
                              backgroundColor: '#374151',
                              color: '#ffffff',
                            },
                            margin: '4px 8px',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color: location.pathname === subItem.path ? '#ffffff' : '#d1d5db',
                              minWidth: 0,
                              mr: 2,
                              justifyContent: 'center',
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText primary={subItem.text} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
