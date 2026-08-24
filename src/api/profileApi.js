import api from "./api";

// ---------------------------------------------------------------------------
// Profile API — all endpoints relative to API_BASE_URL.
// Authorization Bearer token is attached automatically by the request
// interceptor in api.js — never attach it manually here.
// ---------------------------------------------------------------------------
const profileApi = {
    /** GET /api/profile/my-profile — fetch the full profile for the logged-in user */
    getProfile: () => api.get("/api/profile/my-profile"),

    /** PUT /api/profile/personal-info */
    updatePersonalInfo: (data) =>
        api.put("/api/profile/personal-info", {
            fullName: data.fullName || data.name || "",
            location: data.location || "",
            bio: data.bio || "",
            avatarUrl: data.avatarUrl || "",
        }),

    /**
     * POST /api/profile/avatar (seed / DiceBear — existing JSON endpoint)
     * Accepts { seed: string } and returns a DiceBear avatar URL.
     * Use uploadAvatarFile() for actual image file uploads.
     */
    uploadAvatar: (data) =>
        api.post("/api/profile/avatar", typeof data === "string" ? { seed: data } : data),

    /**
     * POST /api/profile/avatar (multipart/form-data — actual image upload)
     * Sends the image file as FormData with the field name "avatar".
     *
     * NOTE: This endpoint requires backend support for multipart/form-data.
     * If the backend only supports the seed-based JSON variant, this call
     * will fail with 400/415. The caller (Setting.jsx) handles that gracefully
     * by catching the error, logging a clear warning, and continuing without
     * breaking the rest of the save flow.
     */
    uploadAvatarFile: (file) => {
        const formData = new FormData();
        formData.append("avatar", file);
        return api.post("/api/profile/avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    /** PUT /api/profile/goals */
    updateGoals: (data) => {
        // Send both keys so the backend receives it regardless of which field it reads.
        const goalsArray = Array.isArray(data) ? data : (data?.goals ?? data?.learningGoal ?? []);
        return api.put("/api/profile/goals", {
            goals: goalsArray,
            learningGoal: goalsArray,
        });
    },

    /** GET /api/profile/interests-options */
    getInterestOptions: () => api.get("/api/profile/interests-options"),

    /** PUT /api/profile/interests */
    updateInterests: (data) =>
        api.put("/api/profile/interests", Array.isArray(data) ? { interests: data } : data),

    /** PUT /api/profile/skills */
    updateSkills: (data) =>
        api.put("/api/profile/skills", Array.isArray(data) ? { skills: data } : data),

    /** GET /api/profile/locations */
    getLocations: () => api.get("/api/profile/locations"),

    /** POST /api/profile/complete */
    completeOnboarding: () => api.post("/api/profile/complete"),
};


export default profileApi;