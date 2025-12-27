const API_URL = process.env.API_URL || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
