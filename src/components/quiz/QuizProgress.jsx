import React from "react";

export default function QuizProgress({
    currentIndex = 0,
    totalQuestions = 15,
}) {
    const currentNumber = currentIndex + 1;
    const progressPercent = totalQuestions > 0 ? Math.round((currentNumber / totalQuestions) * 100) : 0;

    return (
        <div className="w-full mb-6">
            <div className="flex items-center justify-between text-xs font-semibold font-[Manrope] text-gray-400 mb-2">
                <span>
                    Question {currentNumber} of {totalQuestions}
                </span>
                <span className="text-gray-300 font-[Poppins]">
                    {progressPercent}% Completed
                </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#6366F1] rounded-full transition-all duration-300 shadow-sm shadow-indigo-500/50"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
}
