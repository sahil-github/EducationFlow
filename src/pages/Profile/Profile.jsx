import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { toast } from 'react-toastify';
import { getProfile } from '../../features/profile/profileThunks';
import { fetchSettings } from '../../features/settings/settingsThunks';
import { COUNTRY_MAP } from '../../utils/localizationUtils';

// ── Normalization Helpers ──────────────────────────────────────────────────
const normalizeGoalValues = (rawGoals) => {
    if (!rawGoals) return [];
    if (Array.isArray(rawGoals)) {
        return rawGoals
            .map((item) => {
                if (typeof item === 'string') return item.trim();
                // Render the user-facing value or name, NOT internal id
                return item?.value || item?.name || item?.title || item?.id || '';
            })
            .filter(Boolean);
    }
    return [];
};

const normalizeInterestNames = (rawInterests) => {
    if (!rawInterests) return [];
    if (Array.isArray(rawInterests)) {
        return rawInterests
            .map((item) => {
                if (typeof item === 'string') return item.trim();
                return item?.name || item?.exname || item?.title || item?.id || '';
            })
            .filter(Boolean);
    }
    return [];
};

export default function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { profile, loading: profileLoading } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);
    const { settingsData, loading: settingsLoading } = useSelector((state) => state.settings);

    // Fetch latest profile & settings if missing
    useEffect(() => {
        if (!profile) {
            dispatch(getProfile());
        }
        if (!settingsData) {
            dispatch(fetchSettings());
        }
    }, [dispatch, profile, settingsData]);

    const [isConnected, setIsConnected] = useState(false);

    // Combined user data from backend sources
    const currentUser = {
        ...authUser,
        ...(settingsData?.identity || {}),
        ...profile,
    };

    const displayName = currentUser.fullName || currentUser.name || 'Member';
    const avatarUrl =
        currentUser.avatarUrl ||
        currentUser.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

    const headline = currentUser.headline || currentUser.bio || 'EduFlow Learner & Creator';
    const bio = currentUser.bio || currentUser.headline || '';
    const memberStatus = currentUser.memberStatus || settingsData?.subscription?.planName || 'Pro Member';

    const rawJoinedDate = currentUser.joinedDate || 'June 2023';
    const joinedDate = rawJoinedDate.startsWith('Joined') ? rawJoinedDate : `Joined ${rawJoinedDate}`;

    // Country and Location details
    const countryCode = currentUser.country || settingsData?.contactRegion?.country || '';
    const countryName = COUNTRY_MAP[countryCode]?.name || countryCode || '';
    const locationCity = currentUser.location || '';
    const timezone = currentUser.timezone || settingsData?.contactRegion?.timezone || '';

    // Goals, Interests, and Skills
    const rawGoals = profile?.goals || profile?.learningGoal || settingsData?.goals || currentUser.goals || currentUser.learningGoal;
    const goalsList = normalizeGoalValues(rawGoals);

    const rawInterests = profile?.interests || settingsData?.interests || currentUser.interests;
    const interestsList = normalizeInterestNames(rawInterests);

    const rawSkills = profile?.skills || settingsData?.skills || currentUser.skills || [];
    const skillsList = Array.isArray(rawSkills) ? rawSkills : [];

    const isLoading = (profileLoading || settingsLoading) && !profile && !authUser;

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-[#0F1015] text-white flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[#94A3B8] text-sm font-[Manrope]">Loading public profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#0F1015] text-white p-4 sm:p-6 lg:p-10 font-[Manrope]">
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">

                {/* ── Top Back Navigation ── */}
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#16171D] hover:bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white text-xs font-semibold font-[Poppins] transition-all cursor-pointer shadow-md"
                        title="Go back"
                    >
                        <ArrowBackIcon sx={{ fontSize: 16 }} />
                        <span>Back</span>
                    </button>

                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider font-[Manrope]">
                        Public Profile
                    </span>
                </div>

                {/* ── 1. Profile Header Card ── */}
                <div className="w-full bg-[#16171D]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/10 shadow-xl bg-[#1E202B]"
                            onError={(e) => {
                                e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;
                            }}
                        />
                    </div>

                    {/* Header Info */}
                    <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-2 min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="text-white font-bold text-2xl sm:text-3xl font-[Poppins] tracking-tight truncate">
                                {displayName}
                            </h1>
                            <CheckCircleIcon sx={{ fontSize: 20, color: '#10B981' }} titleAccess="Verified EduFlow Member" />
                        </div>

                        {/* Member Status Badge */}
                        <div className="self-center sm:self-start px-2.5 py-0.5 bg-[#E59880]/15 border border-[#E59880]/30 text-[#E59880] rounded-full text-[10px] font-bold tracking-wider uppercase font-[Manrope]">
                            {memberStatus}
                        </div>

                        {/* Connect Button */}
                        <div className="mt-3 flex items-center gap-3">

                            <span className="text-[11px] text-[#64748B] font-[Manrope]">
                                {joinedDate}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── 2. Quick Info Highlights (Location / Country / Timezone) ── */}
                {(locationCity || countryName || timezone) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        {locationCity && (
                            <div className="bg-[#16171D]/90 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                    <LocationOnIcon sx={{ fontSize: 18, color: '#FBBF24' }} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider font-[Manrope]">
                                        Location
                                    </span>
                                    <span className="text-white text-xs font-semibold font-[Poppins] truncate">
                                        {locationCity}
                                    </span>
                                </div>
                            </div>
                        )}

                        {countryName && (
                            <div className="bg-[#16171D]/90 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                    <PublicIcon sx={{ fontSize: 18, color: '#34D399' }} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider font-[Manrope]">
                                        Country / Region
                                    </span>
                                    <span className="text-white text-xs font-semibold font-[Poppins] truncate">
                                        {countryName}
                                    </span>
                                </div>
                            </div>
                        )}

                        {timezone && (
                            <div className="bg-[#16171D]/90 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
                                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                    <ScheduleIcon sx={{ fontSize: 18, color: '#818CF8' }} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider font-[Manrope]">
                                        Timezone
                                    </span>
                                    <span className="text-white text-xs font-semibold font-[Poppins] truncate">
                                        {timezone}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── 3. About Me Section ── */}
                {bio && (
                    <div className="w-full bg-[#16171D]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <VisibilityIcon sx={{ fontSize: 16, color: '#60A5FA' }} />
                            </div>
                            <h2 className="text-white font-bold text-sm sm:text-base font-[Poppins] tracking-wide">
                                About Me
                            </h2>
                        </div>

                        <p className="text-[#94A3B8] text-xs sm:text-sm font-[Manrope] leading-relaxed italic pt-1">
                            {bio}
                        </p>
                    </div>
                )}

                {/* ── 4. Goals Section ── */}
                {goalsList.length > 0 && (
                    <div className="w-full bg-[#16171D]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <TrackChangesIcon sx={{ fontSize: 16, color: '#818CF8' }} />
                            </div>
                            <h2 className="text-white font-bold text-sm sm:text-base font-[Poppins] tracking-wide">
                                Goals
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {goalsList.map((goal, index) => (
                                <span
                                    key={index}
                                    className="bg-[#181B22] border border-white/10 hover:border-indigo-500/30 text-white text-xs font-medium font-[Manrope] px-3.5 py-1.5 rounded-xl transition-all select-none"
                                >
                                    {goal}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── 5. Expertise & Skills Section ── */}
                {skillsList.length > 0 && (
                    <div className="w-full bg-[#16171D]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                <StarBorderRoundedIcon sx={{ fontSize: 16, color: '#A78BFA' }} />
                            </div>
                            <h2 className="text-white font-bold text-sm sm:text-base font-[Poppins] tracking-wide">
                                Expertise & Skills
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {skillsList.map((skill, index) => {
                                const skillName =
                                    typeof skill === 'string'
                                        ? skill
                                        : skill?.name || skill?.id || skill?.title || String(skill);
                                const level = typeof skill === 'object' ? skill?.level : null;

                                return (
                                    <span
                                        key={index}
                                        className="bg-[#181B22] border border-white/10 hover:border-purple-500/30 text-white text-xs font-medium font-[Manrope] px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all select-none"
                                    >
                                        <span>{skillName}</span>
                                        {level !== null && level !== undefined && (
                                            <span className="text-[10px] text-[#A78BFA] font-bold bg-purple-500/10 px-1.5 py-0.5 rounded">
                                                {level}%
                                            </span>
                                        )}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── 6. Interests Section ── */}
                {interestsList.length > 0 && (
                    <div className="w-full bg-[#16171D]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <LightbulbOutlinedIcon sx={{ fontSize: 16, color: '#FBBF24' }} />
                            </div>
                            <h2 className="text-white font-bold text-sm sm:text-base font-[Poppins] tracking-wide">
                                Interests
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {interestsList.map((interest, index) => (
                                <span
                                    key={index}
                                    className="bg-[#181B22] border border-white/10 hover:border-amber-500/30 text-white text-xs font-medium font-[Manrope] px-3.5 py-1.5 rounded-xl transition-all select-none"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Footer ── */}
                <footer className="border-t border-white/5 pt-6 mt-4 flex items-center justify-between text-[11px] text-[#64748B] font-[Manrope]">
                    <span>© 2024 EduFlow Learning Systems.</span>
                    <span className="text-[#94A3B8]">Public Profile</span>
                </footer>
            </div>
        </div>
    );
}
