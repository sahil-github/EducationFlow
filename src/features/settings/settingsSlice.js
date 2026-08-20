import { createSlice } from "@reduxjs/toolkit";
import {
    fetchSettings,
    updateSettingsThunk,
    updateNotificationPreferencesThunk,
} from "./settingsThunks";
import { getSettings, saveSettings } from "../../utils/storage";

// ---------------------------------------------------------------------------
// Rehydrate from localStorage on app startup.
// getSettings() reads the "ef_settings" key — returns the saved object or null.
// We never overwrite it with defaults; only real API / user-submitted data goes in.
// ---------------------------------------------------------------------------
const persisted = getSettings();

const initialState = {
    // Full settings object returned by GET /api/profile/settings.
    // Expected shape consumed by Setting.jsx:
    //   { identity, contactRegion, notifications, security, subscription }
    settingsData: persisted || null,

    loading: false,             // true while fetchSettings is in-flight
    error: null,

    saving: false,              // true while updateSettingsThunk is in-flight
    saveError: null,

    notificationsSaving: false, // true while updateNotificationPreferencesThunk is in-flight
    notificationsError: null,
};

// ---------------------------------------------------------------------------
// Helper — deep-merge a patch into existing settingsData.
// Prevents a partial API response from wiping unrelated nested fields.
// ---------------------------------------------------------------------------
const mergeSettings = (existing, patch) => {
    if (!patch) return existing;
    if (!existing) return patch;
    return {
        ...existing,
        ...patch,
        identity:      { ...(existing.identity      || {}), ...(patch.identity      || {}) },
        contactRegion: { ...(existing.contactRegion || {}), ...(patch.contactRegion || {}) },
        notifications: { ...(existing.notifications || {}), ...(patch.notifications || {}) },
        security:      { ...(existing.security      || {}), ...(patch.security      || {}) },
        subscription:  { ...(existing.subscription  || {}), ...(patch.subscription  || {}) },
    };
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        /** Apply a local optimistic patch (e.g. after a successful save in Setting.jsx). */
        patchSettingsData: (state, action) => {
            state.settingsData = mergeSettings(state.settingsData, action.payload);
            saveSettings(state.settingsData);
        },
        clearSettingsError: (state) => {
            state.error = null;
            state.saveError = null;
            state.notificationsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ── fetchSettings ─────────────────────────────────────────────
            .addCase(fetchSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.loading = false;
                // Merge API data on top of whatever was in localStorage so
                // neither source loses data the other holds.
                state.settingsData = mergeSettings(state.settingsData, action.payload);
                // Persist the merged result back to localStorage immediately.
                saveSettings(state.settingsData);
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Keep whatever was loaded from localStorage — do NOT clear it.
            })

            // ── updateSettingsThunk ───────────────────────────────────────
            .addCase(updateSettingsThunk.pending, (state) => {
                state.saving = true;
                state.saveError = null;
            })
            .addCase(updateSettingsThunk.fulfilled, (state, action) => {
                state.saving = false;
                // Merge the API response (may contain updated identity / contactRegion).
                const patch = action.payload?.data ?? action.payload;
                state.settingsData = mergeSettings(state.settingsData, patch);
                // Persist to localStorage immediately.
                saveSettings(state.settingsData);
            })
            .addCase(updateSettingsThunk.rejected, (state, action) => {
                state.saving = false;
                state.saveError = action.payload;
            })

            // ── updateNotificationPreferencesThunk ────────────────────────
            .addCase(updateNotificationPreferencesThunk.pending, (state) => {
                state.notificationsSaving = true;
                state.notificationsError = null;
            })
            .addCase(updateNotificationPreferencesThunk.fulfilled, (state, action) => {
                state.notificationsSaving = false;
                // Normalise: backend may return { notifications: {...} } or the
                // prefs object directly.
                const raw = action.payload?.data ?? action.payload;
                const notifsPatch = raw?.notifications ?? raw;
                if (notifsPatch && typeof notifsPatch === "object") {
                    state.settingsData = mergeSettings(state.settingsData, {
                        notifications: notifsPatch,
                    });
                }
                saveSettings(state.settingsData);
            })
            .addCase(updateNotificationPreferencesThunk.rejected, (state, action) => {
                state.notificationsSaving = false;
                state.notificationsError = action.payload;
            });
    },
});

export const { patchSettingsData, clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;

