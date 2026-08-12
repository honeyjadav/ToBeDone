import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // required so the httpOnly refreshToken cookie is sent
});

// Add access token automatically to protected requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Auto-refresh logic ----
// If several requests fail with 401 at the same time, we only want ONE
// call to /refresh-token. Everyone else waits for that single refresh
// and then retries with the new token.
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

// Response interceptor: normalize network, auth (401) and server (5xx) errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Network-level errors (no response) – show as no internet
    if (!error?.response) {
      error.message = 'No internet connection';
      error.isNetworkError = true;
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response.status;
    const serverMessage = error.response?.data?.message || error.response?.data?.error;

    if (status === 401) {
      // Don't try to refresh on these — avoids infinite loops / nonsense refreshes
      const isAuthRoute =
        originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/refresh-token") ||
        originalRequest.url.includes("/auth/verify-otp");

      if (!isAuthRoute && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          // A refresh is already in flight — wait for it, then retry
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((newToken) => {
              if (!newToken) {
                reject(error);
                return;
              }
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            });
          });
        }

        isRefreshing = true;

        try {
          const { data } = await api.post("/auth/refresh-token");
          const newAccessToken = data?.data?.accessToken;

          if (!newAccessToken) {
            throw new Error("No access token returned from refresh");
          }

          localStorage.setItem("accessToken", newAccessToken);
          isRefreshing = false;
          onRefreshed(newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          onRefreshed(null);

          // Refresh failed — session is truly dead, force logout
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          console.log("Session expired. Redirecting to login.");
          return Promise.reject(refreshError);
        }
      }

      error.message = serverMessage || 'Invalid email or password.';
      error.isAuthError = true;
      return Promise.reject(error);
    }

    if (status === 500) {
      // User requested 500 be shown as 'No internet connection'
      error.message = 'No internet connection';
      error.isServerError = true;
      return Promise.reject(error);
    }

    if (status >= 500) {
      error.message = serverMessage || 'Internal Server Error. Please try again later.';
      error.isServerError = true;
      return Promise.reject(error);
    }

    // For other client errors prefer server message when available
    if (status >= 400) {
      error.message = serverMessage || error.message || `Request failed with status ${status}`;
    }

    return Promise.reject(error);
  }
);

export default api;