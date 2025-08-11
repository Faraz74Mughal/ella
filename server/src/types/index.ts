import { Request} from "express";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface AuthenticatedRequest extends Request{
    user?:{
        _id:string|mongoose.Schema.Types.ObjectId;
        email:string;
        role:string;
    }
}

export interface ApiResponse <T=any>{
    success:boolean;
    message:string;
    data?:T,
    error?:string
}

export interface UserPayload extends JwtPayload{
     _id:string|mongoose.Schema.Types.ObjectId;
        email:string;
        role:string;
}

export enum UserRole {
    ADMIN = 'admin',
    TEACHER='teacher',
    STUDENT ='student'
}