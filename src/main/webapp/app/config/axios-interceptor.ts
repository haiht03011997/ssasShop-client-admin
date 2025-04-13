// src/services/axiosInstances.js
import axios from 'axios';
import Cookies from 'js-cookie';

const createAxiosInstance = baseUrl => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: 60 * 1000, // 1 minute
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const onRequestSuccess = config => {
    config.headers['ngrok-skip-browser-warning'] = 'true';
    const token = Cookies.get('authentication-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  const onResponseSuccess = response => response;

  const onResponseError = err => {
    const status = err.response ? err.response.status : null;
    if (status === 403 || status === 401) {
      // Add your unauthenticated handling logic here
      console.log('User is unauthenticated');
    }
    return Promise.reject(err);
  };

  instance.interceptors.request.use(onRequestSuccess);
  instance.interceptors.response.use(onResponseSuccess, onResponseError);

  return instance;
};

export const api = createAxiosInstance(SERVER_API);
