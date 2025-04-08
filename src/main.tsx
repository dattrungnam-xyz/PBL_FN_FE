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

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
        path: "create",
        element: <CreateStore />,
      },
      {
        path: "products",
        element: <StoreProductManagement />,
      },
      {
        path: "products/verify",
        element: <VerifyProduct />,
      },
      {
        path: "products/verify/:id",
        element: <UpdateVerifyProduct />,
      },
      {
        path: "products/verify/history",
        element: <VerifyHistory />,
      },
      {
        path: "product/:id/verify",
        element: <VerifyProduct />,
      },
      {
        path: "product/create",
        element: <CreateProduct />,
      },
      {
        path: "product/:id",
        element: <UpdateProduct />,
      },
      {
        path: "orders/unpaid",
        element: <UnPaid />,
      },
      {
        path: "orders/pending",
        element: <Pending />,
      },
      {
        path: "orders/preparing-for-shipping",
        element: <PrepareForShipping />,
      },
      {
        path: "orders/shipping",
        element: <Shipping />,
      },
      {
        path: "orders/completed",
        element: <Completed />,
      },
      {
        path: "orders/cancelled",
        element: <Cancelled />,
      },
      {
        path: "orders/refunded",
        element: <Refunded />,
      },
      {
        path: "orders/require-refund",
        element: <RequireRefund />,
      },
      {
        path: "orders/require-cancelled",
        element: <RequireCancelled />,
      },
    ],
  },
  {
    path: "provide-store-inform",
    element: <ProvideStoreInform />,
  },
  // {
  //   path: "profile",
  //   element: <ProtectedRoute />,
  //   children: [
  //     {
  //       index: true,
  //       element: <UserProfilePage />,
  //     },
  //   ],
  // },

  // {
  //   path: "admin",
  //   element: (
  //     <ProtectedRouteComponent
  //       authorizedRoles={[RoleEnum.Admin, RoleEnum.Doctor]}
  //     >
  //       <Admin />
  //     </ProtectedRouteComponent>
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       element: <Dashboard />,
  //     },
  //   ],
  // },
  // {
  //   path: "admin/account",
  //   element: (
  //     <ProtectedRouteComponent authorizedRoles={[RoleEnum.Admin]}>
  //       <Admin />
  //     </ProtectedRouteComponent>
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       element: <AccountIndexPage />,
  //     },
  //   ],
  // },
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
                <ToastContainer position="top-right" autoClose={4000} />
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
