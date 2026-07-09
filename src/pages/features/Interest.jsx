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


    const toggleInterest = (interest) => {

        setSelectedInterests((prev) => {
            const alreadySelected = prev.some((item) => item.id === interest.id);

            if (alreadySelected) {
                return prev.filter(
                    (item) => item.id !== interest.id
                );
            }
            return [...prev, interest];
        });
    };

    const submitInterest = () => {

        const user = JSON.parse(localStorage.getItem("user")) || {};
        const updatedUser = {
            ...user,
            interests: selectedInterests
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log(selectedInterests);
        navigate("/skill-assessment");

    };

    const Interest = [
        {
            id: 1,
            name: "Technology",
            example: [
                { id: 101, exname: "AI & ML", icon: "" }, { id: 102, exname: "Cybersecurity", icon: "" }, { id: 103, exname: " Development", icon: <CodeIcon /> },
            ]
        },
        {
            id: 2,
            name: "Business",
            example: [
                { id: 201, exname: "Marketing", icon: "" }, { id: 202, exname: "Data Analytics", icon: "" }, { id: 203, exname: "Entrepreneurship", icon: "" },
            ]
        },
        {
            id: 3,
            name: "Art",
            example: [
                { id: 301, exname: "Graphic Design", icon: "" }, { id: 302, exname: "Photography", icon: "" }, { id: 303, exname: "Music Theory", icon: " " }
            ]
        },
        {
            id: 4,
            name: " Health &Science ",
            example: [
                { id: 401, exname: "Physics", icon: "" }, { id: 402, exname: "Wellness", icon: "" }, { id: 403, exname: "Psychology", icon: "" }
            ]
        },

    ]

    return (

        <div className="flex justify-center items-start gap-4 w-full min-h-screen px-4 sm:px-6 py-6 sm:py-6 ">
            <button
                type="button"
                onClick={() => navigate('/learning-goals')}
                className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors font-[Manrope] text-sm cursor-pointer"
            >
                <ArrowBackIcon fontSize="small" />
                <span>Back</span>
            </button>

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
                    {Interest.map((category) => (
                        <div
                            key={category.id}
                            className='cursor-pointer  mb-3'
                        >
                            {category.name}
                            <div className='flex flex-row gap-2 pt-4 justify-center '>
                                {category.example.map((interest) =>
                                    < Card key={interest.id}
                                        onClick={() => {
                                            toggleInterest(interest);
                                        }}
                                        className={`rounded-full flex flex-col justify-center items-center  w-230
                                            ${selectedInterests.some(item => item.id === interest.id)
                                                ? "border bg-indigo-500"
                                                : "bg-white"
                                            }`}
                                    >
                                        <div className='flex flex-col justify-center items-center'>
                                            <span className='text-[#818CF8]'>{interest.icon}</span>
                                            <p>{interest.exname}</p>
                                        </div>

                                    </Card>)}
                            </div>
                        </div>
                    ))}
                </div>


                {/* Navigation Buttons */}
                <div className="w-full flex items-center gap-2 justify-end mt-2 p-1">


                    <Button
                        variant="primary"
                        onClick={submitInterest}
                        className="h-8 px-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs flex items-center gap-1"
                    >
                        Submit
                    </Button>
                    <Button
                        variant="primary"
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

export default Interest;
