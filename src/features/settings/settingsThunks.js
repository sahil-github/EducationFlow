import { createAsyncThunk } from "@reduxjs/toolkit";
import { settingApi } from "../../api/settingApi";

const extractMsg = (error, fallback) => {
    return error.response?.data?.message || error.message || fallback;
};

/**
 * GET /api/profile/settings
 * Fetch settings data for the authenticated user
 */
export const fetchSettings = createAsyncThunk(
    "settings/fetchSettings",
    async (_, { rejectWithValue }) => {
        try {
            const data = await settingApi.getSettings();
            return data.data ?? data;
        } catch (err) {
            return rejectWithValue(extractMsg(err, "Failed to fetch settings"));
        }
    }
);

/**
 * PUT /api/profile/settings
 * Update profile & settings details (fullName, headline, timezone, phoneNumber)
 */
export const updateSettingsThunk = createAsyncThunk(
    "settings/updateSettings",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await settingApi.updateSettings(payload);
            return data;
        } catch (err) {
            return rejectWithValue(extractMsg(err, "Failed to update settings"));
        }
    }
);

/**
 * PUT /api/profile/notifications
 * Update notification preferences (courseActivity, liveSessions, newsletter)
 */
export const updateNotificationPreferencesThunk = createAsyncThunk(
    "settings/updateNotificationPreferences",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await settingApi.updateNotificationPreferences(payload);
            return data;
        } catch (err) {
            return rejectWithValue(extractMsg(err, "Failed to update notification preferences"));
        }
    }
);
