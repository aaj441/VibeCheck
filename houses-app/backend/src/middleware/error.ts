import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err as AppError;
  
  // Default values for non-AppError errors
  if (!(err instanceof AppError)) {
    error = new AppError(err.message || 'Internal Server Error', 500, false);
    error.stack = err.stack;
  }
  
  // Log error
  logger.error({
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack,
    isOperational: error.isOperational,
  });
  
  // Send error response
  res.status(error.statusCode).json({
    status: 'error',
    message: error.isOperational ? error.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  const error = new AppError('Resource not found', 404);
  next(error);
};