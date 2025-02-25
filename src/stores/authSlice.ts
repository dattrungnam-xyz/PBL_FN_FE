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
    login(state, action: PayloadAction<{ token: string; user: User }>) {
      const { token, user } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      state.user = user;

      localStorage.setItem("token", token);
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;

      localStorage.removeItem("token");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
