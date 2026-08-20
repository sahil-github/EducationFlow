import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

export default function ProfileHeaderCard({ user, onEditAvatar, showViewProfileButton = true, className }) {
    const displayName = user?.fullName || user?.name || "Alex Rivera";
    const avatarUrl = user?.avatarUrl || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;
    const roleTitle = user?.headline || user?.bio || user?.role || "Senior Product Designer & Lifelong Learner";
    const memberStatus = user?.memberStatus || "Pro Member";
    const rawJoinedDate = user?.joinedDate || "June 2023";
    const joinedDate = rawJoinedDate.startsWith("Joined") ? rawJoinedDate : `Joined ${rawJoinedDate}`;
    const navigate = useNavigate();

    return (
        <div className={`w-full bg-[#16171D]/90 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 ${className}`}
        >
            <div className="flex flex-col md:flex-row items-center gap-5">
                {/* Avatar with Floating Edit Icon */}
                <div className="relative shrink-0">
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-24 h-24 rounded-full object-cover border-2 border-white/10 shadow-md"
                    />
                    <button
                        type="button"
                        onClick={onEditAvatar}
                        className="absolute bottom-0 right-0 bg-[#1D61E7] text-white p-1.5 rounded-full border-2 border-[#16171D] hover:bg-blue-600 transition-colors shadow-lg cursor-pointer flex items-center justify-center"
                        title="Change Avatar"
                    >
                        <EditIcon sx={{ fontSize: 14 }} />
                    </button>
                </div>

                {/* Info & Badges */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
                    <h2 className="text-white font-bold text-2xl font-[Poppins] leading-tight">
                        {displayName}
                    </h2>
                    <p className="text-[#94A3B8] text-xs font-[Manrope]">
                        {roleTitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="bg-[#1E202B] text-[#93C5FD] text-[11px] font-semibold px-3 py-1 rounded-full border border-blue-500/20 font-[Manrope]">
                            {memberStatus}
                        </span>
                        <span className="bg-[#1E202B] text-[#94A3B8] text-[11px] font-medium px-3 py-1 rounded-full border border-white/5 font-[Manrope]">
                            {joinedDate}
                        </span>
                    </div>
                </div>
            </div>

            {/* View Public Profile Button */}
            {showViewProfileButton && <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-4 py-2 border border-white/15 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-all shadow-sm font-[Poppins] whitespace-nowrap cursor-pointer"
            >
                View Public Profile
            </button>
            }
        </div>
    );
}
