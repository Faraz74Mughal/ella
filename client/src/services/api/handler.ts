import { AxiosError } from "axios";
import { api } from ".";

// const responseModel  = (){
//     return
// }

class Service {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  async get(url: string, headers?: object) {
    try {
      const response = await api.get(`${this.name}/${url}`, {
        headers: {
          ...headers
        }
      });

      return response
    } catch (error) {
      console.error("GET ERROR: ", (error as Error).message);
      return null;
    }
  }

  async post(url: string,data:object ,headers?: object) {
    try {
      const response = await api.post(`${this.name}/${url}`,data, {
        headers: {
          ...headers
        }
      });
      console.log("RESPONSE:",response);
      return {data:response.data.data,success:response.data.success}
    } catch (error) {
      console.error("GET ERROR: ", (error as Error).message);
      return (error as AxiosError).response?.data;
    }
  }
}

export default Service;
