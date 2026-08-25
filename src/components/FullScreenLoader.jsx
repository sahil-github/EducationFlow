import React from "react";

export default function FullScreenLoader({ message = "Preparing your workspace..." }) {
    return (
        <div className="min-h-screen w-full bg-[#0B0F19] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden z-50">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center text-center">
                {/* EduFlow Brand Logo Icon with Glow */}
                <div className="relative mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-xl shadow-indigo-500/30 animate-pulse">
                        <span className="text-2xl font-black text-white font-[Poppins]">
                            E
                        </span>
                    </div>
                </div>

                {/* Animated Ring Spinner */}
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin mb-4" />

                {/* Brand Name & Loading Message */}
                <h2 className="text-base font-bold text-white font-[Poppins] tracking-wide">
                    EduFlow
                </h2>
                <p className="text-xs text-gray-400 font-[Manrope] mt-1.5 animate-pulse">
                    {message}
                </p>
            </div>
        </div>
    );
}
