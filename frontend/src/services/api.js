import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('analytix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

export const projectsAPI = {
  list: (companyId = 1) => api.get(`/projects/?company_id=${companyId}`),
  create: (data) => api.post('/projects/', data),
  update: (projectId, data) => api.put(`/projects/${projectId}`, data),
  delete: (projectId, companyId = 1) => api.delete(`/projects/${projectId}?company_id=${companyId}`),
};

export const queryAPI = {
  runQuery: (question, projectId = 1) => api.post('/query', { question, project_id: projectId }),
  exportExcel: (columns, rows, title = "Analytix AI Hisoboti") => 
    api.post('/reports/export-excel', { columns, rows, title }, { responseType: 'blob' }),
};

export default api;
