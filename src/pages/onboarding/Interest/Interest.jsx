import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Input from '../../../components/Inputs';
import { InterestData } from '../../../constants/constants';
import { toast } from 'react-toastify';
import { updateInterests } from '../../../features/profile/profileThunks';

function Interest() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, profile } = useSelector((state) => state.profile);

    // Pre-populate from backend profile if user is resuming onboarding
    const [selectedInterests, setSelectedInterests] = useState(() => {
        if (Array.isArray(profile?.interests) && profile.interests.length > 0) {
            return profile.interests;
        }
        return [];
    });

    const toggleInterest = (interest) => {
        setSelectedInterests((prev) => {
            const alreadySelected = prev.some((item) => item.id === interest.id);
            if (alreadySelected) {
                return prev.filter((item) => item.id !== interest.id);
            }
            return [...prev, interest];
        });
    };

    const submitInterest = async () => {
        if (selectedInterests.length === 0) {
            toast.error("Please select at least one interest to continue.");
            return;
        }

        // Strip React icon components before sending to the backend
        const interestsToSave = selectedInterests.map(item => ({
            id: item.id,
            name: item.exname || item.name,
        }));

        try {
            await dispatch(updateInterests(interestsToSave)).unwrap();
            navigate("/learning-goals");
        } catch (err) {
            toast.error(err || "Failed to save interests. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center w-full min-h-screen px-2 sm:px-6 py-6 sm:py-6 ">
            <div className="w-full max-w-3xl flex flex-col gap-6 ">

                {/* Heading */}
                <div className="flex flex-col items-start gap-1">
                    <h1 className="font-[Poppins] text-lg sm:text-xl font-bold text-white">
                        Pick your areas of interest
                    </h1>
                    <p className="font-[Manrope] text-xs text-[#64748B]">
                        We'll use these to personalize your learning journey and suggest relevant courses.
                    </p>
                </div>

                <Input
                    placeholder='Find other topics (e.g., Quantum Computing, Cooking)'
                    type='text'
                    className=' rounded-xl w-full bg-[#16161AB2]'
                />

                <div className='flex gap-4 text-wrap flex-col p-2 text-white'>
                    {InterestData.map((category) => (
                        <div
                            key={category.id}
                            className='cursor-pointer mb-3 font-[Poppins] font-semibold text-sm'
                        >
                            <div className={`flex items-center gap-2 mb-4 ${category.color}`}>
                                <span className="w-2 h-2 rounded-full bg-current"></span>
                                <h2 className="uppercase text-sm font-semibold tracking-wider">
                                    {category.name}
                                </h2>
                            </div>
                            <div className='flex flex-row gap-12 pt-4 justify-center flex-wrap'>
                                {category.example.map((interest) => {
                                    const Icon = interest.icon;
                                    const isSelected = selectedInterests.some(
                                        (item) => item.id === interest.id
                                    );

                                    return (
                                        <Card
                                            key={interest.id}
                                            onClick={() => toggleInterest(interest)}
                                            className={`rounded-full flex flex-col w-full p-4 sm:w-[190px] md:w-[210px] lg:w-[230px] justify-center items-center
                                                        w-[160px] bg-[#16161AB2] transition-all duration-200 cursor-pointer
                                            ${isSelected
                                                    ? "border border-indigo-500 bg-[#232338]"
                                                    : "border border-[#2D2D45]"
                                                }`}
                                        >
                                            <Icon
                                                className={isSelected ? "text-white" : category.color}
                                                fontSize="medium"
                                            />

                                            <p className={`text-sm mt-2 ${isSelected ? "text-white" : "text-gray-200"}`}>
                                                {interest.exname}
                                            </p>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="w-full flex items-center justify-between mt-2 p-1 ">
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
                        disabled={loading}
                        onClick={submitInterest}
                        className="h-8 px-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs flex items-center gap-1 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Continue'}
                        <ArrowForwardIcon sx={{ fontSize: 14 }} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Interest;
