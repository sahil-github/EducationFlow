import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { toast } from 'react-toastify';

export default function LearningGoals() {

    const FIELDS = [
        {
            id: "profession",
            label: "Profession",
            options: ["Student", "Software / IT professional", "Healthcare", "Other"],
        },
        {
            id: "age",
            label: "Age",
            options: ["Under 18", "18-24", "25-34", "35-50", "50+"],
        },
        {
            id: "cert",
            label: "Certification held",
            options: [
                "None",
                "Vendor cert (AWS, Microsoft, etc.)",
                "Academic degree",
                "Professional license (PMP, CPA, etc.)",
            ],
        },
        {
            id: "aicert",
            label: "AI certification",
            options: ["None", "In progress", "Completed one", "Completed multiple"],
        },
        {
            id: "experience",
            label: "Experience level",
            options: ["Beginner", "Intermediate", "Advanced", "Expert"],
        },
        {
            id: "goal",
            label: "Primary learning goal",
            options: [
                "Career switch",
                "Skill upgrade",
                "Certification prep",
                "Personal interest",
            ],
        },
        {
            id: "time",
            label: "Time commitment",
            options: [
                "Under 2 hrs/week",
                "2-5 hrs/week",
                "5-10 hrs/week",
                "10+ hrs/week",
            ],
        },
        {
            id: "format",
            label: "Preferred format",
            options: [
                "Self-paced video",
                "Live cohort",
                "Reading / text",
                "Hands-on projects",
            ],
        },
    ];

    const navigate = useNavigate();
    const [selectedGoal, setSelectedGoal] = useState(() => {
        const currentUser = JSON.parse(localStorage.getItem("current_user")) || {};
        return Array.isArray(currentUser.learningGoal) ? currentUser.learningGoal : [];
    });

    const handleChange = (fieldId, value) => {
        setSelectedGoal((prev) => {
            const exists = prev.some((item) => item.id === fieldId);
            if (exists) {
                return prev.map((item) =>
                    item.id === fieldId ? { id: fieldId, value } : item
                );
            }
            return [...prev, { id: fieldId, value }];
        });
    };

    const handleContinue = () => {
        // Validate that all fields have been selected
        const unselectedFields = FIELDS.filter(field => {
            const selected = selectedGoal.find(item => item.id === field.id);
            return !selected || !selected.value;
        });

        if (unselectedFields.length > 0) {
            toast.error(`Please select a value for: ${unselectedFields.map(f => f.label).join(', ')}`);
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem("current_user")) || {};
        const updatedUser = { 
            ...currentUser, 
            learningGoal: selectedGoal 
        };
        localStorage.setItem("current_user", JSON.stringify(updatedUser));

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = { 
                ...users[userIndex], 
                learningGoal: selectedGoal 
            };
            localStorage.setItem("users", JSON.stringify(users));
        }
        navigate('/interests');
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
                            <div key={field.id} className="flex flex-col gap-1.5">
                                <label className="text-white text-sm font-medium font-[Manrope]">
                                    {field.label}
                                </label>
                                <select
                                    value={selectedGoal.find(item => item.id === field.id)?.value || ''}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    className="w-[100%]  h-10 px-3 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-sm transition-all font-[Manrope] cursor-pointer"
                                >
                                    <option value="" disabled className="bg-[#16161A] text-gray-500">
                                        Select your {field.label.toLowerCase()}...
                                    </option>
                                    {field.options.map((option) => (
                                        <option key={option} value={option} className="bg-[#16161A] text-white ">
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
