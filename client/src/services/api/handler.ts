import { AxiosError } from "axios";
import { api, apiAuth } from ".";
import { toast } from "sonner";

class Service {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  async get(url: string, headers?: object, isToasterShow: boolean = false) {
    try {
      const response = await api.get(`${this.name}${url}`, {
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

      return {data:response.data?.data,isSuccess:true};
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
      return {data:null,isSuccess:false};
    }
  }

  async post(
    url: string,
    data: object,
    headers?: object,
    isToasterShow: boolean = false
  ) {
    try {
      try {
        const response = await api.post(`${this.name}${url}`, data, {
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
          console.log(".response?.data", (error as AxiosError).response);

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
        const errorResponse = (error as AxiosError).response?.data as {
          data?: unknown;
          success?: boolean;
        };
        return { data: errorResponse.data ?? null, success: false };
      }
    } catch (error) {
      this.toastMessage((error as Error).message, "warn");
      return { data: null, success: false };
    }
  }

  async patch(
    url: string,
    data: object,
    headers?: object,
    isToasterShow: boolean = false
  ) {
    try {
      const response = await api.patch(`${this.name}${url}`, data, {
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
      const errorResponse = (error as AxiosError).response?.data as {
        data?: unknown;
        success?: boolean;
      };
      return { data: errorResponse.data ?? null, success: false };
    }
  }

  async delete(url: string, headers?: object, isToasterShow: boolean = false) {
    try {
      const response = await api.delete(`${this.name}${url}`, {
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
      const errorResponse = (error as AxiosError).response?.data as {
        data?: unknown;
        success?: boolean;
      };
      return { data: errorResponse.data ?? null, success: false };
    }
  }

  async toastMessage(message: string, errorType: string) {
    if (errorType == "INFO") {
      toast.success(message);
    } else {
      toast.warning(message);
    }
    return this;
  }
}

class ServiceAuth {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  async get(url: string, headers?: object, isToasterShow: boolean = false) {
    try {
      const response = await apiAuth.get(`${this.name}${url}`, {
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
      const response = await apiAuth.post(`${this.name}${url}`, data, {
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
      const errorResponse = (error as AxiosError).response?.data as {
        data?: unknown;
        success?: boolean;
      };
      return { data: errorResponse.data ?? null, success: false };
    }
  }

  async patch(
    url: string,
    data: object,
    headers?: object,
    isToasterShow: boolean = false
  ) {
    try {
      const response = await apiAuth.patch(`${this.name}${url}`, data, {
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
      const errorResponse = (error as AxiosError).response?.data as {
        data?: unknown;
        success?: boolean;
      };
      return { data: errorResponse.data ?? null, success: false };
    }
  }

  async delete(url: string, headers?: object, isToasterShow: boolean = false) {
    try {
      const response = await apiAuth.delete(`${this.name}/${url}`, {
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
      const errorResponse = (error as AxiosError).response?.data as {
        data?: unknown;
        success?: boolean;
      };
      return { data: errorResponse.data ?? null, success: false };
    }
  }

  async toastMessage(message: string, errorType: string) {
    if (errorType == "INFO") {
      toast.success(message);
    } else {
      toast.warning(message);
    }
    return this;
  }
}

export { ServiceAuth, Service };
