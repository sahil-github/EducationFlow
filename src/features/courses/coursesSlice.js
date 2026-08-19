import { createSlice } from "@reduxjs/toolkit";
import {
    fetchCourses,
    fetchCategories,
    fetchCourseById,
    fetchCoursePlayer,
    enrollInCourse,
    fetchMyLearning,
    saveCourseThunk,
    completeLessonInCourse,
    getCourseNotes,
    addCourseNote,
    deleteCourseNote,
    getCourseQnA,
    addCourseQuestion,
    replyToQuestion,
    upvoteQuestion,
    getCourseResources,
    downloadCourseResource,
    fetchLessonById,
    saveLessonProgress,
} from "./coursesThunks";

const initialState = {
    courses: [],
    categories: [],
    currentCourse: null,
    coursePlayerData: null,
    coursePlayerLoading: false,
    coursePlayerError: null,
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

    // Notes State
    notesList: [],
    notesLoading: false,
    notesError: null,
    addingNote: false,
    deletingNoteId: null,

    // Q&A State
    qnaList: [],
    qnaLoading: false,
    qnaError: null,
    addingQuestion: false,
    replyingQuestionId: null,
    upvotingQuestionId: null,

    // Resources State
    resourcesList: [],
    resourcesLoading: false,
    resourcesError: null,
    downloadingResourceId: null,

    // Active Lesson State (by ID)
    activeLessonData: null,
    lessonLoading: false,
    lessonError: null,

    // Video Progress State
    videoProgress: null,
    videoProgressLoading: false,
    videoProgressError: null,
};

