import axios from 'axios'
import config from '../config'
const baseUrl = config.reactApiUrl;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') ?? null;
  if (token) {
    // console.info('👍');
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
},
  (error) => {
    // console.info('👎');
    return Promise.reject(error);
  }
);

export default api;
