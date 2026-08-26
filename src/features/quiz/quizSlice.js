import { createSlice } from "@reduxjs/toolkit";
import {
    fetchQuizzes,
    fetchQuizById,
    submitQuizAttempt,
    loadAttemptFromStorage,
    saveAttemptToStorage,
} from "./quizThunks";
import { defaultQuizzes, defaultStats } from "../../data/quizData";

const initialState = {
    quizzes: defaultQuizzes,
    stats: defaultStats,
    currentQuiz: null,
    currentQuestionIndex: 0,
    answers: {}, // { [questionId]: optionId }
    markedQuestions: [], // array of questionIds
    timeRemaining: 0, // seconds
    quizStatus: "idle", // 'idle' | 'in-progress' | 'submitting' | 'submitted'
    lastResult: null,
    loading: false,
    error: null,
};

const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        startQuizSession: (state, action) => {
            const { quizId, durationMinutes } = action.payload;
            const saved = loadAttemptFromStorage(quizId);

            if (saved && saved.timeRemaining > 0) {
                state.currentQuestionIndex = saved.currentQuestionIndex || 0;
                state.answers = saved.answers || {};
                state.markedQuestions = saved.markedQuestions || [];
                state.timeRemaining = saved.timeRemaining;
            } else {
                state.currentQuestionIndex = 0;
                state.answers = {};
                state.markedQuestions = [];
                state.timeRemaining = (durationMinutes || 20) * 60;
            }

            state.quizStatus = "in-progress";
            state.lastResult = null;
        },

        setCurrentQuestionIndex: (state, action) => {
            state.currentQuestionIndex = action.payload;
            if (state.currentQuiz) {
                saveAttemptToStorage(state.currentQuiz.id, state);
            }
        },

        selectAnswer: (state, action) => {
            const { questionId, optionId } = action.payload;
            state.answers[questionId] = optionId;
            if (state.currentQuiz) {
                saveAttemptToStorage(state.currentQuiz.id, state);
            }
        },

        toggleMarkQuestion: (state, action) => {
            const questionId = action.payload;
            if (state.markedQuestions.includes(questionId)) {
                state.markedQuestions = state.markedQuestions.filter((id) => id !== questionId);
            } else {
                state.markedQuestions.push(questionId);
            }
            if (state.currentQuiz) {
                saveAttemptToStorage(state.currentQuiz.id, state);
            }
        },

        decrementTimer: (state) => {
            if (state.timeRemaining > 0) {
                state.timeRemaining -= 1;
                if (state.currentQuiz && state.timeRemaining % 5 === 0) {
                    saveAttemptToStorage(state.currentQuiz.id, state);
                }
            }
        },

        resetQuizState: (state) => {
            state.currentQuestionIndex = 0;
            state.answers = {};
            state.markedQuestions = [];
            state.timeRemaining = 0;
            state.quizStatus = "idle";
            state.lastResult = null;
        },

        clearCurrentQuiz: (state) => {
            state.currentQuiz = null;
            state.currentQuestionIndex = 0;
            state.answers = {};
            state.markedQuestions = [];
            state.timeRemaining = 0;
            state.quizStatus = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            // ── fetchQuizzes ────────────────────────────────────────────────
            .addCase(fetchQuizzes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.quizzes = action.payload.quizzes || defaultQuizzes;
                state.stats = action.payload.stats || defaultStats;
            })
            .addCase(fetchQuizzes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ── fetchQuizById ───────────────────────────────────────────────
            .addCase(fetchQuizById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentQuiz = action.payload;
            })
            .addCase(fetchQuizById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ── submitQuizAttempt ───────────────────────────────────────────
            .addCase(submitQuizAttempt.pending, (state) => {
                state.quizStatus = "submitting";
                state.loading = true;
            })
            .addCase(submitQuizAttempt.fulfilled, (state, action) => {
                state.loading = false;
                state.quizStatus = "submitted";
                state.lastResult = action.payload;

                // Update local quiz status in state list
                const quizId = action.payload.quizId;
                const idx = state.quizzes.findIndex((q) => q.id === quizId);
                if (idx !== -1) {
                    state.quizzes[idx] = {
                        ...state.quizzes[idx],
                        status: "completed",
                        score: action.payload.percentage,
                        progress: {
                            answeredCount: action.payload.totalQuestions,
                            totalCount: action.payload.totalQuestions,
                            scorePercentage: action.payload.percentage,
                            passed: action.payload.passed,
                        },
                    };
                }
            })
            .addCase(submitQuizAttempt.rejected, (state, action) => {
                state.loading = false;
                state.quizStatus = "in-progress";
                state.error = action.payload;
            });
    },
});

export const {
    startQuizSession,
    setCurrentQuestionIndex,
    selectAnswer,
    toggleMarkQuestion,
    decrementTimer,
    resetQuizState,
    clearCurrentQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
