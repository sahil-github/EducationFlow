// src/api/authApi.js
import { authApi } from "./api";

// Re-export individual auth functions for compatibility with existing thunks
export const login = authApi.login;
export const register = authApi.register;
export const forgotPassword = authApi.forgotPassword;
export const socialLogin = authApi.socialLogin;

// Optional default export containing all functions (maintains previous default shape)
export default { login, register, forgotPassword, socialLogin };
