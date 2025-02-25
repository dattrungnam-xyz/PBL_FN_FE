import axios from "axios";
import { authActions } from "./stores/authSlice.ts";
import { AppDispatch, RootState } from "./stores/index.ts";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type StoreType = {
  dispatch: AppDispatch;
  getState: () => RootState;
};

export const setupAxiosInterceptors = (store: StoreType) => {
  // Add Authorization header
  axiosClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.log("Request error", error.message);
      return Promise.reject(error);
    },
  );

  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const response = error.response;

        if (response.status === 401) {
          // Dispatch logout action
          store.dispatch(authActions.logout());
        }

        if (response.data) {
          console.log("Response with error:", response.data);
          return Promise.reject(response.data);
        }
      }

      console.log("Response error:", error.message);
      return Promise.reject(error);
    },
  );
};

export default axiosClient;
