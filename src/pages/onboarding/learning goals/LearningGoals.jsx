// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import Card from '../../../components/Card';
// import Button from '../../../components/Button';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import { toast } from 'react-toastify';
// import { validateLearningGoals } from "./validation";
// import { updateGoals } from "../../../features/profile/profileThunks";
// import { updateUser } from "../../../features/auth/authSlice";
// import { saveCurrentUser, upsertUser } from "../../../utils/storage";
// import SelectField from "../../../components/SelectField";
// import { FIELDS } from "../../../constants/constants";

// export default function LearningGoals() {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { loading, profile } = useSelector((state) => state.profile);
//     const { user: authUser } = useSelector((state) => state.auth);

//     // Pre-populate from backend profile if user is resuming onboarding
//     const [learningGoal, setLearningGoal] = useState(() => {
//         return Array.isArray(profile?.learningGoal) ? profile.learningGoal : [];
//     });

//     const handleChange = (fieldId, value) => {
//         setLearningGoal((prev) => {
//             const exists = prev.find(item => item.id === fieldId);
//             if (exists) {
//                 return prev.map(item => item.id === fieldId ? { id: fieldId, value } : item);
//             }
//             return [...prev, { id: fieldId, value }];
//         });
//     };

//     const handleContinue = async () => {
//         const { isValid, unfilledFields } = validateLearningGoals(FIELDS, learningGoal);

//         if (!isValid) {
//             toast.error(
//                 `Please select: ${unfilledFields
//                     .map(field => field.label)
//                     .join(", ")}`
//             );
//             return;
//         }

//         try {
//             await dispatch(updateGoals(learningGoal)).unwrap();
//             const updatedUserData = {
//                 ...authUser,
//                 ...profile,
//                 learningGoal,
//             };
//             dispatch(updateUser(updatedUserData));
//             saveCurrentUser(updatedUserData);
//             upsertUser(updatedUserData);

//             navigate("/skill-assessment");
//         } catch (err) {
//             toast.error(err || "Failed to save learning goals. Please try again.");
//         }
//     };

//     return (
//         <div className="flex justify-center items-center w-full min-h-screen px-4 sm:px-6 py-6 sm:py-6">
//             <div className="w-full max-w-3xl flex flex-col gap-6">

//                 {/* Heading */}
//                 <div className="flex flex-col items-start gap-1">
//                     <h1 className="font-[Poppins] text-lg sm:text-xl font-bold text-white">
//                         What are your learning goals?
//                     </h1>
//                     <p className="font-[Manrope] text-xs text-[#64748B]">
//                         Select the primary objective that aligns with your cohort enrollment.
//                     </p>
//                 </div>

//                 {/* Card container */}
//                 <Card className="p-7">
//                     <div className="flex flex-col gap-5">
//                         {FIELDS.map((field) => (
//                             <SelectField
//                                 key={field.id}
//                                 label={field.label}
//                                 name={field.id}
//                                 value={learningGoal.find(item => item.id === field.id)?.value || ""}
//                                 options={field.options}
//                                 placeholder={`Select your ${field.label.toLowerCase()}...`}
//                                 onChange={(e) =>
//                                     handleChange(field.id, e.target.value)
//                                 }
//                             />
//                         ))}
//                     </div>
//                 </Card>

//                 {/* Navigation Buttons */}
//                 <div className="w-full flex items-center justify-between mt-2 p-1">
//                     <Button
//                         variant="ghost"
//                         onClick={() => navigate('/interests')}
//                         className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors font-[Manrope] text-sm cursor-pointer"
//                     >
//                         <ArrowBackIcon fontSize="small" />
//                         Back
//                     </Button>

//                     <Button
//                         variant="primary"
//                         disabled={loading}
//                         onClick={handleContinue}
//                         className="h-8 px-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs flex items-center gap-1 disabled:opacity-50"
//                     >
//                         {loading ? 'Saving...' : 'Continue'}
//                         <ArrowForwardIcon sx={{ fontSize: 14 }} />
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useState } from "react";
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

