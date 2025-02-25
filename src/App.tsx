import React from "react";
import "./App.css";
import { authActions } from "./stores/authSlice";
import { useDispatch } from "react-redux";
import useUser from "./hooks/useUser";
import CustomBackdrop from "./components/UI/CustomBackdrop";

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const {
    data: user,
    isSuccess,
    isLoading: isLoadingUser,
  } = useUser(token || "", token !== null);

  if (isSuccess && user) {
    // init redux auth state
    dispatch(authActions.login({ token: token!, user }));
  }

  return <>{isLoadingUser ? <CustomBackdrop /> : children}</>;
};

export default App;