const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
            state.courseDetailsError = null;
        },
        clearCoursePlayer: (state) => {
            state.coursePlayerData = null;
            state.coursePlayerError = null;
            state.activeLessonData = null;
            state.notesList = [];
            state.qnaList = [];
            state.resourcesList = [];
        },
        clearNotesList: (state) => {
            state.notesList = [];
            state.notesError = null;
        },
        clearActiveLessonData: (state) => {
            state.activeLessonData = null;
            state.lessonError = null;
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
                // Backend may nest under payload.data or return directly
                const raw = action.payload ?? {};
                const payload = raw.data ?? raw;

                // Support both "savedForLater" and "saved" field names from backend
                const savedRaw = payload.savedForLater ?? payload.saved ?? [];

                // Deduplicate completed courses by resolved ID
                const completedRaw = payload.completed ?? [];
                const getIdStr = (c) => {
                    if (c?.course?.id) return String(c.course.id);
                    if (c?.course?._id) return String(c.course._id);
                    const id = c?.courseId || c?.id || c?._id;
                    return id ? String(id).replace(/^(sv_|save_)/, "") : "";
                };
                const seen = new Set();
                const completedDeduped = completedRaw.filter((c) => {
                    const key = getIdStr(c);
                    if (!key || seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });

                state.myLearning = {
                    all: payload.all ?? [],
                    inProgress: payload.inProgress ?? [],
                    savedForLater: savedRaw,
                    completed: completedDeduped,
                    totalEnrolled: payload.totalEnrolled ?? 0,
                };
            })
            .addCase(fetchMyLearning.rejected, (state, action) => {
                state.myLearningLoading = false;
                state.myLearningError = action.payload ?? "Failed to fetch my learning";
            })

            // fetchCoursePlayer
            .addCase(fetchCoursePlayer.pending, (state) => {
                state.coursePlayerLoading = true;
                state.coursePlayerError = null;
            })
            .addCase(fetchCoursePlayer.fulfilled, (state, action) => {
                state.coursePlayerLoading = false;
                state.coursePlayerData = action.payload;
            })
            .addCase(fetchCoursePlayer.rejected, (state, action) => {
                state.coursePlayerLoading = false;
                state.coursePlayerError = action.payload ?? "Failed to load course player";
            })

            // saveCourseThunk
            .addCase(saveCourseThunk.fulfilled, (state, action) => {
                if (state.currentCourse && state.currentCourse.id === action.payload?.id) {
                    state.currentCourse = { ...state.currentCourse, ...action.payload };
                }
            })

            // completeLessonInCourse
            .addCase(completeLessonInCourse.fulfilled, (state, action) => {
                if (state.currentCourse && action.payload) {
                    state.currentCourse = { ...state.currentCourse, ...action.payload };
                }
                if (state.coursePlayerData && action.payload?.progressPercentage !== undefined) {
                    state.coursePlayerData = {
                        ...state.coursePlayerData,
                        progressPercentage: action.payload.progressPercentage,
                    };
                }
            })

            // ── Notes ───────────────────────────────────────────────────────
            .addCase(getCourseNotes.pending, (state) => {
                state.notesLoading = true;
                state.notesError = null;
            })
            .addCase(getCourseNotes.fulfilled, (state, action) => {
                state.notesLoading = false;
                const payload = action.payload;
                state.notesList = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.notes)
                        ? payload.notes
                        : Array.isArray(payload?.data)
                            ? payload.data
                            : payload ?? [];
            })
            .addCase(getCourseNotes.rejected, (state, action) => {
                state.notesLoading = false;
                state.notesError = action.payload ?? "Failed to fetch notes";
            })

            .addCase(addCourseNote.pending, (state) => {
                state.addingNote = true;
                state.notesError = null;
            })
            .addCase(addCourseNote.fulfilled, (state, action) => {
                state.addingNote = false;
                const newNote = action.payload?.data ?? action.payload?.note ?? action.payload;
                if (!newNote) return;

                if (Array.isArray(state.notesList)) {
                    state.notesList.unshift(newNote);
                } else if (state.notesList && typeof state.notesList === "object") {
                    const lid = newNote.lessonId || "default";
                    if (!Array.isArray(state.notesList[lid])) {
                        state.notesList[lid] = [];
                    }
                    state.notesList[lid].unshift(newNote);
                } else {
                    state.notesList = [newNote];
                }
            })
            .addCase(addCourseNote.rejected, (state, action) => {
                state.addingNote = false;
                state.notesError = action.payload ?? "Failed to add note";
            })

            .addCase(deleteCourseNote.pending, (state, action) => {
                state.deletingNoteId = action.meta.arg?.noteId;
            })
            .addCase(deleteCourseNote.fulfilled, (state, action) => {
                state.deletingNoteId = null;
                const targetId = action.meta.arg?.noteId;
                if (Array.isArray(state.notesList)) {
                    state.notesList = state.notesList.filter(
                        (n) => (n.id || n._id || n.noteId) !== targetId
                    );
                } else if (state.notesList && typeof state.notesList === "object") {
                    for (const key of Object.keys(state.notesList)) {
                        if (Array.isArray(state.notesList[key])) {
                            state.notesList[key] = state.notesList[key].filter(
                                (n) => (n.id || n._id || n.noteId) !== targetId
                            );
                        }
                    }
                }
            })
            .addCase(deleteCourseNote.rejected, (state) => {
                state.deletingNoteId = null;
            })

            // ── Q&A ─────────────────────────────────────────────────────────
            .addCase(getCourseQnA.pending, (state) => {
                state.qnaLoading = true;
                state.qnaError = null;
            })
            .addCase(getCourseQnA.fulfilled, (state, action) => {
                state.qnaLoading = false;
                const payload = action.payload;
                state.qnaList = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.qna)
                        ? payload.qna
                        : Array.isArray(payload?.questions)
                            ? payload.questions
                            : Array.isArray(payload?.data)
                                ? payload.data
                                : [];
            })
            .addCase(getCourseQnA.rejected, (state, action) => {
                state.qnaLoading = false;
                state.qnaError = action.payload ?? "Failed to fetch Q&A questions";
            })

            .addCase(addCourseQuestion.pending, (state) => {
                state.addingQuestion = true;
                state.qnaError = null;
            })
            .addCase(addCourseQuestion.fulfilled, (state, action) => {
                state.addingQuestion = false;
                const newQ = action.payload?.data ?? action.payload?.question ?? action.payload;
                if (newQ) {
                    if (!Array.isArray(state.qnaList)) state.qnaList = [];
                    state.qnaList.unshift({
                        ...newQ,
                        replies: newQ.replies || [],
                        upvotes: newQ.upvotes || 0,
                    });
                }
            })
            .addCase(addCourseQuestion.rejected, (state, action) => {
                state.addingQuestion = false;
                state.qnaError = action.payload ?? "Failed to post question";
            })

            .addCase(replyToQuestion.pending, (state, action) => {
                state.replyingQuestionId = action.meta.arg?.questionId;
            })
            .addCase(replyToQuestion.fulfilled, (state, action) => {
                state.replyingQuestionId = null;
                const { questionId } = action.meta.arg;
                const replyPayload = action.payload?.data ?? action.payload;
                const replyObj = replyPayload?.reply ?? replyPayload;

                if (Array.isArray(state.qnaList)) {
                    const qIdx = state.qnaList.findIndex(
                        (q) => (q.id || q._id || q.questionId) === questionId
                    );
                    if (qIdx !== -1) {
                        if (!Array.isArray(state.qnaList[qIdx].replies)) {
                            state.qnaList[qIdx].replies = [];
                        }
                        state.qnaList[qIdx].replies.push(replyObj);
                    }
                }
            })
            .addCase(replyToQuestion.rejected, (state) => {
                state.replyingQuestionId = null;
            })

            .addCase(upvoteQuestion.pending, (state, action) => {
                state.upvotingQuestionId = action.meta.arg?.questionId;
            })
            .addCase(upvoteQuestion.fulfilled, (state, action) => {
                state.upvotingQuestionId = null;
                const { questionId } = action.meta.arg;
                const resData = action.payload?.data ?? action.payload;

                if (Array.isArray(state.qnaList)) {
                    const qIdx = state.qnaList.findIndex(
                        (q) => (q.id || q._id || q.questionId) === questionId
                    );
                    if (qIdx !== -1) {
                        if (resData?.upvotes !== undefined) {
                            state.qnaList[qIdx].upvotes = resData.upvotes;
                        } else {
                            state.qnaList[qIdx].upvotes = (state.qnaList[qIdx].upvotes || 0) + 1;
                        }
                        state.qnaList[qIdx].isUpvoted = true;
                    }
                }
            })
            .addCase(upvoteQuestion.rejected, (state) => {
                state.upvotingQuestionId = null;
            })

            // ── Resources ───────────────────────────────────────────────────
            .addCase(getCourseResources.pending, (state) => {
                state.resourcesLoading = true;
                state.resourcesError = null;
            })
            .addCase(getCourseResources.fulfilled, (state, action) => {
                state.resourcesLoading = false;
                const payload = action.payload;
                state.resourcesList = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.resources)
                        ? payload.resources
                        : Array.isArray(payload?.data)
                            ? payload.data
                            : [];
            })
            .addCase(getCourseResources.rejected, (state, action) => {
                state.resourcesLoading = false;
                state.resourcesError = action.payload ?? "Failed to fetch resources";
            })

            .addCase(downloadCourseResource.pending, (state, action) => {
                state.downloadingResourceId = action.meta.arg?.resourceId;
            })
            .addCase(downloadCourseResource.fulfilled, (state) => {
                state.downloadingResourceId = null;
            })
            .addCase(downloadCourseResource.rejected, (state) => {
                state.downloadingResourceId = null;
            })

            // ── Lesson by ID ────────────────────────────────────────────────
            .addCase(fetchLessonById.pending, (state) => {
                state.lessonLoading = true;
                state.lessonError = null;
            })
            .addCase(fetchLessonById.fulfilled, (state, action) => {
                state.lessonLoading = false;
                state.activeLessonData = action.payload;
            })
            .addCase(fetchLessonById.rejected, (state, action) => {
                state.lessonLoading = false;
                state.lessonError = action.payload ?? "Failed to fetch lesson details";
            })

            // ── Video Progress ──────────────────────────────────────────────
            .addCase(saveLessonProgress.pending, (state) => {
                state.videoProgressLoading = true;
                state.videoProgressError = null;
            })
            .addCase(saveLessonProgress.fulfilled, (state, action) => {
                state.videoProgressLoading = false;
                state.videoProgress = action.payload;
            })
            .addCase(saveLessonProgress.rejected, (state, action) => {
                state.videoProgressLoading = false;
                state.videoProgressError = action.payload ?? "Failed to save video progress";
            });
    },
});

export const {
    clearCurrentCourse,
    clearCoursePlayer,
    clearNotesList,
    clearActiveLessonData,
} = coursesSlice.actions;

export default coursesSlice.reducer;
