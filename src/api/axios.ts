import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';

const api = axios.create({
  baseURL: 'https://bakery-crew-be.onrender.com/api'
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
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
