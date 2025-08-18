import { Request, Response, NextFunction } from 'express';
import { AuthServer } from '../services/authService';
import { sendError, sendResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { emailService } from '../services/emailSevice';
import { User } from '../models/user.model';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email, password } = req.body;

      const existingUser = await AuthServer.findUserEmail(email);
      if (existingUser) {
        sendError(res, 400, 'User already exists with this email.');
        return;
      }

      const user = await AuthServer.createUser({
        firstName,
        lastName,
        email,
        password,
      });

      const token = AuthServer.generateToken(user);
      await AuthServer.generateRefreshToken(user);
      const verificationToken = await AuthServer.createVerifyToken(user._id, email);
      // emailService.sendVerifyEmail(`${firstName} ${lastName}`, email, verificationToken);

      logger.info(`New user registered: ${email}`);

      sendResponse(
        res,
        200,
        true,
        'User register successfully and email send to your email for verify.',
        {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          token,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await AuthServer.findUserEmail(email);
      if (!user) {
        sendError(res, 401, 'Invalid credentials');
        return;
      }

      const comparePassword = user.comparePassword(password);
      if (!comparePassword) {
        sendError(res, 401, 'Invalid password');
        return;
      }

      if (!user.isVerified) {
        sendError(res, 401, 'User is not verified.');
        return;
      }

      await AuthServer.updateLastLogin(user._id);
      const token = AuthServer.generateToken(user);
      await AuthServer.generateRefreshToken(user);
      logger.info(`User logged in: ${email}`);

      sendResponse(res, 200, true, 'User Login successfully', {
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
        sendError(res, 404, 'User not found with this email.');
        return;
      }
      if (user.isVerified) {
        sendError(res, 404, 'User already verified.');
        return;
      }
      const verificationToken = await AuthServer.createVerifyToken(user._id, email);

      emailService.sendVerifyEmail(`${user.firstName} ${user.lastName}`, email, verificationToken);

      logger.info(`Email re send to user: ${email}`);

      sendResponse(res, 200, true, 'Email resend to your email for verify.', null);
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;

      const obj = await AuthServer.decryptToken(token);
      if (!obj?.email) {
        sendError(res, 401, 'Invalid token or token expire');
        return;
      }
      const find = await AuthServer.findUserEmail(obj.email);
      if (!find) {
        sendError(res, 401, 'Invalid credentials');
        return;
      }
      if (find.isVerified) {
        sendError(res, 404, 'User already verified.');
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

      sendResponse(res, 200, true, 'Use verify successfully.', user);
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
        sendError(res, 404, `User not found by ${email} email.`);
        return;
      }

      if (!user.isVerified) {
        sendError(res, 401, `User is not verified.`);
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
        200,
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
        sendError(res, 401, 'Invalid token or token expire');
        return;
      }
      const find = await AuthServer.findUserEmail(obj.email);
      if (!find) {
        sendError(res, 401, 'Invalid credentials');
        return;
      }
      if (!find.isVerified) {
        sendError(res, 404, 'User not verified.');
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

      sendResponse(res, 200, true, 'Forgot password link successfully verified.', {
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
      //// verificationTokenExpiry: null,
      const { oldPassword, newPassword, email } = req.body;
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        sendError(res, 400, 'Some thing went wrong.');
        return;
      }
      const isVerified = AuthServer.verifyToken(token);
      if (!isVerified) {
        sendError(res, 400, 'Link is expired.');
        return;
      }

      const find = await User.findOne({ email: email, verificationToken: token });

      if (!find) {
        sendError(res, 401, 'Link is expired.');
        return;
      }
      find.password = newPassword;
      find.save();

      logger.info(`User password update successfully.: ${email}`);

      sendResponse(res, 200, true, 'Forgot password link successfully verified.', {
        find,
      });
    } catch (error) {
      next(error);
    }
  }
}
