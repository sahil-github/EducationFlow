
import React from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";

function PaymentFailed() {
    const navigate = useNavigate();

    // Later you can get these values from Redux/API/location state
    const paymentDetails = {
        courseName: "Advanced React Native Masterclass",
        amount: "$95.00",
        status: "Declined",
        reason: "Insufficient funds",
    };

    const handleTryAgain = () => {
        // Later navigate to payment page
        navigate("/payment");
    };

    const handleBackToCourse = () => {
        navigate("/courses");
    };

    return (
        <div className="min-h-screen w-full bg-[#080f21] text-white relative overflow-hidden">
            {/* Main Content */}
            <div className="relative z-8 min-h-screen flex items-center justify-center px-2 py-2">
                {/* Payment Card */}
                <div className="w-full max-w-[378px] bg-[#182136] border border-slate-700 rounded-xl p-5 shadow-2xl">

                    {/* Failed Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 rounded-full bg-red-950 flex items-center justify-center">
                            <CloseIcon
                                sx={{
                                    color: "#ff8b7d",
                                    fontSize: 30,
                                }}
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center">

                        <h1 className="text-xl font-bold text-white">
                            Payment Failed
                        </h1>

                        <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                            We couldn't process your payment. Please try
                            <br />
                            again.
                        </p>

                    </div>

                    {/* Payment Information */}
                    <div className="mt-6 border border-slate-700 rounded-lg bg-[#202b42] p-4 space-y-4">

                        {/* Status */}
                        <div className="flex justify-between items-center text-xs">

                            <span className="text-gray-300">
                                Status
                            </span>

                            <span className="text-red-400 font-semibold flex items-center gap-1">
                                <CloseIcon sx={{ fontSize: 10 }} />
                                {paymentDetails.status}
                            </span>

                        </div>

                        {/* Course */}
                        <div className="flex justify-between gap-2 text-xs">

                            <span className="text-gray-300">
                                Course
                            </span>

                            <span className="text-white text-right">
                                {paymentDetails.courseName}
                            </span>

                        </div>

                        {/* Amount */}
                        <div className="flex justify-between items-center text-xs">

                            <span className="text-gray-300">
                                Amount
                            </span>

                            <span className="text-white font-semibold">
                                {paymentDetails.amount}
                            </span>

                        </div>

                        {/* Reason */}
                        <div className="flex justify-between items-center text-xs">

                            <span className="text-gray-300">
                                Reason
                            </span>

                            <span className="text-white">
                                {paymentDetails.reason}
                            </span>

                        </div>

                    </div>

                    {/* Try Again */}
                    <button
                        onClick={handleTryAgain}
                        className="w-full mt-7 py-3 rounded-lg bg-[#b7b3ff] hover:bg-[#a9a5f5] text-[#111936] text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <RefreshIcon sx={{ fontSize: 15 }} />
                        Try Again
                    </button>

                    {/* Back */}
                    <button
                        onClick={handleBackToCourse}
                        className="w-full mt-4 text-sm text-indigo-300 hover:text-white font-semibold transition-colors cursor-pointer"
                    >
                        Back to Course
                    </button>

                </div>


            </div>
        </div>
    );
}

export default PaymentFailed;