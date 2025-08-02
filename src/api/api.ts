import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7259/api', // replace with your backend URL
  withCredentials: true, // if your backend uses cookies for auth
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('Token:', token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
