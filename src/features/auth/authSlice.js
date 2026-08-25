import { createSlice } from "@reduxjs/toolkit";
import {
    loginUser,
    registerUser,
    socialLoginUser,
    sendPasswordReset,
} from "./authThunks";
import { clearCurrentUser, saveCurrentUser } from "../../utils/storage";

// ---------------------------------------------------------------------------
// Safe localStorage read — a tampered/malformed value must not crash the app.
// ---------------------------------------------------------------------------
const safeParseJSON = (key) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const token = localStorage.getItem("token") || null;

const initialState = {
    user: safeParseJSON("user"),
    token: token,
    // If no token exists, auth is immediately settled/initialized.
    // If token exists, authInitialized remains false until the profile/session is verified.
    authInitialized: !token,
    loading: false,
    error: null,
    resetLoading: false,
    resetError: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthInitialized: (state, action) => {
            state.authInitialized = action.payload ?? true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.authInitialized = true;
            state.error = null;
            state.resetError = null;
            clearCurrentUser();
        },
        clearError: (state) => {
            state.error = null;
        },
        clearResetError: (state) => {
            state.resetError = null;
        },
        /**
         * Allows onboarding steps to push partial user updates into Redux
         * without a full login round-trip.
         */
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            saveCurrentUser(state.user);
        },
    },
    extraReducers: (builder) => {
        builder
            // ── loginUser ─────────────────────────────────────────────────
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.authInitialized = true;
                saveCurrentUser(action.payload.user);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.authInitialized = true;
            })

            // ── registerUser ───────────────────────────────────────────────
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.authInitialized = true;
                saveCurrentUser(action.payload.user);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.authInitialized = true;
            })

            // ── socialLoginUser ────────────────────────────────────────────
            .addCase(socialLoginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(socialLoginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.authInitialized = true;
                saveCurrentUser(action.payload.user);
            })
            .addCase(socialLoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.authInitialized = true;
            })

            // ── sendPasswordReset ──────────────────────────────────────────
            .addCase(sendPasswordReset.pending, (state) => {
                state.resetLoading = true;
                state.resetError = null;
            })
            .addCase(sendPasswordReset.fulfilled, (state) => {
                state.resetLoading = false;
            })
            .addCase(sendPasswordReset.rejected, (state, action) => {
                state.resetLoading = false;
                state.resetError = action.payload;
            })

            // ── Listen for Profile Thunks to keep auth user & storage in sync ─
            .addCase("profile/completeOnboarding/fulfilled", (state, action) => {
                if (state.user) {
                    state.user = {
                        ...state.user,
                        ...(action.payload || {}),
                        isOnboarded: true,
                        onboardingCompleted: true,
                    };
                    saveCurrentUser(state.user);
                }
            })
            .addCase("profile/getProfile/fulfilled", (state, action) => {
                state.authInitialized = true;
                if (state.user && action.payload) {
                    state.user = {
                        ...state.user,
                        ...action.payload,
                    };
                    saveCurrentUser(state.user);
                }
            })
            .addCase("profile/getProfile/rejected", (state, action) => {
                state.authInitialized = true;
                // If unauthorized/expired token, clear session
                if (action.payload === "Unauthorized" || action.error?.message?.includes("401")) {
                    state.user = null;
                    state.token = null;
                    clearCurrentUser();
                }
            });
    },
});

export const {
    setAuthInitialized,
    logout,
    clearError,
    clearResetError,
    updateUser,
} = authSlice.actions;

export default authSlice.reducer;
