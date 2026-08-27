import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Card";

// Icons
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function QuizCard({ quiz }) {
    const navigate = useNavigate();

    const {
        id,
        title,
        shortCategory = "GENERAL",
        description,
        difficulty = "INTERMEDIATE",
        questionsCount = 15,
        durationMinutes = 20,
        status = "available", // 'available' | 'in-progress' | 'completed'
        progress,
        score,
    } = quiz;

    // Difficulty badge styling
    const getDifficultyStyles = (diff) => {
        switch (diff?.toUpperCase()) {
            case "BEGINNER":
                return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
            case "ADVANCED":
                return "text-rose-400 border-rose-500/20 bg-rose-500/10";
            case "INTERMEDIATE":
            default:
                return "text-indigo-400 border-indigo-500/20 bg-indigo-500/10";
        }
    };

    const handleAction = () => {
        if (status === "completed") {
            navigate(`/quizzes/${id}/result`);
        } else if (status === "in-progress") {
            navigate(`/quizzes/${id}/attempt`);
        } else {
            navigate(`/quizzes/${id}`);
        }
    };
    const handleReview = () => {
        navigate(`/quizzes/:quizId/result/review`);
    }
    return (
        <Card className="p-5 sm:p-6 bg-[#161B26] border border-white/5 rounded-2xl flex flex-col justify-between hover:border-white/15 transition-all duration-300 group">
            <div>
                {/* Top Tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 font-[Manrope]">
                        {shortCategory}
                    </span>
                    <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border font-[Manrope] ${getDifficultyStyles(
                            difficulty
                        )}`}
                    >
                        {difficulty}
                    </span>
                </div>

                {/* Quiz Title */}
                <h3 className="text-base sm:text-lg font-bold text-white font-[Poppins] group-hover:text-indigo-300 transition-colors line-clamp-1 mb-2">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-400 font-[Manrope] line-clamp-2 leading-relaxed mb-5">
                    {description}
                </p>
            </div>

            <div>
                {/* Status Specific Meta */}
                {status === "completed" && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-[Poppins] mb-4">
                        <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                        <span>{score || progress?.scorePercentage || 92}% Passed</span>
                    </div>
                )}

                {status === "in-progress" && (
                    <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 font-[Manrope]">
                            <span>Progress</span>
                            <span className="text-white font-[Poppins]">
                                {progress?.answeredCount || 4}/{progress?.totalCount || questionsCount} Qs
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                                style={{
                                    width: `${((progress?.answeredCount || 4) /
                                        (progress?.totalCount || questionsCount)) *
                                        100
                                        }%`,
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium font-[Manrope] pt-1">
                            <AccessTimeIcon sx={{ fontSize: 14 }} />
                            <span>14:22 Left</span>
                        </div>
                    </div>
                )}

                {status === "available" && (
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-[Manrope] mb-5">
                        <div className="flex items-center gap-1">
                            <HelpOutlineIcon sx={{ fontSize: 14 }} />
                            <span>{questionsCount} Qs</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <AccessTimeIcon sx={{ fontSize: 14 }} />
                            <span>{durationMinutes}m</span>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                {status === "available" && (
                    <button
                        type="button"
                        onClick={handleAction}
                        className="w-full py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold font-[Poppins] transition-all shadow-lg shadow-[#6366F1]/20 cursor-pointer"
                    >
                        Start Quiz
                    </button>
                )}

                {/* {status === "completed" && (
                    <button
                        type="button"
                        onClick={handleAction}
                        className="w-full py-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/10 text-white text-xs font-bold font-[Poppins] transition-all cursor-pointer"
                    >
                        View Result
                    </button>
                )} */}

                {status === "completed" && (
                    <div className="grid grid-cols-2 gap-2 w-full">
                        <button
                            type="button"
                            onClick={handleAction}
                            className="w-full py-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/10 text-white text-xs font-bold font-[Poppins] transition-all cursor-pointer"
                        >
                            View Result
                        </button>

                        <button
                            type="button"
                            onClick={handleReview}
                            className="w-full py-2.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold font-[Poppins] transition-all cursor-pointer"
                        >
                            Review
                        </button>
                    </div>
                )}

                {status === "in-progress" && (
                    <button
                        type="button"
                        onClick={handleAction}
                        className="w-full py-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/10 text-white text-xs font-bold font-[Poppins] transition-all cursor-pointer"
                    >
                        Resume Quiz
                    </button>
                )}
            </div>
        </Card>
    );
}
