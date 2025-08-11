import dotenv from "dotenv"

dotenv.config()

interface Config {
    port:number;
    mongoUri:string;
    jwtSecret:string;
    jwtExpire:string;
    bcryptRounds:number;
    nodeEnv:string;
}

const config: Config ={
    port:parseInt(process.env.PORT||'3001'),
    mongoUri:process.env.MONGODB_URI||'mongodb://localhost:27017/ella',
    jwtSecret:process.env.JWT_SECRET||"fallback-secret",
    jwtExpire:process.env.JWT_EXPIRE||"7d",
    bcryptRounds:parseInt(process.env.BCRYPT_ROUNDS||'12'),
    nodeEnv:process.env.NODE_ENV||'development'
}

export default config