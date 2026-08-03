import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, socialLogin, forgotPassword } from "../../api/api";
import { saveCurrentUser } from "../../utils/storage";

// ---------------------------------------------------------------------------
// Error normaliser — converts raw Axios errors into user-facing strings.
// Called inside every thunk's catch block.
// ---------------------------------------------------------------------------
const extractErrorMessage = (error, fallback) => {
    if (error.code === "ECONNABORTED") {
        return "Request timed out. Please try again.";
    }
    if (!error.response) {
        return "Cannot reach the server. Please check your internet connection.";
    }
    const status = error.response.status;
    const serverMsg = error.response.data?.message;
    if (status === 400) return serverMsg || "Invalid request. Please check your input.";
    if (status === 401) return serverMsg || "Invalid email or password.";
    if (status === 403) return serverMsg || "You do not have permission to perform this action.";
    if (status === 404) return serverMsg || "Resource not found.";
    if (status === 409) return serverMsg || "An account with this email already exists.";
    if (status >= 500) return "Server error. Please try again later.";
    return serverMsg || error.message || fallback;
};


// ---------------------------------------------------------------------------
// loginUser
// Authenticates with the backend and stores the JWT token.
// Navigation is determined AFTER a subsequent getProfile() call in login.jsx
// which resolves isOnboarded / onboardingStep from the backend.
// ---------------------------------------------------------------------------
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await login(credentials);
            const data = response.data;

            const token = data?.token;
            if (!token) {
                return rejectWithValue("Authentication failed: no token received from server.");
            }

            const user = data?.user;
            if (!user) {
                return rejectWithValue("Authentication failed: no user data received from server.");
            }

            // Persist session credentials. Onboarding data is now stored on the
            // backend; localStorage is no longer the source of truth for it.
            saveCurrentUser(user);
            localStorage.setItem("token", token);

            return { token, user };
        } catch (error) {
            if (error.response?.status === 404) {
                return rejectWithValue({
                    type: "USER_NOT_FOUND",
                    message:
                        error.response.data?.message ||
                        "No account exists with this email. Please sign up first.",
                });
            }
            return rejectWithValue(extractErrorMessage(error, "Login failed."));
        }
    }
);


// ---------------------------------------------------------------------------
// registerUser
// Creates a new account. After registration the user is sent to onboarding;
// isOnboarded will be false on the backend until completeOnboarding() is called.
// ---------------------------------------------------------------------------
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await register(userData);
            const data = response.data;

            const token = data?.token;
            if (!token) {
                return rejectWithValue("Registration failed: no token received from server.");
            }

            const user = data?.user ?? {
                name: userData.name,
                email: userData.email,
                isOnboarded: false,
            };

            saveCurrentUser(user);
            localStorage.setItem("token", token);

            return { token, user };
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Registration failed."));
        }
    }
);


// ---------------------------------------------------------------------------
// socialLoginUser
// ---------------------------------------------------------------------------
export const socialLoginUser = createAsyncThunk(
    "auth/socialLoginUser",
    async (providerData, { rejectWithValue }) => {
        try {
            const response = await socialLogin(providerData);
            const data = response.data;

            const token = data?.token;
            if (!token) {
                return rejectWithValue("Social login failed: no token received from server.");
            }

            const user = data?.user;
            if (!user) {
                return rejectWithValue("Social login failed: no user data received from server.");
            }

            saveCurrentUser(user);
            localStorage.setItem("token", token);

            return { token, user };
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Social login failed."));
        }
    }
);


// ---------------------------------------------------------------------------
// sendPasswordReset
// ---------------------------------------------------------------------------
export const sendPasswordReset = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            const response = await forgotPassword(email);
            return response.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Failed to send password reset email."));
        }
    }
);
