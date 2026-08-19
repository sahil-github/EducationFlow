import { createSlice } from "@reduxjs/toolkit";
import {
    fetchMyLearning,
    saveCourseThunk,
    completeLessonInCourse,
} from "./myLearningThunks";

const getCourseId = (course) => {
    if (!course) return null;
    if (course.course && typeof course.course === "object") {
        return course.course.id || course.course._id || course.course.courseId;
    }
    if (course.courseId && typeof course.courseId === "object") {
        return course.courseId.id || course.courseId._id;
    }
    if (course.courseId && !String(course.courseId).startsWith("sv_") && !String(course.courseId).startsWith("save_")) {
        return course.courseId;
    }
    if (course.id && !String(course.id).startsWith("sv_") && !String(course.id).startsWith("save_")) {
        return course.id;
    }
    if (course._id && !String(course._id).startsWith("sv_") && !String(course._id).startsWith("save_")) {
        return course._id;
    }
    return course.courseId || course.id || course._id;
};

const loadSavedFromStorage = () => {
    try {
        const stored = localStorage.getItem("eduflow_saved_courses");
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveToStorage = (list) => {
    try {
        localStorage.setItem("eduflow_saved_courses", JSON.stringify(list));
    } catch {}
};

const initialState = {
    myLearning: {
        all: [],
        inProgress: [],
        savedForLater: loadSavedFromStorage(),
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
            .addCase("auth/logout", () => {
                localStorage.removeItem("eduflow_saved_courses");
                return initialState;
            })

            // ── fetchMyLearning ─────────────────────────────────────────────
            .addCase(fetchMyLearning.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyLearning.fulfilled, (state, action) => {
                state.loading = false;
                const raw = action.payload ?? {};
                const payload = (raw?.data ?? raw?.myLearning ?? raw?.courses ?? raw) || {};
                
                // Flexible parsing of all backend response structures
                const rawAll = payload.all ?? payload.courses ?? (Array.isArray(payload) ? payload : []);
                const rawInProgress = payload.inProgress ?? payload.enrolled ?? payload.enrolledCourses ?? [];
                const rawSaved = payload.savedForLater ?? payload.saved ?? payload.savedCourses ?? payload.bookmarks ?? [];
                const rawCompleted = payload.completed ?? payload.completedCourses ?? [];

                let inProgress = Array.isArray(rawInProgress) ? [...rawInProgress] : [];
                let backendSaved = Array.isArray(rawSaved) ? [...rawSaved] : [];
                let completed = Array.isArray(rawCompleted) ? [...rawCompleted] : [];

                if (Array.isArray(rawAll) && rawAll.length > 0 && inProgress.length === 0 && backendSaved.length === 0 && completed.length === 0) {
                    rawAll.forEach((course) => {
                        if (course.isSaved) backendSaved.push(course);
                        if (course.progress >= 100 || course.isCompleted) completed.push(course);
                        else if (course.isEnrolled || (course.progress > 0 && course.progress < 100)) inProgress.push(course);
                    });
                }

                // Merge and deduplicate all saved courses across backend and localStorage
                const mergedSaved = [];
                const seenSavedIds = new Set();

                const addCourseToMerged = (c) => {
                    const cid = String(getCourseId(c) || "");
                    if (cid && !seenSavedIds.has(cid)) {
                        seenSavedIds.add(cid);
                        mergedSaved.push(c);
                    }
                };

                backendSaved.forEach(addCourseToMerged);
                const storedSaved = loadSavedFromStorage();
                storedSaved.forEach(addCourseToMerged);

                saveToStorage(mergedSaved);

                state.myLearning = {
                    all: rawAll,
                    inProgress,
                    savedForLater: mergedSaved,
                    completed,
                    totalEnrolled: payload.totalEnrolled ?? inProgress.length,
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
                const courseId = payload.id || (typeof action.meta?.arg === "object" ? action.meta.arg.id : action.meta?.arg);
                const isSaved = payload.isSaved ?? payload.data?.isSaved ?? true;
                const courseInfo = payload.course || payload.data?.course;

                let currentSaved = Array.isArray(state.myLearning.savedForLater) ? [...state.myLearning.savedForLater] : [];

                if (isSaved) {
                    const exists = currentSaved.some(
                        (c) => String(getCourseId(c)) === String(courseId)
                    );
                    if (!exists) {
                        currentSaved.push({
                            id: courseId,
                            title: courseInfo?.title || courseInfo?.name || payload.title || payload.name || "Saved Course",
                            category: courseInfo?.category || courseInfo?.categoryName || payload.category || "Saved",
                            duration: courseInfo?.duration || courseInfo?.totalDuration || payload.duration || "Self-paced",
                            thumbnail: courseInfo?.thumbnail || payload.thumbnail,
                        });
                    }
                } else {
                    currentSaved = currentSaved.filter(
                        (c) => String(getCourseId(c)) !== String(courseId)
                    );
                }

                state.myLearning.savedForLater = currentSaved;
                saveToStorage(currentSaved);
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
                const courseId = action.meta.arg?.courseId;

                // Update inProgress item progress
                if (courseId) {
                    const idx = state.myLearning.inProgress.findIndex(
                        (item) => item.courseId === courseId || item.id === courseId
                    );
                    if (idx !== -1) {
                        const updatedProgress = payload.progressPercentage ?? state.myLearning.inProgress[idx].progress;
                        state.myLearning.inProgress[idx] = {
                            ...state.myLearning.inProgress[idx],
                            ...payload,
                            progress: updatedProgress,
                        };

                        // If 100% completed, move to completed list
                        if (updatedProgress >= 100 || payload.isCompleted) {
                            const completedItem = state.myLearning.inProgress[idx];
                            const existsInCompleted = state.myLearning.completed.some(
                                (c) => (c.id || c._id || c.courseId) === courseId
                            );
                            if (!existsInCompleted) {
                                state.myLearning.completed.push(completedItem);
                            }
                        }
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
