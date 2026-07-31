import api from "./api";

export const profileApi = {
    getProfile: () => api.get("/api/profile/me"),

    updatePersonalInfo: (data) =>
        api.put("/api/profile/personal-info", {
            fullName: data.name || data.fullName || "",
            location: data.location || "",
            bio: data.bio || "",
            avatarUrl: data.avatarUrl || "",
        }),

    uploadAvatar: (data) =>
        api.post("/api/profile/avatar", typeof data === "string" ? { seed: data } : data),

    saveGoals: (data) =>
        api.put("/api/profile/goals", Array.isArray(data) ? { goals: data } : data),

    getInterestOptions: () => api.get("/api/profile/interests-options"),

    saveInterests: (data) =>
        api.put("/api/profile/interests", Array.isArray(data) ? { interests: data } : data),

    saveSkills: (data) =>
        api.put("/api/profile/skills", Array.isArray(data) ? { skills: data } : data),

    completeOnboarding: () => api.post("/api/profile/complete"),
};

export const {
    getProfile,
    updatePersonalInfo,
    uploadAvatar,
    saveGoals,
    getInterestOptions,
    saveInterests,
    saveSkills,
    completeOnboarding,
} = profileApi;

export default profileApi;