import { Response, NextFunction } from "express";
import { AuthenticatedRequest, UserPayload } from "../types";
import { sendError } from "../utils/response";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { User } from "../models/user.model";
import { logger } from "../utils/logger";
import { StatusCodes } from "http-status-codes";

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      sendError(res, StatusCodes.UNAUTHORIZED, "Access denied. No token provided.");
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;
    const user = await User.findById(decoded._id).select("+password");

    if (!user ) {
      sendError(res, StatusCodes.UNAUTHORIZED, "Invalid token or user not found.");
      return;
    }

    req.user = {
      _id: user._id,
      email: user.email,
      role: user?.role
    };

    next();
  } catch (error) {
    sendError(res, StatusCodes.UNAUTHORIZED, "Invalid token");
  }
};

export const authorize = (...roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, StatusCodes.FORBIDDEN, "Access denied. Insufficient permissions.");
      return;
    }
    next();
  };
};
