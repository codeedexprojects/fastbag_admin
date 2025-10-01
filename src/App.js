import React, { useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

import Header from "./components/Header";
import Sidebar from "./components/Siedebar";
import Dashboard from "./pages/Dashboard";
import OrderList from "./pages/Orders/Orders";
import OrderDetails from "./pages/Orders/OrderDetails";
import CategoryPage from "./pages/Category/CategoryList";
import AddCategory from "./pages/Category/AddCategory";
import CustomersList from "./pages/Customers/Customers";
import CustomerDetails from "./pages/Customers/CustomerDetails";
import LoginPage from "./pages/AdminLogin";
import AddProduct from "./pages/Products/AddProduct";
import ProductList from "./pages/Products/ProductList";
import ViewVendors from "./pages/Vendors/ViewVendors";
import VendorDetails from "./pages/Vendors/SingleView";
import AddVendor from "./pages/Vendors/AddVendor";
import ViewStores from "./pages/Stores/ViewStores";
import AddStore from "./pages/Stores/AddStore";
import AddSubCategory from "./pages/SubCategory/AddSubcategory";
import SubCategoryPage from "./pages/SubCategory/SubCategoryList";
import ColorManagement from "./pages/Colours/ColursList";
import CouponList from "./pages/Coupons/ViewCoupons";
import AddEditCoupon from "./pages/Coupons/AddCoupon";
import ReviewViewer from "./pages/Customers/UserReviews";
import ReportPage from "./pages/Customers/UserReports";
import AddSubAdmin from "./pages/SubAdmin/AddSubAdmin";
import ViewSubAdmin from "./pages/SubAdmin/ViewSubadmins";
import AddFoodProduct from "./pages/Products/AddFoodProduct";
import AddGroceryProduct from "./pages/Products/AddGroceryProduct";
import GroceryProductList from "./pages/Products/GroceryProductList";
import FoodProductList from "./pages/Products/FoodProductList";
import NotificationPage from "./pages/Notifications/ViewNotifications";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BigBuyOrders from "./pages/BigBuyOrders/BigBuyOrders";
import DeliveryBoyList from "./pages/Delivery/DeliveryBoyList";
import DeliveryBoyDetails from "./pages/Delivery/DeliveryBoyDetails";
import CarouselList from "./pages/Carousel/ListCarousel";
import AddCarousel from "./pages/Carousel/AddCarousel";
import ProductDetails from "./pages/Products/ProductDetails";
import FoodProductDetails from "./pages/Products/FoodProductDetails";
import GroceryProductDetailsPage from "./pages/Products/GroceryPrdouctdetails";
import GoogleMapsWrapper from "./components/GoogleMapsWrapper";
import VendorCommissionPage from "./pages/VendorCommission/listVendorCommission";
import AddDeliveryBoy from "./pages/Delivery/addDeliveryBoy";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("access_token");
  const isLoginPage = location.pathname === "/admin-login";

  useEffect(() => {
    if (!isLoggedIn && !isLoginPage) {
      navigate("/admin-login");
    } else if (isLoggedIn && isLoginPage) {
      navigate("/");
    }
  }, [isLoggedIn, isLoginPage, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={appStyle}>
        {!isLoginPage && <Sidebar />}
        <div style={contentStyle}>
          {!isLoginPage && <Header />}
          <div style={mainStyle}>
            <Routes>
              {/* Auth Routes */}
              <Route path="/admin-login" element={<LoginPage />} />

              {/* Protected Routes */}
              {isLoggedIn && (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/product-list" element={<ProductList />} />
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/view-product/:productId" element={<ProductDetails />} />
                  <Route path="/order-list" element={<OrderList />} />
                  <Route path="/order-details/:orderId" element={<OrderDetails />} />
                  <Route path="/category-list" element={<CategoryPage />} />
                  <Route path="/add-category" element={<AddCategory />} />
                  <Route path="/customers-list" element={<CustomersList />} />
                  <Route path="/customer-details/:id" element={<CustomerDetails />} />
                  <Route path="/view-vendors" element={<ViewVendors />} />
                  <Route path="/vendors/:vendorId" element={<VendorDetails />} />
                  <Route path="/add-vendor" element={<GoogleMapsWrapper><AddVendor /></GoogleMapsWrapper>} />
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
                  <Route path="/view-groceryproduct/:id" element={<GroceryProductDetailsPage />} />
                  <Route path="/view-foodproducts" element={<FoodProductList />} />
                  <Route path="/view-foodproduct/:id" element={<FoodProductDetails />} />
                  <Route path="/view-notifications" element={<NotificationPage />} />
                  <Route path="/view-bigbuyorders" element={<BigBuyOrders />} />
                  <Route path="/view-deliveryboyslist" element={<DeliveryBoyList />} />
                  <Route path="/view-deliveryboydetails/:id" element={<GoogleMapsWrapper><DeliveryBoyDetails /></GoogleMapsWrapper>} />
                  <Route path="/view-carousel" element={<CarouselList />} />
                  <Route path="/add-carousel" element={<AddCarousel />} />
                  <Route path="/vendor-commission" element={<VendorCommissionPage />} />
                  <Route path="/add-deliveryboy" element={<AddDeliveryBoy />} />
                </>
              )}

              <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/admin-login"} />} />
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
    </ThemeProvider>
  );
};

const appStyle = {
  display: "flex",
  height: "100vh",
};

const contentStyle = {
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
};

const mainStyle = {
  padding: "20px",
  flexGrow: 1,
  overflowY: "auto",
  backgroundColor: "#f5f5f5",
};

export default App;
