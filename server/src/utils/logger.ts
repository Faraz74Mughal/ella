import config from "../config/config";

class Logger {
    private isDevelopment = config.nodeEnv ==='development'

    info(message:string,data?:any):void{
        if(this.isDevelopment){
            console.info(`[INFO] ${new Date().toString()}: ${message}`, data||'')
        }
    }

    error(message:string,error?:any):void{
            console.error(`[ERROR] ${new Date().toString()}: ${message}`, error||'')
    }

  warn(message:string,data?:any):void{
            console.error(`[WARN] ${new Date().toString()}: ${message}`, data||'')
    }
}

export const logger = new Logger()