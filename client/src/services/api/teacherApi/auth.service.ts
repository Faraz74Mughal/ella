import { FacebookJwtPayload, GoogleJwtPayload, TSignIn, TToken } from "@/types/userType";
import { ServiceAuth as Service } from "../handler";

class AuthService extends Service {
  constructor(name: string) {
    super(name);
  }

  async signIn(data: TSignIn) {
    return await this.post("/sign-in", data, {}, true);
  }
  
  async googleSignIn(data: GoogleJwtPayload) {
    return await this.post("/google-sign-in", data, {}, true);
  }

   async facebookSignIn(data: FacebookJwtPayload) {
    return await this.post("/facebook-sign-in", data, {}, true);
  }

  async signUp(data: TSignIn) {
    return await this.post("/sign-up", data, {}, true);
  }

  // async githubTokenExchange(data:{code:string}){
  //   return await this.post('/github-token-exchange',{...data})
  // }

  async verifyUser(data: TToken) {
    return await this.post("/verify-email", data, {}, true);
  }

 async forgotPasswordEmail(data: {email:string}) {
    return await this.post("/forgot-password-email", data, {}, true);
  }

   async createNewPasswordEmail(data: {newPassword:string,confirmPassword:string,token:string}) {
    return await this.post("/update-forgot-password", data, {}, true);
  }
  
  //  async googleSingInUser(data: TToken) {
  //   return await this.post("/google-sing-in", data, {}, true);
  // }

  
}

const authService = new AuthService("/auth");

export default authService;
