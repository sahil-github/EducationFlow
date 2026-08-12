import api from "./api";

// ---------------------------------------------------------------------------
// Profile API — all endpoints relative to API_BASE_URL.
// Authorization Bearer token is attached automatically by the request
// interceptor in api.js — never attach it manually here.
// ---------------------------------------------------------------------------
const profileApi = {
    /** GET /api/profile/me — fetch the full profile for the logged-in user */
    getProfile: () => api.get("/api/profile/me"),

    /** PUT /api/profile/personal-info */
    updatePersonalInfo: (data) =>
        api.put("/api/profile/personal-info", {
            fullName: data.fullName || data.name || "",
            location: data.location || "",
            bio: data.bio || "",
            avatarUrl: data.avatarUrl || "",
        }),

    /** POST /api/profile/avatar */
    uploadAvatar: (data) =>
        api.post("/api/profile/avatar", typeof data === "string" ? { seed: data } : data),

    /** PUT /api/profile/goals */
    updateGoals: (data) =>
        api.put("/api/profile/goals", Array.isArray(data) ? { goals: data } : data),

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