import { TSignIn, TToken } from "@/types/userType";
import {ServiceAuth as Service} from "../handler";

class AuthService extends Service {
  constructor(name: string) {
    super(name);
  }

  async signIn(data: TSignIn) {
    return await this.post("/sign-in", data, {}, true);
  }

  async signUp(data: TSignIn) {
    return await this.post("/sign-up", data, {}, true);
  }

  async verifyUser(data: TToken) {
    return await this.post("/verify-email", data, {}, true);
  }
}

const authService = new AuthService("/auth");

export default authService;
