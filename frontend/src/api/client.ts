import axios from "axios";
import { toast } from "sonner";

const excludeToastErrorPath=["/auth/me"]
const serverDownPath = "/server-not-running";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true, // Required for HttpOnly Cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
   const method= response?.config?.method?.toLowerCase();
    if (
      method === "post" ||
      method === "put" ||
      method === "patch" ||
      method === "delete"
    ) {
      toast.success(response?.data?.message);
    }
    return response},
  (error) => {
    const requestUrl = error?.response?.config?.url;
    const hasNoResponse = !error?.response;

    if (hasNoResponse) {
      if (window.location.pathname !== serverDownPath) {
        window.location.assign(serverDownPath);
      }
      return Promise.reject(error);
    }

    if (!excludeToastErrorPath.includes(requestUrl)) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }

    return Promise.reject(error);
  },
);

export default api;
