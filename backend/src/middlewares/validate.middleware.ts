import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validate = (schema: ZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into our field-wise error object
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path.join('.');
          formattedErrors[path] = err.message;
        });

        return next(new ApiError(400, "Validation Error", formattedErrors));
      }
      next(error);
    }
  };