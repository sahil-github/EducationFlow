import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Input from '../../components/Inputs'
import CodeIcon from '@mui/icons-material/Code';

function Interest() {
    const navigate = useNavigate();
    const [selectedInterests, setSelectedInterests] = useState([]);


    const toggleInterest = (topic) => {
        setSelectedInterests((prev) =>
            prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
        );
    };

    const Interest = [
        {
            id: 1,
            name: "Technology",
            example: [
                { exname: "AI & ML", icon: "" }, { exname: "Cybersecurity", icon: "" }, { exname: " Development", icon: <CodeIcon /> },
            ]
        },
        {
            id: 2,
            name: "Business",
            example: [
                { exname: "Marketing", icon: "" }, { exname: "Data Analytics", icon: "" }, { exname: "Entrepreneurship", icon: "" },
            ]
        },
        {
            id: 3,
            name: "Art",
            example: [
                { exname: "Graphic Design", icon: "" }, { exname: "Photography", icon: "" }, { exname: "Music Theory", icon: " " }
            ]
        },
        {
            id: 4,
            name: " Health &Science ",
            example: [
                { exname: "Physics", icon: "" }, { exname: "Wellness", icon: "" }, { exname: "Psychology", icon: "" }
            ]
        },

    ]

    return (
        <Sidebar>
            <div className="flex justify-center items-center w-full min-h-screen px-4 sm:px-6 py-8 sm:py-10">
                <div className="w-full max-w-xl flex flex-col gap-6">

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
                        className=' rounded-full w-full'
                    >
                    </Input>

                    <div className='flex gap-4 text-wrap flex-col p-2'>
                        {Interest.map((topic) => (
                            <div
                                key={topic}
                                onClick={() => toggleInterest(topic)}
                                className='cursor-pointer  mb-3'
                            >
                                {topic.name}
                                <div className='flex flex-row gap-2 pt-4 justify-center'>
                                    {topic.example.map((ex) =>
                                        < Card className='rounded-full flex flex-col justify-center items-center  w-230'>
                                            <div className='flex flex-col justify-center items-center'>
                                                <span className='text-[#818CF8]'>{ex.icon}</span>
                                                <p>{ex.exname}</p>
                                            </div>

                                        </Card>)}
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Navigation Buttons */}
                    <div className="w-full flex items-center justify-between mt-2 p-1">
                        <button
                            type="button"
                            onClick={() => navigate('/learning-goals')}
                            className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors font-[Manrope] text-sm cursor-pointer"
                        >
                            <ArrowBackIcon fontSize="small" />
                            <span>Back</span>
                        </button>

                        <Button
                            variant="primary"
                            onClick={() => navigate('/skill-assessment')}
                            className="h-8 px-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs flex items-center gap-1"
                        >
                            Continue
                            <ArrowForwardIcon sx={{ fontSize: 14 }} />
                        </Button>
                    </div>
                </div>
            </div>
        </Sidebar >
    );
}

export default Interest;
