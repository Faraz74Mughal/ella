import config from '../config/config';
import { IUser, User } from '../models/user.model';
import jwt, { SignOptions } from 'jsonwebtoken';
import { addTimeFromString } from '../utils/helper';

export class AuthServer {
  static generateToken(user: IUser): string {
    return jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpire as SignOptions['expiresIn'],
      }
    );
  }

  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  static async findUserEmail(email: string): Promise<IUser | null> {
    // return await User.findOne({email,isActive:true}).select('+password');
    return await User.findOne({ email }).select('+password');
  }

  static async updateLastLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
  }

  static async createVerifyToken(userId: string, email: string): Promise<string> {
    const token = jwt.sign(
      {
        email,
      },
      config.verifyTokenSecret,
      {
        expiresIn: config.verifyTokenExpire as SignOptions['expiresIn'],
      }
    );
    // verificationToken;
    const verificationTokenExpiry = addTimeFromString(config.verifyTokenExpire);
    await User.findByIdAndUpdate(userId, { verificationToken: token, verificationTokenExpiry });

    return token;
  }

  static decryptToken(token: string): any {
    let obj = null;
    const verify = jwt.verify(token, config.verifyTokenSecret);
    if (verify) {
      const decoded = jwt.decode(token);
      if (decoded) {
        obj = decoded;
      }
    }
    return obj;
  }

  static verifyToken(token: string): boolean {
    return jwt.verify(token, config.verifyTokenSecret)?true:false;
  }
}
