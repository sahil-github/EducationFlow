import { createAsyncThunk } from "@reduxjs/toolkit";
import { courseApi } from "../../api/courseApi";

const extractMsg = (error, fallback) => {
    return error.response?.data?.message || error.message || fallback;
};

export const fetchCourses = createAsyncThunk(
    "courses/fetchCourses",
    async (params, { rejectWithValue }) => {
        try {
            const response = await courseApi.getCourses(params);
            return response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch courses")
            );
        }
    }
);

export const fetchCategories = createAsyncThunk(
    "courses/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await courseApi.getCategories();
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch categories")
            );
        }
    }
);

export const fetchCourseById = createAsyncThunk(
    "courses/fetchCourseById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await courseApi.getCourseById(id);
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch course details")
            );
        }
    }
);

export const enrollInCourse = createAsyncThunk(
    "courses/enrollInCourse",
    async (id, { rejectWithValue }) => {
        try {
            const response = await courseApi.enrollInCourse(id);
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to enroll in course")
            );
        }
    }
);

export const fetchMyLearning = createAsyncThunk(
    "courses/fetchMyLearning",
    async (_, { rejectWithValue }) => {
        try {
            const response = await courseApi.getMyLearning();
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch my learning")
            );
        }
    }
);

export const saveCourseThunk = createAsyncThunk(
    "courses/saveCourse",
    async (id, { rejectWithValue }) => {
        try {
            const response = await courseApi.saveCourse(id);
            return { id, ...(response.data?.data ?? response.data) };
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to save course")
            );
        }
    }
);

export const completeLessonInCourse = createAsyncThunk(
    "courses/completeLesson",
    async ({ courseId, lessonId }, { rejectWithValue }) => {
        try {
            const response = await courseApi.completeLesson(courseId, lessonId);
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to mark lesson complete")
            );
        }
    }
);
