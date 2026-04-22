import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
import {
  getResetPasswordTemplate,
  getVerificationEmailTemplate,
} from "../utils/emailTemplates";
import { MailService } from "./mail.service";
import { OAuth2Client } from "google-auth-library";
import { IUser } from "../types/user.type";
import {
  ACCOUNT_STATUS,
  AUTH_PROVIDERS,
  USER_ROLES,
} from "../constants/user.constant";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface SocialUserPayload {
  email: string;
  name: string;
  username: string;
  image: string;
  provider: "google" | "facebook";
  providerId: string;
}

export class AuthService {
  static async registerUser(userData: Partial<IUser>) {
    // 1. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "User with this email or username already exists",
      );
    }

    // 3. Create User
    let user = await User.create({
      ...userData,
      role: "pending",
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
  }

  static async login(userData: Partial<IUser>) {
    const { email, password } = userData;
    // 1. Validation
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // 2. Find user (must explicitly select password because we hid it in schema)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    // 3. Compare Password (using our model method)
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    if (user.role !== "pending" && !user.isEmailVerified) {
      throw new ApiError(
        403,
        "Your email is not verified. Please verify your email before logging in.",
      );
    }

    // if (
    //   user.role === "teacher" &&
    //   user.accountStatus === ACCOUNT_STATUS.PENDING
    // ) {
    //   throw new ApiError(403, "Your account is pending approval.");
    // }

    if (user.accountStatus === ACCOUNT_STATUS.BLOCKED) {
      throw new ApiError(403, "Your account has been suspended.");
    }

    if (user.accountStatus === ACCOUNT_STATUS.REJECTED) {
      throw new ApiError(403, `Your account application was rejected.`);
    }

    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    return loggedInUser;
  }

  static async generateAccessAndRefreshTokens(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to DB for session management
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  }

  static async refreshAccessToken({
    incomingRefreshToken,
  }: {
    incomingRefreshToken: string;
  }) {
    try {
      // 1. Verify the token
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
      ) as { _id: string };

      // 2. Find the user
      const user = await User.findById(decodedToken?._id).select(
        "+refreshToken",
      );

      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }

      // 3. Security Check: Does the token from the cookie match the one in the DB?
      if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
      }

      // 4. Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateAccessAndRefreshTokens(user._id.toString());

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new ApiError(
        401,
        (error as Error)?.message || "Invalid refresh token",
      );
    }
  }

  static async loginWithSocialProvider(payload: SocialUserPayload) {
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        email: payload.email,
        name: payload.name,
        username: payload.username || payload.email.split("@")[0],
        image: payload.image,
        authProvider: payload.provider,
        providerId: payload.providerId,
        role: "student", // Default role for social signup
        isEmailVerified: true,
      });
    } else {
      // If user exists but is an Admin, block social login (Security Rule)
      if (user.role === "admin") {
        throw new ApiError(403, "Admins must use local login");
      }
      // Sync social data if needed
      user.authProvider = payload.provider;
      user.providerId = payload.providerId;
      await user.save();
    }

    return await this.generateAccessAndRefreshTokens(user._id);
  }

  static async forgotPassword(email: string) {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User with this email does not exist");

    // 2. Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3. Hash and set to user fields
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await user.save({ validateBeforeSave: false });

    // 4. Prepare Email using Template
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const htmlBody = getResetPasswordTemplate(resetUrl);

    try {
      // 5. Send Email via Abstracted MailService
      await MailService.send({
        to: user.email,
        subject: "Password Reset Request",
        html: htmlBody,
      });
    } catch (error) {
      // Clean up DB if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      // Let the global error handler catch this
      throw new ApiError(
        500,
        "Email could not be sent. Please try again later.",
      );
    }
  }

  static async resetPassword(token: string, newPassword: string) {
    // 1. Hash the incoming token to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Find user with valid token and not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) throw new ApiError(400, "Token is invalid or has expired");

    // 3. Set new password (the pre-save hook will hash it automatically!)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return user;
  }

  static async sendVerificationEmail(user: IUser) {
    // 1. Generate Raw Token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 2. Hash and Save to User
    user.emailVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Set expiry (24 hours)
    user.emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    // 3. Prepare Email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const htmlBody = getVerificationEmailTemplate(user.name, verificationUrl);

    // 4. Send via Service
    await MailService.send({
      to: user.email,
      subject: "Verify Your Email Address",
      html: htmlBody,
    });
  }

  static async verifyEmail(token: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    console.log("verify-email", user);

    if (!user) {
      throw new ApiError(400, "Verification link is invalid or has expired.");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return user;
  }

  static async loginWithGoogle(idToken: string) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new ApiError(400, "Invalid Google token");
    }

    const { email, name, picture, sub: googleId } = payload;

    // 2. Find or Create user (Upsert)
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        username: email.split("@")[0] + Math.floor(Math.random() * 1000),
        image: picture,
        authProvider: "google",
        providerId: googleId,
        isEmailVerified: true, // Google already verified this email,
        role: "pending",
      });
    }

    // 3. Generate our system's Access and Refresh tokens
    const tokens = await this.generateAccessAndRefreshTokens(
      user._id.toString(),
    );
    return { ...tokens, user };
  }

  static async findOrCreateSocialUser(profile: {
    email: string;
    name: string;
    provider: string;
    providerId: string;
  }) {
    let user = await User.findOne({ email: profile.email });

    if (user && user.authProvider !== profile.provider) {
      // Option: Link accounts or throw error
      throw new ApiError(
        400,
        `This email is already registered via ${user.authProvider}`,
      );
    }

    if (!user) {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        authProvider: profile.provider,
        providerId: profile.providerId,
        isEmailVerified: true,
        role: "student",
      });
    }
    return user;
  }

  static async getCurrentUser(userId: string) {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  static async assignRole(userId: string, newRole: string) {
    // 1. Security Check: Prevent self-promotion to Admin
    if (newRole === USER_ROLES.ADMIN) {
      throw new ApiError(403, "You cannot assign the Admin role to yourself.");
    }

    // 2. Validate the role exists in our defined roles
    const validRoles = [
      USER_ROLES.STUDENT as string,
      USER_ROLES.TEACHER as string,
    ];
    if (!validRoles.includes(newRole)) {
      throw new ApiError(400, "Invalid role selection.");
    }
    const accountStatus =
      newRole === USER_ROLES.TEACHER
        ? ACCOUNT_STATUS.AWAITING
        : ACCOUNT_STATUS.ACTIVE;
    // 3. Update the user
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          role: newRole,
          accountStatus: accountStatus,
        },
      },
      { new: true, runValidators: true },
    );
    if (user?.authProvider !== AUTH_PROVIDERS.LOCAL) {
      await this.sendVerificationEmail(user as any);
    }
    if (!user) throw new ApiError(404, "User not found.");

    return user;
  }
}
