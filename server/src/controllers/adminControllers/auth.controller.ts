import { Request, Response, NextFunction } from 'express';
import { AuthServer } from '../../services/authService';
import { sendError, sendResponse } from '../../utils/response';
import { logger } from '../../utils/logger';
import { emailService } from '../../services/emailSevice';
import { UserModel } from '../../models/user.model';
import {  EUserRole, IExtendedUser } from '../../interface/userInterface';
import CustomStatusCodes from '../../utils/custom-status-code';
import config from '../../config/config';

export class AuthController {
  static async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user: IExtendedUser = (await AuthServer.findUserEmail(email)) as IExtendedUser;
      if (!user) {
        sendError(res, CustomStatusCodes.NOT_FOUND, 'Invalid credentials');
        return;
      }

      if (!user.password) {
        sendError(res, CustomStatusCodes.BAD_REQUEST, 'Invalid password');
        return;
      }

      const comparePassword = await user.comparePassword(password);

      if (!comparePassword) {
        sendError(res, CustomStatusCodes.BAD_REQUEST, 'Invalid password');
        return;
      }

      if (user.role !== EUserRole.ADMIN) {
        sendError(res, CustomStatusCodes.NOT_FOUND, 'Sorry you are not an admin.');
        return;
      }

      if (!user.isVerified) {
        sendError(res, CustomStatusCodes.ACCOUNT_NOT_VERIFIED, 'User is not verified.');
        return;
      }

      if (!user.isApprove) {
        sendError(res, CustomStatusCodes.BAD_REQUEST, 'Your account is pending admin approval.');
        return;
      }
      await AuthServer.updateLastLogin(user._id);
      const token = await AuthServer.generateToken(user as IExtendedUser);
      const refreshToken = await AuthServer.generateRefreshToken(user as IExtendedUser);
      logger.info(`User logged in: ${email}`);

      sendResponse(res, CustomStatusCodes.OK, true, 'User Login successfully', {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      const verify =await AuthServer.verifyToken(refreshToken, config.refreshTokenSecret);
      if (!verify) {
        sendError(res, CustomStatusCodes.REFRESH_TOKEN_EXPIRED, 'Token Expired.');
        return;
      }

      logger.warn(`verify token: ${verify}`);
      const user = await UserModel.findOne({ refreshToken: refreshToken });
      if (!user) {
        sendError(res, CustomStatusCodes.NO_REFRESH_TOKEN, 'User not found with this token.');
        return;
      }

      const accessToken = await AuthServer.generateToken(user as IExtendedUser);
      const newRefreshToken = await AuthServer.generateRefreshToken(user as IExtendedUser);

      user.refreshToken = newRefreshToken;
      await user.save({ validateBeforeSave: false });

      logger.info(`User logged in: ${user.email}`);

      sendResponse(res, CustomStatusCodes.OK, true, 'User Login successfully', {
        token: accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      logger.error('Error: ', (error as Error).message);

      next(error);
    }
  }

  static async sendEmailWhileForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      const user = (await AuthServer.findUserEmail(email)) as IExtendedUser;

      if (!user) {
        sendError(res, CustomStatusCodes.NOT_FOUND, `User not found by ${email} email.`);
        return;
      }

      if (user.role !== EUserRole.ADMIN) {
        sendError(res, CustomStatusCodes.NOT_FOUND, 'Sorry you are not an admin.');
        return;
      }

      const numericPassword = Math.floor(Math.random() * 99999999);
      user.password = numericPassword.toString();
      await user.save();

      logger.info(`Email re send to user: ${email}`);

      sendResponse(
        res,
        CustomStatusCodes.OK,
        true,
        'An email has been send to your email. Please check your email.'
      );
    } catch (error) {
      next(error);
    }
  }
}
