import axios from 'axios';

// Use your live Hugging Face backend URL
const API_URL = 'https://malik-2025-uniinbox-ai.hf.space';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const auth = {
  register: (data) => api.post('/api/v1/auth/register', data),
  login: (data) => {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    return api.post('/api/v1/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  refresh: (refreshToken) => api.post('/api/v1/auth/refresh', { refresh_token: refreshToken }),
};

// User endpoints
export const users = {
  getMe: () => api.get('/api/v1/users/me'),
  updateMe: (data) => api.put('/api/v1/users/me/update', data),
  getPreferences: () => api.get('/api/v1/users/preferences'),
  updatePreferences: (data) => api.put('/api/v1/users/preferences', data),
};

// Persona endpoints
export const personas = {
  getAll: () => api.get('/api/v1/personas/'),
  getOne: (id) => api.get(`/api/v1/personas/${id}`),
  create: (data) => api.post('/api/v1/personas/', data),
  update: (id, data) => api.put(`/api/v1/personas/${id}`, data),
  delete: (id) => api.delete(`/api/v1/personas/${id}`),
  setDefault: (id) => api.post(`/api/v1/personas/${id}/set-default`),
};

// Onboarding endpoints
export const onboarding = {
  generatePersona: (data) => api.post('/api/v1/onboarding/generate-persona', data),
  savePersona: (data) => api.post('/api/v1/onboarding/save-persona', data),
  getIndustries: () => api.get('/api/v1/onboarding/industries'),
  getIndustryQuestions: (industry) => api.get(`/api/v1/onboarding/industry-questions/${industry}`),
};

// Message endpoints
export const messages = {
  getAll: (params) => api.get('/api/v1/messages/', { params }),
  getOne: (id) => api.get(`/api/v1/messages/${id}`),
  markAsRead: (id) => api.put(`/api/v1/messages/${id}/read`),
  markAsUnread: (id) => api.put(`/api/v1/messages/${id}/unread`),
  toggleFlag: (id) => api.put(`/api/v1/messages/${id}/flag`),
  reply: (id, data) => api.post(`/api/v1/messages/${id}/reply`, data),
  getThread: (threadId) => api.get(`/api/v1/messages/thread/${threadId}`),
};

// Channel endpoints
export const channels = {
  getAll: () => api.get('/api/v1/channels/'),
  getOne: (id) => api.get(`/api/v1/channels/${id}`),
  create: (data) => api.post('/api/v1/channels/', data),
  update: (id, data) => api.put(`/api/v1/channels/${id}`, data),
  delete: (id) => api.delete(`/api/v1/channels/${id}`),
  sync: (id) => api.post(`/api/v1/channels/${id}/sync`),
};

// AI endpoints
export const ai = {
  getSuggestions: (data) => api.post('/api/v1/ai/suggestions', data),
  generateDraft: (data) => api.post('/api/v1/ai/draft', data),
  summarize: (data) => api.post('/api/v1/ai/summarize', data),
};

export default api;
