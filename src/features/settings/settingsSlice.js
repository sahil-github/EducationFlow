import { createSlice } from "@reduxjs/toolkit";
import {
    fetchSettings,
    updateSettingsThunk,
    updateNotificationPreferencesThunk,
} from "./settingsThunks";

const initialState = {
    settingsData: null,
    loading: false,
    error: null,
    saving: false,
    saveError: null,
    notificationsSaving: false,
    notificationsError: null,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        clearSettingsError: (state) => {
            state.error = null;
            state.saveError = null;
            state.notificationsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Reset on logout
            .addCase("auth/logout", () => initialState)

            // ── fetchSettings ───────────────────────────────────────────────
            .addCase(fetchSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settingsData = action.payload ?? null;
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to load settings";
            })

            // ── updateSettingsThunk ─────────────────────────────────────────
            .addCase(updateSettingsThunk.pending, (state) => {
                state.saving = true;
                state.saveError = null;
            })
            .addCase(updateSettingsThunk.fulfilled, (state, action) => {
                state.saving = false;
                const payloadData = action.payload?.data;
                if (payloadData && state.settingsData) {
                    state.settingsData = {
                        ...state.settingsData,
                        identity: {
                            ...state.settingsData.identity,
                            fullName: payloadData.fullName ?? state.settingsData.identity?.fullName,
                            headline: payloadData.headline ?? state.settingsData.identity?.headline,
                        },
                        contactRegion: {
                            ...state.settingsData.contactRegion,
                            timezone: payloadData.timezone ?? state.settingsData.contactRegion?.timezone,
                            phoneNumber: payloadData.phoneNumber ?? state.settingsData.contactRegion?.phoneNumber,
                        },
                    };
                }
            })
            .addCase(updateSettingsThunk.rejected, (state, action) => {
                state.saving = false;
                state.saveError = action.payload ?? "Failed to update settings";
            })

            // ── updateNotificationPreferencesThunk ─────────────────────────
            .addCase(updateNotificationPreferencesThunk.pending, (state) => {
                state.notificationsSaving = true;
                state.notificationsError = null;
            })
            .addCase(updateNotificationPreferencesThunk.fulfilled, (state, action) => {
                state.notificationsSaving = false;
                const newNotifs = action.payload?.notifications;
                if (newNotifs && state.settingsData) {
                    state.settingsData = {
                        ...state.settingsData,
                        notifications: {
                            ...state.settingsData.notifications,
                            ...newNotifs,
                        },
                    };
                }
            })
            .addCase(updateNotificationPreferencesThunk.rejected, (state, action) => {
                state.notificationsSaving = false;
                state.notificationsError = action.payload ?? "Failed to update notification preferences";
            });
    },
});

export const { clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;
