import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { toast } from 'react-toastify';
import { validateLearningGoals } from "./validation";
import {
    getCurrentUser,
    saveCurrentUser,
    getUsers,
    saveUsers,
} from "../../../utils/store"

import SelectField from "../../../components/SelectField";
import { FIELDS } from "../../../constants/constants";

export default function LearningGoals() {

    const navigate = useNavigate();
    const [learningGoal, setLearningGoal] = useState(() => {
        const currentUser = getCurrentUser();
        return currentUser.learningGoal || {};
    });

    const handleChange = (fieldId, value) => {
        setLearningGoal((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    const handleContinue = () => {

        const { isValid, unfilledFields } =
            validateLearningGoals(FIELDS, learningGoal);

        if (!isValid) {
            toast.error(
                `Please select: ${unfilledFields
                    .map(field => field.label)
                    .join(", ")}`
            );
            return;
        }

        const currentUser = getCurrentUser();

        const updatedUser = {
            ...currentUser,
            learningGoal,
        };

        saveCurrentUser(updatedUser);

        const users = getUsers();

        const userIndex = users.findIndex(
            user => user.email === currentUser.email
        );

        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            saveUsers(users);
        }

        navigate("/interests");
    };
    return (
        <div className="flex justify-center items-center w-full min-h-screen px-4 sm:px-6 py-6 sm:py-6">
            <div className="w-full max-w-3xl flex flex-col gap-6">

                {/* Heading */}
                <div className="flex flex-col items-start gap-1">
                    <h1 className="font-[Poppins] text-lg sm:text-xl font-bold text-white">
                        What are your learning goals?
                    </h1>
                    <p className="font-[Manrope] text-xs text-[#64748B]">
                        Select the primary objective that aligns with your cohort enrollment.
                    </p>
                </div>

                {/* Card container */}
                <Card className="p-7">
                    <div className="flex flex-col gap-5">
                        {FIELDS.map((field) => (
                            <SelectField
                                key={field.id}
                                label={field.label}
                                name={field.id}
                                value={learningGoal[field.id] || ""}
                                options={field.options}
                                placeholder={`Select your ${field.label.toLowerCase()}...`}
                                onChange={(e) =>
                                    handleChange(field.id, e.target.value)
                                }
                            />
                        ))}
                    </div>
                </Card>

                {/* Navigation Buttons */}
                <div className="w-full flex items-center justify-between mt-2 p-1">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/personal-info')}
                        className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors font-[Manrope] text-sm cursor-pointer"
                    >
                        <ArrowBackIcon fontSize="small" />
                        Back
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleContinue}
                        className="h-8 px-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs flex items-center gap-1"
                    >
                        Continue
                        <ArrowForwardIcon sx={{ fontSize: 14 }} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
