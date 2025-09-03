import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, IExtendedUser, IUser, UserPayload } from '../interface/userInterface';
import { sendError } from '../utils/response';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { UserModel } from '../models/user.model';
import { logger } from '../utils/logger';

import CustomStatusCodes from '../utils/custom-status-code';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token?.trim() == 'null' || !token) {
      sendError(res, CustomStatusCodes.NO_TOKEN, 'No token provided.');
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;
    console.log('|decoded', decoded);

    if (!decoded || !decoded._id) {
      sendError(res, CustomStatusCodes.TOKEN_EXPIRED, 'Invalid token or expired.');
      return;
    }

    const user = await UserModel.findById(decoded._id).select('+password');

    if (!user) {
      sendError(res, CustomStatusCodes.INVALID_TOKEN, 'User not found.');
      return;
    }

    req.user = user;
    req.extendedUser = user as IExtendedUser;

    next();
  } catch (error) {
    console.log('Authentication error:', error);
    if ((error as Error).message === 'jwt expired') {
      sendError(res, CustomStatusCodes.TOKEN_EXPIRED, 'AUTH ERROR', (error as Error).message);
      return
    }
    sendError(res, CustomStatusCodes.INTERNAL_SERVER_ERROR, 'AUTH ERROR', (error as Error).message);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, CustomStatusCodes.FORBIDDEN, 'Access denied. Insufficient permissions.');
      return;
    }
    next();
  };
};

