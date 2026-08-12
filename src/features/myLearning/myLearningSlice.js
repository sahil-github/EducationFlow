import { createSlice } from "@reduxjs/toolkit";
import {
    fetchMyLearning,
    saveCourseThunk,
    completeLessonInCourse,
} from "./myLearningThunks";

const initialState = {
    myLearning: {
        all: [],
        inProgress: [],
        savedForLater: [],
        completed: [],
        totalEnrolled: 0,
    },
    loading: false,
    error: null,
    saveLoading: false,
    saveError: null,
    completeLessonLoading: false,
    completeLessonError: null,
};

const myLearningSlice = createSlice({
    name: "myLearning",
    initialState,
    reducers: {
        clearMyLearningError: (state) => {
            state.error = null;
            state.saveError = null;
            state.completeLessonError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Reset state on user logout
            .addCase("auth/logout", () => initialState)

            // ── fetchMyLearning ─────────────────────────────────────────────
            .addCase(fetchMyLearning.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyLearning.fulfilled, (state, action) => {
                state.loading = false;
                const payload = action.payload ?? {};
                state.myLearning = {
                    all: payload.all ?? [],
                    inProgress: payload.inProgress ?? [],
                    savedForLater: payload.savedForLater ?? [],
                    completed: payload.completed ?? [],
                    totalEnrolled: payload.totalEnrolled ?? 0,
                };
            })
            .addCase(fetchMyLearning.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to fetch my learning";
            })

            // ── saveCourseThunk ─────────────────────────────────────────────
            .addCase(saveCourseThunk.pending, (state) => {
                state.saveLoading = true;
                state.saveError = null;
            })
            .addCase(saveCourseThunk.fulfilled, (state, action) => {
                state.saveLoading = false;
                const payload = action.payload ?? {};
                // If backend returns updated savedForLater list
                if (Array.isArray(payload.savedForLater)) {
                    state.myLearning.savedForLater = payload.savedForLater;
                }
            })
            .addCase(saveCourseThunk.rejected, (state, action) => {
                state.saveLoading = false;
                state.saveError = action.payload ?? "Failed to save course";
            })

            // ── completeLessonInCourse ──────────────────────────────────────
            .addCase(completeLessonInCourse.pending, (state) => {
                state.completeLessonLoading = true;
                state.completeLessonError = null;
            })
            .addCase(completeLessonInCourse.fulfilled, (state, action) => {
                state.completeLessonLoading = false;
                const payload = action.payload ?? {};
                // If backend returns updated courseProgress object, update inProgress list item
                if (payload.courseProgress) {
                    const cp = payload.courseProgress;
                    const idx = state.myLearning.inProgress.findIndex(
                        (item) => item.courseId === cp.courseId || item.id === cp.id
                    );
                    if (idx !== -1) {
                        state.myLearning.inProgress[idx] = {
                            ...state.myLearning.inProgress[idx],
                            ...cp,
                        };
                    }
                }
            })
            .addCase(completeLessonInCourse.rejected, (state, action) => {
                state.completeLessonLoading = false;
                state.completeLessonError = action.payload ?? "Failed to mark lesson complete";
            });
    },
});

export const { clearMyLearningError } = myLearningSlice.actions;
export default myLearningSlice.reducer;
