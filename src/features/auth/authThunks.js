import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, socialLogin, forgotPassword } from "../../api/api";
import { saveCurrentUser } from "../../utils/storage";

// ---------------------------------------------------------------------------
// Error normaliser — converts raw Axios errors into user-facing strings.
// Called inside every thunk's catch block.
// ---------------------------------------------------------------------------
const extractErrorMessage = (error, fallback) => {
    // Timeout
    if (error.code === "ECONNABORTED") {
        return "Request timed out. Please try again.";
    }
    // No response received (backend down, no internet, CORS preflight blocked)
    if (!error.response) {
        return "Cannot reach the server. Please check your internet connection.";
    }
    // Server responded with an error status
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
// ---------------------------------------------------------------------------
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await login(credentials);
            const data = response.data;

            // Enforce that the backend MUST return a real token.
            // If no token is returned, authentication fails immediately —
            // we never fall back to fake tokens.
            const token = data?.token;
            if (!token) {
                return rejectWithValue("Authentication failed: no token received from server.");
            }

            const user = data?.user;
            if (!user) {
                return rejectWithValue("Authentication failed: no user data received from server.");
            }

            // Persist session
            saveCurrentUser(user);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            return { token, user };
        } catch (error) {
            // Network failures, timeouts, and server errors all reject — no
            // offline fallback, no mock tokens, no silent success.
            return rejectWithValue(extractErrorMessage(error, "Login failed."));
        }
    }
);

// ---------------------------------------------------------------------------
// registerUser
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

            // Backend may return the full user object; fall back to building
            // a minimal one from the submitted form data if not provided.
            const user = data?.user ?? {
                name: userData.name,
                email: userData.email,
                onboardingCompleted: false,
            };

            // Persist session
            saveCurrentUser(user);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

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

            // Persist session
            saveCurrentUser(user);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

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
            // Network failure is not silently treated as success — the user
            // must know that the reset email was NOT sent.
            return rejectWithValue(extractErrorMessage(error, "Failed to send password reset email."));
        }
    }
);
