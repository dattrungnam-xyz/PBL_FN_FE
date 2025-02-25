import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../stores/index.ts";
import { AuthState } from "../stores/authSlice.ts";
import { globalMessageActions } from "../stores/globalMessageSlice.ts";

interface ProtectedRouteComponentProps {
  authorizedRoles?: string[];
  children: React.ReactNode;
}

const ProtectedRouteComponent: React.FC<ProtectedRouteComponentProps> = ({
  authorizedRoles,
  children,
}) => {
  const { isAuthenticated, user } = useSelector<RootState, AuthState>(
    (state) => state.auth,
  );
  const dispatch = useDispatch();

  const roles = user?.roles || [];

  if (!isAuthenticated) {
    return <Navigate to="/account/login" />;
  }

  if (
    authorizedRoles &&
    !roles.some((role) => authorizedRoles.includes(role))
  ) {
    dispatch(
      globalMessageActions.notify({
        message: "You don't have permission to access this page or resource.",
        severity: "error",
      }),
    );
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRouteComponent;
