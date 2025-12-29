import { Router } from 'express';
import { Dependencies } from '@application/use-cases/CreateUserUseCase';
import { createUserController } from '../controllers/UserController';

export const userRoute = (deps: Dependencies): Router => {
  const router = Router();
  const controller = createUserController(deps);

  router.get('/users/:id', controller.getUser);
  router.post('/users', controller.createUser);

  return router;
}

