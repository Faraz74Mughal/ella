import { NextFunction, Response, Request } from 'express';
import { sendError, sendResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { UserModel } from '../models/user.model';
import { IUser } from '../interface/userInterface';
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
      const user = req.user as IUser;
      if (!user) {
        sendError(res, CustomStatusCodes.NOT_FOUND, 'User not found Or Token expire.');
        return;
      }

      await UserModel.findByIdAndUpdate(user._id, { refreshToken: null });
      logger.info(`User sign out successfully: ${user.email}`);
      sendResponse(res, CustomStatusCodes.OK, true, 'User sign out successfully.', null);
    } catch (error) {
      next(error);
    }
  }
}
