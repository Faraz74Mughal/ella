import config from "../config/config";
import colors from "colors";

class Logger {
    private isDevelopment = config.nodeEnv ==='development'

    info(message:string,data?:any):void{
        if(this.isDevelopment){
            console.info(colors.cyan( `[INFO] ${new Date().toString()}: ${message}`), data||'')
        }
    }

    error(message:string,error?:any):void{
            console.error(colors.red(`[ERROR] ${new Date().toString()}: ${message}`), error||'')
    }

  warn(message:string,data?:any):void{
            console.error(colors.yellow(`[WARN] ${new Date().toString()}: ${message}`), data||'')
    }
}

export const logger = new Logger()