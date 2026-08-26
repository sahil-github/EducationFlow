import React, { useEffect } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function QuizTimer({
    timeRemaining = 1200,
    onTick,
    onTimeUp,
}) {
    useEffect(() => {
        if (timeRemaining <= 0) {
            onTimeUp && onTimeUp();
            return;
        }

        const interval = setInterval(() => {
            onTick && onTick();
        }, 1000);

        return () => clearInterval(interval);
    }, [timeRemaining, onTick, onTimeUp]);

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const isUrgent = timeRemaining <= 120; // under 2 minutes

    return (
        <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors ${
                isUrgent
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse"
                    : "bg-white/5 border-white/10 text-gray-200"
            }`}
        >
            <AccessTimeIcon
                sx={{
                    fontSize: 16,
                    color: isUrgent ? "#FB7185" : "#818CF8",
                }}
            />
            <span className="text-sm font-bold font-mono tracking-wider">
                {formattedTime}
            </span>
        </div>
    );
}
