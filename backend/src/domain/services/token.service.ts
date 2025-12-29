export interface TokenService  {
  generateToken(payload: object) : Promise<string>; 
}