import Card from "../Card";

export default function QuestionCard({
    question,
    questionIndex = 0,
    selectedOptionId = null,
    onSelectOption,
}) {
    if (!question) return null;

    const { number, question: questionText, options = [] } = question;
    const qNumber = number || questionIndex + 1;

    return (
        <Card className="p-6 sm:p-8 bg-[#161B26] border border-white/10 rounded-2xl shadow-xl">
            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-bold text-white font-[Poppins] leading-relaxed mb-6">
                Q{qNumber}. {questionText}
            </h2>

            {/* Options List */}
            <div className="space-y-3.5" role="radiogroup" aria-label={`Question ${qNumber}`}>
                {options.map((option) => {
                    const isSelected = selectedOptionId === option.id;

                    return (
                        <div
                            key={option.id}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onClick={() => onSelectOption && onSelectOption(option.id)}
                            onKeyDown={(e) => {
                                if (e.key === " " || e.key === "Enter") {
                                    e.preventDefault();
                                    onSelectOption && onSelectOption(option.id);
                                }
                            }}
                            className={`w-full flex items-center gap-4 px-4 sm:px-5 py-4 rounded-xl text-sm font-medium font-[Manrope] cursor-pointer transition-all duration-200 border select-none ${isSelected
                                    ? "bg-[#1E2235] border-indigo-500 shadow-md shadow-indigo-500/10 text-white font-semibold"
                                    : "bg-[#0F131D] border-white/5 text-gray-300 hover:text-white hover:border-white/15 hover:bg-white/[0.02]"
                                }`}
                        >
                            {/* Custom Radio Dot */}
                            <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${isSelected
                                        ? "border-indigo-500 bg-indigo-500"
                                        : "border-gray-500/60 bg-transparent"
                                    }`}
                            >
                                {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-white animate-scaleUp" />
                                )}
                            </div>

                            {/* Option Label */}
                            <span className="flex-1 text-left">{option.label}</span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
