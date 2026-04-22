import { Document } from "mongoose";
import {
  ACCOUNT_STATUS,
  AUTH_PROVIDERS,
  USER_ROLES,
} from "../constants/user.constant";

export interface IUser extends Document {
  // Auth & Identity
  username: string;
  email: string;
  password?: string;
  authProvider: (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];
  providerId?: string;
  role: (typeof USER_ROLES)[keyof typeof USER_ROLES];
  accountStatus: (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

  // Basic Info
  name: string;
  image?: string;
  bio?: string;
  dob?: Date;
  contactNo?: string;
  language?: string;

  // Verification & Security
  rejectionReason?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  isDeleted: boolean;
  // Role-Specific
  teacherProfile?: {
    resumeUrl: string;
    educationDocuments: string[];
    idProof: {
      front: string;
      back: string;
    };
  };

  // Security & Tokens
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;

  // Metadata
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}
