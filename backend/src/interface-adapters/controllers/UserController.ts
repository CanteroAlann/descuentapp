import { Request, Response } from 'express';
import { getUser } from '@application/use-cases/GetUser';
import { Dependencies } from '@application/use-cases/CreateUser';
import { createUser } from '@application/use-cases/CreateUser';
import { logger } from '@infrastructure/logger/logger';

export const createUserController = (deps: Dependencies) => {
  return {
    getUser: async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const result = await getUser(id, deps.repo);

      if (!result.ok) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.value,
      });
    },
    createUser: async (req: Request, res: Response): Promise<void> => {
      const { fullName, email, password } = req.body;
      logger.debug('Creating user', { fullName, email,password });

      const result = await createUser({ fullName, email, password }, deps);

      if (!result.ok) {
        logger.debug('User creation failed', { reason: result.error.reason });
        res.status(400).json({
          success: result.error.type === 'UserCreationFailed' ? false : undefined,
          message: 'Failed to create user',
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: result.value,
      });
    }
  };
};
