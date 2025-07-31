import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';

const api = axios.create({
  baseURL: '/api',   // for local run + production on server!
    // baseURL: 'https://bakery-crew-be.onrender.com/api'  // for production
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === 'object' &&
      !Array.isArray(response.data)
    ) {
      return {
        ...response,
        data: camelcaseKeys(response.data, { deep: true }),
      };
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
