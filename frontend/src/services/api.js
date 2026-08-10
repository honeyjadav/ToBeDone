import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
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

// Response interceptor: normalize network, auth (401) and server (5xx) errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network-level errors (no response) – show as no internet
    if (!error?.response) {
      error.message = 'No internet connection';
      error.isNetworkError = true;
      return Promise.reject(error);
    }

    const status = error.response.status;
    const serverMessage = error.response?.data?.message || error.response?.data?.error;

    if (status === 401) {
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
