import axios from "axios";

export const BASE_URL = 'http://localhost:4000';

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(config => {
  if (config.headers) {
    
  }
  return config;
}, error => {
  return Promise.reject(error);
});

instance.interceptors.response.use(response => {
  const { data, config } = response;

  return data;
}, error => {
  return Promise.reject(error);
});

export default instance;