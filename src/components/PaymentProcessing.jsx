import React from "react";
import LockIcon from "@mui/icons-material/Lock";

export default function PaymentProcessing() {
    return (
        <div className="min-h-screen w-full bg-[#080F22] text-white flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background dots */}
            {/* <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #ffffff 2px, transparent 2px)",
                        backgroundSize: "48px 48px",
                    }}
                />
            </div> */}

            {/* Processing Card */}
            <div className="relative z-10 w-full max-w-sm rounded-xl bg-[#252D42] border border-white/10 shadow-2xl px-8 py-7">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-5">

                    <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                            E
                        </span>
                    </div>

                    <span className="text-sm font-bold text-gray-200">
                        EduFlow
                    </span>

                </div>

                {/* Spinner */}
                <div className="flex justify-center mb-5">
                    <div className="w-12 h-12 rounded-full border-[7px] border-indigo-300/30 border-t-indigo-400 animate-spin" />

                </div>

                {/* Heading */}
                <h2 className="text-center text-lg font-bold text-gray-200">
                    Processing your payment...
                </h2>

                {/* Description */}
                <p className="text-center text-xs text-gray-400 leading-relaxed mt-2">
                    Please don't close this window. We are securely
                    validating your transaction with the provider.
                </p>

                {/* Secure Connection */}
                <div className="flex justify-center mt-5">

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">

                        <LockIcon
                            sx={{
                                fontSize: 13,
                                color: "#9CA3AF",
                            }}
                        />

                        <span className="text-[10px] text-gray-400 font-medium">
                            256-bit Secure Connection
                        </span>

                    </div>

                </div>

            </div>
        </div>
    );
}