import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../stores/index.ts";
import { AuthState } from "../stores/authSlice.ts";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  authorizedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ authorizedRoles }) => {
  const { isAuthenticated, user } = useSelector<RootState, AuthState>(
    (state) => state.auth,
  );

  const roles = user?.roles || [];

  if (!isAuthenticated) {
    return <Navigate to="/account/login" />;
  }

  if (
    authorizedRoles &&
    !roles.some((role) => authorizedRoles.includes(role))
  ) {
    toast.error("You are not authorized to access this page or resource.");
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
