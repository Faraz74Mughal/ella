import { Request, Response, NextFunction } from 'express';
import { AuthServer } from '../services/authService';
import { sendError, sendResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { emailService } from '../services/emailSevice';
import { UserModel } from '../models/user.model';
import { IExtendedUser } from '../interface/userInterface';
import CustomStatusCodes from '../utils/custom-status-code';
import config from '../config/config';
import axios from 'axios';

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
      const hrf = `http://localhost:5173/verify-user?token=${verificationToken}`;
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
      const user: IExtendedUser = (await AuthServer.findUserEmail(email)) as IExtendedUser;
      if (!user) {
        sendError(res, CustomStatusCodes.NOT_FOUND, 'Invalid credentials');
        return;
      }

      if (!user.password) {
        sendError(res, CustomStatusCodes.BAD_REQUEST, 'Invalid password');
        return;
      }
      const comparePassword = user.comparePassword(password);
      console.log('CHEC', comparePassword);

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

  static async googleSignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { given_name, family_name, picture, email, role } = req.body;
      let user = await AuthServer.findUserEmail(email);
      if (!user) {
        user = await AuthServer.createUser({
          firstName: given_name,
          lastName: family_name,
          email,
          profilePicture: picture,
          isVerified: true,
          role: role || 'student',
        });
      }

      if (!user) {
        sendError(res, CustomStatusCodes.BAD_REQUEST, 'Singing in with google is failed.');
        return;
      }

      if (user?.role !== role) {
        sendError(res, CustomStatusCodes.UNAUTHORIZED, 'User is unauthorized.');
        return;
      }
      await AuthServer.updateLastLogin(user?._id);

      const token = await AuthServer.generateToken(user as IExtendedUser);
      const refreshToken = await AuthServer.generateRefreshToken(user as IExtendedUser);
      logger.info(`User logged in: ${email}`);

      sendResponse(res, CustomStatusCodes.OK, true, 'User Login successfully', {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: true,
        },
        token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async facebookSignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;

      let user = await AuthServer.findUserEmail(body.email);
      if (!user) {
        user = await AuthServer.createUser({
          ...body,
        });
      }

      if (!user) {
        sendError(res, CustomStatusCodes.BAD_REQUEST, 'Singing in with google is failed.');
        return;
      }

      if (user?.role !== body.role) {
        sendError(res, CustomStatusCodes.UNAUTHORIZED, 'User is unauthorized.');
        return;
      }
      await AuthServer.updateLastLogin(user?._id);

      const token = await AuthServer.generateToken(user as IExtendedUser);
      const refreshToken = await AuthServer.generateRefreshToken(user as IExtendedUser);
      logger.info(`User logged in: ${body.email}`);

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

  static async githubTokenExchange(req: Request, res: Response, next: NextFunction) {
    const { code } = req.body;
    if (!code) {
      sendError(res, CustomStatusCodes.BAD_REQUEST, 'Authorization code is required');
      return;
    }

    try {
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: config.githubAuthId,
          client_secret: config.githubAuthClientSecret,
          code: code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const { access_token, error } = tokenResponse.data;
      if (error) {
        sendError(res, CustomStatusCodes.BAD_REQUEST, tokenResponse.data.error_description);
        return;
      }

      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });

      sendResponse(
        res,
        CustomStatusCodes.OK,
        true,
        'Github data fetch successfully',
        userResponse.data
      );
    } catch (error) {}
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      logger.error('REF', refreshToken);

      const verify = AuthServer.verifyToken(refreshToken, config.refreshTokenSecret);
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
      console.log('ERRs', error);

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
      const hrf = `http://localhost:5173/verify-user?token=${verificationToken}`;
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
      const user = await UserModel.findOneAndUpdate(
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
      const user = await UserModel.findOneAndUpdate(
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
      const isVerified = AuthServer.verifyToken(token, config.verifyTokenSecret);
      if (!isVerified) {
        sendError(res, CustomStatusCodes.BAD_REQUEST, 'Link is expired.');
        return;
      }

      const find = await UserModel.findOne({ email: email, verificationToken: token });

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
