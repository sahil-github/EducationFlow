import { createSlice } from "@reduxjs/toolkit";

import {
    fetchDashboard,
    fetchLearningStats,
    fetchLiveClasses,
    fetchContinueLearning,
    fetchRecommendedCourses,
    fetchModuleExplorer,
    fetchDownloadResources,
    toggleLiveClassReminder,
} from "./dashThunks";

const initialState = {
    summary: null,
    learningStats: null,
    liveClasses: [],
    continueLearning: [],
    recommendedCourses: [],
    moduleExplorer: null,
    downloadResources: null,

    status: {
        summary: "idle",
        learningStats: "idle",
        liveClasses: "idle",
        continueLearning: "idle",
        recommendedCourses: "idle",
        moduleExplorer: "idle",
        downloadResources: "idle",
        reminder: "idle",
    },

    error: {
        summary: null,
        learningStats: null,
        liveClasses: null,
        continueLearning: null,
        recommendedCourses: null,
        moduleExplorer: null,
        downloadResources: null,
        reminder: null,
    },
};

const dashSlice = createSlice({
    name: "dashboard",
    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder
            // Reset dashboard state when user logs out
            .addCase('auth/logout', () => initialState)

            
            .addCase(fetchDashboard.pending, (state) => {
                state.status.summary = "pending";
                state.error.summary = null;
            })

            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.status.summary = "succeeded";
                state.summary = action.payload;

                // Populate other sections from the composite response ONLY when
                // their dedicated endpoints haven't returned data yet.
                // NOTE: learningStats is intentionally NOT set here — the composite
                // /api/dashboard endpoint returns DB-column default values that differ
                // from the user's real stats. Only fetchLearningStats (which calls
                // /api/dashboard/stats) may write to state.learningStats.
                if (action.payload && typeof action.payload === "object") {
                    const data = action.payload;

                    if (data.liveClasses && (!state.liveClasses || state.liveClasses.length === 0)) {
                        state.liveClasses = data.liveClasses;
                    }
                    if (data.continueLearning && (!state.continueLearning || state.continueLearning.length === 0)) {
                        state.continueLearning = data.continueLearning;
                    }
                    if (data.recommended && (!state.recommendedCourses || state.recommendedCourses.length === 0)) {
                        state.recommendedCourses = data.recommended;
                    }
                    if (data.moduleExplorer && !state.moduleExplorer) {
                        state.moduleExplorer = data.moduleExplorer;
                    }
                }
            })

            .addCase(fetchDashboard.rejected, (state, action) => {
                state.status.summary = "failed";
                state.error.summary = action.payload;
            })

           

            .addCase(fetchLearningStats.pending, (state) => {
                state.status.learningStats = "pending";
                state.error.learningStats = null;
            })

            .addCase(fetchLearningStats.fulfilled, (state, action) => {
                state.status.learningStats = "succeeded";
                state.learningStats = action.payload;
            })

            .addCase(fetchLearningStats.rejected, (state, action) => {
                state.status.learningStats = "failed";
                state.error.learningStats = action.payload;
            })


            .addCase(fetchLiveClasses.pending, (state) => {
                state.status.liveClasses = "pending";
                state.error.liveClasses = null;
            })

            .addCase(fetchLiveClasses.fulfilled, (state, action) => {
                state.status.liveClasses = "succeeded";
                state.liveClasses = action.payload;
            })

            .addCase(fetchLiveClasses.rejected, (state, action) => {
                state.status.liveClasses = "failed";
                state.error.liveClasses = action.payload;
            })

           

            .addCase(fetchContinueLearning.pending, (state) => {
                state.status.continueLearning = "pending";
                state.error.continueLearning = null;
            })

            .addCase(fetchContinueLearning.fulfilled, (state, action) => {
                state.status.continueLearning = "succeeded";
                state.continueLearning = action.payload;
            })

            .addCase(fetchContinueLearning.rejected, (state, action) => {
                state.status.continueLearning = "failed";
                state.error.continueLearning = action.payload;
            })

       

            .addCase(fetchRecommendedCourses.pending, (state) => {
                state.status.recommendedCourses = "pending";
                state.error.recommendedCourses = null;
            })

            .addCase(fetchRecommendedCourses.fulfilled, (state, action) => {
                state.status.recommendedCourses = "succeeded";
                state.recommendedCourses = action.payload;
            })

            .addCase(fetchRecommendedCourses.rejected, (state, action) => {
                state.status.recommendedCourses = "failed";
                state.error.recommendedCourses = action.payload;
            })

           
            .addCase(fetchModuleExplorer.pending, (state) => {
                state.status.moduleExplorer = "pending";
                state.error.moduleExplorer = null;
            })

            .addCase(fetchModuleExplorer.fulfilled, (state, action) => {
                state.status.moduleExplorer = "succeeded";
                state.moduleExplorer = action.payload;
            })

            .addCase(fetchModuleExplorer.rejected, (state, action) => {
                state.status.moduleExplorer = "failed";
                state.error.moduleExplorer = action.payload;
            })

           

            .addCase(fetchDownloadResources.pending, (state) => {
                state.status.downloadResources = "pending";
                state.error.downloadResources = null;
            })

            .addCase(fetchDownloadResources.fulfilled, (state, action) => {
                state.status.downloadResources = "succeeded";
                state.downloadResources = action.payload;
            })

            .addCase(fetchDownloadResources.rejected, (state, action) => {
                state.status.downloadResources = "failed";
                state.error.downloadResources = action.payload;
            })

       

            .addCase(toggleLiveClassReminder.pending, (state) => {
                state.status.reminder = "pending";
                state.error.reminder = null;
            })

            .addCase(toggleLiveClassReminder.fulfilled, (state, action) => {
                state.status.reminder = "succeeded";

                const updatedClass = action.payload;
                if (!updatedClass) return;

                const index = state.liveClasses.findIndex(
                    (liveClass) => (liveClass.id || liveClass._id) === (updatedClass.id || updatedClass._id)
                );

                if (index !== -1) {
                    state.liveClasses[index] = updatedClass;
                }
            })

            .addCase(toggleLiveClassReminder.rejected, (state, action) => {
                state.status.reminder = "failed";
                state.error.reminder = action.payload;
            });
    },
});

export default dashSlice.reducer;