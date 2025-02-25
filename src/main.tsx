import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
// Use this workaround to make default MUI styles is overridden by the same specificity styles
import StyledEngineProvider from "@mui/material/StyledEngineProvider";

import theme from "./theme";
import store from "./stores/index.ts";
import queryClient from "./queryClient.ts";
import { setupAxiosInterceptors } from "./axios.ts";

import "./index.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";

import ProtectedRoute from "./components/ProtectedRoute.tsx";

import AuthLayout from "./layout/auth/AuthLayout.tsx";

import GlobalMessageContainer from "./components/GlobalMessageContainer.tsx";

import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  HomePage,
} from "./pages/index.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
                <ToastContainer />
                <App>
                  <RouterProvider router={router} />
                </App>
              </GlobalMessageContainer>
            </GoogleOAuthProvider>
          </QueryClientProvider>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);
