import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpire: string;
  bcryptRounds: number;
  nodeEnv: string;
  emailKey: string;
  companyName: string;
  companyEmail: string;
  supportEmail: string;
  companyPhone: string;
  verifyTokenSecret: string;
  verifyTokenExpire: string;
  refreshTokenSecret: string;
  githubAuthId: string;
  githubAuthClientSecret: String;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3001'),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ella',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  jwtExpire: process.env.JWT_EXPIRE || '10s',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  nodeEnv: process.env.NODE_ENV || 'development',
  emailKey: process.env.RESEND_API_KEY || '',
  companyName: process.env.COMPANY_NAME || '',
  companyEmail: process.env.COMPANY_EMAIL || '',
  supportEmail: process.env.SUPPORT_EMAIL || '',
  companyPhone: process.env.COMPANY_PHONE || '',
  verifyTokenSecret: process.env.VERIFY_TOKEN_SECRET || '',
  verifyTokenExpire: process.env.VERIFY_TOKEN_EXPIRE || '',
  refreshTokenSecret: process.env.RE_JWT_SECRET || '',
  githubAuthId: process.env.GITHUB_AUTH_ID || '',
  githubAuthClientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET || '',
};

export default config;
