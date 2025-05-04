import axios from 'axios';
import { API_URL } from '../constants/apiConstants';

const api = axios.create({
  baseURL: API_URL, 
});

api.interceptors.request.use(
  (config) => {
    if(config.url==='/admin/login'){
      return config;
    }
    const token = localStorage.getItem('token');
    if (token!=="") {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && error.config.url !== '/admin/login') {
      window.location.href = '/?expired=true';
    }
    if(error.response?.data.message==="jwt expired"){
        localStorage.removeItem('token');
        window.location.href = '/?expired=true';
    }
    return Promise.reject(error);
  }
);

export default api;