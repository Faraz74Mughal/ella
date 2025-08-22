import { SERVER_PATH_API, STORAGE_KEY } from "@/config";
import CustomStatusCodes from "@/utils/custom-status-code";
import axios, { AxiosError } from "axios";

const apiAuth = axios.create({
  baseURL: SERVER_PATH_API
});

const api = axios.create({
  baseURL: SERVER_PATH_API
});

api.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${localStorage.getItem(STORAGE_KEY)}`;
  return req;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    try {
      console.log("Request Interceptor error", error);
      const errorResponse = (error as AxiosError).response?.data as {
        code: number;
      };
      console.log(".status", errorResponse?.code);
      if (
        errorResponse?.code === CustomStatusCodes.NO_TOKEN ||
        errorResponse?.code === CustomStatusCodes.INVALID_TOKEN
      ) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = "/sign-in";
      }
    } catch (error) {
      console.log("THERE", error);

      // if(errorResponse?.code === 417) {
      //   localStorage.removeItem(STORAGE_KEY);
      //   window.location.href = "/teacher/sign-in";
      // }
    }

    return Promise.reject(error);
  }
);

export { api, apiAuth };
