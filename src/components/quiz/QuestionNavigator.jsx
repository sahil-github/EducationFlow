import React from "react";
import Card from "../Card";

export default function QuestionNavigator({
    totalQuestions = 15,
    currentIndex = 0,
    answers = {},
    markedQuestions = [],
    questions = [],
    onSelectQuestion,
}) {
    return (
        <Card className="p-5 sm:p-6 bg-[#161B26] border border-white/10 rounded-2xl">
            {/* Header */}
            <h3 className="text-sm font-bold text-white font-[Poppins] tracking-wide mb-4 text-left">
                Question Navigator
            </h3>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium font-[Manrope] text-gray-300 mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E2538] border border-white/20 inline-block" />
                    <span className="text-gray-400">Unanswered</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] inline-block" />
                    <span className="text-gray-300 font-semibold">Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block" />
                    <span className="text-amber-400 font-semibold">Marked</span>
                </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-5 gap-2.5">
                {Array.from({ length: totalQuestions }).map((_, idx) => {
                    const qId = questions[idx]?.id || `q${idx + 1}`;
                    const isCurrent = currentIndex === idx;
                    const isAnswered = answers[qId] !== undefined && answers[qId] !== null;
                    const isMarked = markedQuestions.includes(qId);

                    let btnStyles = "bg-[#1E2538] text-gray-300 hover:bg-[#28314A] border-transparent";

                    if (isMarked) {
                        btnStyles = "bg-[#F59E0B] text-white font-bold shadow-md shadow-amber-500/20";
                    } else if (isAnswered) {
                        btnStyles = "bg-[#6366F1] text-white font-bold shadow-md shadow-indigo-500/20";
                    }

                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => onSelectQuestion && onSelectQuestion(idx)}
                            className={`aspect-square w-full rounded-xl text-xs font-semibold font-[Poppins] flex items-center justify-center transition-all cursor-pointer ${btnStyles} ${
                                isCurrent
                                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#161B26] scale-105"
                                    : ""
                            }`}
                            title={`Go to Question ${idx + 1}`}
                        >
                            {idx + 1}
                        </button>
                    );
                })}
            </div>
        </Card>
    );
}
