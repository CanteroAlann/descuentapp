import type { NextFunction, Request, Response } from 'express';
import { logger } from '@infrastructure/logger/logger';

const getDurationMs = (startNs: bigint): number => {
  const diffNs = process.hrtime.bigint() - startNs;
  return Number(diffNs) / 1_000_000;
};

export const requestLoggerMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const start = process.hrtime.bigint();
    const requestId = req.header('x-request-id');

    let logged = false;

    const logRequestOnce = () => {
      if (logged) return;
      logged = true;

      const durationMs = Math.round(getDurationMs(start) * 100) / 100;
      const statusCode = res.statusCode;

      const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

      logger.log({
        level,
        message: 'HTTP',
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode,
        durationMs,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        contentLength: res.getHeader('content-length'),
      });
    };

    res.on('finish', logRequestOnce);
    res.on('close', logRequestOnce);

    next();
  };
};
