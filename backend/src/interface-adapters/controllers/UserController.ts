
import { Request, Response } from 'express';
import { GetUserUseCase } from '@application/use-cases/GetUserUseCase';

export class UserController {
  constructor(private getUserUseCase: GetUserUseCase) {}

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserUseCase.execute(id);
      
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
