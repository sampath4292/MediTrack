import axios from "axios";

// Get the API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Log the API URL for debugging
console.log("🔗 API Base URL:", API_BASE_URL);

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
