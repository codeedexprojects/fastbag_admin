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
  Divider,
  Percent
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';


import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

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
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>,
      path: '/',
    },
    {
      key: 'Category',
      text: 'Category',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-category"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4h6v6h-6z" /><path d="M14 4h6v6h-6z" /><path d="M4 14h6v6h-6z" /><path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>,
      subItems: [
        { text: 'Category', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-category-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 4h6v6h-6z" /><path d="M4 14h6v6h-6z" /><path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M7 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>, path: '/category-list' },
        { text: 'Sub Category', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-category-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4h6v6h-6zm10 0h6v6h-6zm-10 10h6v6h-6zm10 3h6m-3 -3v6" /></svg>, path: '/view-subcategory' },
      ],
    },
    {
      key: 'Orders',
      text: 'Orders',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>,
      path: '/order-list',
    },
    {
      key: 'Customers',
      text: 'Customers',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>,
      subItems: [
        { text: 'Customers List', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-list-icon lucide-list"><path d="M3 12h.01" /><path d="M3 18h.01" /><path d="M3 6h.01" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M8 6h13" /></svg>, path: '/customers-list' },
        { text: 'Product Reviews', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-list-todo-icon lucide-list-todo"><rect x="3" y="5" width="6" height="6" rx="1" /><path d="m3 17 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg>, path: '/reviews-list' },
        { text: 'Product Reportings', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-report"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" /><path d="M18 14v4h4" /><path d="M18 11v-4a2 2 0 0 0 -2 -2h-2" /><path d="M8 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M8 11h4" /><path d="M8 15h3" /></svg>, path: '/reports-list' },
      ],
    },
    {
      key: 'Coupons',
      text: 'Coupons',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-rosette-discount"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 15l6 -6" /><circle cx="9.5" cy="9.5" r=".5" fill="currentColor" /><circle cx="14.5" cy="14.5" r=".5" fill="currentColor" /><path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7a2.2 2.2 0 0 0 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1a2.2 2.2 0 0 0 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" /></svg>,
      path: '/view-coupons',
    },
    {
      key: 'Notifications',
      text: 'Notifications',
      icon: (
        <Badge badgeContent={unreadCount} color="error">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bell-dot-icon lucide-bell-dot"><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M13.916 2.314A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673 9 9 0 0 1-.585-.665" /><circle cx="18" cy="8" r="3" /></svg>   </Badge>
      ),
      path: '/view-notifications',
    },
    {
      key: 'Stores',
      text: 'Stores',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-store-icon lucide-store"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" /></svg>,
      path: '/view-stores',
    },
    {
      key: 'Sub Admins',
      text: 'Sub Admins',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shield-user-icon lucide-shield-user"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="M6.376 18.91a6 6 0 0 1 11.249.003" /><circle cx="12" cy="11" r="4" /></svg>,
      path: '/view-subadmin',
    },
    {
      key: 'Sellers',
      text: 'Sellers',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shopping-bag-icon lucide-shopping-bag"><path d="M16 10a4 4 0 0 1-8 0" /><path d="M3.103 6.034h17.794" /><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" /></svg>,
      subItems: [
        { text: 'View Vendors', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-archive-icon lucide-archive"><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></svg>, path: '/view-vendors' },
      ],
    },
    {
      key: 'Vendor Commission',
      text: 'Vendor Commission',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-percent"
        >
          <line x1="19" y1="5" x2="5" y2="19" />
          <circle cx="6.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      ),
      path: '/vendor-commission',
    },
    {
      key: 'Story',
      text: 'Story',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-book-open"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      path: '/list-story',
    },
    {
      key: 'Vendors Product',
      text: 'Vendors Product',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-package-icon lucide-package"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" /><path d="M12 22V12" /><polyline points="3.29 7 12 12 20.71 7" /><path d="m7.5 4.27 9 5.15" /></svg>,
      subItems: [
        { text: 'Grocery', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffff" viewBox="0 0 256 256"><path d="M136,120v56a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm36.84-.8-5.6,56A8,8,0,0,0,174.4,184a7.32,7.32,0,0,0,.81,0,8,8,0,0,0,7.95-7.2l5.6-56a8,8,0,0,0-15.92-1.6Zm-89.68,0a8,8,0,0,0-15.92,1.6l5.6,56a8,8,0,0,0,8,7.2,7.32,7.32,0,0,0,.81,0,8,8,0,0,0,7.16-8.76ZM239.93,89.06,224.86,202.12A16.06,16.06,0,0,1,209,216H47a16.06,16.06,0,0,1-15.86-13.88L16.07,89.06A8,8,0,0,1,24,80H68.37L122,18.73a8,8,0,0,1,12,0L187.63,80H232a8,8,0,0,1,7.93,9.06ZM89.63,80h76.74L128,36.15ZM222.86,96H33.14L47,200H209Z"></path></svg>, path: '/view-groceryproducts' },
        { text: 'Fashion', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-tie"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 22l4 -4l-2.5 -11l.993 -2.649a1 1 0 0 0 -.936 -1.351h-3.114a1 1 0 0 0 -.936 1.351l.993 2.649l-2.5 11l4 4z" /><path d="M10.5 7h3l5 5.5" /></svg>, path: '/product-list' },
        { text: 'Food', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-tools-kitchen-3"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 4v17m-3 -17v3a3 3 0 1 0 6 0v-3" /><path d="M17 8m-3 0a3 4 0 1 0 6 0a3 4 0 1 0 -6 0" /><path d="M17 12v9" /></svg>, path: '/view-foodproducts' },
      ],
    },
    {
      key: 'Big Buy Orders',
      text: 'Big Buy Orders',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-home-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2c.641 0 1.212 .302 1.578 .771" /><path d="M20.136 11.136l-8.136 -8.136l-9 9h2v7a2 2 0 0 0 2 2h6.344" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg>,
      path: '/view-bigbuyorders',
    },
    {
      key: 'Delivery',
      text: 'Delivery',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-truck-delivery"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /><path d="M3 9l4 0" /></svg>,
      path: '/view-deliveryboyslist',
    },
    {
      key: 'Carousel',
      text: 'Carousel',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-carousel-horizontal"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 5m0 1a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1z" /><path d="M22 17h-1a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h1" /><path d="M2 17h1a1 1 0 0 0 1 -1v-8a1 1 0 0 0 -1 -1h-1" /></svg>,
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
          border:'none',
          
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
                    cursor: 'pointer', // 👈 Add this line
                    borderRadius: '8px',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                    color: isSelected ? '#ffffff' : '#d1d5db',
                    backdropFilter: isSelected ? 'blur(8px)' : 'none',
                    '&:hover': {
                      color: '#ffffff',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(12px)',
                      cursor: item.subItems ? 'pointer' : 'default',
                      '& svg': {
                        filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))',
                      },
                      '& .dropdown-icon': {
                        filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))',
                      },
                    },
                    '& svg': {
                      transition: 'all 0.3s ease',
                    },
                    padding: '10px 16px',
                    margin: '4px 8px',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected ? '#ffffff' : '#d1d5db',
                      minWidth: 0,
                      mr: isSidebarOpen ? 2 : 'auto',
                      justifyContent: 'center',
                      filter: isSelected ? 'drop-shadow(0 0 6px rgba(255,255,255,0.5))' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {isSidebarOpen && <ListItemText primary={item.text} />}

                  {isSidebarOpen && item.subItems && (
                    <Box
                      classNameName="dropdown-icon"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        filter: isSelected ? 'drop-shadow(0 0 6px rgba(255,255,255,0.6))' : 'none'
                      }}
                    >
                      {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  )}
                </ListItem>

                {item.subItems && isSidebarOpen && (
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map(subItem => {
                        const isSubSelected = location.pathname === subItem.path;
                        return (
                          <ListItem
                            button
                            component={Link}
                            to={subItem.path}
                            key={subItem.text}
                            selected={isSubSelected}
                            sx={{
                              paddingLeft: '32px',
                              borderRadius: '8px',
                              backgroundColor: isSubSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                              color: isSubSelected ? '#ffffff' : '#d1d5db',
                              backdropFilter: isSubSelected ? 'blur(6px)' : 'none',
                              '&:hover': {
                                color: '#ffffff',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(10px)',
                                '& svg': {
                                  filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))',
                                },
                              },
                              '& svg': {
                                transition: 'all 0.3s ease',
                              },
                              margin: '4px 8px',
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color: isSubSelected ? '#ffffff' : '#d1d5db',
                                minWidth: 0,
                                mr: 2,
                                justifyContent: 'center',
                                filter: isSubSelected ? 'drop-shadow(0 0 6px rgba(255,255,255,0.5))' : 'none',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText primary={subItem.text} />
                          </ListItem>
                        );
                      })}
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
