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
  req.headers.Authorization = `Bearer ${
    JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"token":null}').token
  }`;
  return req;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    try {
      const errorResponse = (error as AxiosError).response?.data as {
        code: number;
      };
      const getToken = localStorage.getItem(STORAGE_KEY);
      const refreshToken = getToken ? JSON.parse(getToken).refreshToken : null;
      const original = error.config;

      if (errorResponse?.code === CustomStatusCodes.TOKEN_EXPIRED) {
        await axios
          .post(`${SERVER_PATH_API}/auth/refresh-token`, { refreshToken })
          .then((res) => {
            if (res.data.success) {
              localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                  token: res.data.data?.token,
                  refreshToken: res.data.data?.refreshToken
                })
              );
              original.headers.Authorization = `Bearer ${res.data.data?.token}`;
              return api.request(original);
            }

            if (!res.data.success) {
              localStorage.removeItem(STORAGE_KEY);
              window.location.href = "/sign-in";
              return Promise.reject(new Error("Token refresh failed"));
            }
            return Promise.reject(new Error("Token refresh failed"));
          });
      }

      if (
        errorResponse?.code === CustomStatusCodes.NO_TOKEN ||
        errorResponse?.code === CustomStatusCodes.INVALID_TOKEN
      ) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = "/sign-in";
      }
    } catch (error) {
    
      if (
        ((error as AxiosError).response?.data as { code: number })?.code ===
          CustomStatusCodes.REFRESH_TOKEN_EXPIRED ||
        ((error as AxiosError).response?.data as { code: number })?.code ===
          CustomStatusCodes.NO_REFRESH_TOKEN
      ) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = "/sign-in";
      }
     
    }

    return Promise.reject(error);
  }
);

export { api, apiAuth };
