import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, socialLogin, forgotPassword } from "../../api/api";
import {
    saveCurrentUser,
    upsertUser,
    mergeLocalOnboardingData,
} from "../../utils/storage";

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

            const rawUser = data?.user;
            if (!rawUser) {
                return rejectWithValue("Authentication failed: no user data received from server.");
            }

            // The backend has no onboarding API, so its login response does NOT
            // include onboardingCompleted, interests, learningGoal, skills, etc.
            // mergeLocalOnboardingData() looks up this email in the local users[]
            // array and re-applies any onboarding fields that were saved there,
            // so they are never lost across a logout → login cycle.
            const user = mergeLocalOnboardingData(rawUser);

            // Persist the enriched user object (auth + onboarding fields together)
            saveCurrentUser(user);
            localStorage.setItem("token", token);

            return { token, user };
        } catch (error) {
            // Special case: 404 means no account exists for this email.
            // Return a typed error object so login.jsx can branch on it
            // explicitly without fragile string matching — the user must be
            // redirected to signup, NOT silently authenticated.
            if (error.response?.status === 404) {
                return rejectWithValue({
                    type: "USER_NOT_FOUND",
                    message:
                        error.response.data?.message ||
                        "No account exists with this email. Please sign up first.",
                });
            }
            // Network failures, timeouts, and all other server errors reject —
            // no offline fallback, no mock tokens, no silent success.
            return rejectWithValue(extractErrorMessage(error, "Login failed."));
        }
    }
);


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

            // Seed the local users[] array entry for this new user so that
            // mergeLocalOnboardingData() can find them on future logins.
            // Without this upsert, onboarding data saved during the pipeline
            // has nowhere persistent to live and would be lost on re-login.
            upsertUser(user);

            return { token, user };
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Registration failed."));
        }
    }
);


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

            const rawUser = data?.user;
            if (!rawUser) {
                return rejectWithValue("Social login failed: no user data received from server.");
            }

            // Same merge strategy as loginUser — restore any locally-stored
            // onboarding data that the backend doesn't know about yet.
            const user = mergeLocalOnboardingData(rawUser);

            // Persist session
            saveCurrentUser(user);
            localStorage.setItem("token", token);

            // Ensure this social user has an entry in users[] so onboarding
            // data written during the pipeline can be merged back on next login.
            upsertUser(user);

            return { token, user };
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Social login failed."));
        }
    }
);


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

