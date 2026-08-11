export const apiConfig = {
  baseUrl: import.meta.env.VITE_SDMS_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  retryCount: 2,
  retryDelay: 1000,
};
