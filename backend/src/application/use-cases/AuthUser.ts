import { IUserRepository } from "@domain/repositories/IUserRepository";
import { HashService } from "@domain/services/hash.service";
import { TokenService } from "@domain/services/token.service";
import { Result , ok , err} from "@domain/shared/Result";
import { UserLoginDTO } from "@application/dtos/UserDTO";
import { logger } from "@infrastructure/logger/logger";
import { log } from "console";

export type Dependencies = {
  repo: IUserRepository;
  hasher: HashService;
  tokener: TokenService;
};

type AuthError = {
    readonly type : 'NoValidCredentials'
    readonly reason : string;
}

export const authUser = async (
    userData : UserLoginDTO,
    deps : Dependencies): Promise<Result<string,AuthError>> => {
        const {repo, hasher ,tokener} = deps;
        const user = await repo.findByEmail(userData.email);
        if (!user || !user.password) {
            logger.debug('User not found or missing password', { email: userData.email });
            return err({ type: 'NoValidCredentials', reason: 'Email or password are incorrect' });
        }
        logger.debug('User password', { password: user.password });
        const verifyPassword = await hasher.compare(userData.password, user.password);
        if(!verifyPassword){
            logger.debug('Password verification failed', { email: userData.email });
            return err({ type: 'NoValidCredentials', reason: 'Email or password are incorrect' });
        }
        const token = await tokener.generateToken({ userId: user.id, email: user.email });
        return ok(token);
    }



