// src/services/apiClient.ts
import axios from 'axios';
import supabaseClient from './supabaseClient';

// Improved API URL detection
const getApiUrl = () => {
  // Use environment variable if available
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production, try to use the same domain
  if (window.location.hostname !== 'localhost') {
    return `${window.location.origin}/api`;
  }
  
  // Default to localhost for development
  return 'http://localhost:4000/api';
};

const API_URL = getApiUrl();

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabaseClient.auth.getSession();
  const session = data.session;
  
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;