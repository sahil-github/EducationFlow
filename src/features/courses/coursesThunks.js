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

export const createCourseThunk = createAsyncThunk(
    "courses/createCourse",
    async (data, { rejectWithValue }) => {
        try {
            const response = await courseApi.createCourse(data);
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to create course")
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

export const fetchCoursePlayer = createAsyncThunk(
    "courses/fetchCoursePlayer",
    async (id, { rejectWithValue }) => {
        try {
            const response = await courseApi.getCoursePlayer(id);
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to load course player")
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

// ── Notes Thunks ────────────────────────────────────────────────────────────
export const getCourseNotes = createAsyncThunk(
    "courses/getCourseNotes",
    async (id, { rejectWithValue }) => {
        try {
            const response = await courseApi.getCourseNotes(id);
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch course notes")
            );
        }
    }
);

export const addCourseNote = createAsyncThunk(
    "courses/addCourseNote",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await courseApi.addCourseNote(id, data);
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to add course note")
            );
        }
    }
);

export const deleteCourseNote = createAsyncThunk(
    "courses/deleteCourseNote",
    async ({ id, noteId }, { rejectWithValue }) => {
        try {
            const response = await courseApi.deleteCourseNote(id, noteId);
            return { noteId, ...(response.data?.data ?? response.data) };
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to delete course note")
            );
        }
    }
);

// ── Q&A Thunks ──────────────────────────────────────────────────────────────
export const getCourseQnA = createAsyncThunk(
    "courses/getCourseQnA",
    async (id, { rejectWithValue }) => {
        try {
            const response = await courseApi.getCourseQnA(id);
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch Q&A questions")
            );
        }
    }
);

export const fetchQnA = getCourseQnA;

export const addCourseQuestion = createAsyncThunk(
    "courses/addCourseQuestion",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await courseApi.addCourseQuestion(id, data);
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to post question")
            );
        }
    }
);

export const replyToQuestion = createAsyncThunk(
    "courses/replyToQuestion",
    async ({ id, questionId, data }, { rejectWithValue }) => {
        try {
            const response = await courseApi.replyToQuestion(id, questionId, data);
            return { questionId, ...(response.data?.data ?? response.data) };
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to post reply")
            );
        }
    }
);

export const upvoteQuestion = createAsyncThunk(
    "courses/upvoteQuestion",
    async ({ id, questionId }, { rejectWithValue }) => {
        try {
            const response = await courseApi.upvoteQuestion(id, questionId);
            return { questionId, ...(response.data?.data ?? response.data) };
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to upvote question")
            );
        }
    }
);

// ── Resources Thunks ────────────────────────────────────────────────────────
export const getCourseResources = createAsyncThunk(
    "courses/getCourseResources",
    async (id, { rejectWithValue }) => {
        try {
            const response = await courseApi.getCourseResources(id);
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch course resources")
            );
        }
    }
);

export const fetchResource = getCourseResources;

export const downloadCourseResource = createAsyncThunk(
    "courses/downloadCourseResource",
    async ({ id, resourceId, fileName }, { rejectWithValue }) => {
        try {
            const response = await courseApi.downloadCourseResource(id, resourceId);
            return response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to download resource")
            );
        }
    }
);

// ── Lesson Switching Thunk ──────────────────────────────────────────────────
export const fetchLessonById = createAsyncThunk(
    "courses/fetchLessonById",
    async ({ courseId, lessonId }, { rejectWithValue }) => {
        try {
            const response = await courseApi.getLessonById(courseId, lessonId);
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to fetch lesson details")
            );
        }
    }
);

// ── Video Progress Thunk ────────────────────────────────────────────────────
export const saveLessonProgress = createAsyncThunk(
    "courses/saveLessonProgress",
    async ({ courseId, lessonId, data }, { rejectWithValue }) => {
        try {
            const response = await courseApi.saveLessonProgress(courseId, lessonId, data);
            return response.data?.data ?? response.data;
        } catch (err) {
            return rejectWithValue(
                extractMsg(err, "Failed to save lesson progress")
            );
        }
    }
);