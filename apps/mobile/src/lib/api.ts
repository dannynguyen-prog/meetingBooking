import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000'
});

api.interceptors.request.use((config) => {
  if (globalThis.AdminToken) {
    config.headers.Authorization = `Bearer ${globalThis.AdminToken}`;
  }
  return config;
});

declare global {
  // eslint-disable-next-line no-var
  var AdminToken: string | undefined;
}
