import { createAsyncThunk } from "@reduxjs/toolkit";
import { profileApi } from "../../api/profileApi";



// export const updatePersonalInfo = createAsyncThunk(
//     'profile/updatePersonalInfo',
//     async (data, { rejectWithValue }) => {
//         try {
//             const response = await profileApi.updatePersonalInfo(data);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );
export const updatePersonalInfo = createAsyncThunk(
    "profile/updatePersonalInfo",
    async (data, { rejectWithValue }) => {
        try {
            const response = await profileApi.updatePersonalInfo(data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update personal info"
            );
        }
    }
);

export const updateSkills = createAsyncThunk(
    'profile/updateSkills',
    async (data, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateSkills(data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue( error.response?.data?.message);
        }
    }
);

export const updateGoals = createAsyncThunk(
    'profile/updateGoals',
    async (data, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateGoals(data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue( error.response?.data?.message);
        }
    }
);

export const updateInterests = createAsyncThunk(
    'profile/updateInterests',
    async (data, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateInterests(data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue( error.response?.data?.message);
        }
    }
);

export const updateAvatar = createAsyncThunk(
    'profile/updateAvatar',
    async (data, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateAvatar(data);
            return {
                avatarUrl: response.data.avatarUrl
            }
        } catch (error) {
            return rejectWithValue( error.response?.data?.message);
        }
    }
);

export const completeOnboarding = createAsyncThunk(
    'profile/completeOnboarding',
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.completeOnboarding();
            return response.data.data;
        } catch (error) {
            return rejectWithValue( error.response?.data?.message);
        }
    }
);

export const getProfile = createAsyncThunk(
    'profile/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.getProfile();
            return response.data.data;
        } catch (error) {
            return rejectWithValue( error.response?.data?.message);
        }
    }
);