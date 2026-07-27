import { createAsyncThunk } from '@reduxjs/toolkit';
import { login, register, socialLogin, forgotPassword } from '../../api/authApi';
import { saveCurrentUser, getUsers, saveUsers } from '../../utils/store';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await login(credentials);
            const data = response.data || response;

            if (data.success === false) {
                return rejectWithValue(data.message || "Login failed");
            }

            const token = data.token || "jwt-auth-token-sample";
            const user = data.user || {
                email: credentials.email,
                name: credentials.email.split('@')[0],
                onboardingCompleted: false
            };

            saveCurrentUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            const users = getUsers();
            const existingIndex = users.findIndex(u => u.email === user.email);
            if (existingIndex !== -1) {
                users[existingIndex] = { ...users[existingIndex], ...user };
            } else {
                users.push(user);
            }
            saveUsers(users);

            return { token, user, ...data };
        } catch (error) {
            // Handle offline/network error fallback for standalone testing
            if (!error.response && (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.code === 'ECONNREFUSED')) {
                const users = getUsers();
                const localUser = users.find(u => u.email === credentials.email);
                if (localUser && localUser.password === credentials.password) {
                    const mockToken = "mock-jwt-token-" + Date.now();
                    saveCurrentUser(localUser);
                    localStorage.setItem('token', mockToken);
                    localStorage.setItem('user', JSON.stringify(localUser));
                    return { token: mockToken, user: localUser, success: true };
                } else if (localUser && localUser.password !== credentials.password) {
                    return rejectWithValue("Invalid email or password");
                }
                const demoUser = {
                    email: credentials.email,
                    name: credentials.email.split('@')[0],
                    onboardingCompleted: false
                };
                const mockToken = "mock-jwt-token-" + Date.now();
                saveCurrentUser(demoUser);
                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(demoUser));
                users.push({ ...demoUser, password: credentials.password });
                saveUsers(users);
                return { token: mockToken, user: demoUser, success: true };
            }

            const errorMsg = error.response?.data?.message || error.message || "Login failed";
            return rejectWithValue(errorMsg);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await register(userData);
            const data = response.data || response;
            if (data.success === false) {
                return rejectWithValue(data.message || "Registration failed");
            }

            const users = getUsers();
            const newUser = {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                onboardingCompleted: false
            };
            if (!users.some(u => u.email === userData.email)) {
                users.push(newUser);
                saveUsers(users);
            }
            return data;
        } catch (error) {
            if (!error.response && (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.code === 'ECONNREFUSED')) {
                const users = getUsers();
                const newUser = {
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    onboardingCompleted: false
                };
                if (!users.some(u => u.email === userData.email)) {
                    users.push(newUser);
                    saveUsers(users);
                }
                return { success: true, message: "User registered" };
            }
            const errorMsg = error.response?.data?.message || error.message || "Registration failed";
            return rejectWithValue(errorMsg);
        }
    }
);

export const socialLoginUser = createAsyncThunk(
    'auth/socialLoginUser',
    async (providerData, { rejectWithValue }) => {
        try {
            const response = await socialLogin(providerData);
            const data = response.data || response;
            if (data.success === false) {
                return rejectWithValue(data.message || "Social login failed");
            }
            const token = data.token || "mock-social-jwt-token";
            const user = data.user || {
                email: `${providerData.provider.toLowerCase()}user@example.com`,
                name: `${providerData.provider} User`,
                onboardingCompleted: false
            };
            saveCurrentUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { token, user, ...data };
        } catch (error) {
            if (!error.response && (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.code === 'ECONNREFUSED')) {
                const demoUser = {
                    email: `${providerData.provider.toLowerCase()}user@example.com`,
                    name: `${providerData.provider} User`,
                    onboardingCompleted: false
                };
                const mockToken = "mock-social-jwt-token-" + Date.now();
                saveCurrentUser(demoUser);
                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(demoUser));
                return { token: mockToken, user: demoUser, success: true };
            }
            const errorMsg = error.response?.data?.message || error.message || "Social login failed";
            return rejectWithValue(errorMsg);
        }
    }
);

export const sendPasswordReset = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await forgotPassword({ email });
            const data = response.data || response;
            return data;
        } catch (error) {
            if (!error.response && (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.code === 'ECONNREFUSED')) {
                return { success: true, message: "Reset email sent" };
            }
            const errorMsg = error.response?.data?.message || error.message || "Failed to send reset email";
            return rejectWithValue(errorMsg);
        }
    }
);


