import { Request, Response } from 'express';
import { authUser } from '@application/use-cases/AuthUser';
import { logger } from '@infrastructure/logger/logger';
import { Dependencies } from '@application/use-cases/AuthUser';




export const authUserController = (deps: Dependencies) => {
  return {
    authUser: async (req: Request, res: Response): Promise<void> => {
      const { email, password } = req.body;
      logger.debug('Authenticating user', { email });

      const result = await authUser({ email, password }, deps);

      if (!result.ok) {
        logger.debug('Authentication failed', { reason: result.error.reason });
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      res.status(200).json({
        success: true,
        token: result.value,
      });
    },
  };
}