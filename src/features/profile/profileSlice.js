import { createSlice } from "@reduxjs/toolkit";
import { updatePersonalInfo, updateSkills, updateGoals, updateInterests, updateAvatar, completeOnboarding, getProfile } from "./profileThunks";



const initialState = {
    user: null,
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updatePersonalInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePersonalInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updatePersonalInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateSkills.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSkills.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateSkills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateGoals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGoals.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateGoals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateInterests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateInterests.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateInterests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAvatar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateAvatar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(completeOnboarding.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(completeOnboarding.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(completeOnboarding.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;

