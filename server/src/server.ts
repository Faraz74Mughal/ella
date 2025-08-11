// import app from "./app";

// app.listen(3000, () => {
//   console.log("Server is running on http://localhost:30001");
// });
import express from "express"
import helmet from "helmet";
import cors from "cors"
import config from "./config/config";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan"


import authRoutes from './routers/authRouters'
import userRoutes from './routers/userRouters'
import { errorHandler, notFound } from "./middleware/errorHandler";
import { connectionDatabase } from "./config/database";
import { logger } from "./utils/logger";

class Server{
  public app: express.Application;
  
  constructor(){
    this.app =express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware():void{
    this.app.use(helmet())
    this.app.use(cors({
      origin:config.nodeEnv === 'development'?'*':['https://yourdomain.com'],
      credentials:true
    }))

    this.app.use(rateLimit({
      windowMs:15*60*1000,
      max:100,
      message:{
        success:false,
        message:"Too many request from Ip, please try later"
      }
    }))

    this.app.use(express.json({limit:'10mb'}))
    this.app.use(express.urlencoded({extended:true}))
    this.app.use(compression())

    if(config.nodeEnv==="development"){
      this.app.use(morgan('dev'))
    }

  }

  private initializeRoutes():void{
    
    this.app.get('/health',(req,res)=>{
      res.status(200).json({
        success:true,
        message:'Server is running',
        timestamp:new Date().toISOString(),
        environment:config.nodeEnv
      })
    })

    // Root route
    this.app.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Welcome to the API',
        version: '1.0.0'
      });
    });

    this.app.use('/api/auth',authRoutes)
    this.app.use('/api/users',userRoutes)

    this.app.use('/.*/',notFound)

  }


  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start():Promise<void>{
    try {
      await connectionDatabase()
      this.app.listen(config.port,()=>{
        logger.info(`Server is running on port ${config.port} in ${config.nodeEnv} mode`)
      })

      process.on("SIGTERM",this.gracefulShutdown)
      process.on("SIGINT",this.gracefulShutdown)

    } catch (error) {
       logger.error('Failed to start server:', error);
      process.exit(1);
    }

  }

  private gracefulShutdown = (signal:string):void =>{
    logger.info(`Received ${signal}.  Starting graceful shutdown...`)
    process.exit(1)
  }

}

const server = new Server()
server.start().catch((error) => {
  logger.error('Unhandled server startup error:', error);
  process.exit(1);
})

export default server