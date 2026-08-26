import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Redux
import {
    fetchQuizById,
    submitQuizAttempt,
} from "../../features/quiz/quizThunks";
import {
    startQuizSession,
    setCurrentQuestionIndex,
    selectAnswer,
    toggleMarkQuestion,
    decrementTimer,
} from "../../features/quiz/quizSlice";

// Components
import QuestionCard from "../../components/quiz/QuestionCard";
import QuestionNavigator from "../../components/quiz/QuestionNavigator";
import QuizTimer from "../../components/quiz/QuizTimer";
import QuizProgress from "../../components/quiz/QuizProgress";
import SubmitQuizDialog from "../../components/quiz/SubmitQuizDialog";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function QuizAttempt() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        currentQuiz,
        currentQuestionIndex = 0,
        answers = {},
        markedQuestions = [],
        timeRemaining = 1200,
        quizStatus,
        loading,
    } = useSelector((state) => state.quiz);

    const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
    const [exitDialogOpen, setExitDialogOpen] = useState(false);

    // Initial load and session setup
    useEffect(() => {
        if (quizId && (!currentQuiz || currentQuiz.id !== quizId)) {
            dispatch(fetchQuizById(quizId)).unwrap().then((quiz) => {
                if (quiz) {
                    dispatch(
                        startQuizSession({
                            quizId: quiz.id,
                            durationMinutes: quiz.durationMinutes || 20,
                        })
                    );
                }
            });
        }
    }, [quizId, currentQuiz, dispatch]);

    const questions = currentQuiz?.questions || [];
    const totalQuestions = questions.length || currentQuiz?.questionsCount || 15;
    const currentQuestion = questions[currentQuestionIndex];
    const currentQuestionId = currentQuestion?.id || `q${currentQuestionIndex + 1}`;
    const isCurrentMarked = markedQuestions.includes(currentQuestionId);
    const selectedOptionId = answers[currentQuestionId] || null;

    const answeredCount = Object.keys(answers).length;

    // Handlers
    const handleSelectOption = (optionId) => {
        if (!currentQuestionId) return;
        dispatch(selectAnswer({ questionId: currentQuestionId, optionId }));
    };

    const handleToggleMark = () => {
        if (!currentQuestionId) return;
        dispatch(toggleMarkQuestion(currentQuestionId));
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1));
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
        } else {
            setSubmitDialogOpen(true);
        }
    };

    const handleSelectQuestionFromNav = (index) => {
        if (index >= 0 && index < totalQuestions) {
            dispatch(setCurrentQuestionIndex(index));
        }
    };

    const handleTimerTick = () => {
        dispatch(decrementTimer());
    };

    const handleTimeUp = () => {
        handleSubmitConfirmed();
    };

    const handleSubmitConfirmed = async () => {
        const totalDurationSec = (currentQuiz?.durationMinutes || 20) * 60;
        const timeTaken = Math.max(0, totalDurationSec - timeRemaining);

        const res = await dispatch(
            submitQuizAttempt({
                quizId: currentQuiz?.id || quizId,
                answers,
                timeTaken,
            })
        ).unwrap();

        if (res) {
            navigate(`/quizzes/${currentQuiz?.id || quizId}/result`, {
                state: { result: res },
                replace: true,
            });
        }
    };

    const handleExitQuiz = () => {
        navigate(`/quizzes/${quizId}`);
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col justify-between">
            {/* Top Navigation Bar matching Screenshot 1 */}
            <header className="h-16 px-4 sm:px-8 border-b border-white/10 bg-[#0B0F19]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
                {/* Left: Close icon + Title + Category */}
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        type="button"
                        onClick={() => setExitDialogOpen(true)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        title="Exit Quiz"
                    >
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </button>

                    <div className="flex flex-col min-w-0">
                        <h1 className="text-sm sm:text-base font-bold text-white font-[Poppins] truncate">
                            {currentQuiz?.title || "Node.js Fundamentals Quiz"}
                        </h1>
                        <span className="text-[11px] text-gray-400 font-[Manrope] truncate">
                            {currentQuiz?.category || "Backend Development Bootcamp"}
                        </span>
                    </div>
                </div>

                {/* Right: Live Countdown Timer + Submit Button */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <QuizTimer
                        timeRemaining={timeRemaining}
                        onTick={handleTimerTick}
                        onTimeUp={handleTimeUp}
                    />

                    <button
                        type="button"
                        onClick={() => setSubmitDialogOpen(true)}
                        className="px-4 sm:px-5 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold font-[Poppins] transition-all shadow-lg shadow-[#6366F1]/20 cursor-pointer"
                    >
                        Submit Quiz
                    </button>
                </div>
            </header>

            {/* Main Interactive Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
                {/* Progress bar */}
                <QuizProgress
                    currentIndex={currentQuestionIndex}
                    totalQuestions={totalQuestions}
                />

                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Main: Question Card + Bottom Navigation */}
                    <div className="lg:col-span-8 flex flex-col space-y-6">
                        <QuestionCard
                            question={currentQuestion}
                            questionIndex={currentQuestionIndex}
                            selectedOptionId={selectedOptionId}
                            onSelectOption={handleSelectOption}
                        />

                        {/* Bottom Actions Bar matching Screenshot 1 */}
                        <div className="flex items-center justify-between pt-2">
                            {/* Previous Button */}
                            <button
                                type="button"
                                disabled={currentQuestionIndex === 0}
                                onClick={handlePrevious}
                                className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white text-xs font-semibold font-[Poppins] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ArrowBackIcon sx={{ fontSize: 15 }} />
                                <span>Previous</span>
                            </button>

                            {/* Mark for Review Toggle */}
                            <button
                                type="button"
                                onClick={handleToggleMark}
                                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold font-[Poppins] transition-all flex items-center gap-1.5 cursor-pointer ${
                                    isCurrentMarked
                                        ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                                        : "border-white/10 bg-transparent text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10"
                                }`}
                            >
                                {isCurrentMarked ? (
                                    <BookmarkIcon sx={{ fontSize: 16 }} />
                                ) : (
                                    <BookmarkBorderIcon sx={{ fontSize: 16 }} />
                                )}
                                <span>{isCurrentMarked ? "Marked for Review" : "Mark for Review"}</span>
                            </button>

                            {/* Next / Finish Button */}
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold font-[Poppins] transition-all shadow-lg shadow-[#6366F1]/20 flex items-center gap-1.5 cursor-pointer"
                            >
                                <span>{currentQuestionIndex === totalQuestions - 1 ? "Submit" : "Next"}</span>
                                <ArrowForwardIcon sx={{ fontSize: 15 }} />
                            </button>
                        </div>
                    </div>

                    {/* Right Sidebar: Question Navigator */}
                    <div className="lg:col-span-4 w-full">
                        <QuestionNavigator
                            totalQuestions={totalQuestions}
                            currentIndex={currentQuestionIndex}
                            answers={answers}
                            markedQuestions={markedQuestions}
                            questions={questions}
                            onSelectQuestion={handleSelectQuestionFromNav}
                        />
                    </div>
                </div>
            </main>

            {/* Submit Confirmation Dialog */}
            <SubmitQuizDialog
                open={submitDialogOpen}
                onClose={() => setSubmitDialogOpen(false)}
                onConfirm={handleSubmitConfirmed}
                answeredCount={answeredCount}
                totalQuestions={totalQuestions}
                isSubmitting={quizStatus === "submitting"}
            />

            {/* Exit Warning Dialog */}
            <SubmitQuizDialog
                open={exitDialogOpen}
                onClose={() => setExitDialogOpen(false)}
                onConfirm={handleExitQuiz}
                answeredCount={answeredCount}
                totalQuestions={totalQuestions}
                isSubmitting={false}
            />
        </div>
    );
}
