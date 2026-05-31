import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface User {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  wants: string[];
  contact: string;
}

export interface SkillRequest {
  _id: string;
  from: User;
  to: User;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/login', data),
};

export const usersAPI = {
  getAll: (params?: { skill?: string; wants?: string }) =>
    api.get<User[]>('/users', { params }),
  getById: (id: string) =>
    api.get<User>(`/users/${id}`),
  updateProfile: (data: Partial<Pick<User, 'name' | 'skills' | 'wants' | 'contact'>>) =>
    api.put<User>('/users/profile', data),
};

export const requestsAPI = {
  send: (data: { to: string; message: string }) =>
    api.post<SkillRequest>('/requests', data),
  getAll: () =>
    api.get<SkillRequest[]>('/requests'),
  updateStatus: (id: string, status: 'accepted' | 'rejected') =>
    api.put<SkillRequest>(`/requests/${id}`, { status }),
};
