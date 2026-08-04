import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { completeOnboarding } from "../../features/profile/profileThunks";

export default function Review() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, profile } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);

    // All data comes from the backend profile stored in Redux —
    // no localStorage reads needed.
    const user = profile ?? {};

    const handleSubmit = async () => {
        try {
            await dispatch(completeOnboarding()).unwrap();

            // profileSlice.completeOnboarding.fulfilled sets isOnboarded: true in Redux.
            // The router guard (RequireCompletedOnboarding) will then allow /dashboard.
            toast.success("Onboarding profile submitted successfully! Welcome aboard 🎉");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err || "Failed to complete onboarding. Please try again.");
        }
    };

    const profileFields = [
        { label: "Name",     value: user.fullName || user.name || authUser?.name || authUser?.fullName },
        { label: "Email",    value: user.email || authUser?.email },
        { label: "Location", value: user.location },
    ];

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
                                <span className="text-slate-400">
                                    {label}
                                </span>

                                <span className="text-white font-semibold">
                                    {value || "Not Provided"}
                                </span>
                            </div>
                        ))}

                        {/* Learning Goals */}
                        <div className="pt-2">
                            <span className="text-slate-400">
                                Learning Goals
                            </span>

                            {Array.isArray(user.learningGoal) && user.learningGoal.length > 0 ? (
                                user.learningGoal.map(
                                    (item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center py-2 border-b border-white/5"
                                        >
                                            <span className="capitalize text-slate-400">
                                                {item.id}
                                            </span>

                                            <span className="text-white text-right">
                                                {item.value}
                                            </span>
                                        </div>
                                    )
                                )
                            ) : (
                                <p className="text-slate-400">
                                    No learning goals selected.
                                </p>
                            )}
                        </div>

                        {/* Interests */}
                        <div className="pt-2">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-slate-400">
                                    Interests
                                </span>

                                <span className="text-white text-right">
                                    {user.interests?.length
                                        ? user.interests
                                            .map((interest) => interest.name || interest.exname)
                                            .join(", ")
                                        : "None"}
                                </span>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="pt-2">
                            <span className="text-slate-400">
                                Skills
                            </span>

                            {Array.isArray(user.skills) && user.skills.length > 0 ? (
                                user.skills.map(
                                    (skill) => (
                                        <div
                                            key={skill.id}
                                            className="flex justify-between items-center py-2 border-b border-white/5"
                                        >
                                            <span className="capitalize text-slate-400">
                                                {skill.id}
                                            </span>

                                            <span className="text-white text-right">
                                                {skill.level} / 100
                                            </span>
                                        </div>
                                    )
                                )
                            ) : (
                                <p className="text-slate-400">
                                    No skills selected.
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Buttons */}
                <div className="flex justify-between items-center">

                    <Button
                        variant="ghost"
                        onClick={() => navigate("/skill-assessment")}
                        className="flex items-center gap-2 text-slate-400 hover:text-white"
                    >
                        <ArrowBackIcon fontSize="small" />
                        Back
                    </Button>

                    <Button
                        variant="primary"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-6 h-10 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Confirm & Submit Profile"}
                    </Button>

                </div>
            </div>
        </div>
    );
}