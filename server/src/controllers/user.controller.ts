import { NextFunction,Response,Request } from "express";
import { sendResponse } from "../utils/response";

export class UserController{


    static fetchProfile (req:any,res:Response,next:NextFunction){
        try {
            sendResponse(res,200,true,"Profile retrieved successfully.",req.user)
        } catch (error) {
            next(error)
        }
    }

     static fetchAdmin (req:any,res:Response,next:NextFunction){
        try {
            sendResponse(res,200,true,"Admin access granted.")
        } catch (error) {
            next(error)
        }
    }
}