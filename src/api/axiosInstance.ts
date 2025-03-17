import axios from "axios";

const axiosInstance = axios.create({  
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false; // Prevent multiple refresh attempts
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized (401) and not already trying to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await axiosInstance.post(
            `/AgentAuth/refresh-token?refreshtoken=${refreshToken}`
          );
          console.log("new token fetched");
          
          const { access_token, refresh_token: newRefreshToken } = res.data?.data;

          localStorage.setItem("token", access_token);
          localStorage.setItem("refresh_token", newRefreshToken);
          isRefreshing = false;
          onRefreshed(access_token);

          return axiosInstance(originalRequest); // Retry the original request
        } catch (refreshError) {
          isRefreshing = false;
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error.response?.data?.error || error.message);
  }
);

export default axiosInstance;
