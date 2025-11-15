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
  Tooltip,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Zoom from '@mui/material/Zoom';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { getNotificationCounts } from '../services/allApi';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [openItems, setOpenItems] = useState({});
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

  const handleToggle = key => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleItemClick = (item) => {
    if (item.subItems) {
      // If sidebar is collapsed, expand it first
      if (!isOpen && onToggle) {
        onToggle();
        // Wait for sidebar to expand, then open the submenu
        setTimeout(() => {
          handleToggle(item.key);
        }, 300);
      } else {
        handleToggle(item.key);
      }
    }
  };

  const menuItems = [
    {
      key: 'Dashboard',
      text: 'Dashboard',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>,
      path: '/',
    },
    {
      key: 'Category',
      text: 'Category',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h6v6h-6z" /><path d="M14 4h6v6h-6z" /><path d="M4 14h6v6h-6z" /><path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>,
      subItems: [
        { text: 'Category', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6h-6z" /><path d="M4 14h6v6h-6z" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>, path: '/category-list' },
        { text: 'Sub Category', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h6v6h-6zm10 0h6v6h-6zm-10 10h6v6h-6zm10 3h6m-3 -3v6" /></svg>, path: '/view-subcategory' },
      ],
    },
    {
      key: 'Orders',
      text: 'Orders',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>,
      path: '/order-list',
    },
    {
      key: 'Customers',
      text: 'Customers',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>,
      subItems: [
        { text: 'Customers List', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13" /></svg>, path: '/customers-list' },
        { text: 'Product Reviews', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="6" height="6" rx="1" /><path d="m3 17 2 2 4-4" /><path d="M13 6h8M13 12h8M13 18h8" /></svg>, path: '/reviews-list' },
        { text: 'Product Reportings', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" /><path d="M18 14v4h4" /><path d="M18 11v-4a2 2 0 0 0 -2 -2h-2" /><circle cx="18" cy="18" r="4" /></svg>, path: '/reports-list' },
      ],
    },
    {
      key: 'Coupons',
      text: 'Coupons',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 15l6 -6" /><circle cx="9.5" cy="9.5" r=".5" fill="currentColor" /><circle cx="14.5" cy="14.5" r=".5" fill="currentColor" /><path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7a2.2 2.2 0 0 0 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .613.249 1.168.64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" /></svg>,
      path: '/view-coupons',
    },
    {
      key: 'Notifications',
      text: 'Notifications',
      icon: (
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M13.916 2.314A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673 9 9 0 0 1-.585-.665" /><circle cx="18" cy="8" r="3" /></svg>
        </Badge>
      ),
      path: '/view-notifications',
    },
    {
      key: 'Stores',
      text: 'Stores',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" /></svg>,
      path: '/view-stores',
    },
    {
      key: 'Sub Admins',
      text: 'Sub Admins',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="M6.376 18.91a6 6 0 0 1 11.249.003" /><circle cx="12" cy="11" r="4" /></svg>,
      path: '/view-subadmin',
    },
    {
      key: 'Sellers',
      text: 'Sellers',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 10a4 4 0 0 1-8 0" /><path d="M3.103 6.034h17.794" /><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" /></svg>,
      path: '/view-vendors',
    },
    {
      key: 'Vendor Commission',
      text: 'Vendor Commission',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>,
      path: '/vendor-commission',
    },
    {
      key: 'Story',
      text: 'Story',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
      path: '/list-story',
    },
    {
      key: 'Vendors Product',
      text: 'Vendors Product',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" /><path d="M12 22V12" /><polyline points="3.29 7 12 12 20.71 7" /><path d="m7.5 4.27 9 5.15" /></svg>,
      subItems: [
        { text: 'Grocery', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M136,120v56a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm36.84-.8-5.6,56A8,8,0,0,0,174.4,184a7.32,7.32,0,0,0,.81,0,8,8,0,0,0,7.95-7.2l5.6-56a8,8,0,0,0-15.92-1.6Zm-89.68,0a8,8,0,0,0-15.92,1.6l5.6,56a8,8,0,0,0,8,7.2,7.32,7.32,0,0,0,.81,0,8,8,0,0,0,7.16-8.76ZM239.93,89.06,224.86,202.12A16.06,16.06,0,0,1,209,216H47a16.06,16.06,0,0,1-15.86-13.88L16.07,89.06A8,8,0,0,1,24,80H68.37L122,18.73a8,8,0,0,1,12,0L187.63,80H232a8,8,0,0,1,7.93,9.06ZM89.63,80h76.74L128,36.15ZM222.86,96H33.14L47,200H209Z"></path></svg>, path: '/view-groceryproducts' },
        { text: 'Fashion', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22l4 -4l-2.5 -11l.993 -2.649a1 1 0 0 0 -.936 -1.351h-3.114a1 1 0 0 0 -.936 1.351l.993 2.649l-2.5 11l4 4z" /><path d="M10.5 7h3l5 5.5" /></svg>, path: '/product-list' },
        { text: 'Food', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v17m-3 -17v3a3 3 0 1 0 6 0v-3" /><path d="M17 8m-3 0a3 4 0 1 0 6 0a3 4 0 1 0 -6 0" /><path d="M17 12v9" /></svg>, path: '/view-foodproducts' },
      ],
    },
    {
      key: 'Big Buy Orders',
      text: 'Big Buy Orders',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21v-6a2 2 0 0 1 2 -2h2c.641 0 1.212 .302 1.578 .771" /><path d="M20.136 11.136l-8.136 -8.136l-9 9h2v7a2 2 0 0 0 2 2h6.344" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg>,
      path: '/view-bigbuyorders',
    },
    {
      key: 'Delivery',
      text: 'Delivery',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /><path d="M3 9l4 0" /></svg>,
      subItems: [
        { text: 'Delivery Boys', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, path: '/view-deliveryboyslist' },
        { text: 'Delivery Charges', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>, path: '/delivery-charges' },
      ],
    },
    {
      key: 'Carousel',
      text: 'Carousel',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 5m0 1a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1z" /><path d="M22 17h-1a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h1" /><path d="M2 17h1a1 1 0 0 0 1 -1v-8a1 1 0 0 0 -1 -1h-1" /></svg>,
      path: '/view-carousel',
    },
  ];

  const visibleItems = role === 'admin'
    ? menuItems
    : menuItems.filter(item => permissions.includes(item.key));

  const sidebarWidth = isOpen ? 260 : 80;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          background: '#f8fafc',
          color: '#334155',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          border: 'none',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
          mt: '70px',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: 'calc(100vh - 70px)',
          zIndex: (theme) => theme.zIndex.drawer,
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          padding: isOpen ? '24px 20px' : '24px 12px',
          textAlign: 'center',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: isOpen ? 60 : 50,
            height: isOpen ? 60 : 50,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <img
            src="https://i.postimg.cc/qqhWvvN2/6f05cef92da77e8f946c303920fa8a7e.png"
            alt="Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.2))',
              transition: 'all 0.4s ease',
            }}
          />
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor: '#e2e8f0',
          margin: '0 16px 16px 16px',
        }}
      />

      {/* Menu List */}
      <Box
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden',
          flexGrow: 1,
          px: isOpen ? 2 : 1.5,
          pb: 3,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f5f9',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '3px',
            '&:hover': {
              background: '#94a3b8',
            },
          },
        }}
      >
        <List sx={{ padding: 0 }}>
          {visibleItems.map(item => {
            const isOpenItem = openItems[item.key] || false;
            const isSelected =
              location.pathname === item.path ||
              (item.subItems && item.subItems.some(sub => location.pathname === sub.path));

            return (
              <React.Fragment key={item.key}>
                <Tooltip
                  title={!isOpen ? item.text : ''}
                  placement="right"
                  arrow
                  TransitionComponent={Zoom}
                  // Disable tooltip when sidebar is open OR when item has subItems
                  disableHoverListener={isOpen || item.subItems}
                >
                  <ListItem
                    button
                    onClick={() => handleItemClick(item)}
                    component={item.subItems ? 'div' : Link}
                    to={item.subItems ? undefined : item.path}
                    selected={isSelected}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: '12px',
                      backgroundColor: isSelected
                        ? '#e0f2fe'
                        : 'transparent',
                      color: isSelected ? '#0284c7' : '#64748b',
                      border: isSelected
                        ? '1px solid #bae6fd'
                        : '1px solid transparent',
                      marginBottom: '8px',
                      minHeight: '52px',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '4px',
                        height: '100%',
                        background: 'linear-gradient(180deg, #0ea5e9 0%, #06b6d4 100%)',
                        opacity: isSelected ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover': {
                        color: '#0284c7',
                        backgroundColor: isSelected
                          ? '#e0f2fe'
                          : '#f0f9ff',
                        border: '1px solid #bae6fd',
                        transform: 'translateX(4px)',
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)',
                        '& svg': {
                          filter: 'drop-shadow(0 0 6px rgba(14, 165, 233, 0.4))',
                          transform: 'scale(1.1) rotate(5deg)',
                        },
                      },
                      '& svg': {
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      },
                      padding: isOpen ? '12px 16px' : '12px',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: 'inherit',
                        minWidth: 0,
                        mr: isOpen ? 2.5 : 0,
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        filter: isSelected
                          ? 'drop-shadow(0 0 6px rgba(14, 165, 233, 0.3))'
                          : 'none',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {isOpen && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '14px',
                          fontWeight: isSelected ? 600 : 500,
                          letterSpacing: '0.3px',
                        }}
                        sx={{
                          opacity: isOpen ? 1 : 0,
                          transition: 'opacity 0.3s ease',
                        }}
                      />
                    )}

                    {isOpen && item.subItems && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'transform 0.3s ease',
                          transform: isOpenItem ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      >
                        <ExpandMore fontSize="small" />
                      </Box>
                    )}
                  </ListItem>
                </Tooltip>

                {/* Submenu */}
                {item.subItems && isOpen && (
                  <Collapse in={isOpenItem} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ mt: 0.5, mb: 1 }}>
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
                              paddingLeft: '48px',
                              borderRadius: '10px',
                              backgroundColor: isSubSelected
                                ? '#dbeafe'
                                : 'transparent',
                              color: isSubSelected ? '#0284c7' : '#94a3b8',
                              marginBottom: '6px',
                              minHeight: '44px',
                              position: 'relative',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: '24px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: isSubSelected ? '16px' : '12px',
                                height: '2px',
                                background: isSubSelected
                                  ? 'linear-gradient(90deg, #0ea5e9 0%, #06b6d4 100%)'
                                  : '#cbd5e1',
                                borderRadius: '1px',
                                transition: 'all 0.3s ease',
                              },
                              '&:hover': {
                                color: '#0284c7',
                                backgroundColor: '#f0f9ff',
                                transform: 'translateX(4px)',
                                '&::before': {
                                  width: '16px',
                                  background: 'linear-gradient(90deg, #0ea5e9 0%, #06b6d4 100%)',
                                },
                                '& svg': {
                                  filter: 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.3))',
                                  transform: 'scale(1.1)',
                                },
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color: 'inherit',
                                minWidth: 0,
                                mr: 2,
                                display: 'flex',
                                alignItems: 'center',
                                filter: isSubSelected
                                  ? 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.25))'
                                  : 'none',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={subItem.text}
                              primaryTypographyProps={{
                                fontSize: '13px',
                                fontWeight: isSubSelected ? 600 : 500,
                                letterSpacing: '0.2px',
                              }}
                            />
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