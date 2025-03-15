/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { authActions } from "./stores/authSlice.ts";
import { AppDispatch, RootState } from "./stores/index.ts";
import { toast } from "react-toastify";

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

let isRefreshing = false; // To track if a refresh request is in progress
const requestQueue: Array<{ resolve: any; reject: any; originalRequest: any }> =
  []; // Queue to store requests that failed due to expired token

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
    async (error) => {
      const originalRequest = error.config;

      // Check need to refresh token or not
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          // Return and store an intermediate promise to wait for the token refresh
          return new Promise((resolve, reject) => {
            requestQueue.push({ resolve, reject, originalRequest });
          });
        }

        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          originalRequest._retry = true;
          isRefreshing = true;

          let refreshResponse;
          try {
            refreshResponse = await refreshAccessToken(refreshToken);

            // Update new token (redux state and local storage)
            store.dispatch(
              authActions.refreshToken({
                token: refreshResponse.token,
                refreshToken: refreshResponse.refreshToken,
              }),
            );
          } catch (error) {
            console.error("Call refresh token with error", error);
            store.dispatch(authActions.logout());
            toast.error("Your session has expired. Please login again.");

            return Promise.reject(error);
          } finally {
            isRefreshing = false;
            requestQueue.length = 0; // Clear the queue after processing
          }

          if (refreshResponse) {
            try {
              // Retry the original request
              const response = await axiosClient(originalRequest);

              // Retry requests
              requestQueue.forEach((item) => {
                item.originalRequest.headers["Authorization"] =
                  `Bearer ${refreshResponse.token}`;

                // Call the actual request with the handler received from intermediate promise
                axiosClient(item.originalRequest).then(
                  item.resolve,
                  item.reject,
                );
              });

              return Promise.resolve(response);
            } catch (error) {
              console.error(
                "Retry request after refreshing token with error:",
                error,
              );

              return Promise.reject(error);
            } finally {
              isRefreshing = false;
              requestQueue.length = 0; // Clear the queue after processing
            }
          }
        }
      }

      if (error.response) {
        const response = error.response;

        if (response.data) {
          // Reject the error response from body
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

async function refreshAccessToken(refreshToken: string) {
  const response = await axios.post<RefreshResponse>(
    import.meta.env.VITE_API_URL + "/auth/refresh",
    undefined,
    {
      headers: { Authorization: `Bearer ${refreshToken}` },
    },
  );

  return response.data;
}

type RefreshResponse = {
  token: string;
  refreshToken: string;
};
