import { Request, Response, NextFunction } from 'express';
import { AuthServer } from '../services/authService';
import { sendError, sendResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { emailService } from '../services/emailSevice';
import { User } from '../models/user.model';
import { IExtendedUser } from '../types';
import CustomStatusCodes from '../utils/custom-status-code';

export class AuthController {
  static async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email, password } = req.body;

      const existingUser = await AuthServer.findUserEmail(email);
      if (existingUser) {
        sendError(res, CustomStatusCodes.BAD_REQUEST, 'User already exists with this email.');
        return;
      }

      const user = await AuthServer.createUser({
        firstName,
        lastName,
        email,
        password,
      });

      const verificationToken = await AuthServer.createVerifyToken(user._id, email);
      const hrf = `http://localhost:5173/teacher/verify-user?token=${verificationToken}`;
      emailService.sendVerifyEmail(`${firstName} ${lastName}`, email, hrf);

      logger.info(`New user registered: ${email}`);

      sendResponse(
        res,
        CustomStatusCodes.CREATED,
        true,
        'User register successfully and email send to your email for verify.',
        {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        }
      );
    } catch (error) {
      next(error);
    }
  }

  static async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await AuthServer.findUserEmail(email);
      if (!user) {
        sendError(res, CustomStatusCodes.NOT_FOUND, 'Invalid credentials');
        return;
      }

      const comparePassword = user.comparePassword(password);
      if (!comparePassword) {
        sendError(res, CustomStatusCodes.BAD_REQUEST, 'Invalid password');
        return;
      }

      if (!user.isVerified) {
        sendError(res, CustomStatusCodes.ACCOUNT_NOT_VERIFIED, 'User is not verified.');
        return;
      }

      await AuthServer.updateLastLogin(user._id);
      const token = await AuthServer.generateToken(user as IExtendedUser);
      await AuthServer.generateRefreshToken(user as IExtendedUser);
      logger.info(`User logged in: ${email}`);

      sendResponse(res, CustomStatusCodes.OK, true, 'User Login successfully', {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async resendVerifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const user = await AuthServer.findUserEmail(email);
      if (!user) {
        sendError(res, CustomStatusCodes.NOT_FOUND, 'User not found with this email.');
        return;
      }
      if (user.isVerified) {
        sendError(res, CustomStatusCodes.ACCOUNT_ALREADY_VERIFIED, 'User already verified.');
        return;
      }
      const verificationToken = await AuthServer.createVerifyToken(user._id, email);
      const hrf = `http://localhost:5173/teacher/verify-user?token=${verificationToken}`;
      emailService.sendVerifyEmail(`${user.firstName} ${user.lastName}`, email, hrf);

      logger.info(`Email re send to user: ${email}`);

      sendResponse(res, CustomStatusCodes.OK, true, 'Email resend to your email for verify.', null);
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;

      const obj = await AuthServer.decryptToken(token);
      if (!obj?.email) {
        sendError(res, CustomStatusCodes.INVALID_TOKEN, 'Invalid token or token expire');
        return;
      }

      const find = await AuthServer.findUserEmail(obj.email);
      if (!find) {
        sendError(res, CustomStatusCodes.NOT_FOUND, 'Invalid credentials');
        return;
      }
      if (find.isVerified) {
        sendError(res, CustomStatusCodes.ACCOUNT_ALREADY_VERIFIED, 'User already verified.');
        return;
      }
      const user = await User.findOneAndUpdate(
        { email: obj.email },
        {
          $set: {
            isVerified: true,
            verificationToken: '',
            verificationTokenExpiry: null,
          },
        },
        { new: true }
      );

      logger.info(`Use verify successfully.: ${obj.email}`);

      sendResponse(res, CustomStatusCodes.OK, true, 'Use verify successfully.', user);
    } catch (error) {
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

      const user = await AuthServer.findUserEmail(email);

      if (!user) {
        sendError(res, CustomStatusCodes.NOT_FOUND, `User not found by ${email} email.`);
        return;
      }

      if (!user.isVerified) {
        sendError(res, CustomStatusCodes.ACCOUNT_NOT_VERIFIED, `User is not verified.`);
        return;
      }

      const verificationToken = await AuthServer.createVerifyToken(user._id, email);

      emailService.sendForgotPasswordEmail(
        `${user.firstName} ${user.lastName}`,
        email,
        verificationToken
      );

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

  static async verifyForgotPasswordEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.body;

      const obj = await AuthServer.decryptToken(token);
      if (!obj?.email) {
        sendError(res, CustomStatusCodes.INVALID_TOKEN, 'Invalid token or token expire');
        return;
      }
      const find = await AuthServer.findUserEmail(obj.email);
      if (!find) {
        sendError(res, CustomStatusCodes.NOT_FOUND, 'Invalid credentials');
        return;
      }
      if (!find.isVerified) {
        sendError(res, CustomStatusCodes.ACCOUNT_NOT_VERIFIED, 'User not verified.');
        return;
      }
      const user = await User.findOneAndUpdate(
        { email: obj.email },
        {
          $set: {
            verificationToken: '',
          },
        },
        { new: true }
      );

      logger.info(`Use verify successfully.: ${obj.email}`);

      sendResponse(res, CustomStatusCodes.OK, true, 'Forgot password link successfully verified.', {
        email: find.email,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { oldPassword, newPassword, email } = req.body;
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token || token?.trim() == 'null') {
        sendError(res, CustomStatusCodes.NO_TOKEN, 'Some thing went wrong.');
        return;
      }
      const isVerified = AuthServer.verifyToken(token);
      if (!isVerified) {
        sendError(res, CustomStatusCodes.BAD_REQUEST, 'Link is expired.');
        return;
      }

      const find = await User.findOne({ email: email, verificationToken: token });

      if (!find) {
        sendError(res, CustomStatusCodes.BAD_REQUEST, 'Link is expired.');
        return;
      }
      find.password = newPassword;
      find.save();

      logger.info(`User password update successfully.: ${email}`);

      sendResponse(res, CustomStatusCodes.OK, true, 'Forgot password link successfully verified.', {
        find,
      });
    } catch (error) {
      next(error);
    }
  }
}
