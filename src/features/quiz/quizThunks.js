import { createAsyncThunk } from "@reduxjs/toolkit";
import { defaultQuizzes, defaultStats } from "../../data/quizData";
import { getActiveUserId } from "../addtoCart/cartSlice";

const STORAGE_PREFIX = "eduflow_quiz_attempt_";

export const getAttemptStorageKey = (quizId, userId) => {
    const uid = userId || getActiveUserId();
    return `${STORAGE_PREFIX}${quizId}_${uid}`;
};

export const loadAttemptFromStorage = (quizId, userId) => {
    try {
        const raw = localStorage.getItem(getAttemptStorageKey(quizId, userId));
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const saveAttemptToStorage = (quizId, state, userId) => {
    try {
        const key = getAttemptStorageKey(quizId, userId);
        const dataToSave = {
            currentQuestionIndex: state.currentQuestionIndex,
            answers: state.answers,
            markedQuestions: state.markedQuestions,
            timeRemaining: state.timeRemaining,
            updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(key, JSON.stringify(dataToSave));
    } catch {
        // ignore quota errors
    }
};

export const clearAttemptFromStorage = (quizId, userId) => {
    try {
        localStorage.removeItem(getAttemptStorageKey(quizId, userId));
    } catch {
        // ignore
    }
};

/**
 * Fetch list of all quizzes and overall stats
 */
export const fetchQuizzes = createAsyncThunk(
    "quiz/fetchQuizzes",
    async (_, { rejectWithValue }) => {
        try {
            // Simulated asynchronous fetch
            await new Promise((resolve) => setTimeout(resolve, 150));
            return {
                quizzes: defaultQuizzes,
                stats: defaultStats,
            };
        } catch (err) {
            return rejectWithValue(err?.message || "Failed to load quizzes");
        }
    }
);

/**
 * Fetch a specific quiz by ID along with its questions
 */
export const fetchQuizById = createAsyncThunk(
    "quiz/fetchQuizById",
    async (quizId, { rejectWithValue }) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const quiz = defaultQuizzes.find((q) => q.id === quizId);
            if (!quiz) {
                return rejectWithValue("Quiz not found");
            }
            return quiz;
        } catch (err) {
            return rejectWithValue(err?.message || "Failed to load quiz details");
        }
    }
);

/**
 * Submit quiz answers and calculate results
 */
export const submitQuizAttempt = createAsyncThunk(
    "quiz/submitQuizAttempt",
    async ({ quizId, answers = {}, timeTaken = 0 }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const quiz = state.quiz.currentQuiz || defaultQuizzes.find((q) => q.id === quizId);

            if (!quiz) {
                return rejectWithValue("Invalid quiz submission");
            }

            const questions = quiz.questions || [];
            let correctCount = 0;
            let incorrectCount = 0;
            let unansweredCount = 0;

            const questionBreakdown = questions.map((q) => {
                const selectedOption = answers[q.id];
                const isAnswered = selectedOption !== undefined && selectedOption !== null;
                const isCorrect = isAnswered && selectedOption === q.correctAnswer;

                if (!isAnswered) {
                    unansweredCount++;
                } else if (isCorrect) {
                    correctCount++;
                } else {
                    incorrectCount++;
                }

                return {
                    questionId: q.id,
                    question: q.question,
                    options: q.options,
                    selectedAnswer: selectedOption || null,
                    correctAnswer: q.correctAnswer,
                    isCorrect,
                    explanation: q.explanation || "",
                };
            });

            const totalQuestions = questions.length;
            const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
            const passed = percentage >= (quiz.passingScore || 70);

            const result = {
                quizId,
                quizTitle: quiz.title,
                category: quiz.category,
                totalQuestions,
                correctCount,
                incorrectCount,
                unansweredCount,
                percentage,
                passed,
                passingScore: quiz.passingScore || 70,
                timeTakenSeconds: timeTaken,
                answers,
                breakdown: questionBreakdown,
                submittedAt: new Date().toISOString(),
            };

            // Clear in-progress storage attempt
            clearAttemptFromStorage(quizId);

            return result;
        } catch (err) {
            return rejectWithValue(err?.message || "Failed to submit quiz");
        }
    }
);
