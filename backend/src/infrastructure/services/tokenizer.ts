import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../../config.js";
import  type { TokenService } from "@domain/services/token.service";

export function createJwtTokener(): TokenService {
  return {
    async generateToken(payload: object): Promise<string> {
      return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }, (err, token) => {
          if (err || !token) {
            reject(err || new Error('Failed to generate token'));
          } else {
            resolve(token);
          }
        });
      });
    },
  };
}