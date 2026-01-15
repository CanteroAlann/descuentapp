import type { SignOptions } from "jsonwebtoken";

export const JWT_SECRET: string = process.env.JWT_SECRET || "changeme_local_secret";
export const JWT_EXPIRES_IN: SignOptions["expiresIn"] = "1h";
export const API_URL: string = process.env.API_URL || "http://localhost:3000";