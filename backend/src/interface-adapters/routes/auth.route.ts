import { Router } from 'express';
import { Dependencies } from '@application/use-cases/AuthUser';
import { authUserController } from '../controllers/AuthController';

export const authRoute = (deps: Dependencies): Router => {
  const router = Router();
  const controller = authUserController(deps);

  router.post('/auth/login', controller.authUser);

  return router;
}
