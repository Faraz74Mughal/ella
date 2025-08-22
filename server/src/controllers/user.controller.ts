import { NextFunction, Response, Request } from 'express';
import { sendError, sendResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { StatusCodes } from 'http-status-codes';
import { User } from '../models/user.model';
import { IUser } from '../types';
import CustomStatusCodes from '../utils/custom-status-code';

export class UserController {
  static fetchCurrentUser(req: any, res: Response, next: NextFunction) {
    try {
      sendResponse(res, CustomStatusCodes.OK, true, 'User retrieved successfully.', req.user);
    } catch (error) {
      next(error);
    }
  }

  static fetchAdmin(req: any, res: Response, next: NextFunction) {
    try {
      sendResponse(res, CustomStatusCodes.OK, true, 'Admin access granted.');
    } catch (error) {
      next(error);
    }
  }

  static async signOut(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token|| token.trim() === 'null') {
        sendResponse(res, CustomStatusCodes.NO_TOKEN, false, 'Token is required for sign out.');
        return;
      }
      const user = req.user as IUser;
      if (!user) {
        sendError(res, CustomStatusCodes.NOT_FOUND, 'User not found Or Token expire.');
        return;
      }
      const findUser = await User.findById(user._id).select('+token');

      if (!findUser || findUser.token !== token) {
        sendError(res, CustomStatusCodes.INVALID_TOKEN, 'User not found Or Token expire.');
        return;
      }
      await User.findByIdAndUpdate(
         user._id,
        { refreshToken: null, token: null },
        
      );
      logger.info(`User sign out successfully: ${user.email}`);
      sendResponse(res, CustomStatusCodes.OK, true, 'User sign out successfully.', null);
    } catch (error) {
      next(error);
    }
  }
}
