import bcrypt from "bcryptjs";
import argon2 from "argon2";
import { HashService } from "@domain/services/hash.service";

function bcryptHashService(rounds = parseInt(process.env.HASH_ROUNDS || "10", 10)): HashService {
  return {
    async hash(plain: string): Promise<string> {
      return bcrypt.hash(plain, rounds);
    },
    async compare(plain: string, hashed: string): Promise<boolean> {
      return bcrypt.compare(plain, hashed);
    },
  };
}


function argon2HashService(): HashService {
  return {
    async hash(plain: string): Promise<string> {
      return argon2.hash(plain, { type: argon2.argon2id });
    },
    async compare(plain: string, hashed: string): Promise<boolean> {
      return argon2.verify(hashed, plain);
    },
  };
}


export function createHashService(): HashService {
  const provider = (process.env.HASH_PROVIDER || "bcrypt").toLowerCase();
  switch (provider) {
    case "argon2":
      return argon2HashService();
    case "bcrypt":
    default:
      return bcryptHashService();
  }
}
