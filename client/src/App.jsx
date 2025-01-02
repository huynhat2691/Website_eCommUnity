import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lazy, Suspense, useEffect, useState } from "react";
import Store from "./redux/store.js";
import { loadUser, loadSeller } from "./redux/actions/user.js";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import SellerProtectedRoute from "./routes/SellerProtectedRoute.jsx";
import AdminProtectedRoute from "./routes/AdminProtectedRoute.jsx";
import { getAllProducts } from "./redux/actions/product.js";
import { getAllEvents } from "./redux/actions/event.js";
import axios from "axios";
import { server } from "./server.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProfileContent from "./components/Profile/ProfileContent.jsx";
import UserAllOrders from "./components/Profile/UserAllOrders.jsx";
import UserPreviewAndUpdateProfile from "./components/Profile/UserPreviewAndUpdateProfile";
import UserAllRefundOrders from "./components/Profile/UserAllRefundOrders";
import UserTrackOrders from "./components/Profile/UserTrackOrders";
import UserChangePassword from "./components/Profile/UserChangePassword";
import UserAddress from "./components/Profile/UserAddress";
import Loader from "./components/Layout/Loader";
import ScrollToTop from "./components/ScrollToTop";
import ChatPopup from "./components/Chat/ChatPopup";
import { useSelector } from "react-redux";

