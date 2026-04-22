import jwt, { SignOptions } from "jsonwebtoken";
import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import {
  ACCOUNT_STATUS,
  AUTH_PROVIDERS,
  USER_ROLES,
} from "../constants/user.constant";
import { IUser, IUserMethods } from "../types/user.type";

export type UserDocument = Document & IUser & IUserMethods;
// --- Mongoose Schema ---
const userSchema = new Schema<
  IUser,
  Model<IUser, any, IUserMethods>,
  IUserMethods
>(
  {
    // --- Auth & Identity ---
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    password: {
      type: String,
      select: false, // Security: hide password by default
    },
    authProvider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.LOCAL,
    },
    providerId: {
      type: String,
      index: true, // Speeds up social login queries,
      required: function (): any {
        return this.authProvider !== AUTH_PROVIDERS.LOCAL;
      },
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
      index: true,
      default: USER_ROLES.PENDING,
    },
    accountStatus: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.AWAITING,
      index: true,
    },

    // --- Basic Info ---
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "https://default-avatar-url.com/avatar.png",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    dob: {
      type: Date,
    },
    contactNo: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      trim: true,
    },

    // --- Verification ---
    rejectionReason: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: { type: String, select: false },
    emailVerificationExpire: { type: Date, select: false },

    // --- Role-Specific ---
    teacherProfile: {
      type: {
        resumeUrl: { type: String, required: true },
        educationDocuments: [{ type: String, required: true }],
        idProof: {
          front: { type: String, required: true },
          back: { type: String, required: true },
        },
      },
      required: false, // This entire object is only required if the user is a teacher
    },
    refreshToken: {
      type: String,
      select: false, // We don't want to accidentally expose this in normal queries
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    isDeleted: { type: Boolean, default: false },
    // --- Metadata ---
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.index(
  { authProvider: 1, providerId: 1 },
  {
    unique: true,
    partialFilterExpression: { providerId: { $type: "string" } },
  },
);
// --- Hooks ---
userSchema.pre<IUser>("save", async function () {
  if (
    this.isNew &&
    this.authProvider === AUTH_PROVIDERS.LOCAL &&
    !this.password
  ) {
    throw new Error("Password is required.");
  }

  if (this.password && this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.isPasswordCorrect = async function (
  password: string,
): Promise<boolean> {
  if (!this.password) return false; // No password means we can't verify

  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || "15m";
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error(
      "Access token secret is not defined in environment variables",
    );
  }
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: accessTokenExpiry as SignOptions["expiresIn"] },
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || "7d";
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error(
      "Refresh token secret is not defined in environment variables",
    );
  }
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: refreshTokenExpiry as SignOptions["expiresIn"] },
  );
};

userSchema.set("toJSON", {
  transform: function (_, ret) {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.emailVerificationToken;
    delete ret.resetPasswordToken;
    return ret;
  },
});

export const User = mongoose.model<IUser, Model<IUser, any, IUserMethods>>(
  "User",
  userSchema,
);
