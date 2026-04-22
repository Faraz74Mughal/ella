import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user was populated by verifyJWT middleware
    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user.role)) {
      throw new ApiError(
        403, 
        `Role (${user.role}) is not allowed to access this resource`
      );
    }

    next();
  };
};