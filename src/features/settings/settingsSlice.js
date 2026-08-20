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
                const sent = action.meta?.arg || {};
                const resData = action.payload?.data ?? action.payload?.settings ?? (typeof action.payload === "object" ? action.payload : {});

                const updatedFullName = resData.fullName ?? sent.fullName;
                const updatedEmail = resData.email ?? sent.email;
                const updatedHeadline = resData.headline ?? sent.headline;
                const updatedCountry = resData.country ?? sent.country;
                const updatedTimezone = resData.timezone ?? sent.timezone;
                const updatedPhoneNumber = resData.phoneNumber ?? sent.phoneNumber;

                const currentSettings = state.settingsData || {};

                state.settingsData = {
                    ...currentSettings,
                    identity: {
                        ...(currentSettings.identity || {}),
                        fullName: updatedFullName ?? currentSettings.identity?.fullName,
                        email: updatedEmail ?? currentSettings.identity?.email,
                        headline: updatedHeadline ?? currentSettings.identity?.headline,
                    },
                    contactRegion: {
                        ...(currentSettings.contactRegion || {}),
                        country: updatedCountry ?? currentSettings.contactRegion?.country,
                        timezone: updatedTimezone ?? currentSettings.contactRegion?.timezone,
                        phoneNumber: updatedPhoneNumber ?? currentSettings.contactRegion?.phoneNumber,
                    },
                };
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
                const sentNotifs = action.meta?.arg || {};
                const resNotifs = action.payload?.notifications ?? action.payload?.data?.notifications ?? action.payload?.data ?? (typeof action.payload === "object" ? action.payload : {});

                const updatedNotifs = {
                    courseActivity: resNotifs.courseActivity ?? sentNotifs.courseActivity,
                    liveSessions: resNotifs.liveSessions ?? sentNotifs.liveSessions,
                    newsletter: resNotifs.newsletter ?? sentNotifs.newsletter,
                };

                const currentSettings = state.settingsData || {};

                state.settingsData = {
                    ...currentSettings,
                    notifications: {
                        ...(currentSettings.notifications || {}),
                        ...updatedNotifs,
                    },
                };
            })
            .addCase(updateNotificationPreferencesThunk.rejected, (state, action) => {
                state.notificationsSaving = false;
                state.notificationsError = action.payload ?? "Failed to update notification preferences";
            });
    },
});

export const { clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;
