import axios from "axios";
import { clearCurrentUser } from "../utils/storage"; // canonical path (not the deprecated utils/store shim)

// ---------------------------------------------------------------------------
// Axios instance — single shared client for the entire app.
// All API calls MUST use this instance so interceptors apply everywhere.
// ---------------------------------------------------------------------------
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error(
        "[EducationFlow] VITE_API_BASE_URL is not set.\n" +
        "• Local dev: add it to your .env file (e.g. VITE_API_BASE_URL=http://localhost:5000)\n" +
        "• Render deployment: set it in the Render dashboard → Service → Environment tab."
    );
}

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds — prevents indefinite UI freezes on slow/dead servers
    headers: {
        "Content-Type": "application/json",
    },
});

// ---------------------------------------------------------------------------
// Request Interceptor — attach JWT Bearer token to every outgoing request.
// Token is read from localStorage (kept in sync by authSlice on login/logout).
// ---------------------------------------------------------------------------
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response Interceptor
//   401 → clear session & redirect to /login (hard redirect is intentional
//         here because the interceptor runs outside React; a full reload also
//         clears any stale in-memory state).
//   Other errors → pass through so individual thunks can handle them.
// ---------------------------------------------------------------------------
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearCurrentUser();
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// ---------------------------------------------------------------------------
// Auth API — all endpoints relative to API_BASE_URL
// ---------------------------------------------------------------------------
export const authApi = {
    login: (credentials) =>
        api.post("/api/auth/login", {
            email: credentials.email,
            password: credentials.password,
        }),

    register: (data) =>
        api.post("/api/auth/register", {
            name: data.name || data.fullName || "",
            email: data.email,
            password: data.password,
        }),

    forgotPassword: (email) =>
        api.post("/api/auth/forgot-password", { email }),

    socialLogin: (data) =>
        api.post("/api/auth/social-login", {
            provider: data.provider,
            providerToken: data.providerToken,
        }),
};

// ---------------------------------------------------------------------------
// Course API (re-exported from standalone courseApi.js)
// ---------------------------------------------------------------------------
export { courseApi, default as CourseApi } from "./courseApi";


// ---------------------------------------------------------------------------
// Named exports — imported directly by authThunks.js
// ---------------------------------------------------------------------------
export const { login, register, forgotPassword, socialLogin } = authApi;

export default api;