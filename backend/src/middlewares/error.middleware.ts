import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // If the error isn't already our custom ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof Error ? 400 : 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error?.errors || {});
  }

  // Standardized Error Response Formatter
  const response = {
    success: error.success,
    message: error.message,
    data: null,
    errors: error.errors,
    // Only send the stack trace if we are in development mode!
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};