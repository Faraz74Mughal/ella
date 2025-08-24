import { Response } from 'express';
import { ApiResponse } from '../types';
// import { StatusCodes } from 'http-status-codes';
import  CustomStatusCodes, { getStatusCodeKey, getStatusText } from './custom-status-code';

export const sendResponse = <T>(
  res: Response,
  statusCode: number | keyof typeof CustomStatusCodes,
  success: boolean,
  message: string,
  data?: T
): Response => {
  const sCode = statusCode as number >= 200 && statusCode as number <= 299 ? 'INFO' : 'WARN';
  const response: ApiResponse<T> = {
    code: statusCode as number,
    status: (CustomStatusCodes[statusCode as keyof typeof CustomStatusCodes]||"").toString(), 
    success,
    message: { type: sCode, text: message },
    ...(data && { data }),
  };
  return res.status(statusCode as number).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number ,
  message: string,
  error?: string
): Response => {
    const sCode = statusCode as number >= 200 && statusCode as number <= 299 ? 'INsFO' : 'WARN';
    
  const response: ApiResponse = {
    code: statusCode as number,
    status:getStatusCodeKey(statusCode), 
    success: false,
    message: { type: sCode, text: message },
    ...(error && { error }),
  };

  return res.status(statusCode as number).json(response);
};
