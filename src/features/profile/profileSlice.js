import { createSlice } from "@reduxjs/toolkit";
import {
    getProfile,
    updatePersonalInfo,
    uploadAvatar,
    updateGoals,
    getInterestOptions,
    updateInterests,
    updateSkills,
    completeOnboarding,
    getLocations,
} from "./profileThunks";

// ---------------------------------------------------------------------------
// Helpers — build extraReducers cases without repetition.
// ---------------------------------------------------------------------------
const pending = (state) => {
    state.loading = true;
    state.error = null;
};

const rejected = (state, action) => {
    state.loading = false;
    state.error = action.payload;
};

// Merge the returned profile patch into existing state instead of replacing
// the whole object, so partial updates from individual steps don't wipe
// fields that the backend didn't return in that particular response.
const fulfilled = (state, action) => {
    state.loading = false;
    if (action.payload) {
        state.profile = { ...state.profile, ...action.payload };
    }
};

const initialState = {
    profile: null,       // Full profile from GET /api/profile/my-profile
    interestOptions: [], // From GET /api/profile/interests-options
    locationOptions: [], // From GET /api/profile/locations
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
        // Allow onboarding steps to patch profile in Redux without a round-trip
        patchProfile: (state, action) => {
            state.profile = { ...state.profile, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            // ── getProfile ──────────────────────────────────────────────────
            .addCase(getProfile.pending, pending)
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                if (!action.payload) return;
                const p = action.payload;
                // Normalize goals: expose under both keys regardless of which one backend returns
                const rawGoals = p.learningGoal ?? p.goals ?? p.learningGoals;
                // Normalize skills: always an array
                const rawSkills = Array.isArray(p.skills) ? p.skills : [];
                state.profile = {
                    ...p,
                    learningGoal: rawGoals ?? [],
                    goals: rawGoals ?? [],
                    skills: rawSkills,
                };
            })
            .addCase(getProfile.rejected, rejected)

            // ── updatePersonalInfo ──────────────────────────────────────────
            .addCase(updatePersonalInfo.pending, pending)
            .addCase(updatePersonalInfo.fulfilled, fulfilled)
            .addCase(updatePersonalInfo.rejected, rejected)

            // ── uploadAvatar ────────────────────────────────────────────────
            .addCase(uploadAvatar.pending, pending)
            .addCase(uploadAvatar.fulfilled, fulfilled)
            .addCase(uploadAvatar.rejected, rejected)

            // ── updateGoals ─────────────────────────────────────────────────
            .addCase(updateGoals.pending, pending)
            .addCase(updateGoals.fulfilled, (state, action) => {
                state.loading = false;
                // Merge server response; also keep the submitted goals
                // in case the server returns a minimal / empty payload.
                const p = action.payload ?? {};
                const rawGoals = p.learningGoal ?? p.goals ?? p.learningGoals ?? action.meta?.arg;
                state.profile = {
                    ...state.profile,
                    ...p,
                    ...(rawGoals ? { learningGoal: rawGoals, goals: rawGoals } : {}),
                };
            })
            .addCase(updateGoals.rejected, rejected)

            // ── getInterestOptions ──────────────────────────────────────────
            .addCase(getInterestOptions.pending, pending)
            .addCase(getInterestOptions.fulfilled, (state, action) => {
                state.loading = false;
                state.interestOptions = action.payload ?? [];
            })
            .addCase(getInterestOptions.rejected, rejected)

            // ── updateInterests ─────────────────────────────────────────────
            .addCase(updateInterests.pending, pending)
            .addCase(updateInterests.fulfilled, fulfilled)
            .addCase(updateInterests.rejected, rejected)

            // ── updateSkills ────────────────────────────────────────────────
            .addCase(updateSkills.pending, pending)
            .addCase(updateSkills.fulfilled, (state, action) => {
                state.loading = false;
                const p = action.payload ?? {};
                // Prefer server-echoed skills; fall back to the submitted payload
                const rawSkills = p.skills ?? action.meta?.arg;
                state.profile = {
                    ...state.profile,
                    ...p,
                    ...(rawSkills ? { skills: rawSkills } : {}),
                };
            })
            .addCase(updateSkills.rejected, rejected)

            // ── getLocations ─────────────────────────────────────────────────────────
            .addCase(getLocations.pending, pending)
            .addCase(getLocations.fulfilled, (state, action) => {
                state.loading = false;
                state.locationOptions = action.payload ?? [];
            })
            .addCase(getLocations.rejected, (state) => {
                state.loading = false;
                // Non-critical: leave locationOptions as empty array on failure
            })

            // ── completeOnboarding ──────────────────────────────────────────
            .addCase(completeOnboarding.pending, pending)
            .addCase(completeOnboarding.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = {
                    ...state.profile,
                    ...action.payload,
                    isOnboarded: true,
                };
            })
            .addCase(completeOnboarding.rejected, rejected);
    },
});

export const { clearError, patchProfile } = profileSlice.actions;
export default profileSlice.reducer;
