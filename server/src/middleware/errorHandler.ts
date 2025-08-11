import { NextFunction,Request,Response } from "express";
import { logger } from "../utils/logger";
import { sendError } from "../utils/response";
import config from "../config/config";

export interface AppError extends Error{
    statusCode?:number;
    isOperational?:boolean
}

export const errorHandler =(err:AppError,req:Request,res:Response,next:NextFunction)=>{

    let statusCode = err.statusCode || 500
    let message = err.message||'Internal Server Error'

    logger.error('Error occurred:',{
        message:err.message,
        stack:err.stack,
        url:req.url,
        method:req.method
    })

    if(err.name==="ValidationError")
    {
        statusCode=400;
        message=Object.values((err as any).errors).map((val:any)=>val.message).join(', ')
    }

    if((err as any).code ===11000){
        statusCode=400;
        message='Duplicate field value entered'
    }

    if(err.name === 'JsonWebTokenError'){
        statusCode =  401;
        message = "Invalid token"
    }

    if(err.name ==='TokenExpiredError'){
        statusCode= 401;
        message = 'Token expired'
    }

    sendError(res,statusCode,message,config.nodeEnv ==="development"?err.stack:undefined)
}

export const  notFound = (req:Request,res:Response)=>{
    sendError(res,404,`Route ${req.originalUrl} not found.`)
}