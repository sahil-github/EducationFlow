import React, { useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

/**
 * ProfileHeaderCard
 *
 * Props:
 *   user             — user object (avatarUrl, fullName, headline/bio, etc.)
 *   onAvatarChange   — (file: File, previewUrl: string) => void
 *                      Called when the user selects a new image file.
 *   showViewProfileButton — boolean (default true)
 *   className        — extra class names
 */
export default function ProfileHeaderCard({ user, onAvatarChange, showViewProfileButton = true, className }) {
    const displayName = user?.fullName || user?.name || 'Alex Rivera';
    const avatarUrl =
        user?.avatarUrl ||
        user?.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;
    const roleTitle = user?.headline || user?.bio || user?.role || 'Senior Product Designer & Lifelong Learner';
    const memberStatus = user?.memberStatus || 'Pro Member';
    const rawJoinedDate = user?.joinedDate || 'June 2023';
    const joinedDate = rawJoinedDate.startsWith('Joined') ? rawJoinedDate : `Joined ${rawJoinedDate}`;
    const navigate = useNavigate();

    // Hidden file input ref — triggered programmatically by the edit button
    const fileInputRef = useRef(null);

    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a local object URL for immediate preview
        const previewUrl = URL.createObjectURL(file);

        if (onAvatarChange) {
            onAvatarChange(file, previewUrl);
        }

        // Reset the input value so the same file can be re-selected if needed
        e.target.value = '';
    };

    return (
        <div className={`w-full bg-[#16171D]/90 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 ${className}`}>
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                {/* Avatar with Floating Edit Icon */}
                <div className="relative shrink-0">
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white/10 shadow-md"
                    />
                    {/* Hidden file input — accepts common image formats */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                        aria-label="Upload profile picture"
                    />
                    <button
                        type="button"
                        onClick={handleEditClick}
                        className="absolute bottom-0 right-0 bg-[#1D61E7] text-white p-1.5 rounded-full border-2 border-[#16171D] hover:bg-blue-600 transition-colors shadow-lg cursor-pointer flex items-center justify-center"
                        title="Change Avatar"
                    >
                        <EditIcon sx={{ fontSize: 14 }} />
                    </button>
                </div>

                {/* Info & Badges */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 min-w-0">
                    <h2 className="text-white font-bold text-xl sm:text-2xl font-[Poppins] leading-tight truncate max-w-full">
                        {displayName}
                    </h2>
                    <p className="text-[#94A3B8] text-xs font-[Manrope] line-clamp-2">
                        {roleTitle}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
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
            {showViewProfileButton && (
                <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="w-full sm:w-auto px-4 py-2 border border-white/15 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-all shadow-sm font-[Poppins] whitespace-nowrap cursor-pointer text-center"
                >
                    View Public Profile
                </button>
            )}
        </div>
    );
}
