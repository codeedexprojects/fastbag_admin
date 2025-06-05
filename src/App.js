import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Siedebar';  // Make sure this path is correct
import Dashboard from './pages/Dashboard';
import OrderList from './pages/Orders/Orders';
import OrderDetails from './pages/Orders/OrderDetails';
import CategoryPage from './pages/Category/CategoryList';
import AddCategory from './pages/Category/AddCategory';
import CustomersList from './pages/Customers/Customers';
import CustomerDetails from './pages/Customers/CustomerDetails';
import LoginPage from './pages/AdminLogin';
import AddProduct from './pages/Products/AddProduct';
import ProductList from './pages/Products/ProductList';
import ViewVendors from './pages/Vendors/ViewVendors';
import VendorDetails from './pages/Vendors/SingleView';
import AddVendor from './pages/Vendors/AddVendor';
import ViewStores from './pages/Stores/ViewStores';
import AddStore from './pages/Stores/AddStore';
import AddSubCategory from './pages/SubCategory/AddSubcategory';
import SubCategoryPage from './pages/SubCategory/SubCategoryList';
import ColorManagement from './pages/Colours/ColursList';
import CouponList from './pages/Coupons/ViewCoupons';
import AddEditCoupon from './pages/Coupons/AddCoupon';
import ReviewViewer from './pages/Customers/UserReviews';
import ReportPage from './pages/Customers/UserReports';
import AddSubAdmin from './pages/SubAdmin/AddSubAdmin';
import ViewSubAdmin from './pages/SubAdmin/ViewSubadmins';
import AddFoodProduct from './pages/Products/AddFoodProduct';
import AddGroceryProduct from './pages/Products/AddGroceryProduct';
import GroceryProductList from './pages/Products/GroceryProductList';
import FoodProductList from './pages/Products/FoodProductList';
import NotificationPage from './pages/Notifications/ViewNotifications';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BigBuyOrders from './pages/BigBuyOrders/BigBuyOrders';
import DeliveryBoyList from './pages/Delivery/DeliveryBoyList';
import DeliveryBoyDetails from './pages/Delivery/DeliveryBoyDetails';

const App = () => {
  const location = useLocation(); // Get current route

  const isLoginPage = location.pathname === '/admin-login';

  // Simple test function to show a toast notification
  const handleTestToast = () => {
    toast.success('Toast is working!');
  };

  return (
    <div style={appStyle}>
      {/* Conditionally render Sidebar and Header */}
      {!isLoginPage && <Sidebar />}
      <div style={contentStyle}>
        {!isLoginPage && <Header />}
        <div style={mainStyle}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/order-list" element={<OrderList />} />
            <Route path="/order-details/:orderId" element={<OrderDetails />} />
            <Route path="/category-list" element={<CategoryPage />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/customers-list" element={<CustomersList />} />
            <Route path="/customer-details/:id" element={<CustomerDetails />} />
            <Route path="/admin-login" element={<LoginPage />} />
            <Route path="/view-vendors" element={<ViewVendors />} />
            <Route path="/vendors/:vendorId" element={<VendorDetails />} />
            <Route path="/add-vendor" element={<AddVendor />} />
            <Route path="/view-stores" element={<ViewStores />} />
            <Route path="/add-store" element={<AddStore />} />
            <Route path="/add-subcategory" element={<AddSubCategory />} />
            <Route path="/view-subcategory" element={<SubCategoryPage />} />
            <Route path="/colours" element={<ColorManagement />} />
            <Route path="/view-coupons" element={<CouponList />} />
            <Route path="/add-coupons" element={<AddEditCoupon />} />
            <Route path="/reviews-list" element={<ReviewViewer />} />
            <Route path="/reports-list" element={<ReportPage />} />
            <Route path="/add-subadmin" element={<AddSubAdmin />} />
            <Route path="/view-subadmin" element={<ViewSubAdmin />} />
            <Route path="/add-foodproduct" element={<AddFoodProduct />} />
            <Route path="/add-groceryproduct" element={<AddGroceryProduct />} />
            <Route path="/view-groceryproducts" element={<GroceryProductList />} />
            <Route path="/view-foodproducts" element={<FoodProductList />} />
            <Route path="/view-notifications" element={<NotificationPage />} />
            <Route path="/view-bigbuyorders" element={<BigBuyOrders />} />
            <Route path="/view-deliveryboyslist" element={<DeliveryBoyList />} />
            <Route path="/view-deliveryboydetails/:id" element={<DeliveryBoyDetails />} />
          </Routes>

         

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </div>
    </div>
  );
};

const appStyle = {
  display: 'flex',
  height: '100vh',
};

const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
};

const mainStyle = {
  padding: '20px',
  flexGrow: 1,
  overflowY: 'auto',
  backgroundColor: '#f5f5f5',
};

export default App;
