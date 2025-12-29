import type { NextFunction, Request, Response } from 'express';
import { logger } from '@infrastructure/logger/logger';

export const errorHandlerMiddleware = () => {
  return (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
    const requestId = req.header('x-request-id');

    const error = err instanceof Error ? err : new Error('Unknown error');

    logger.error('Unhandled error', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    });

    if (res.headersSent) return;

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      requestId,
    });
  };
};
