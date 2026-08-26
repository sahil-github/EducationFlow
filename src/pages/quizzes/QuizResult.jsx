import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "../../components/Card";

// Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

export default function QuizResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const { quizId } = useParams();

    // Result can come from navigation state or from Redux
    const reduxResult = useSelector((state) => state.quiz.lastResult);
    const result = location.state?.result || reduxResult;

    // Fallback for direct navigation without result
    if (!result) {
        return (
            <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <p className="text-gray-400 font-[Manrope] text-sm">No result data found.</p>
                    <button
                        type="button"
                        onClick={() => navigate("/quizzes")}
                        className="px-5 py-2.5 rounded-xl bg-[#6366F1] text-white text-xs font-bold font-[Poppins] cursor-pointer"
                    >
                        Back to My Quizzes
                    </button>
                </div>
            </div>
        );
    }

    const {
        quizTitle = "Quiz Completed",
        category = "",
        percentage = 0,
        passed = false,
        correctCount = 0,
        incorrectCount = 0,
        unansweredCount = 0,
        totalQuestions = 15,
        passingScore = 70,
        breakdown = [],
    } = result;

    const getScoreColor = () => {
        if (passed) return "text-emerald-400";
        if (percentage >= passingScore * 0.8) return "text-amber-400";
        return "text-rose-400";
    };

    const getScoreBgColor = () => {
        if (passed) return "bg-emerald-500/10 border-emerald-500/20";
        if (percentage >= passingScore * 0.8) return "bg-amber-500/10 border-amber-500/20";
        return "bg-rose-500/10 border-rose-500/20";
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
            {/* Minimalist Header */}
            <header className="px-6 py-5 border-b border-white/5 flex items-center">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg font-[Poppins] text-white">EduFlow</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-xs font-semibold text-gray-400 font-[Manrope] uppercase tracking-wider">LMS</span>
                </div>
            </header>

            {/* Main Result Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
                <div className="w-full max-w-2xl space-y-5">
                    {/* Score Banner Card */}
                    <Card className={`p-8 sm:p-10 ${getScoreBgColor()} border rounded-2xl text-center relative overflow-hidden`}>
                        {/* Ambient Glow */}
                        <div className={`absolute inset-0 rounded-2xl ${passed ? "bg-emerald-500/5" : "bg-rose-500/5"} pointer-events-none`} />

                        <div className="relative z-10">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 font-[Manrope] mb-2">
                                {category}
                            </p>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-[Poppins] mb-6">
                                {quizTitle}
                            </h1>

                            {/* Score percentage */}
                            <div className={`text-6xl sm:text-7xl font-black font-[Poppins] tracking-tight ${getScoreColor()} mb-2`}>
                                {percentage}%
                            </div>

                            {/* Pass / Fail badge */}
                            <div className="flex items-center justify-center gap-2 mt-2 mb-1">
                                {passed ? (
                                    <CheckCircleIcon sx={{ fontSize: 20, color: "#34D399" }} />
                                ) : (
                                    <CancelOutlinedIcon sx={{ fontSize: 20, color: "#FB7185" }} />
                                )}
                                <span className={`text-base font-bold font-[Poppins] ${passed ? "text-emerald-400" : "text-rose-400"}`}>
                                    {passed ? "Passed" : "Failed"}
                                </span>
                            </div>

                            <p className="text-xs text-gray-400 font-[Manrope] mt-1">
                                Passing score: {passingScore}%
                            </p>

                            {/* Quick score summary */}
                            <div className="mt-4 text-sm text-gray-300 font-[Poppins] font-semibold">
                                {correctCount} / {totalQuestions} Correct
                            </div>
                        </div>
                    </Card>

                    {/* Breakdown Stats Card */}
                    <Card className="bg-[#161B26] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-3 divide-x divide-white/5">
                            <div className="p-5 flex flex-col items-center text-center">
                                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
                                    <CheckOutlinedIcon sx={{ fontSize: 17, color: "#34D399" }} />
                                </div>
                                <span className="text-xl font-extrabold text-white font-[Poppins]">{correctCount}</span>
                                <span className="text-[11px] text-gray-400 font-[Manrope] font-medium mt-0.5">Correct</span>
                            </div>

                            <div className="p-5 flex flex-col items-center text-center">
                                <div className="w-9 h-9 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-2">
                                    <CloseIcon sx={{ fontSize: 17, color: "#FB7185" }} />
                                </div>
                                <span className="text-xl font-extrabold text-white font-[Poppins]">{incorrectCount}</span>
                                <span className="text-[11px] text-gray-400 font-[Manrope] font-medium mt-0.5">Incorrect</span>
                            </div>

                            <div className="p-5 flex flex-col items-center text-center">
                                <div className="w-9 h-9 rounded-full bg-gray-500/10 border border-gray-500/20 flex items-center justify-center mb-2">
                                    <HelpOutlineIcon sx={{ fontSize: 17, color: "#94A3B8" }} />
                                </div>
                                <span className="text-xl font-extrabold text-white font-[Poppins]">{unansweredCount}</span>
                                <span className="text-[11px] text-gray-400 font-[Manrope] font-medium mt-0.5">Unanswered</span>
                            </div>
                        </div>
                    </Card>

                    {/* Detailed Breakdown (collapsed view) */}
                    {breakdown.length > 0 && (
                        <Card className="bg-[#161B26] border border-white/10 rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                                <AssignmentOutlinedIcon sx={{ fontSize: 18, color: "#818CF8" }} />
                                <h2 className="text-sm font-bold text-white font-[Poppins]">Answer Breakdown</h2>
                            </div>

                            <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                                {breakdown.map((item, idx) => {
                                    const selectedOption = item.options?.find((o) => o.id === item.selectedAnswer);
                                    const correctOption = item.options?.find((o) => o.id === item.correctAnswer);

                                    return (
                                        <div key={item.questionId || idx} className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                                    item.isCorrect
                                                        ? "bg-emerald-500/15 border border-emerald-500/30"
                                                        : "bg-rose-500/15 border border-rose-500/30"
                                                }`}>
                                                    {item.isCorrect ? (
                                                        <CheckOutlinedIcon sx={{ fontSize: 12, color: "#34D399" }} />
                                                    ) : (
                                                        <CloseIcon sx={{ fontSize: 12, color: "#FB7185" }} />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-white font-[Poppins] leading-snug mb-1.5">
                                                        Q{idx + 1}. {item.question}
                                                    </p>

                                                    {!item.isCorrect && selectedOption && (
                                                        <p className="text-[11px] text-rose-400 font-[Manrope]">
                                                            Your answer: {selectedOption.label}
                                                        </p>
                                                    )}
                                                    {!item.isCorrect && correctOption && (
                                                        <p className="text-[11px] text-emerald-400 font-[Manrope] font-semibold">
                                                            Correct: {correctOption.label}
                                                        </p>
                                                    )}
                                                    {item.isCorrect && selectedOption && (
                                                        <p className="text-[11px] text-emerald-400 font-[Manrope]">
                                                            {selectedOption.label}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate("/quizzes")}
                            className="flex-1 py-3 px-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white text-xs font-bold font-[Poppins] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <ArrowBackIcon sx={{ fontSize: 16 }} />
                            <span>Back to My Quizzes</span>
                        </button>

                        {!passed && (
                            <button
                                type="button"
                                onClick={() => navigate(`/quizzes/${quizId}`)}
                                className="flex-1 py-3 px-5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold font-[Poppins] transition-all shadow-lg shadow-[#6366F1]/20 cursor-pointer"
                            >
                                Retry Quiz
                            </button>
                        )}
                    </div>
                </div>
            </main>

            <footer className="py-5 text-center text-xs text-gray-500 font-[Manrope] border-t border-white/5">
                &copy; {new Date().getFullYear()} EduFlow LMS. All rights reserved.
            </footer>
        </div>
    );
}
