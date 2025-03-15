import { useDispatch } from "react-redux";
import useUser from "../../../hooks/useUser";
import { authActions } from "../../../stores/authSlice";
import CustomBackdrop from "../../../components/UI/CustomBackdrop";
import React from "react";

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  const {
    data: user,
    isSuccess,
    isError,
    error,
    isLoading: isLoadingUser,
  } = useUser(token || "", token !== null);

  if (isSuccess && user) {
    // init redux auth state
    dispatch(
      authActions.login({ token: token!, user, refreshToken: refreshToken! }),
    );
  }

  if (isError) {
    console.error("Error occurred while init auth state", error);
    dispatch(authActions.logout());
  }

  return <>{isLoadingUser ? <CustomBackdrop /> : children}</>;
};

export default AuthInitializer;
