import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const endpoints = {
  dashboard: '/companies',
  companies: '/companies',
  companyAdmins: (companyId: string) => `/companies/${companyId}/admins`,
  meetingRooms: '/meeting-rooms',
  employees: '/employees',
  meetings: '/meetings',
  availableRooms: '/meetings/available-rooms',
  authLogin: '/auth/login'
};

export default api;
