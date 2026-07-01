import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function LearningGoals() {
    const navigate = useNavigate();
    const [selectedGoal, setSelectedGoal] = useState('upskill');

    const goals = [
        { id: 'switch', title: 'Switching Careers', desc: 'Transitioning into a completely new field of study or software development role.' },
        { id: 'upskill', title: 'Upskilling for Current Job', desc: 'Advancing skills for promotion, projects, or staying current with new technologies.' },
        { id: 'uni', title: 'Academic Supplement', desc: 'Supplementing university coursework, lab studies, and exam preparation.' },
        { id: 'startup', title: 'Building a Startup', desc: 'Gaining critical technical skills to design, deploy, and launch a digital product.' }
    ];

    return (
        <Sidebar>
            <div className="flex justify-center items-center w-full min-h-screen px-4 sm:px-6 py-8 sm:py-10">
                <div className="w-full max-w-xl flex flex-col gap-6">

                    {/* Heading */}
                    {/* <div className="flex flex-col items-start gap-1">
                        <h1 className="font-[Poppins] text-lg sm:text-xl font-bold text-white">
                            What are your learning goals?
                        </h1>
                        <p className="font-[Manrope] text-xs text-[#64748B]">
                            Select the primary objective that aligns with your cohort enrollment.
                        </p>
                    </div> */}

                    {/* Card container */}
                    {/* <Card className="w-full">
                        <div className="grid grid-cols-1 gap-3.5">
                            {goals.map((goal) => (
                                <div
                                    key={goal.id}
                                    onClick={() => setSelectedGoal(goal.id)}
                                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-1 ${selectedGoal === goal.id
                                            ? 'bg-[#6366F1]/10 border-[#6366F1] shadow-lg shadow-[#6366F1]/5'
                                            : 'bg-black/40 border-white/5 hover:bg-black/60'
                                        }`}
                                >
                                    <h3 className="text-white font-bold text-sm font-[Poppins]">{goal.title}</h3>
                                    <p className="text-slate-400 text-xs font-[Manrope] leading-relaxed">{goal.desc}</p>
                                </div>
                            ))}
                        </div>
                    </Card> */}

                    {/* Navigation Buttons */}
                    <div className="w-full flex items-center justify-between mt-2 p-1">
                        <button
                            type="button"
                            onClick={() => navigate('/personal-info')}
                            className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors font-[Manrope] text-sm cursor-pointer"
                        >
                            <ArrowBackIcon fontSize="small" />
                            <span>Back</span>
                        </button>

                        <Button
                            variant="primary"
                            onClick={() => navigate('/interests')}
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
