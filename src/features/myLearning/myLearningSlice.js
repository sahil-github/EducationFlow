import { createSlice, isAnyOf } from "@reduxjs/toolkit";
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

const loadCompletedFromStorage = () => {
    try {
        const stored = localStorage.getItem("eduflow_completed_courses");
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveCompletedToStorage = (list) => {
    try {
        localStorage.setItem("eduflow_completed_courses", JSON.stringify(list));
    } catch {}
};

const initialState = {
    myLearning: {
        all: [],
        inProgress: [],
        savedForLater: loadSavedFromStorage(),
        completed: loadCompletedFromStorage(),
        totalEnrolled: 0,
    },
    loading: false,
    error: null,
    saveLoading: false,
    saveError: null,
    completeLessonLoading: false,
    completeLessonError: null,
};

// ── Shared completion logic ────────────────────────────────────────────────
// Handles both myLearning/completeLesson and courses/completeLesson payloads
const applyLessonCompletion = (state, payload, courseId) => {
    if (!courseId) return;

    const inProgress = state.myLearning.inProgress;
    const idx = inProgress.findIndex(
        (item) =>
            String(getCourseId(item)) === String(courseId) ||
            item.courseId === courseId ||
            item.id === courseId ||
            item._id === courseId
    );

    const updatedProgress =
        payload?.progressPercentage ??
        payload?.progress ??
        (idx !== -1 ? inProgress[idx].progress : 100);

    if (idx !== -1) {
        state.myLearning.inProgress[idx] = {
            ...inProgress[idx],
            progress: updatedProgress,
            progressPercentage: updatedProgress,
        };
    }

    // If 100% complete, move course from inProgress → completed
    if (updatedProgress >= 100 || payload?.isCompleted === true) {
        const baseItem = idx !== -1 ? inProgress[idx] : null;
        const completedItem = {
            ...(baseItem || {}),
            id: courseId,
            courseId: courseId,
            title: payload?.courseTitle || baseItem?.title || baseItem?.name || "Completed Course",
            category: payload?.category || baseItem?.category || "Course",
            duration: payload?.duration || baseItem?.duration || "Self-paced",
            progress: 100,
            progressPercentage: 100,
            isCompleted: true,
            completedAt: payload?.completedAt || new Date().toISOString(),
        };

        const alreadyComplete = state.myLearning.completed.some(
            (c) => String(getCourseId(c)) === String(courseId)
        );

        if (!alreadyComplete) {
            state.myLearning.completed.push(completedItem);
        }

        if (idx !== -1) {
            state.myLearning.inProgress.splice(idx, 1);
        }

        saveCompletedToStorage(state.myLearning.completed);
    }
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
        // Allows external dispatchers (e.g. CoursePlayer) to directly mark
        // a course as completed by courseId without going through the thunk
        markCourseCompleted: (state, action) => {
            const { courseId, courseTitle, category, duration, completedAt } = action.payload ?? {};
            applyLessonCompletion(
                state,
                { progressPercentage: 100, isCompleted: true, courseTitle, category, duration, completedAt },
                courseId
            );
        },
    },
    extraReducers: (builder) => {
        builder
            // Reset state on user logout
            .addCase("auth/logout", () => {
                localStorage.removeItem("eduflow_saved_courses");
                localStorage.removeItem("eduflow_completed_courses");
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

                // Merge and deduplicate completed courses across backend and localStorage
                const mergedCompleted = [];
                const seenCompletedIds = new Set();

                const addCourseToCompleted = (c) => {
                    const cid = String(getCourseId(c) || "");
                    if (cid && !seenCompletedIds.has(cid)) {
                        seenCompletedIds.add(cid);
                        mergedCompleted.push(c);
                    }
                };

                completed.forEach(addCourseToCompleted);
                const storedCompleted = loadCompletedFromStorage();
                storedCompleted.forEach(addCourseToCompleted);

                saveCompletedToStorage(mergedCompleted);

                // Exclude any courses in inProgress that are already completed
                const filteredInProgress = inProgress.filter((c) => {
                    const cid = String(getCourseId(c) || "");
                    const is100 = (c.progress ?? c.progressPercent ?? 0) >= 100 || c.isCompleted;
                    return !is100 && !seenCompletedIds.has(cid);
                });

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
                    inProgress: filteredInProgress,
                    savedForLater: mergedSaved,
                    completed: mergedCompleted,
                    totalEnrolled: payload.totalEnrolled ?? filteredInProgress.length,
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

            // ── completeLessonInCourse (myLearning thunk) ───────────────────
            .addCase(completeLessonInCourse.pending, (state) => {
                state.completeLessonLoading = true;
                state.completeLessonError = null;
            })
            .addCase(completeLessonInCourse.fulfilled, (state, action) => {
                state.completeLessonLoading = false;
                const payload = action.payload ?? {};
                const courseId = action.meta.arg?.courseId ?? payload.courseId;
                applyLessonCompletion(state, payload, courseId);
            })
            .addCase(completeLessonInCourse.rejected, (state, action) => {
                state.completeLessonLoading = false;
                state.completeLessonError = action.payload ?? "Failed to mark lesson complete";
            })

            // ── Listen to courses/completeLesson (from CoursePlayer's thunk) ─
            // CoursePlayer dispatches completeLessonInCourse from coursesThunks.js
            // which has action type "courses/completeLesson". We react to that here
            // so My Learning reflects completions even when navigating from the player.
            .addMatcher(
                (action) => action.type === "courses/completeLesson/fulfilled",
                (state, action) => {
                    const payload = action.payload ?? {};
                    // courses thunk payload: { courseId, lessonId, progressPercentage, ... }
                    const courseId =
                        action.meta?.arg?.courseId ??
                        payload.courseId ??
                        action.payload?.courseId;
                    applyLessonCompletion(state, payload, courseId);
                }
            );
    },
});

export const { clearMyLearningError, markCourseCompleted } = myLearningSlice.actions;
export default myLearningSlice.reducer;
