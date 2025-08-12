import { Response } from 'express';
import { ApiResponse } from '../types';
import { StatusCodes } from 'http-status-codes';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T
): Response => {
  const sCode = statusCode >= 200 && statusCode <= 299 ? 'INFO' : 'WARN';
  const response: ApiResponse<T> = {
    code: statusCode,
    status: StatusCodes[statusCode],
    success,
    message: { type: sCode, text: message },
    ...(data && { data }),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: string
): Response => {
    const sCode = statusCode >= 200 && statusCode <= 299 ? 'INFO' : 'WARN';
  const response: ApiResponse = {
    code: statusCode,
    status: StatusCodes[statusCode],
    success: false,
    message: { type: sCode, text: message },
    ...(error && { error }),
  };

  return res.status(statusCode).json(response);
};
