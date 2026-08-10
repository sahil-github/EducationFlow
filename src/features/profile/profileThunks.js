import { createAsyncThunk } from "@reduxjs/toolkit";
import profileApi from "../../api/profileApi";
import { getCurrentUser } from "../../utils/storage";

// ---------------------------------------------------------------------------
// Error normaliser — converts Axios errors into readable strings.
// ---------------------------------------------------------------------------
const extractMsg = (error, fallback) =>
    error.response?.data?.message || error.message || fallback;

// ---------------------------------------------------------------------------
// GET /api/profile/me
// Fetches the full profile on app load / after login.
// Returns the profile object which includes isOnboarded, onboardingStep, etc.
// ---------------------------------------------------------------------------
export const getProfile = createAsyncThunk(
    "profile/getProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.getProfile();
            const resData = response.data;
            if (resData && typeof resData === "object" && resData.data) {
                return resData.data;
            }
            return resData;
        } catch (error) {
            const localUser = getCurrentUser();
            if (localUser && (localUser.email || localUser.id)) {
                return localUser;
            }
            return rejectWithValue(extractMsg(error, "Failed to fetch profile."));
        }
    }
);


export const updatePersonalInfo = createAsyncThunk(
    "profile/updatePersonalInfo",
    async (data, { rejectWithValue }) => {
        try {
            const response = await profileApi.updatePersonalInfo(data);
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(extractMsg(error, "Failed to update personal info."));
        }
    }
);

export const uploadAvatar = createAsyncThunk(
    "profile/uploadAvatar",
    async (data, { rejectWithValue }) => {
        try {
            const response = await profileApi.uploadAvatar(data);
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(extractMsg(error, "Failed to upload avatar."));
        }
    }
);


export const updateGoals = createAsyncThunk(
    "profile/updateGoals",
    async (data, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateGoals(data);
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(extractMsg(error, "Failed to save learning goals."));
        }
    }
);


export const getInterestOptions = createAsyncThunk(
    "profile/getInterestOptions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.getInterestOptions();
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(extractMsg(error, "Failed to load interest options."));
        }
    }
);


export const updateInterests = createAsyncThunk(
    "profile/updateInterests",
    async (data, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateInterests(data);
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(extractMsg(error, "Failed to save interests."));
        }
    }
);


export const updateSkills = createAsyncThunk(
    "profile/updateSkills",
    async (data, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateSkills(data);
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(extractMsg(error, "Failed to save skills."));
        }
    }
);

export const completeOnboarding = createAsyncThunk(
    "profile/completeOnboarding",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.completeOnboarding();
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(extractMsg(error, "Failed to complete onboarding."));
        }
    }
);