import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import Slider from '@mui/material/Slider';
import {
    getCurrentUser,
    saveCurrentUser,
    getUsers,
    saveUsers,
} from "../../utils/store";

function SkillAssesment() {
    const navigate = useNavigate();
    const [skills, setSkills] = useState(() => {
        const currentUser = getCurrentUser();
        if (Array.isArray(currentUser.skills)) {
            return currentUser.skills;
        }
        return [
            { id: 'Web development', level: 70 },
            { id: 'Public speaking', level: 70 },
            { id: 'UI/UX Design', level: 70 }
        ];
    });

    const levels = [
        { id: 'Web development', title: 'Web Development', icon: <CodeIcon /> },
        { id: 'Public speaking', title: 'Public Speaking', icon: <RecordVoiceOverIcon /> },
        { id: 'UI/UX Design', title: 'UI/UX Design', icon: <ColorLensIcon /> }
    ];

    const getLevelLabel = (value) => {
        if (value <= 32) return "Novice";
        if (value <= 62) return "Intermediate";
        return "Expert";
    };

    const handleContinue = () => {
        const currentUser = getCurrentUser();
        const updatedUser = { ...currentUser, skills: skills };
        saveCurrentUser(updatedUser);

        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], skills: skills };
            saveUsers(users);
        }
        navigate('/review');
    };

    return (
        <div className="flex justify-center items-center w-full h-auto gap-4 px-4 sm:px-6 py-6 sm:py-6 ">
            <div className="w-full max-w-3xl flex flex-col gap-6  ">
                {/* Heading */}
                <div className="flex flex-col items-start gap-1">
                    <h1 className="font-[Poppins] text-lg sm:text-xl font-bold text-white">
                        Rate your current skills
                    </h1>
                    <p className="font-[Manrope] text-xs text-[#64748B]">
                        Honest assessment helps us personalize your curriculum to bridge the gaps in your knowledge.
                    </p>
                </div>

                {/* Card container */}
                <Card className="flex flex-col gap-5 p-5">
                    {levels.map((level, index) => {
                        const currentSkill = skills.find(s => s.id === level.id);
                        const skillLevel = currentSkill ? currentSkill.level : 0;
                        return (
                        <Card key={index} className="w-full   p-4 bg-[#1E293B66]">
                            <div className="flex flex-col ">
                                <div className='flex flex-row gap-4 justify-between'>
                                    <div className='flex flex-row gap-2 '>
                                        <p className='text-[#6366F1] bg-gray-500/20  rounded-full'>{level.icon}</p>
                                        <p className='text-white'>{level.title}</p>
                                    </div>
                                    <div className='flex flex-row gap-2 justify-end'>
                                        <p className='text-[#A1A1AA] bg-[#0F172A] p-2 rounded-lg text-xs font-bold font-[Manrope]'>
                                            {getLevelLabel(skillLevel)}
                                        </p>
                                    </div>
                                </div>
                                <Slider
                                    size="small"
                                    value={skillLevel}
                                    onChange={(e, val) => setSkills(prev => prev.map(s => s.id === level.id ? { ...s, level: val } : s))}
                                    aria-label="Small"
                                    valueLabelDisplay="auto"
                                />
                                <div className='flex justify-between text-[10px] text-[#A1A1AA] font-[Manrope]'>
                                    <span>Novice</span>
                                    <span>Intermediate</span>
                                    <span>Expert</span>
                                </div>
                            </div>
                        </Card>
                    )})}


                    <Button className='text-[#A1A1AA] w-full border border-dashed border-gray-600 p-4 rounded-3xl text-xs font-bold font-[Manrope] '
                        variant='ghost'
                    >+ Add another skill</Button>
                </Card>
                {/* Navigation Buttons */}
                <div className="w-full flex items-center justify-between mt-2 p-1">
                    <Button
                        type="button"
                        onClick={() => navigate('/interests')}
                        className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors font-[Manrope] text-sm cursor-pointer"
                        variant="ghost"
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

export default SkillAssesment;
