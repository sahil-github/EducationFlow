import axios from "axios";
import { clearCurrentUser } from "../utils/store";

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json"
  }
});


// Request Interceptor: Attach token except for auth endpoints
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Handle 401 unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearCurrentUser();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data, emailArg, passwordArg) => {
    let name, email, password;
    if (typeof data === 'object' && data !== null) {
      name = data.name || data.fullName || '';
      email = data.email || '';
      password = data.password || '';
    } else {
      name = data || '';
      email = emailArg || '';
      password = passwordArg || '';
    }
    return api.post('/api/auth/register', { name, fullName: name, email, password });
  },

  login: (credentials, passwordArg, rememberMeArg = false) => {
    let email, password, rememberMe;
    if (typeof credentials === 'object' && credentials !== null) {
      email = credentials.email || '';
      password = credentials.password || '';
      rememberMe = credentials.rememberMe ?? false;
    } else {
      email = credentials || '';
      password = passwordArg || '';
      rememberMe = rememberMeArg ?? false;
    }
    return api.post('/api/auth/login', { email, password, rememberMe });
  },

  forgotPassword: (data) => {
    const email = typeof data === 'object' && data !== null ? data.email : data;
    return api.post('/api/auth/forgot-password', { email });
  },
  // forgotPassword: (data) => {
  //   const email = typeof data === 'object' && data !== null ? data.email : data;
  //   return api.post('/api/auth/forgot-password', { email });
  // },

  // socialLogin: (data, tokenArg) => {
  //   let provider, providerToken;
  //   if (typeof data === 'object' && data !== null) {
  //     provider = data.provider || '';
  //     providerToken = data.providerToken || '';
  //   } else {
  //     provider = data || '';
  //     providerToken = tokenArg || '';
  //   }
  //   return api.post('/api/auth/social-login', { provider, providerToken });
  // },
  socialLogin: (data, tokenArg) => {
    let provider, providerToken;
    if (typeof data === 'object' && data !== null) {
      provider = data.provider || '';
      providerToken = data.providerToken || '';
    } else {
      provider = data || '';
      providerToken = tokenArg || '';
    }
    return api.post('/api/auth/social-login', { provider, providerToken });
  },
};

export const courseApi = {
  getAll: () => api.get('/api/courses'),
  getById: (id) => api.get(`/api/courses/${id}`),
  create: (title, instructor, duration) =>
    api.post('/api/courses', { title, instructor, duration }),
};

export default api;