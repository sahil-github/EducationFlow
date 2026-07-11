import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';

export default function Review() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem("current_user")) || {};
        setUser(savedData);
    }, []);

    const handleSubmit = () => {
        const currentUser = JSON.parse(localStorage.getItem("current_user")) || {};
        const updatedUser = { ...currentUser, onboardingCompleted: true };
        localStorage.setItem("current_user", JSON.stringify(updatedUser));

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], onboardingCompleted: true };
            localStorage.setItem("users", JSON.stringify(users));
        }

        toast.success('Onboarding profile submitted successfully! Welcome aboard 🎉');
        navigate('/home');
    };

    return (
        <div className="flex justify-center items-center w-full min-h-screen px-4 sm:px-6 py-6 sm:py-6">
            <div className="w-full max-w-3xl flex flex-col gap-6">

                {/* Heading */}
                <div className="flex flex-col items-start gap-1">
                    <h1 className="font-[Poppins] text-lg sm:text-xl font-bold text-white">
                        Review Profile
                    </h1>
                    <p className="font-[Manrope] text-xs text-[#64748B]">
                        Confirm your selections to finalize your cohort onboarding path.
                    </p>
                </div>

                {/* Card container */}
                <Card className="w-full">
                    <div className="space-y-4 text-white">
                        <div className="flex justify-between py-2.5 border-b border-white/5">
                            <span className="text-slate-400 text-sm font-[Manrope]">Name</span>
                            <span className="text-white text-sm font-semibold font-[Manrope]">{user.name || 'Not Provided'}</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-white/5">
                            <span className="text-slate-400 text-sm font-[Manrope]">Email</span>
                            <span className="text-white text-sm font-semibold font-[Manrope]">{user.email || 'Not Provided'}</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-white/5">
                            <span className="text-slate-400 text-sm font-[Manrope]">Location</span>
                            <span className="text-white text-sm font-semibold font-[Manrope]">{user.location || 'Not Provided'}</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-white/5">
                            <span className="text-slate-400 text-sm font-[Manrope]">Learning Goal</span>
                            <span className="text-white text-sm font-semibold font-[Manrope] capitalize">{user.learningGoal || 'Not Provided'}</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-white/5">
                            <span className="text-slate-400 text-sm font-[Manrope]">Interests Selected</span>
                            <span className="text-white text-sm font-semibold font-[Manrope] text-right">
                                {user.interests ? user.interests.map(i => i.exname).join(', ') : 'None'}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Navigation / Action row */}
                <div className="w-full flex items-center justify-between mt-2 p-1">
                    <button
                        type="button"
                        onClick={() => navigate('/skill-assessment')}
                        className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors font-[Manrope] text-sm cursor-pointer"
                    >
                        <ArrowBackIcon fontSize="small" />
                        <span>Back</span>
                    </button>

                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        className="h-9 px-5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs"
                    >
                        Confirm & Submit Profile
                    </Button>
                </div>
            </div>
        </div>
    );
}
