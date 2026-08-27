import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizById } from "../../features/quiz/quizThunks";
import { startQuizSession } from "../../features/quiz/quizSlice";
import Card from "../../components/Card";

// Icons
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SyncIcon from "@mui/icons-material/Sync";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function QuizInstructions() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentQuiz, loading } = useSelector((state) => state.quiz);

    useEffect(() => {
        if (quizId) {
            dispatch(fetchQuizById(quizId));
        }
    }, [dispatch, quizId]);

    const quiz = currentQuiz || {
        id: quizId || "node-js-fundamentals",
        title: "Node.js Fundamentals Quiz",
        category: "BACKEND DEVELOPMENT BOOTCAMP",
        description:
            "Test your knowledge on core Node.js concepts including event loops, modules, file systems, and asynchronous programming.",
        questionsCount: 15,
        durationMinutes: 20,
        attemptsAllowed: 2,
        passingScore: 70,
    };

    const handleStartQuiz = () => {
        dispatch(
            startQuizSession({
                quizId: quiz.id,
                durationMinutes: quiz.durationMinutes || 20,
            })
        );
        navigate(`/quizzes/${quiz.id}/attempt`);
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col justify-between">
            {/* Centered Instructions Card matching Screenshot 2 */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-3xl">
                    <Card className="p-6 sm:p-10 bg-[#161B26] border border-white/10 rounded-2xl shadow-2xl">
                        {/* Tag, Title, and Description */}
                        <div className="text-center mb-8">
                            <span className="text-[11px] font-bold text-indigo-400 font-[Poppins] tracking-widest uppercase mb-2 inline-block">
                                {quiz.category}
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-[Poppins] tracking-tight mb-3">
                                {quiz.title}
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-300 font-[Manrope] max-w-xl mx-auto leading-relaxed">
                                {quiz.description}
                            </p>
                        </div>

                        {/* 4 Info Metric Boxes */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
                            <div className="p-4 rounded-xl bg-[#0F131D] border border-white/5 flex flex-col items-center justify-center text-center">
                                <DescriptionOutlinedIcon sx={{ fontSize: 22, color: "#818CF8", mb: 1 }} />
                                <span className="text-lg sm:text-xl font-extrabold text-white font-[Poppins]">
                                    {quiz.questionsCount || 15}
                                </span>
                                <span className="text-[11px] text-gray-400 font-medium font-[Manrope] mt-0.5">
                                    Questions
                                </span>
                            </div>

                            <div className="p-4 rounded-xl bg-[#0F131D] border border-white/5 flex flex-col items-center justify-center text-center">
                                <AccessTimeIcon sx={{ fontSize: 22, color: "#38BDF8", mb: 1 }} />
                                <span className="text-lg sm:text-xl font-extrabold text-white font-[Poppins]">
                                    {quiz.durationMinutes || 20}m
                                </span>
                                <span className="text-[11px] text-gray-400 font-medium font-[Manrope] mt-0.5">
                                    Time Limit
                                </span>
                            </div>

                            <div className="p-4 rounded-xl bg-[#0F131D] border border-white/5 flex flex-col items-center justify-center text-center">
                                <SyncIcon sx={{ fontSize: 22, color: "#A78BFA", mb: 1 }} />
                                <span className="text-lg sm:text-xl font-extrabold text-white font-[Poppins]">
                                    {quiz.attemptsAllowed || 2}
                                </span>
                                <span className="text-[11px] text-gray-400 font-medium font-[Manrope] mt-0.5">
                                    Attempts Allowed
                                </span>
                            </div>

                            <div className="p-4 rounded-xl bg-[#0F131D] border border-white/5 flex flex-col items-center justify-center text-center">
                                <VerifiedOutlinedIcon sx={{ fontSize: 22, color: "#34D399", mb: 1 }} />
                                <span className="text-lg sm:text-xl font-extrabold text-white font-[Poppins]">
                                    {quiz.passingScore || 70}%
                                </span>
                                <span className="text-[11px] text-gray-400 font-medium font-[Manrope] mt-0.5">
                                    Passing Score
                                </span>
                            </div>
                        </div>

                        {/* "Before you begin" Section */}
                        <div className="p-5 sm:p-6 rounded-xl bg-[#0F131D] border border-white/5 mb-8">
                            <div className="flex items-center gap-2 text-sm font-bold text-white font-[Poppins] mb-4">
                                <InfoOutlinedIcon sx={{ fontSize: 18, color: "#818CF8" }} />
                                <span>Before you begin</span>
                            </div>

                            <ul className="space-y-3 text-xs sm:text-sm text-gray-300 font-[Manrope] leading-relaxed">
                                <li className="flex items-start gap-2.5">
                                    <RadioButtonCheckedIcon sx={{ fontSize: 15, color: "#6366F1", mt: 0.3, shrink: 0 }} />
                                    <span>You must answer all {quiz.questionsCount || 15} questions. Unanswered questions will be marked as incorrect.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <RadioButtonCheckedIcon sx={{ fontSize: 15, color: "#6366F1", mt: 0.3, shrink: 0 }} />
                                    <span>You can navigate freely between questions during the {quiz.durationMinutes || 20}-minute timeframe.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <RadioButtonCheckedIcon sx={{ fontSize: 15, color: "#6366F1", mt: 0.3, shrink: 0 }} />
                                    <span>The quiz will automatically submit when the timer reaches zero.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <RadioButtonCheckedIcon sx={{ fontSize: 15, color: "#6366F1", mt: 0.3, shrink: 0 }} />
                                    <span>Ensure you have a stable internet connection before starting.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="button"
                                onClick={() => navigate("/quizzes")}
                                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer font-[Poppins]"
                            >
                                <ArrowBackIcon sx={{ fontSize: 16 }} />
                                <span>Back to Quizzes</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleStartQuiz}
                                className="px-6 py-3 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs sm:text-sm font-bold font-[Poppins] transition-all shadow-lg shadow-[#6366F1]/25 flex items-center gap-2 cursor-pointer"
                            >
                                <span>Start Quiz</span>
                                <ArrowForwardIcon sx={{ fontSize: 16 }} />
                            </button>
                        </div>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-5 text-center text-xs text-gray-500 font-[Manrope] border-t border-white/5">
                &copy; {new Date().getFullYear()} EduFlow LMS. All rights reserved.
            </footer>
        </div>
    );
}
