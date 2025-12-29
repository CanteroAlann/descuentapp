import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { userRoute } from './interface-adapters/routes/user.route';
import { UserRepositoryPrisma } from '@infrastructure/repositories/UserRepository.prisma';
import { createHashService } from '@infrastructure/services/hasher';
import { logger } from '@infrastructure/logger/logger';
import { requestLoggerMiddleware } from '@interface-adapters/middlewares/requestLogger.middleware';
import { errorHandlerMiddleware } from '@interface-adapters/middlewares/errorHandler.middleware';
import { authRoute } from '@interface-adapters/routes/auth.route';
import { createJwtTokener } from '@infrastructure/services/tokenizer';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLoggerMiddleware());

app.use(userRoute({ repo: UserRepositoryPrisma(), hasher: createHashService() }));
app.use(authRoute({ repo: UserRepositoryPrisma(), hasher: createHashService(), tokener: createJwtTokener() }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'DescuentApp API - Clean Architecture & DDD' });
});

app.use(errorHandlerMiddleware());

// Start server
app.listen(PORT, () => {
  logger.info('Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
  });
});

export default app;
