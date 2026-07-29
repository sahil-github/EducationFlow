import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, socialLoginUser } from './authThunks';
import { clearCurrentUser } from '../../utils/storage';

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            clearCurrentUser();  // single place for all storage cleanup
        },
        clearError: (state) => {
            state.error = null;
        },
        // Allows onboarding steps (and other consumers) to push partial user
        // updates into Redux without a full login round-trip.
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            // Login User
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

            // Register User — previously only set loading; now correctly
            // updates Redux so showAppNav is true immediately after signup.
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

            // Social Login
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
            });
    }
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
