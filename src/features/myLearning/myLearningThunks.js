import { createAsyncThunk } from "@reduxjs/toolkit";
import myLearningApi from "../../api/myLearningApi";

const extractMsg = (error, fallback) => {
    return error.response?.data?.message || error.message || fallback;
};

// ---------------------------------------------------------------------------
// GET /api/courses/my-learning
// Fetches the currently logged in user's enrolled, saved, and completed courses
// ---------------------------------------------------------------------------
export const fetchMyLearning = createAsyncThunk(
    "myLearning/fetchMyLearning",
    async (_, { rejectWithValue }) => {
        try {
            const response = await myLearningApi.getMyLearning();
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch my learning courses")
            );
        }
    }
);

// ---------------------------------------------------------------------------
// POST /api/courses/save/:id
// Toggles the saved-for-later status for a course
// ---------------------------------------------------------------------------
export const saveCourseThunk = createAsyncThunk(
    "myLearning/saveCourse",
    async (id, { rejectWithValue }) => {
        try {
            const response = await myLearningApi.saveCourse(id);
            return { id, ...(response.data?.data ?? response.data) };
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to save course")
            );
        }
    }
);

// ---------------------------------------------------------------------------
// POST /api/courses/complete-lesson/:id
// Marks a specific lesson as complete for a course
// ---------------------------------------------------------------------------
export const completeLessonInCourse = createAsyncThunk(
    "myLearning/completeLesson",
    async ({ courseId, lessonId }, { rejectWithValue }) => {
        try {
            const response = await myLearningApi.completeLesson(courseId, lessonId);
            return { courseId, lessonId, ...(response.data?.data ?? response.data) };
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to mark lesson complete")
            );
        }
    }
);