const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ActivationPage = lazy(() => import("./pages/ActivationPage"));
const BestSellingPage = lazy(() =>
  import("./components/Route/BestDeals/BestSellingPage")
);
const EventsPage = lazy(() => import("./components/Route/Events/EventsPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ShopCreatePage = lazy(() => import("./pages/ShopCreatePage"));
const SellerActivationPage = lazy(() => import("./pages/SellerActivationPage"));
const ShopLoginPage = lazy(() => import("./pages/ShopLoginPage.jsx"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage"));
const UserInbox = lazy(() => import("./components/Profile/UserInbox.jsx"));
const CouponsPage = lazy(() => import("./pages/CouponsPage"));
const ClearancePage = lazy(() => import("./pages/ClearancePage"));
const SecondhandPage = lazy(() => import("./pages/SecondhandPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const SearchResults = lazy(() => import("./pages/SearchResults"));

const ShopHomePage = lazy(() => import("./pages/Shop/ShopHomePage"));
const ShopDashboardPage = lazy(() => import("./pages/Shop/ShopDashboardPage"));
const ShopAddProduct = lazy(() => import("./pages/Shop/ShopAddProduct"));
const ShopAllProducts = lazy(() => import("./pages/Shop/ShopAllProducts"));
const ShopAddEvent = lazy(() => import("./pages/Shop/ShopAddEvent"));
const ShopAllEvents = lazy(() => import("./pages/Shop/ShopAllEvents"));
const ShopAllCoupons = lazy(() => import("./pages/Shop/ShopAllCoupons"));
const ShopPreviewPage = lazy(() => import("./pages/Shop/ShopPreviewPage"));
const ShopAllOrders = lazy(() => import("./pages/Shop/ShopAllOrders"));
const ShopOrderDetails = lazy(() => import("./pages/Shop/ShopOrderDetails"));
const ShopAllRefunds = lazy(() => import("./pages/Shop/ShopAllRefunds"));
const ShopSettingsPage = lazy(() => import("./pages/Shop/ShopSettingsPage"));
const ShopWithDrawMoneyPage = lazy(() =>
  import("./pages/Shop/ShopWithDrawMoneyPage")
);
const ShopInboxPage = lazy(() => import("./pages/Shop/ShopInboxPage"));
const ShopRatingsPage = lazy(() => import("./pages/Shop/ShopRatingsPage"));
const ShopAllCancelledOrders = lazy(() =>
  import("./pages/Shop/ShopAllCancelledOrders")
);

const AdminDashboardPage = lazy(() =>
  import("./pages/Admin/AdminDashboardPage")
);
const AdminDashboardUsersPage = lazy(() =>
  import("./pages/Admin/AdminDashboardUsersPage")
);
const AdminDashboardSellersPage = lazy(() =>
  import("./pages/Admin/AdminDashboardSellersPage")
);
const AdminDashboardOrdersPage = lazy(() =>
  import("./pages/Admin/AdminDashboardOrdersPage")
);
const AdminDashboardProductsPage = lazy(() =>
  import("./pages/Admin/AdminDashboardProductsPage")
);
const AdminDashboardEventsPage = lazy(() =>
  import("./pages/Admin/AdminDashboardEventsPage")
);
const AdminDashboardWithdrawRequestPage = lazy(() =>
  import("./pages/Admin/AdminDashboardWithdrawRequestPage")
);
const AdminDashboardBannersPage = lazy(() =>
  import("./pages/Admin/AdminDashboardBannersPage")
);
const AdminDashboardCouponsPage = lazy(() =>
  import("./pages/Admin/AdminDashboardCouponsPage")
);
const AdminDashboardReportsPage = lazy(() =>
  import("./pages/Admin/AdminDashboardReportsPage")
);
const AdminShopHomePage = lazy(() =>
  import("./pages/Admin/AdminShopHomePage")
);
const AdminDashboardAddProductsPage = lazy(() =>
  import("./pages/Admin/AdminDashboardAddProductsPage")
);
const AdminDashboardAdminProductsPage = lazy(() =>
  import("./pages/Admin/AdminDashboardAdminProductsPage")
);
const AdminDashboardAdminOrdersPage = lazy(() =>
  import("./pages/Admin/AdminDashboardAdminOrdersPage")
);
const AdminDashboardOrderDetailsPage = lazy(() =>
  import("./pages/Admin/AdminDashboardOrderDetailsPage")
);
const AdminDashboardAddEventsPage = lazy(() =>
  import("./pages/Admin/AdminDashboardAddEventsPage")
);
const AdminDashboardAdminEventsPage = lazy(() =>
  import("./pages/Admin/AdminDashboardAdminEventsPage")
);
const AdminShopSettingsPage = lazy(() =>
  import("./pages/Admin/AdminShopSettingsPage")
);
const AdminDashboardAllOrderDetailsPage = lazy(() =>
  import("./pages/Admin/AdminDashboardAllOrderDetailsPage")
);
const AdminDashboardReportReviewsPage = lazy(() =>
  import("./pages/Admin/AdminDashboardReportReviewsPage")
);

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [showChatPopup, setShowChatPopup] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  async function getStripeApiKey() {
    const { data } = await axios.get(`${server}/payment/stripe-api-key`);
    setStripeApiKey(data.stripeApiKey);
  }

  const isSellerOrAdminRoute = (pathname) => {
    return (
      pathname.startsWith("/shop/") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/settings") ||
      pathname.startsWith("/admin/")
    );
  };

  useEffect(() => {
    setShowChatPopup(!isSellerOrAdminRoute(location.pathname));
  }, [location]);

  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    getStripeApiKey();
  }, []);

  return (
    <div>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Routes>
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Elements>
        )}

        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/activation/:activation_token"
            element={<ActivationPage />}
          />
          <Route
            path="/seller/activation/:activation_token"
            element={<SellerActivationPage />}
          />
          <Route path="/products" element={<ProductsPage />} />
          {/* <Route path="/product/:id" element={<ProductDetailsPage />} /> */}
          <Route
            path="/product/:id"
            element={
              <Suspense fallback={<Loader />}>
                <ProductDetailsPage />
              </Suspense>
            }
          />
          <Route path="/events" element={<EventsPage />} />
          {/* Nav bar */}
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/coupons" element={<CouponsPage />} />
          <Route path="/clearance" element={<ClearancePage />} />
          <Route path="/secondhand" element={<SecondhandPage />} />

          <Route path="/faq" element={<FAQPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/order/success" element={<OrderSuccessPage />} />
          <Route
            path="/user/order/:id"
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/track/order/:id"
            element={
              <ProtectedRoute>
                <TrackOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileContent />} />
            <Route path="account" element={<UserPreviewAndUpdateProfile />} />
            <Route path="orders" element={<UserAllOrders />} />
            <Route path="refunds" element={<UserAllRefundOrders />} />
            <Route path="inbox" element={<UserInbox />} />
            <Route path="track-orders" element={<UserTrackOrders />} />
            <Route path="change-password" element={<UserChangePassword />} />
            <Route path="addresses" element={<UserAddress />} />
          </Route>
          {/* shop routes */}
          <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
          <Route path="/shop-create" element={<ShopCreatePage />} />
          <Route path="/shop-login" element={<ShopLoginPage />} />
          <Route
            path="/shop/:id"
            element={
              <SellerProtectedRoute>
                <ShopHomePage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <SellerProtectedRoute>
                <ShopSettingsPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <SellerProtectedRoute>
                <ShopDashboardPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/add-product"
            element={
              <SellerProtectedRoute>
                <ShopAddProduct />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/products"
            element={
              <SellerProtectedRoute>
                <ShopAllProducts />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/orders"
            element={
              <SellerProtectedRoute>
                <ShopAllOrders />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/order/:id"
            element={
              <SellerProtectedRoute>
                <ShopOrderDetails />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/refunds"
            element={
              <SellerProtectedRoute>
                <ShopAllRefunds />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/cancelled-orders"
            element={
              <SellerProtectedRoute>
                <ShopAllCancelledOrders />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/add-event"
            element={
              <SellerProtectedRoute>
                <ShopAddEvent />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/events"
            element={
              <SellerProtectedRoute>
                <ShopAllEvents />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/withdraw-money"
            element={
              <SellerProtectedRoute>
                <ShopWithDrawMoneyPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/coupons"
            element={
              <SellerProtectedRoute>
                <ShopAllCoupons />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/messages"
            element={
              <SellerProtectedRoute>
                <ShopInboxPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ratings"
            element={
              <SellerProtectedRoute>
                <ShopRatingsPage />
              </SellerProtectedRoute>
            }
          />
          {/* admin shop routes */}
          <Route
            path="/admin/shop/66e47c9b81cc1412b8c9edca"
            element={<AdminShopHomePage />}
          />
          <Route
            path="/admin/shop-settings"
            element={<AdminShopSettingsPage />}
          />
          {/* admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminDashboardUsersPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/sellers"
            element={
              <AdminProtectedRoute>
                <AdminDashboardSellersPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminProtectedRoute>
                <AdminDashboardOrdersPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/order/:id"
            element={
              <AdminProtectedRoute>
                <AdminDashboardAllOrderDetailsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/admin-orders"
            element={
              <AdminProtectedRoute>
                <AdminDashboardAdminOrdersPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/admin-order/:id"
            element={
              <SellerProtectedRoute>
                <AdminDashboardOrderDetailsPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/admin/add-banners"
            element={
              <AdminProtectedRoute>
                <AdminDashboardBannersPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/add-coupons-and-preview"
            element={
              <AdminProtectedRoute>
                <AdminDashboardCouponsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminProtectedRoute>
                <AdminDashboardProductsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/admin-products"
            element={
              <AdminProtectedRoute>
                <AdminDashboardAdminProductsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/add-product"
            element={
              <AdminProtectedRoute>
                <AdminDashboardAddProductsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <AdminProtectedRoute>
                <AdminDashboardEventsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/admin-events"
            element={
              <AdminProtectedRoute>
                <AdminDashboardAdminEventsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/add-event"
            element={
              <AdminProtectedRoute>
                <AdminDashboardAddEventsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/withdraw-request"
            element={
              <AdminProtectedRoute>
                <AdminDashboardWithdrawRequestPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminProtectedRoute>
                <AdminDashboardReportsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/reports-review"
            element={
              <AdminProtectedRoute>
                <AdminDashboardReportReviewsPage />
              </AdminProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Suspense>
      {isAuthenticated && showChatPopup && <ChatPopup />}
    </div>
  );
}

export default App;
