import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@mui/material/styles";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import { QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import theme from "./theme";
import queryClient from "./queryClient.ts";
import store from "./stores/index.ts";
import "react-toastify/dist/ReactToastify.css";
import { setupAxiosInterceptors } from "./axios.ts";

import GlobalMessageContainer from "./components/GlobalMessageContainer.tsx";
import AuthInitializer from "./features/auth/components/AuthInitializer.tsx";
import AuthLayout from "./features/auth/components/AuthLayout.tsx";
import LoginPage from "./features/auth/components/LoginPage.tsx";
import RegisterPage from "./features/auth/components/RegisterPage.tsx";
import ForgotPasswordPage from "./features/auth/components/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./features/auth/components/ResetPasswordPage.tsx";
import HomePage from "./features/home/HomePage.tsx";
import Products from "./features/products/Products.tsx";
import Product from "./features/product/Product.tsx";
import Cart from "./features/cart/Cart.tsx";
import Payment from "./features/payment/Payment.tsx";
import Orders from "./features/orders/Orders.tsx";
import Profile from "./features/profile/Profile.tsx";

import SellerLayout from "./layouts/seller/SellerLayout.tsx";
import ProvideStoreInform from "./features/provideStoreInform/ProvideStoreInform.tsx";
import CreateStore from "./features/store/create/CreateStore.tsx";
import StoreProductManagement from "./features/productManagement/StoreProductManagement.tsx";
import CreateProduct from "./features/product/create/CreateProduct.tsx";
import UpdateStore from "./features/store/update/UpdateStore.tsx";
import UpdateProduct from "./features/product/update/UpdateProduct.tsx";
import VerifyProduct from "./features/productVerifyManagement/seller/VerifyProduct.tsx";
import VerifyHistory from "./features/productVerifyManagement/seller/VerifyHistory.tsx";
import UpdateVerifyProduct from "./features/productVerifyManagement/seller/UpdateVerifyProduct.tsx";
import UnPaid from "./features/orderManagement/UnPaid.tsx";
import Pending from "./features/orderManagement/Pending.tsx";
import PrepareForShipping from "./features/orderManagement/PrepareForShipping.tsx";
import Shipping from "./features/orderManagement/Shipping.tsx";
import Completed from "./features/orderManagement/Completed.tsx";
import Refunded from "./features/orderManagement/Refunded.tsx";
import RequireRefund from "./features/orderManagement/RequireRefund.tsx";
import Cancelled from "./features/orderManagement/Cancelled.tsx";
import RequireCancelled from "./features/orderManagement/RequireCancelled.tsx";
import Rejected from "./features/orderManagement/Rejected.tsx";
import Analystic from "./features/analystic/Analystic.tsx";
import Revenue from "./features/revenue/Revenue.tsx";
import Review from "./features/review/Review.tsx";
import Customer from "./features/customer/Customer.tsx";
import AdminLayout from "./layouts/admin/AdminLayout.tsx";
import AdminStore from "./features/adminStore/AdminStore.tsx";
import AdminProduct from "./features/adminProduct/AdminProduct.tsx";
import Restocking from "./features/restocking/Restocking.tsx";
import AdminUsers from "./features/adminUser/AdminUser.tsx";
import AdminVerify from "./features/adminVerify/AdminVerify.tsx";
import AdminDashboard from "./features/adminDashboard/AdminDashboard.tsx";
import Store from "./features/store/index/Store.tsx";
import RequireCreateSeller from "./layouts/seller/RequireCreateSeller.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/store/:id",
    element: <Store />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/product/:id",
    element: <Product />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/account",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "reset-password/:token",
    element: <ResetPasswordPage />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  // for seller
  {
    path: "seller",
    element: <SellerLayout />,
    children: [
      {
        path: "",
        element: <UpdateStore />,
      },
      {
        path: "restocking",
        element: (
          <RequireCreateSeller>
            <Restocking />
          </RequireCreateSeller>
        ),
      },
      {
        path: "analytics",
        element: (
          <RequireCreateSeller>
            <Analystic />
          </RequireCreateSeller>
        ),
      },
      {
        path: "reviews",
        element: (
          <RequireCreateSeller>
            <Review />
          </RequireCreateSeller>
        ),
      },
      {
        path: "customers",
        element: (
          <RequireCreateSeller>
            <Customer />
          </RequireCreateSeller>
        ),
      },
      {
        path: "revenue",
        element: (
          <RequireCreateSeller>
            <Revenue />
          </RequireCreateSeller>
        ),
      },
      {
        path: "create",
        element: <CreateStore />,
      },
      {
        path: "products",
        element: (
          <RequireCreateSeller>
            <StoreProductManagement />
          </RequireCreateSeller>
        ),
      },
      {
        path: "products/verify",
        element: (
          <RequireCreateSeller>
            <VerifyProduct />
          </RequireCreateSeller>
        ),
      },
      {
        path: "products/verify/:id",
        element: (
          <RequireCreateSeller>
            <UpdateVerifyProduct />
          </RequireCreateSeller>
        ),
      },
      {
        path: "products/verify/history",
        element: (
          <RequireCreateSeller>
            <VerifyHistory />
          </RequireCreateSeller>
        ),
      },
      {
        path: "product/:id/verify",
        element: (
          <RequireCreateSeller>
            <VerifyProduct />
          </RequireCreateSeller>
        ),
      },
      {
        path: "product/create",
        element: (
          <RequireCreateSeller>
            <CreateProduct />
          </RequireCreateSeller>
        ),
      },
      {
        path: "product/:id",
        element: (
          <RequireCreateSeller>
            <UpdateProduct />
          </RequireCreateSeller>
        ),
      },
      {
        path: "orders/unpaid",
        element: (
          <RequireCreateSeller>
            <UnPaid />
          </RequireCreateSeller>
        ),
      },
      {
        path: "orders/pending",
        element: (
          <RequireCreateSeller>
            <Pending />
          </RequireCreateSeller>
        ),
      },
      {
        path: "orders/preparing-for-shipping",
        element: (
          <RequireCreateSeller>
            <PrepareForShipping />
          </RequireCreateSeller>
        ),
      },
      {
        path: "orders/shipping",
        element: (
          <RequireCreateSeller>
            <Shipping />
          </RequireCreateSeller>
        ),
      },
      {
        path: "orders/completed",
        element: (
          <RequireCreateSeller>
            <Completed />
          </RequireCreateSeller>
        ),
      },
      {
        path: "orders/cancelled",
        element: (
          <RequireCreateSeller>
            <Cancelled />
          </RequireCreateSeller>
        ),
      },
      {
        path: "orders/refunded",
        element: (
          <RequireCreateSeller>
            <Refunded />
          </RequireCreateSeller>
        ),
      },
      {
        path: "orders/require-refund",
        element: (
          <RequireCreateSeller>
            <RequireRefund />
          </RequireCreateSeller>
        ),
      },
      {
        path: "orders/require-cancelled",
        element: (
          <RequireCreateSeller>
            <RequireCancelled />
          </RequireCreateSeller>
        ),
      },
      {
        path: "orders/rejected",
        element: (
          <RequireCreateSeller>
            <Rejected />
          </RequireCreateSeller>
        ),
      },
    ],
  },
  {
    path: "provide-store-inform",
    element: <ProvideStoreInform />,
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "stores",
        element: <AdminStore />,
      },
      {
        path: "products",
        element: <AdminProduct />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "verify",
        element: <AdminVerify />,
      },
    ],
  },
]);

setupAxiosInterceptors(store);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <GlobalMessageContainer>
                <ToastContainer position="bottom-right" autoClose={4000} />
                <AuthInitializer>
                  <RouterProvider router={router} />
                </AuthInitializer>
              </GlobalMessageContainer>
            </GoogleOAuthProvider>
          </QueryClientProvider>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
);