import { updateGoals } from "../../../features/profile/profileThunks";
import { updateUser } from "../../../features/auth/authSlice";

import {
    saveCurrentUser,
    upsertUser,
} from "../../../utils/storage";

const learningGoalOptions = [
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


export default function LearningGoals() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, profile } = useSelector(
        (state) => state.profile
    );

    const { user: authUser } = useSelector(
        (state) => state.auth
    );


    // Existing learning goals from backend
    const [learningGoal, setLearningGoal] = useState(() => {
        if (Array.isArray(profile?.learningGoal)) {
            return profile.learningGoal;
        }
        return [];
    });


    /*
     * Get all selected goal values
     *
     * Example:
     *
     * [
     *   "Get a New Job",
     *   "Learn a New Skill"
     * ]
     */

    const selectedGoals = learningGoal
        .filter((item) => item.id === "learningGoal")
        .map((item) => item.value);


    /*
     * Select / unselect goal
     */

    const handleGoalSelect = (value) => {
        setLearningGoal((prev) => {

            const alreadySelected = prev.some(
                (item) =>
                    item.id === "learningGoal" &&
                    item.value === value
            );


            // If already selected → remove it
            if (alreadySelected) {
                return prev.filter(
                    (item) =>
                        !(
                            item.id === "learningGoal" &&
                            item.value === value
                        )
                );
            }


            // If not selected → add it
            return [
                ...prev,
                {
                    id: "learningGoal",
                    value: value,
                },
            ];
        });
    };


    /*
     * Continue
     */

    const handleContinue = async () => {
        if (selectedGoals.length === 0) {
            toast.error(
                "Please select at least one learning goal."
            );
            return;
        }


        try {
            await dispatch(
                updateGoals(learningGoal)
            ).unwrap();


            const updatedUserData = {
                ...authUser,
                ...profile,
                learningGoal: learningGoal,
            };


            dispatch(
                updateUser(updatedUserData)
            );


            saveCurrentUser(updatedUserData);
            upsertUser(updatedUserData);

            navigate("/skill-assessment");

        } catch (err) {

            toast.error(
                err ||
                "Failed to save learning goals. Please try again."
            );
        }
    };


    return (
        <div className="flex justify-center w-full min-h-screen px-4 sm:px-6 py-6">
            <div className="w-full max-w-5xl flex flex-col gap-5">

                {/* PAGE HEADING */}
                <div className="flex flex-col items-start gap-1">
                    <h1
                        className="font-[Poppins] text-lg sm:text-xl font-bold text-white"
                    >
                        What are your learning goals?
                    </h1>
                    <p
                        className="font-[Manrope] text-xs text-[#64748B]"
                    >
                        Select one or more goals that match what you want to achieve.
                    </p>
                </div>


                {/* MAIN CARD */}

                <Card className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4">
                        {/* GOAL CARDS */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-2.5
                            "
                        >

                            {learningGoalOptions.map((goal) => {

                                const Icon = goal.icon;


                                /*
                                 * IMPORTANT:
                                 * Check whether THIS goal
                                 * exists in selectedGoals
                                 */

                                const isSelected =
                                    selectedGoals.includes(
                                        goal.value
                                    );


                                return (
                                    <button
                                        key={goal.value}
                                        type="button"
                                        onClick={() =>
                                            handleGoalSelect(
                                                goal.value
                                            )
                                        }
                                        className={`
                                            relative
                                            min-h-[132px]
                                            rounded-xl
                                            border
                                            p-4
                                            flex
                                            flex-col
                                            items-center
                                            justify-center
                                            text-center
                                            cursor-pointer
                                            transition-all
                                            duration-200
                                            focus:outline-none
 
                                            ${isSelected
                                                ? `
                                                        border-[#FF6B35]
                                                        bg-[#FF6B35]/[0.07]
                                                        shadow-[0_0_0_1px_rgba(255,107,53,0.25)]
                                                      `
                                                : `
                                                        border-white/[0.10]
                                                        bg-white/[0.02]
                                                        hover:border-[#FF6B35]/60
                                                        hover:bg-white/[0.04]
                                                      `
                                            }
                                        `}
                                    >

                                        {/* CHECK ICON */}

                                        {isSelected && (
                                            <CheckCircleIcon
                                                sx={{
                                                    position:
                                                        "absolute",
                                                    top: 8,
                                                    right: 8,
                                                    fontSize: 20,
                                                    color: "#FF6B35",
                                                }}
                                            />
                                        )}


                                        {/* ICON */}

                                        <div
                                            className={`
                                                w-10
                                                h-10
                                                rounded-full
                                                flex
                                                items-center
                                                justify-center
                                                mb-2.5
 
                                                ${isSelected
                                                    ? "bg-[#FF6B35]/15"
                                                    : "bg-white/[0.06]"
                                                }
                                            `}
                                        >

                                            <Icon
                                                sx={{
                                                    fontSize: 20,
                                                    color: isSelected
                                                        ? "#FF6B35"
                                                        : "#A1A1AA",
                                                }}
                                            />

                                        </div>


                                        {/* TITLE */}

                                        <p
                                            className={`
                                                font-[Poppins]
                                                text-xs
                                                sm:text-[13px]
                                                font-semibold
                                                leading-tight
 
                                                ${isSelected
                                                    ? "text-white"
                                                    : "text-[#E4E4E7]"
                                                }
                                            `}
                                        >
                                            {goal.value}
                                        </p>


                                        {/* DESCRIPTION */}

                                        <p
                                            className="
                                                font-[Manrope]
                                                text-[10px]
                                                sm:text-[11px]
                                                leading-snug
                                                text-[#71717A]
                                                mt-2
                                                max-w-[180px]
                                            "
                                        >
                                            {goal.description}
                                        </p>

                                    </button>
                                );
                            })}

                        </div>


                        {/* SELECTED COUNT */}

                        {selectedGoals.length > 0 && (
                            <p
                                className="
                                    font-[Manrope]
                                    text-[11px]
                                    text-[#A1A1AA]
                                "
                            >
                                {selectedGoals.length}{" "}
                                {selectedGoals.length === 1
                                    ? "goal"
                                    : "goals"}{" "}
                                selected
                            </p>
                        )}
                    </div>

                </Card>


                {/* NAVIGATION */}

                <div
                    className="
                        w-full
                        flex
                        items-center
                        justify-between
                        mt-1
                    "
                >

                    <Button
                        variant="ghost"
                        onClick={() =>
                            navigate("/interests")
                        }
                        className="
                            flex
                            items-center
                            gap-1.5
                            text-[#A1A1AA]
                            hover:text-white
                            transition-colors
                            font-[Manrope]
                            text-sm
                            cursor-pointer
                        "
                    >

                        <ArrowBackIcon fontSize="small" />

                        Back

                    </Button>


                    <Button
                        variant="primary"
                        disabled={
                            loading ||
                            selectedGoals.length === 0
                        }
                        onClick={handleContinue}
                        className="
                            h-8
                            px-4
                            bg-[#6366F1]
                            hover:bg-[#4F46E5]
                            text-white
                            font-bold
                            rounded-2xl
                            tracking-wide
                            transition-all
                            duration-200
                            shadow-lg
                            shadow-[#6366F1]/20
                            font-[Poppins]
                            text-xs
                            flex
                            items-center
                            gap-1
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >

                        {loading
                            ? "Saving..."
                            : "Continue"}

                        <ArrowForwardIcon
                            sx={{ fontSize: 14 }}
                        />

                    </Button>

                </div>

            </div>

        </div>
    );
}