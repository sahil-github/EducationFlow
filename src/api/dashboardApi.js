import api from "./api";

const DashboardApi = {
    getDashboardSummary: () => api.get("/api/dashboard"),
    getLearningStats: () => api.get("/api/dashboard/stats"),
    getLiveClasses: () => api.get("/api/dashboard/live-classes"),
    toggleLiveClassReminder: (id) =>
        api.post(`/api/dashboard/live-classes/${id}/reminder`),
    getContinueLearning: () =>
        api.get("/api/dashboard/continue-learning"),
    getRecommendedCourses: () =>
        api.get("/api/dashboard/recommended"),
    getModuleExplorer: () =>
        api.get("/api/dashboard/module-explorer"),
    downloadResources: () =>
        api.get("/api/dashboard/download-resources"),
};

export default DashboardApi;