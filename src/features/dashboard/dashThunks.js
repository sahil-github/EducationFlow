import { createAsyncThunk } from "@reduxjs/toolkit";
import DashboardApi from "../../api/dashboardApi";

const extractMsg = (error, fallback) => {
    return error.response?.data?.message || error.message || fallback;
};

export const fetchDashboard = createAsyncThunk(
    "dashboard/fetchDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const response = await DashboardApi.getDashboardSummary();
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch dashboard")
            );
        }
    }
);

export const fetchLearningStats = createAsyncThunk(
    "dashboard/fetchLearningStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await DashboardApi.getLearningStats();
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch dashboard stats")
            );
        }
    }
);

export const fetchLiveClasses = createAsyncThunk(
    "dashboard/fetchLiveClasses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await DashboardApi.getLiveClasses();
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch dashboard live sessions")
            );
        }
    }
);

export const fetchContinueLearning = createAsyncThunk(
    "dashboard/fetchContinueLearning",
    async (_, { rejectWithValue }) => {
        try {
            const response = await DashboardApi.getContinueLearning();
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch continue learning")
            );
        }
    }
);

export const fetchRecommendedCourses = createAsyncThunk(
    "dashboard/fetchRecommendedCourses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await DashboardApi.getRecommendedCourses();
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch recommended courses")
            );
        }
    }
);

export const fetchModuleExplorer = createAsyncThunk(
    "dashboard/fetchModuleExplorer",
    async (_, { rejectWithValue }) => {
        try {
            const response = await DashboardApi.getModuleExplorer();
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch module explorer")
            );
        }
    }
);

export const fetchDownloadResources = createAsyncThunk(
    "dashboard/fetchDownloadResources",
    async (_, { rejectWithValue }) => {
        try {
            const response = await DashboardApi.downloadResources();
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to download resources")
            );
        }
    }
);

export const toggleLiveClassReminder = createAsyncThunk(
    "dashboard/toggleLiveClassReminder",
    async (id, { rejectWithValue }) => {
        try {
            const response =
                await DashboardApi.toggleLiveClassReminder(id);

            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to update live class reminder")
            );
        }
    }
);