import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  updateUser: (userData) => api.put('/auth/me', userData),
};

// Certification API
export const certificationAPI = {
  createRequest: (data, files) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    files.forEach(file => {
      formData.append('media', file);
    });
    return api.post('/certification/request', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getRequestDetails: (requestId) => api.get(`/certification/${requestId}`),
  getFarmerRequests: () => api.get('/certification/farmer/requests'),
  getInspectionRequests: () => api.get('/certification/inspection/requests'),
  inspectRequest: (requestId, approved) => 
    api.post(`/certification/inspect/${requestId}`, { approved }),
  issueCertificate: (requestId) => 
    api.post(`/certification/certify/${requestId}`),
  revertRequest: (requestId) => 
    api.post(`/certification/revert/${requestId}`),
};

// Media API
export const mediaAPI = {
  uploadMedia: (file, requestId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('requestId', requestId);
    return api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getMediaByRequest: (requestId) => api.get(`/media/request/${requestId}`),
  deleteMedia: (mediaId) => api.delete(`/media/${mediaId}`),
  updateMedia: (mediaId, data) => api.put(`/media/${mediaId}`, data),
};

export default api; 