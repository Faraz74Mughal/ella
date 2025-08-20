import { NextFunction, Response, Request } from 'express';
import { sendError, sendResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { StatusCodes } from 'http-status-codes';
import { User } from '../models/user.model';

export class UserController {
  static fetchProfile(req: any, res: Response, next: NextFunction) {
    try {
      sendResponse(res, 200, true, 'Profile retrieved successfully.', req.user);
    } catch (error) {
      next(error);
    }
  }

  static fetchAdmin(req: any, res: Response, next: NextFunction) {
    try {
      sendResponse(res, 200, true, 'Admin access granted.');
    } catch (error) {
      next(error);
    }
  }

  static async signOut(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        sendResponse(res, 417, false, 'Token is required for sign out.');
        return;
      }
      const user = req.user as any;
      if (!user) {
        sendError(res, 400, 'User not found.');
        return;
      }
      const findUser = await User.findById(user._id).select('+refreshToken');
      console.log('findUsers', findUser,token);

      if (!findUser || findUser.refreshToken !== token) {
        sendError(res, 417, 'User alreadyss signout.');
        return
      }
      await User.findOneAndUpdate(
        { _id: user._id, refreshToken: token },
        { refreshToken: null },
        { new: true }
      );
      //   const existingUser = await AuthServer.findUserEmail(email);
      //   if (existingUser) {
      //     sendError(res, 400, 'User already exists with this email.');
      //     return;
      //   }

      sendResponse(res, 200, true, 'User sign out successfully.', null);
    } catch (error) {
      next(error);
    }
  }
}
