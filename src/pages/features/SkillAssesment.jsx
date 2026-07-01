import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import Slider from '@mui/material/Slider';
function SkillAssesment() {
    const navigate = useNavigate();
    const [selectedLevel, setSelectedLevel] = useState('beginner');

    const levels = [
        { id: 'Web development', title: 'Web Development', icon: <CodeIcon />, level: 'Intermediate' },
        { id: 'Public speaking', title: 'Public Speaking', icon: <RecordVoiceOverIcon />, level: 'Invoice' },
        { id: 'UI/UX Design', title: 'UI/UX Design', icon: <ColorLensIcon />, level: 'Expert' }
    ];

    return (
        <Sidebar>
            <div className="flex justify-center items-center w-full min-h-screen px-4 sm:px-6 py-6 sm:py-6">
                <div className="w-full max-w-xl flex flex-col gap-6">

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
                    {levels.map((level, index) => (
                        <Card key={index} className="w-full">
                            <div className="flex flex-col gap-2">
                                <div className='flex flex-row gap-2 justify-between'>
                                    <div className='flex flex-row gap-2'>
                                        <span className='text-[#6366F1] bg-gray-500/20 p-1 rounded-full'>{level.icon}</span>
                                        <p className='text-white'>{level.title}</p>
                                    </div>
                                    <div>
                                        <span className='text-[#A1A1AA] bg-[#0F172A] p-1 rounded-lg text-xs font-bold font-[Manrope]'>{level.level}</span>
                                    </div>
                                </div>
                                <Slider
                                    size="small"
                                    defaultValue={70}
                                    aria-label="Small"
                                    valueLabelDisplay="auto"
                                />
                                <div className='flex justify-between text-[10px] text-[#A1A1AA] font-[Manrope]'>
                                    <span>Invoice</span>
                                    <span >Intermediate</span>
                                    <span>Expert</span>
                                </div>
                            </div>
                        </Card>
                    ))}

                    <button className='text-[#A1A1AA] bg-[#0F172A] p-3 rounded-lg text-xs font-bold font-[Manrope] '>+ Add another skill</button>

                    {/* Navigation Buttons */}
                    <div className="w-full flex items-center justify-between mt-2 p-1">
                        <button
                            type="button"
                            onClick={() => navigate('/interests')}
                            className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors font-[Manrope] text-sm cursor-pointer"
                        >
                            <ArrowBackIcon fontSize="small" />
                            <span>Back</span>
                        </button>

                        <Button
                            variant="primary"
                            onClick={() => navigate('/review')}
                            className="h-8 px-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs flex items-center gap-1"
                        >
                            Continue
                            <ArrowForwardIcon sx={{ fontSize: 14 }} />
                        </Button>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}

export default SkillAssesment;
