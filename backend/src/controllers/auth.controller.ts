import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";
import { IUser } from "../types/user.type";
import { ACCOUNT_STATUS, USER_ROLES } from "../constants/user.constant";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.registerUser(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      "User register successfully. Select your role to continue.",
      {
        user: user,
      },
    ),
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  // 1. Validation
  const user = await AuthService.login(req.body);

  if (
    user.role === "teacher" &&
    user.accountStatus === ACCOUNT_STATUS.AWAITING
  ) {
    return res.status(200).json(
      new ApiResponse(200, "Please submit your application for teacher role.", {
        user: user,
      }),
    );
  }

  // Handle pending role - return user data without tokens
  if (user.role === "pending") {
    return res.status(200).json(
      new ApiResponse(200, "Please select your role to continue.", {
        user: user,
      }),
    );
  }

  // 4. Generate Tokens
  const { accessToken, refreshToken } =
    await AuthService.generateAccessAndRefreshTokens(user._id);

  // 5. Secure Cookie Options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  const statusMessage =
    user.accountStatus === ACCOUNT_STATUS.PENDING
      ? "Your account is pending approval. Please wait for admin review."
      : "User logged in successfully";

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, statusMessage, {
        user: user,
        accessToken,
        refreshToken,
      }),
    );
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Is I am in refresh access token");

    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const { accessToken, refreshToken } =
      await AuthService.refreshAccessToken(incomingRefreshToken);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "Access token refreshed", {
          accessToken,
          refreshToken,
        }),
      );
  },
);

// --- Logout Controller ---
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Note: We will create the 'auth' middleware next to populate req.user
  const userId = (req as any).user?._id;

  // 1. Remove refresh token from DB
  await User.findByIdAndUpdate(
    userId,
    { $set: { refreshToken: null } },
    { new: true },
  );

  // 2. Clear cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully"));
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Please provide a valid email");
    }

    // The service handles token generation, hashing, and sending the email
    await AuthService.forgotPassword(email);

    return res
      .status(200)
      .json(new ApiResponse(200, `Reset link sent to ${email}`));
  },
);

// --- Reset Password Controller ---
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    // We get the token from the URL params (e.g., /reset-password/:token)
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      throw new ApiError(400, "New password is required");
    }

    // The service verifies the token hash and expiry, then updates the password
    await AuthService.resetPassword(token as string, password);

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Password reset successfully. You can now login."),
      );
  },
);

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "Verification token is required");
  }

  await AuthService.verifyEmail(token as string);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Your email has been successfully verified! Login to continue.",
      ),
    );
});

export const resendVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw new ApiError(404, "User not found");
    if (user.isEmailVerified)
      throw new ApiError(400, "Email is already verified");

    await AuthService.sendVerificationEmail(user as any);

    return res
      .status(200)
      .json(new ApiResponse(200, "Verification email resent successfully"));
  },
);

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { googleId } = req.body;

  if (!googleId) {
    throw new ApiError(400, "Google ID Token is required");
  }

  const { accessToken, refreshToken, user } =
    await AuthService.loginWithGoogle(googleId);

  if (user.role === USER_ROLES.PENDING) {
    return res.status(200).json(
      new ApiResponse(200, "Please select your role to continue.", {
        user: user,
      }),
    );
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "Logged in with Google successfully", {
        accessToken,
        refreshToken,
        user: user,
      }),
    );
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    // Use the service to get the freshest data from the DB

    const user = await AuthService.getCurrentUser((req as any).user._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Current user fetched successfully", user));
  },
);

export const assignRole = asyncHandler(async (req: Request, res: Response) => {
  const { role, _id } = req.body;
  const userId = _id;

  const updatedUser = await AuthService.assignRole(userId, role);
  // await AuthService.sendVerificationEmail(updatedUser as IUser);
  const loggedInUser = updatedUser.toObject();

  if (
    loggedInUser.isEmailVerified &&
    loggedInUser.accountStatus === ACCOUNT_STATUS.ACTIVE
  ) {
   const { accessToken, refreshToken } =
    await AuthService.generateAccessAndRefreshTokens(loggedInUser._id);
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "User logged in successfully", {
          user: loggedInUser,
          accessToken,
          refreshToken,
        }),
      );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      `Role updated successfully. ${loggedInUser?.role === USER_ROLES.STUDENT && "Email has been sent. Please verify your email to log in."} `,
      {
        user: loggedInUser,
      },
    ),
  );
});
