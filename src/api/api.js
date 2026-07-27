// src/api/api.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json"
    }
});

// Request Interceptor: Attach the token to every outgoing request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Catch global 401 Unauthorized errors (expired token)
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error.response?.data || error);
    }
);

export const authApi = {
  register: (fullName, email, password) =>
    api.post('/api/auth/register', { fullName, email, password }),

  login: (email, password, rememberMe = false) =>
    api.post('/api/auth/login', { email, password, rememberMe }),

  forgotPassword: (email) =>
    api.post('/api/auth/forgot-password', { email }),

  socialLogin: (provider, providerToken) =>
    api.post('/api/auth/social-login', { provider, providerToken }),
};

export const courseApi = {
  getAll: () => api.get('/api/courses'),
  getById: (id) => api.get(`/api/courses/${id}`),
  create: (title, instructor, duration) =>
    api.post('/api/courses', { title, instructor, duration }),
};

export default api;