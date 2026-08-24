import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { completeOnboarding } from "../../features/profile/profileThunks";
import { getCurrentUser } from "../../utils/storage";

// ── Shared helpers (same logic as LearningGoals.jsx) ────────────────────────

/**
 * Extracts plain string values from any goal data shape:
 * - [ { id: "learningGoal", value: "Get a New Job" } ]
 * - [ { name: "Get a New Job" } ]
 * - [ "Get a New Job" ]
 * - "Get a New Job"
 * - null / undefined / []
 */
const extractGoalValues = (raw) => {
    if (!raw) return [];
    if (typeof raw === "string") {
        const trimmed = raw.trim();
        return trimmed ? [trimmed] : [];
    }
    if (Array.isArray(raw)) {
        return raw
            .map((item) => {
                if (typeof item === "string") return item.trim();
                if (item && typeof item === "object") {
                    return (
                        item.value ||
                        item.name ||
                        item.title ||
                        item.label ||
                        item.goal ||
                        item.id ||
                        ""
                    ).trim();
                }
                return "";
            })
            .filter(Boolean);
    }
    if (typeof raw === "object") {
        const val = (raw.value || raw.name || raw.title || raw.label || "").trim();
        return val ? [val] : [];
    }
    return [];
};

/**
 * Extracts plain string values from any interest data shape.
 */
const extractInterestNames = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
        return raw
            .map((item) => {
                if (typeof item === "string") return item.trim();
                if (item && typeof item === "object") {
                    return (item.name || item.exname || item.title || item.label || item.id || "").trim();
                }
                return "";
            })
            .filter(Boolean);
    }
    return [];
};

// ────────────────────────────────────────────────────────────────────────────

export default function Review() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, profile } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);

    // Primary source: Redux profile (server data).
    // Fallback: authUser (set after login) → localStorage (last resort).
    const storedUser = getCurrentUser() ?? {};
    const user = profile ?? storedUser;

    const handleSubmit = async () => {
        try {
            await dispatch(completeOnboarding()).unwrap();
            toast.success("Onboarding profile submitted successfully! Welcome aboard 🎉");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err || "Failed to complete onboarding. Please try again.");
        }
    };

    // ── Derived display data ────────────────────────────────────────────────

    const profileFields = [
        {
            label: "Name",
            value: user.fullName || user.name || authUser?.name || authUser?.fullName,
        },
        { label: "Email", value: user.email || authUser?.email },
        { label: "Location", value: user.location },
    ];

    // Goals — try both keys the backend might use
    const rawGoals = user.learningGoal ?? user.goals ?? user.learningGoals;
    const goalsList = extractGoalValues(rawGoals);

    // Interests
    const interestsList = extractInterestNames(user.interests);

    // Skills
    const skillsList = Array.isArray(user.skills) ? user.skills : [];

    return (
        <div className="flex justify-center items-center w-full min-h-screen px-4 py-6">
            <div className="w-full max-w-3xl flex flex-col gap-6">

                {/* Heading */}
                <div>
                    <h1 className="font-[Poppins] text-xl font-bold text-white">
                        Review Profile
                    </h1>
                    <p className="font-[Manrope] text-sm text-slate-400">
                        Confirm your selections before submitting your onboarding.
                    </p>
                </div>

                <Card>
                    <div className="p-6 space-y-4">

                        {/* Personal Information */}
                        {profileFields.map(({ label, value }) => (
                            <div
                                key={label}
                                className="flex justify-between items-center py-2 border-b border-white/5"
                            >
                                <span className="text-slate-400">{label}</span>
                                <span className="text-white font-semibold">
                                    {value || "Not Provided"}
                                </span>
                            </div>
                        ))}

                        {/* Learning Goals */}
                        <div className="pt-2">
                            <div className="flex justify-between items-start py-2 border-b border-white/5">
                                <span className="text-slate-400 shrink-0 mr-4">
                                    Learning Goals
                                </span>

                                <div className="flex flex-wrap gap-1.5 justify-end">
                                    {goalsList.length > 0 ? (
                                        goalsList.map((goal, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/30 text-white text-xs rounded-lg font-medium whitespace-nowrap"
                                            >
                                                {goal}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-slate-400 text-sm">
                                            No learning goals selected.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="pt-2">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-slate-400">Interests</span>
                                <span className="text-white text-right">
                                    {interestsList.length > 0
                                        ? interestsList.join(", ")
                                        : "None"}
                                </span>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="pt-2">
                            <span className="text-slate-400 block mb-2">Skills</span>

                            {skillsList.length > 0 ? (
                                skillsList.map((skill, idx) => {
                                    const skillName =
                                        typeof skill === "string"
                                            ? skill
                                            : skill?.skillName ||
                                              skill?.name ||
                                              skill?.skill ||
                                              skill?.title ||
                                              skill?.id ||
                                              `Skill ${idx + 1}`;

                                    const rawScore =
                                        typeof skill === "object" && skill?.score !== undefined
                                            ? skill.score
                                            : typeof skill === "object" && skill?.level !== undefined
                                            ? skill.level
                                            : 70;

                                    return (
                                        <div
                                            key={skill?.id || skill?.skillId || idx}
                                            className="flex justify-between items-center py-2 border-b border-white/5"
                                        >
                                            <span className="capitalize text-slate-400">
                                                {skillName}
                                            </span>
                                            <span className="text-white text-right">
                                                {rawScore} / 100
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-slate-400">No skills selected.</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Buttons */}
                <div className="flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/skill-assessment")}
                        className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer"
                    >
                        <ArrowBackIcon fontSize="small" />
                        Back
                    </Button>

                    <Button
                        variant="primary"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-6 h-10 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Submitting..." : "Confirm & Submit Profile"}
                    </Button>
                </div>
            </div>
        </div>
    );
}