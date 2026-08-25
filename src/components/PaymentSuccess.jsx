import React from "react";
import { useNavigate } from "react-router-dom";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ChecklistIcon from "@mui/icons-material/Checklist";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function EnrollmentSuccess() {
    const navigate = useNavigate();

    const course = {
        title: "Advanced React Native Masterclass",
        instructor: "Sarah Jenkins",
        thumbnail: "/images/course-thumbnail.jpg",
    };

    const payment = {
        amount: "$65.39",
        transactionId: "TRX-98231457",
        date: "Aug 24, 2024",
    };

    return (
        <div className="min-h-screen w-full bg-[#080f21] text-white flex justify-center">
            <div className="w-full max-w-5xl flex justify-center px-4">
                <div className="w-full max-w-[645px] bg-[#182136] border border-slate-700 rounded-xl p-6 md:p-8 my-6">
                    <div className="flex justify-center mb-5">
                        <div className="w-14 h-14 rounded-full bg-emerald-900 flex items-center justify-center">
                            <CheckCircleIcon
                                sx={{
                                    fontSize: 30,
                                    color: "#8dd8ff",
                                }}
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center">

                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            You're enrolled!
                        </h1>

                        <p className="text-sm text-gray-300 mt-2 leading-relaxed max-w-md mx-auto">
                            You've successfully enrolled in this course.
                            Your learning journey starts now.
                        </p>

                    </div>


                    {/* Course Card */}
                    <div className="mt-8 bg-[#202b42] border border-slate-700 rounded-xl p-4">

                        <div className="flex items-center gap-4">

                            {/* Thumbnail */}
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-800 shrink-0">

                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />

                            </div>

                            {/* Course Information */}
                            <div className="min-w-0">

                                <h2 className="text-sm font-bold text-white truncate">
                                    {course.title}
                                </h2>

                                <p className="text-xs text-gray-300 mt-1">
                                    by {course.instructor}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Payment Details */}
                    <div className="mt-6 border border-slate-700 rounded-xl overflow-hidden">

                        {/* Payment Status */}
                        <div className="flex justify-between items-center px-4 py-4 border-b border-slate-700">

                            <span className="text-sm text-gray-300">
                                Payment Status
                            </span>

                            <span className="text-sm text-sky-300 font-semibold flex items-center gap-1.5">
                                <CheckCircleIcon sx={{ fontSize: 14 }} />
                                Successful
                            </span>

                        </div>


                        {/* Amount */}
                        <div className="flex justify-between items-center px-4 py-4 border-b border-slate-700">

                            <span className="text-sm text-gray-300">
                                Amount Paid
                            </span>

                            <span className="text-sm text-white font-semibold">
                                {payment.amount}
                            </span>

                        </div>


                        {/* Transaction ID */}
                        <div className="flex justify-between items-center px-4 py-4 border-b border-slate-700">

                            <span className="text-sm text-gray-300">
                                Transaction ID
                            </span>

                            <span className="text-sm text-white font-semibold">
                                {payment.transactionId}
                            </span>

                        </div>


                        {/* Date */}
                        <div className="flex justify-between items-center px-4 py-4">

                            <span className="text-sm text-gray-300">
                                Date
                            </span>

                            <span className="text-sm text-white font-semibold">
                                {payment.date}
                            </span>

                        </div>

                    </div>


                    {/* What's Next */}
                    <div className="mt-8">

                        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-5">
                            What's Next?
                        </h3>


                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">

                            {/* Start Lesson */}
                            <div className="flex items-center gap-3">

                                <div className="w-8 h-8 rounded-full bg-[#293451] flex items-center justify-center shrink-0">

                                    <PlayArrowIcon
                                        sx={{
                                            fontSize: 16,
                                            color: "#aeb5ff",
                                        }}
                                    />

                                </div>

                                <span className="text-sm text-white font-medium">
                                    Start your first lesson
                                </span>

                            </div>


                            {/* Track Progress */}
                            <div className="flex items-center gap-3">

                                <div className="w-8 h-8 rounded-full bg-[#293451] flex items-center justify-center shrink-0">

                                    <ShowChartIcon
                                        sx={{
                                            fontSize: 16,
                                            color: "#aeb5ff",
                                        }}
                                    />

                                </div>

                                <span className="text-sm text-white font-medium">
                                    Track your progress
                                </span>

                            </div>


                            {/* Complete Course */}
                            <div className="flex items-center gap-3">

                                <div className="w-8 h-8 rounded-full bg-[#293451] flex items-center justify-center shrink-0">

                                    <ChecklistIcon
                                        sx={{
                                            fontSize: 16,
                                            color: "#aeb5ff",
                                        }}
                                    />

                                </div>

                                <span className="text-sm text-white font-medium">
                                    Complete the course
                                </span>

                            </div>


                            {/* Certificate */}
                            <div className="flex items-center gap-3">

                                <div className="w-8 h-8 rounded-full bg-[#293451] flex items-center justify-center shrink-0">

                                    <WorkspacePremiumIcon
                                        sx={{
                                            fontSize: 16,
                                            color: "#aeb5ff",
                                        }}
                                    />

                                </div>

                                <span className="text-sm text-white font-medium">
                                    Earn your certificate
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">

                        <button
                            onClick={() =>
                                navigate(`/courses/learn`)
                            }
                            className="w-full py-3 rounded-lg bg-[#b8b5ff] hover:bg-[#aaa6f5] text-[#111936] font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Start Learning

                            <ArrowForwardIcon
                                sx={{ fontSize: 18 }}
                            />

                        </button>


                        <button
                            onClick={() =>
                                navigate("/my-learning")
                            }
                            className="w-full py-3 rounded-lg border border-slate-700 hover:bg-white/5 text-white font-semibold text-sm transition-colors cursor-pointer"
                        >
                            Go to My Learning
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default EnrollmentSuccess;