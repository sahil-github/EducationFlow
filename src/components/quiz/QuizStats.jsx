import React from "react";
import Card from "../Card";
// Icons
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";

export default function QuizStats({ stats }) {
    const {
        available = 12,
        inProgress = 2,
        completed = 45,
        averageScore = "88%",
    } = stats || {};

    const statItems = [
        {
            id: "available",
            value: available,
            label: "AVAILABLE",
            icon: LayersOutlinedIcon,
            iconColor: "#818CF8",
            bgColor: "bg-indigo-500/10",
        },
        {
            id: "inProgress",
            value: inProgress,
            label: "IN PROGRESS",
            icon: PendingActionsOutlinedIcon,
            iconColor: "#38BDF8",
            bgColor: "bg-sky-500/10",
        },
        {
            id: "completed",
            value: completed,
            label: "COMPLETED",
            icon: CheckCircleOutlineOutlinedIcon,
            iconColor: "#34D399",
            bgColor: "bg-emerald-500/10",
        },
        {
            id: "averageScore",
            value: averageScore,
            label: "AVERAGE SCORE",
            icon: LeaderboardOutlinedIcon,
            iconColor: "#A78BFA",
            bgColor: "bg-purple-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Card
                        key={item.id}
                        className="p-5 bg-[#161B26] border border-white/5 rounded-2xl flex flex-col items-center justify-between"
                    >
                        <div className="flex items-center justify-center mb-3">
                            <div className={`w-9 h-9 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                                <Icon sx={{ fontSize: 20, color: item.iconColor }} />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-white font-[Poppins] tracking-tight">
                            {item.value}
                        </div>
                        <div className="text-[11px] font-bold text-gray-400 font-[Manrope] tracking-wider uppercase mt-1">
                            {item.label}
                        </div>

                    </Card>
                );
            })}
        </div>
    );
}
