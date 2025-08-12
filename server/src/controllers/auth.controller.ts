import { Request, Response, NextFunction } from 'express';
import { AuthServer } from '../services/authService';
import { sendError, sendResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { emailService } from '../services/emailSevice';

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
      const verificationToken = await AuthServer.createVerifyToken(user._id, email);
      emailService.sendVerifyEmail(`${firstName} ${lastName}`, email, verificationToken);

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
            password: user.password,
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
      logger.info('CHECK EMAIL', email);
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

      await AuthServer.updateLastLogin(user._id);
      const token = AuthServer.generateToken(user);

      logger.info(`User logged in: ${email}`);

      sendResponse(res, 200, true, 'User Login successfully', {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
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
      const verificationToken = await AuthServer.createVerifyToken(user._id, email);
      emailService.sendVerifyEmail(`${user.firstName} ${user.lastName}`, email, verificationToken);

      logger.info(`New user registered: ${email}`);

      sendResponse(res, 200, true, 'Email resend to your email for verify.', null);
    } catch (error) {
      next(error);
    }
  }

  // static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const { token } = req.body;

  //     const user = await AuthServer.findUserEmail(email);
  //     if (!user) {
  //       sendError(res, 404, 'User not found with this email.');
  //       return;
  //     }
  //     const verificationToken = await AuthServer.createVerifyToken(user._id, email);
  //     emailService.sendVerifyEmail(`${user.firstName} ${user.lastName}`, email, verificationToken);

  //     logger.info(`New user registered: ${email}`);

  //     sendResponse(res, 200, true, 'Email resend to your email for verify.', null);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
