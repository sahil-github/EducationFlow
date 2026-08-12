import Card from '../../components/Card'
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useState } from "react";
import {
    Box,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";

const courseFilters = [
    { value: "all", label: "All Courses" },
    { value: "inProgress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

function MyLearning() {

    const [filter, setFilter] = useState("all");

    const handleFilterChange = (event, newFilter) => {
        // Prevent deselecting the currently selected option
        if (newFilter !== null) {
            setFilter(newFilter);
        }
    };

    const learningCourses = [
        {
            id: 1,
            category: "Advanced Data Science",
            title: "Predictive Modeling with Python",
            progress: 68,
            timeLeft: "2h left",
            buttonText: "Continue Lesson",
        },
        {
            id: 2,
            category: "UX/UI Design",
            title: "Design Systems for Enterprise",
            progress: 12,
            timeLeft: "14h left",
            buttonText: "Resume Module",
        },
        {
            id: 3,
            category: "Professional Development",
            title: "Critical Thinking for Leaders",
            progress: 92,
            timeLeft: "45m left",
            buttonText: "Finish Module",
        },
    ];

    const courseSavedCategories = [
        {
            id: 1,
            category: "Management",
            title: "Time Mastery for Creatives",
            duration: "4.5 hours",
        },
        {
            id: 2,
            category: "Security",
            title: "Cybersecurity Fundamentals",
            duration: "12 hours",
        },
    ];

    const completedCategories = [{
        id: 1,
        course: 'Intro to Agile',
        certificateDate: 'certified oct 12'
    },
    {
        id: 2,
        course: 'Modern Js ES6+',
        certificateDate: 'certified sep 28'
    }
    ]
    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-10 pb-20">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
                        My Learning
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
                        Track your progress and continue where you left off in your learning journey.
                    </p>
                </div>
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: { xs: "100%", lg: 410 },
                    }}
                >
                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={handleFilterChange}
                        aria-label="course filter"
                        sx={{
                            width: "100%",
                            height: { xs: 44, sm: 48, md: 50 },
                            padding: "4px",
                            border: "2px solid",
                            borderColor: "#343942",
                            borderRadius: "22px",
                            backgroundColor: "#181b21",

                            "& .MuiToggleButtonGroup-grouped": {
                                border: "none",
                                borderRadius: "16px !important",
                                margin: 0,
                            },
                        }}
                    >
                        {courseFilters.map((item) => (
                            <ToggleButton
                                key={item.value}
                                value={item.value}
                                sx={{
                                    flex: 1,
                                    height: "100%",
                                    color: "#ffffff",
                                    textTransform: "none",
                                    fontSize: { xs: "12px", sm: "14px", md: "15px" },
                                    fontWeight: 500,
                                    letterSpacing: "0.2px",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    },

                                    "&.Mui-selected": {
                                        backgroundColor: "#0759d9",
                                        color: "#ffffff",

                                        "&:hover": {
                                            backgroundColor: "#0759d9",
                                        },
                                    },
                                }}
                            >
                                {item.label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            </div>

            {/* In Progress Section */}
            {(filter === "all" || filter === "inProgress") && (
                <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                        <PlayCircleIcon fontSize="medium" className="text-[#0759d9]" />
                        In Progress
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {learningCourses.map((course) => (
                            <Card className="flex flex-col justify-between p-5 rounded-xl border border-gray-800 bg-[#1A1D24] text-start h-full" key={course.id}>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                                        <span className="bg-[#181b21] px-2.5 py-1 rounded-md text-gray-300 border border-gray-800">
                                            {course.category}
                                        </span>
                                        <span>{course.timeLeft}</span>
                                    </div>
                                    <h3 className="text-white font-bold text-lg leading-snug pt-1 min-h-[3.5rem] line-clamp-2">
                                        {course.title}
                                    </h3>
                                </div>
                                <div className="mt-6 space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs text-gray-400 font-semibold">
                                            <span>Progress</span>
                                            <span className="text-[#0759d9]">{course.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-[#0759d9] h-full rounded-full transition-all duration-300"
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <button className="w-full py-2.5 bg-[#0759d9] hover:bg-[#054dbb] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer">
                                        {course.buttonText}
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Saved and Completed Sections */}
            {filter === "all" && (
                <div className="flex flex-col lg:flex-row gap-8 mt-10">
                    <div className="flex-1">
                        <h2 className="text-white text-xl font-semibold mb-4">Saved for Later</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {courseSavedCategories.map((course) => (
                                <Card className="flex flex-col justify-between p-5 rounded-xl border border-gray-800 bg-[#1A1D24]" key={course.id}>
                                    <div>
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">
                                            {course.category}
                                        </span>
                                        <h3 className="text-white font-bold text-base mb-2 line-clamp-2">
                                            {course.title}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                                        <span>🕒</span> {course.duration}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-80 flex flex-col gap-4">
                        <h2 className="text-white text-xl font-semibold mb-4">Completed</h2>
                        <div className="flex flex-col gap-4">
                            {completedCategories.map((complete) => (
                                <Card className="p-5 rounded-xl border border-gray-800 bg-[#1A1D24] flex flex-col gap-2" key={complete.id}>
                                    <h3 className="text-white font-bold text-base">{complete.course}</h3>
                                    <span className="text-xs text-[#0759d9] bg-[#0759d9]/10 border border-[#0759d9]/20 self-start px-2 py-0.5 rounded-md font-medium uppercase tracking-wider">
                                        {complete.certificateDate}
                                    </span>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Filter-specific completed view */}
            {filter === "completed" && (
                <div className="mt-6">
                    <h2 className="text-white text-xl font-semibold mb-4">Completed</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completedCategories.map((complete) => (
                            <Card className="p-5 rounded-xl border border-gray-800 bg-[#1A1D24] flex flex-col gap-2" key={complete.id}>
                                <h3 className="text-white font-bold text-base">{complete.course}</h3>
                                <span className="text-xs text-[#0759d9] bg-[#0759d9]/10 border border-[#0759d9]/20 self-start px-2 py-0.5 rounded-md font-medium uppercase tracking-wider">
                                    {complete.certificateDate}
                                </span>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyLearning;