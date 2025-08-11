import mongoose from "mongoose";
import config from "./config";
import { logger } from "../utils/logger";


export const connectionDatabase =async():Promise<void>=>{
try {
    const conn =await mongoose.connect(config.mongoUri,{
         maxPoolSize:10,
            serverSelectionTimeoutMS:5000,
            socketTimeoutMS:45000
    })

    logger.info(`MongoDB Connected: ${conn.connection.host}`)

    mongoose.connection.on("error",(error)=>{
        logger.error("MongoDB Connection Error: ", error)
    })

    mongoose.connection.on("disconnected",()=>{
        logger.warn("MongoDB Disconnected.")
    })
    
} catch (error) {
    logger.error("MongoDB Connection Failed: ",error)
    process.exit(1)
}
}
