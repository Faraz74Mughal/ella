import config from "../config/config";
import { IUser, User } from "../models/user.model";
import jwt, { SignOptions } from "jsonwebtoken"

export class AuthServer {
    static generateToken(user:IUser):string{
        return jwt.sign({
            _id:user._id,
            email:user.email,
            role:user.role
        },
        config.jwtSecret,
        {
            expiresIn:config.jwtExpire as  SignOptions['expiresIn']
        }
    )}

    static async createUser(userData:Partial<IUser>):Promise<IUser>{
        const user =new User(userData)
        return await user.save()
    }

    static async findUserEmail (email:string):Promise<IUser|null>{
        return await User.findOne({email,isActive:true}).select('+password');
    }

    static async updateLastLogin(userId:string):Promise<void>{
        await User.findByIdAndUpdate(userId,{lastLogin:new Date()})
    }
}