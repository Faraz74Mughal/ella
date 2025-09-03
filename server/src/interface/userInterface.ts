import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';



export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: UserRole;
  profilePicture: string;
  isApprove: boolean;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IExtendedUser extends IUser {
  password?: string;
  verificationToken: string;
  verificationTokenExpiry: Date;
  refreshToken: string;
}

export interface AuthenticatedRequest extends Request {
  extendedUser?: IExtendedUser;
  user?: IUser;
}

export interface ApiResponse<T = any> {
  code: number;
  status: string;
  success: boolean;
  message: { type: string; text: string };
  data?: T;
  error?: string;
}

export interface UserPayload extends JwtPayload {
  _id: string | mongoose.Schema.Types.ObjectId;
  email: string;
  role: string;
}

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}


declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      extendedUser?: IExtendedUser;
    }
  }
}
