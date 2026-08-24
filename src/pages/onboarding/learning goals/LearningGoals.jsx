import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { toast } from "react-toastify";

import { updateGoals, getProfile } from "../../../features/profile/profileThunks";
import { patchProfile } from "../../../features/profile/profileSlice";
import { updateUser } from "../../../features/auth/authSlice";
import { saveCurrentUser, upsertUser, getCurrentUser } from "../../../utils/storage";

// ── Goal Option Definitions ──────────────────────────────────────────────────
export const learningGoalOptions = [
    {
        value: "Get a New Job",
        description: "Find a better role and kickstart your career",
        icon: WorkOutlineIcon,
    },
    {
        value: "Switch Careers",
        description: "Transition to a new career path",
        icon: SwapHorizIcon,
    },
    {
        value: "Get a Promotion",
        description: "Grow in your current role and career",
        icon: TrendingUpIcon,
    },
    {
        value: "Improve Current Job Skills",
        description: "Enhance your skills and perform better",
        icon: BuildOutlinedIcon,
    },
    {
        value: "Learn a New Skill",
        description: "Explore new skills and expand your knowledge",
        icon: SchoolOutlinedIcon,
    },
    {
        value: "Prepare for an Interview",
        description: "Get ready and boost your interview confidence",
        icon: TrackChangesIcon,
    },
    {
        value: "Earn a Certification",
        description: "Validate your expertise with a certification",
        icon: WorkspacePremiumOutlinedIcon,
    },
    {
        value: "Build a Portfolio",
        description: "Showcase your work and projects",
        icon: FolderOutlinedIcon,
    },
    {
        value: "Start Freelancing",
        description: "Build a freelance career and work on your terms",
        icon: PersonOutlineIcon,
    },
    {
        value: "Start a Business",
        description: "Turn your idea into a successful business",
        icon: StorefrontOutlinedIcon,
    },
    {
        value: "Complete a Degree / Academic Goal",
        description: "Achieve an academic milestone",
        icon: MenuBookOutlinedIcon,
    },
    {
        value: "Explore a Personal Interest",
        description: "Learn something you're passionate about",
        icon: FavoriteBorderIcon,
    },
];

// ── Data Shape Normalizers ───────────────────────────────────────────────────
/**
 * Robust extractor that handles any shape:
 * - [ { id: "learningGoal", value: "Get a New Job" } ]
 * - [ { name: "Get a New Job" } ]
 * - [ "Get a New Job" ]
 * - "Get a New Job"
 * - null / undefined / []
 */
export const extractGoalValues = (raw) => {
    if (!raw) return [];
    if (typeof raw === "string") {
        const trimmed = raw.trim();
        return trimmed ? [trimmed] : [];
    }
    if (Array.isArray(raw)) {
        return raw.map((item) => {
            if (typeof item === "string") return item.trim();
            if (item && typeof item === "object") {
                return (item.value || item.name || item.title || item.label || item.goal || item.id || "").trim();
            }
            return "";
        }).filter(Boolean);
    }
    if (typeof raw === "object") {
        if (raw.goals || raw.learningGoal || raw.learningGoals) {
            return extractGoalValues(raw.goals || raw.learningGoal || raw.learningGoals);
        }
        const val = (raw.value || raw.name || raw.title || raw.label || raw.goal || raw.id || "").trim();
        return val ? [val] : [];
    }
    return [];
};

/**
 * Normalizes any goals data into the required canonical API payload:
 * [ { id: "learningGoal", value: "..." }, ... ]
 */
export const normalizeGoalsToPayload = (raw) => {
    const values = extractGoalValues(raw);
    return values.map((val) => ({
        id: "learningGoal",
        value: val,
    }));
};

