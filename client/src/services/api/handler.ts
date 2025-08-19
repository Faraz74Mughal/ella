import { AxiosError } from "axios";
import { api } from ".";
import { toast } from "sonner";

class Service {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  async get(url: string, headers?: object, isToasterShow:boolean=false) {
    try {
      const response = await api.get(`${this.name}/${url}`, {
        headers: {
          ...headers
        }
      });

      if (isToasterShow) {
        this.toastMessage(
          response.data.message?.text,
          response.data.message?.type
        );
      }

      return response;
    } catch (error) {
      console.error("GET ERROR: ", (error as Error).message);
      if (isToasterShow) {
        this.toastMessage(
          (
            (error as AxiosError).response?.data as {
              message?: { text?: string };
            }
          )?.message?.text || (error as Error).message,
          (
            (error as AxiosError).response?.data as {
              message?: { type?: string };
            }
          )?.message?.type || "warn"
        );
      }
      return null;
    }
  }

  async post(
    url: string,
    data: object,
    headers?: object,
    isToasterShow: boolean = false
  ) {
    try {
      const response = await api.post(`${this.name}/${url}`, data, {
        headers: {
          ...headers
        }
      });
      if (isToasterShow) {
        this.toastMessage(
          response.data.message?.text,
          response.data.message?.type
        );
      }
      return { data: response.data.data, success: response.data.success };
    } catch (error) {
      if (isToasterShow) {
        this.toastMessage(
          (
            (error as AxiosError).response?.data as {
              message?: { text?: string };
            }
          )?.message?.text || (error as Error).message,
          (
            (error as AxiosError).response?.data as {
              message?: { type?: string };
            }
          )?.message?.type || "warn"
        );
      }
      return (error as AxiosError).response?.data;
    }
  }


    async patch(
    url: string,
    data: object,
    headers?: object,
    isToasterShow: boolean = false
  ) {
    try {
      const response = await api.patch(`${this.name}/${url}`, data, {
        headers: {
          ...headers
        }
      });
      if (isToasterShow) {
        this.toastMessage(
          response.data.message?.text,
          response.data.message?.type
        );
      }
      return { data: response.data.data, success: response.data.success };
    } catch (error) {
      if (isToasterShow) {
        this.toastMessage(
          (
            (error as AxiosError).response?.data as {
              message?: { text?: string };
            }
          )?.message?.text || (error as Error).message,
          (
            (error as AxiosError).response?.data as {
              message?: { type?: string };
            }
          )?.message?.type || "warn"
        );
      }
      return (error as AxiosError).response?.data;
    }
  }

  async delete(
    url: string,
    headers?: object,
    isToasterShow: boolean = false
  ) {
    try {
      const response = await api.delete(`${this.name}/${url}`,  {
        headers: {
          ...headers
        }
      });
      if (isToasterShow) {
        this.toastMessage(
          response.data.message?.text,
          response.data.message?.type
        );
      }
      return { data: response.data.data, success: response.data.success };
    } catch (error) {
      if (isToasterShow) {
        this.toastMessage(
          (
            (error as AxiosError).response?.data as {
              message?: { text?: string };
            }
          )?.message?.text || (error as Error).message,
          (
            (error as AxiosError).response?.data as {
              message?: { type?: string };
            }
          )?.message?.type || "warn"
        );
      }
      return (error as AxiosError).response?.data;
    }
  }


  async toastMessage(message: string, errorType: string) {
    if (errorType == "success") {
      toast.success(message);
    } else {
      toast.warning(message);
    }
    return this;
  }
}

export default Service;
