import api from "./api";

/**
 * Settings API service — endpoints for fetching and updating user settings & notification preferences.
 * Authorization Bearer token is attached automatically by the request interceptor in api.js.
 */
export const settingApi = {
    /** GET /api/profile/settings */
    getSettings: async () => {
        const response = await api.get("/api/profile/settings");
        return response.data;
    },

    /** PUT /api/profile/settings */
    updateSettings: async (payload) => {
        const response = await api.put("/api/profile/settings", payload);
        return response.data;
    },

    /** PUT /api/profile/notifications */
    updateNotificationPreferences: async (payload) => {
        const response = await api.put("/api/profile/notifications", payload);
        return response.data;
    },
};

export const { getSettings, updateSettings, updateNotificationPreferences } = settingApi;

export default settingApi;
