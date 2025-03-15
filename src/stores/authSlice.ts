import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/auth";

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        token: string;
        user: User;
        refreshToken: string;
      }>,
    ) {
      const { token, user, refreshToken } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      state.user = user;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
    },
    refreshToken(
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
      }>,
    ) {
      const { token, refreshToken } = action.payload;
      state.token = token;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
