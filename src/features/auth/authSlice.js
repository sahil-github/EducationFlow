import { createSlice } from "@reduxjs/toolkit";
import {
    loginUser,
    registerUser,
    socialLoginUser,
    sendPasswordReset,
} from "./authThunks";
import { clearCurrentUser } from "../../utils/storage";

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

const initialState = {
    user: safeParseJSON("user"),
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    // Separate loading state for the forgot-password flow so it doesn't
    // conflict with the main auth loading spinner.
    resetLoading: false,
    resetError: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            state.resetError = null;
            clearCurrentUser(); // clears localStorage token + user keys
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
         * Also keeps localStorage in sync so page refreshes don't lose the
         * updated user object.
         */
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            // Sync to localStorage so the authSlice initialState picks it up
            // on a page reload.
            localStorage.setItem("user", JSON.stringify(state.user));
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
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
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
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
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
            })
            .addCase(socialLoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
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
            });
    },
});

export const { logout, clearError, clearResetError, updateUser } =
    authSlice.actions;
export default authSlice.reducer;
