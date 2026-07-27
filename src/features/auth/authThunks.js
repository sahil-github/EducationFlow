import { createAsyncThunk } from '@reduxjs/toolkit';
import { login, register, socialLogin, forgotPassword } from '../../api/authApi';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await login(credentials);
            if (!response.data.success) {
                return rejectWithValue(response.data.message || "Login failed");
            }
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("An unexpected error occurred");
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await register(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

export const socialLoginUser = createAsyncThunk(
    'auth/socialLoginUser',
    async (providerData, { rejectWithValue }) => {
        try {
            const response = await socialLogin(providerData);
            if (!response.data.success) {
                return rejectWithValue(response.data.message || "Social login failed");
            }
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Social login failed");
        }
    }
);

export const sendPasswordReset = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await forgotPassword({ email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to send reset email");
        }
    }
);
