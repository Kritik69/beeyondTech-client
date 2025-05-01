import axios from "axios";
import useAuthStore from "@/store/store";
import { baseUrl } from "@/pages/api";
import { useRouter } from "next/router";

const axiosInstance = axios.create({
  baseURL: baseUrl, // Replace with your API base URL
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const { token, user } = useAuthStore.getState(); // Get the token from your auth store
    if (token) {
      console.log("Through interceptor");
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.user = JSON.stringify(user);
    }
    return config;
  },
  (error) => {
    const router = useRouter();
    const { clearToken } = useAuthStore.getState();
    const handleLogout = () => {
      clearToken();
      router.push("/login");
    };
    handleLogout();
    console.log(error, "Error in interceptor");
    return Promise.reject(error);
  }
);

export default axiosInstance;