export default function LearningGoals() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, profile } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);

    // Initial state resolved from profile, authUser, or storage fallback
    const [learningGoal, setLearningGoal] = useState(() => {
        const raw =
            profile?.learningGoal ||
            profile?.goals ||
            authUser?.learningGoal ||
            authUser?.goals ||
            getCurrentUser()?.learningGoal ||
            getCurrentUser()?.goals;
        return normalizeGoalsToPayload(raw);
    });

    // Ensure backend profile is fetched if not already in Redux
    useEffect(() => {
        if (!profile) {
            dispatch(getProfile());
        }
    }, [dispatch, profile]);

    // Keep local state in sync when profile or authUser loads/updates
    useEffect(() => {
        const raw =
            profile?.learningGoal ||
            profile?.goals ||
            authUser?.learningGoal ||
            authUser?.goals ||
            getCurrentUser()?.learningGoal ||
            getCurrentUser()?.goals;
        if (raw) {
            const normalized = normalizeGoalsToPayload(raw);
            if (normalized.length > 0) {
                setLearningGoal(normalized);
            }
        }
    }, [profile, authUser]);

    // Derived list of selected string values for comparison & counting
    const selectedGoals = useMemo(() => {
        return extractGoalValues(learningGoal);
    }, [learningGoal]);

    // Toggle goal selection (supports MULTIPLE selections)
    const handleGoalSelect = (value) => {
        setLearningGoal((prev) => {
            const currentValues = extractGoalValues(prev);
            const exists = currentValues.includes(value);
            const nextValues = exists
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];

            return nextValues.map((v) => ({
                id: "learningGoal",
                value: v,
            }));
        });
    };

    // Save and continue to next step
    const handleContinue = async () => {
        const payload = normalizeGoalsToPayload(learningGoal);

        if (payload.length === 0) {
            toast.error("Please select at least one learning goal.");
            return;
        }

        try {
            console.log("Learning Goals payload:", payload);
            await dispatch(updateGoals(payload)).unwrap();

            const updatedUserData = {
                ...authUser,
                ...profile,
                learningGoal: payload,
                goals: payload,
            };

            dispatch(updateUser(updatedUserData));
            dispatch(patchProfile({ learningGoal: payload, goals: payload }));
            saveCurrentUser(updatedUserData);
            upsertUser(updatedUserData);

            navigate("/skill-assessment");
        } catch (err) {
            toast.error(
                typeof err === "string"
                    ? err
                    : err?.message || "Failed to save learning goals. Please try again."
            );
        }
    };

    return (
        <div className="flex justify-center w-full min-h-screen px-4 sm:px-6 py-6">
            <div className="w-full max-w-5xl flex flex-col gap-5">
                {/* Page Heading */}
                <div className="flex flex-col items-start gap-1">
                    <h1 className="font-[Poppins] text-lg sm:text-xl font-bold text-white">
                        What are your learning goals?
                    </h1>
                    <p className="font-[Manrope] text-xs text-[#64748B]">
                        Select one or more goals that match what you want to achieve.
                    </p>
                </div>

                {/* Main Card */}
                <Card className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4">
                        {/* Goal Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                            {learningGoalOptions.map((goal) => {
                                const Icon = goal.icon;
                                const isSelected = selectedGoals.includes(goal.value);

                                return (
                                    <button
                                        key={goal.value}
                                        type="button"
                                        onClick={() => handleGoalSelect(goal.value)}
                                        className={`relative min-h-[132px] rounded-xl border p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 focus:outline-none ${
                                            isSelected
                                                ? "border-[#FF6B35] bg-[#FF6B35]/[0.07] shadow-[0_0_0_1px_rgba(255,107,53,0.25)]"
                                                : "border-white/[0.10] bg-white/[0.02] hover:border-[#FF6B35]/60 hover:bg-white/[0.04]"
                                        }`}
                                    >
                                        {/* Check Icon */}
                                        {isSelected && (
                                            <CheckCircleIcon
                                                sx={{
                                                    position: "absolute",
                                                    top: 8,
                                                    right: 8,
                                                    fontSize: 20,
                                                    color: "#FF6B35",
                                                }}
                                            />
                                        )}

                                        {/* Icon */}
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 ${
                                                isSelected ? "bg-[#FF6B35]/15" : "bg-white/[0.06]"
                                            }`}
                                        >
                                            <Icon
                                                sx={{
                                                    fontSize: 20,
                                                    color: isSelected ? "#FF6B35" : "#A1A1AA",
                                                }}
                                            />
                                        </div>

                                        {/* Title */}
                                        <p
                                            className={`font-[Poppins] text-xs sm:text-[13px] font-semibold leading-tight ${
                                                isSelected ? "text-white" : "text-[#E4E4E7]"
                                            }`}
                                        >
                                            {goal.value}
                                        </p>

                                        {/* Description */}
                                        <p className="font-[Manrope] text-[10px] sm:text-[11px] leading-snug text-[#71717A] mt-2 max-w-[180px]">
                                            {goal.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Selected Count */}
                        {selectedGoals.length > 0 && (
                            <p className="font-[Manrope] text-[11px] text-[#A1A1AA]">
                                {selectedGoals.length} {selectedGoals.length === 1 ? "goal" : "goals"} selected
                            </p>
                        )}
                    </div>
                </Card>

                {/* Navigation Buttons */}
                <div className="w-full flex items-center justify-between mt-1">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/interests")}
                        className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors font-[Manrope] text-sm cursor-pointer"
                    >
                        <ArrowBackIcon fontSize="small" />
                        Back
                    </Button>

                    <Button
                        variant="primary"
                        disabled={loading || selectedGoals.length === 0}
                        onClick={handleContinue}
                        className="h-8 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Saving..." : "Continue"}
                        <ArrowForwardIcon sx={{ fontSize: 14 }} />
                    </Button>
                </div>
            </div>
        </div>
    );
}