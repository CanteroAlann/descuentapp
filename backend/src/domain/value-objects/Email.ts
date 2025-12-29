import { err, ok, Result } from '@domain/shared/Result';

export type Email = string & { readonly __brand: 'Email' };

export type InvalidEmailError = {
  readonly type: 'InvalidEmail';
  readonly email: string;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const parseEmail = (email: string): Result<Email, InvalidEmailError> => {
  if (!isValidEmail(email)) {
    return err({ type: 'InvalidEmail', email });
  }

  return ok(email as Email);
};

export const emailToString = (email: Email): string => email;
