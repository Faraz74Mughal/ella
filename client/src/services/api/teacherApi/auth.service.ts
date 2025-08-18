import { TSignIn } from "@/types/userType";
import Service from "../handler";

class AuthService extends Service {

    constructor(name:string){
        super(name)
    }

    async signIn(data:TSignIn){
        return await this.post("/sign-in",data)
    }


    async signUp(data:TSignIn){
        return await this.post("/sign-up",data)
    }

}

const authService = new AuthService("/auth")

export default authService