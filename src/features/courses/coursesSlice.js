import { createSlice } from "@reduxjs/toolkit";
import {
    fetchCourses,
    fetchCategories,
    fetchCourseById,
    enrollInCourse,
    fetchMyLearning,
    saveCourseThunk,
    completeLessonInCourse,
} from "./coursesThunks";

const initialState = {
    courses: [],
    categories: [],
    currentCourse: null,
    totalPages: 1,
    currentPage: 1,
    totalCourses: 0,
    hasMore: false,
    loading: false,
    categoriesLoading: false,
    courseDetailsLoading: false,
    enrollLoading: false,
    error: null,
    categoriesError: null,
    courseDetailsError: null,
    enrollError: null,
    // My Learning state – populated by GET /api/courses/my-learning
    myLearning: {
        all: [],
        inProgress: [],
        savedForLater: [],
        completed: [],
        totalEnrolled: 0,
    },
    myLearningLoading: false,
    myLearningError: null,
};

const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
            state.courseDetailsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchCourses
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                // Response structure: { success, count, totalCourses, page, totalPages, hasMore, data }
                const payload = action.payload ?? {};
                state.courses = payload.data ?? [];
                state.totalPages = payload.totalPages ?? 1;
                state.currentPage = payload.page ?? 1;
                state.totalCourses = payload.totalCourses ?? 0;
                state.hasMore = payload.hasMore ?? false;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to fetch courses";
            })

            // fetchCategories
            .addCase(fetchCategories.pending, (state) => {
                state.categoriesLoading = true;
                state.categoriesError = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categoriesLoading = false;
                state.categories = action.payload ?? [];
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.categoriesLoading = false;
                state.categoriesError = action.payload ?? "Failed to fetch categories";
            })

            // fetchCourseById
            .addCase(fetchCourseById.pending, (state) => {
                state.courseDetailsLoading = true;
                state.courseDetailsError = null;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.courseDetailsLoading = false;
                state.currentCourse = action.payload;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.courseDetailsLoading = false;
                state.courseDetailsError = action.payload ?? "Failed to fetch course details";
            })

            // enrollInCourse
            .addCase(enrollInCourse.pending, (state) => {
                state.enrollLoading = true;
                state.enrollError = null;
            })
            .addCase(enrollInCourse.fulfilled, (state) => {
                state.enrollLoading = false;
                if (state.currentCourse) {
                    state.currentCourse.isEnrolled = true;
                }
            })
            .addCase(enrollInCourse.rejected, (state, action) => {
                state.enrollLoading = false;
                state.enrollError = action.payload ?? "Failed to enroll in course";
            })

            // fetchMyLearning
            .addCase(fetchMyLearning.pending, (state) => {
                state.myLearningLoading = true;
                state.myLearningError = null;
            })
            .addCase(fetchMyLearning.fulfilled, (state, action) => {
                state.myLearningLoading = false;
                const payload = action.payload ?? {};
                // Backend returns: { inProgress, savedForLater, completed, all, totalEnrolled }
                state.myLearning = {
                    all: payload.all ?? [],
                    inProgress: payload.inProgress ?? [],
                    savedForLater: payload.savedForLater ?? [],
                    completed: payload.completed ?? [],
                    totalEnrolled: payload.totalEnrolled ?? 0,
                };
            })
            .addCase(fetchMyLearning.rejected, (state, action) => {
                state.myLearningLoading = false;
                state.myLearningError = action.payload ?? "Failed to fetch my learning";
            })

            // saveCourseThunk
            .addCase(saveCourseThunk.fulfilled, (state, action) => {
                // If the backend echoes back updated course data, refresh currentCourse
                if (state.currentCourse && state.currentCourse.id === action.payload?.id) {
                    state.currentCourse = { ...state.currentCourse, ...action.payload };
                }
            })

            // completeLessonInCourse
            .addCase(completeLessonInCourse.fulfilled, (state, action) => {
                // Merge updated lesson progress into currentCourse if available
                if (state.currentCourse && action.payload) {
                    state.currentCourse = { ...state.currentCourse, ...action.payload };
                }
            });
    },
});

export const { clearCurrentCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
