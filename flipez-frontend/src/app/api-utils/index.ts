'use client';

import axios from 'axios';
import { toast } from 'react-hot-toast';  // Import toast for notifications

export const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: false
});

const getTokenFromCookie = (): string | null => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      
      if (cookie.startsWith('token=')) {
        return cookie.substring('token='.length);
      }
    }
  }
  
  return null;
};

apiInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = getTokenFromCookie();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;
    if (response) {
      if (response.status === 401) {
        toast.error('Session expired. Redirecting to login...');
      } else {
        toast.error(response?.data?.error || response?.data?.message || 'An error occurred. Please try again.');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject();
  }
);

