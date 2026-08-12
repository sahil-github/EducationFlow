import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Card from "../../components/Card";
import { fetchCourseById } from "../../features/courses/coursesThunks";
import { completeLessonInCourse } from "../../features/myLearning/myLearningThunks";

// Static default lessons list matching the screenshot design
const DEFAULT_LESSONS = [
    {
        id: "l_1",
        title: "Course Overview",
        duration: "3:45",
        status: "completed",
    },
    {
        id: "l_2",
        title: "Introduction",
        duration: "5:20",
        status: "active",
    },
    {
        id: "l_3",
        title: "Understanding Users",
        duration: "12:10",
        status: "upcoming",
    },
    {
        id: "l_4",
        title: "Ideation Techniques",
        duration: "08:45",
        status: "upcoming",
    },
    {
        id: "l_5",
        title: "Prototyping Labs",
        duration: "25:00",
        status: "locked",
    },
];

export default function CoursePlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentCourse } = useSelector((state) => state.courses);
    const { myLearning } = useSelector((state) => state.myLearning);

    const [activeTab, setActiveTab] = useState("about");
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeLessonId, setActiveLessonId] = useState("l_2");

    useEffect(() => {
        if (id) {
            dispatch(fetchCourseById(id));
        }
    }, [dispatch, id]);

    // Derive lessons list from API currentCourse or fall back to DEFAULT_LESSONS
    const lessonsList = (() => {
        if (currentCourse?.modules && Array.isArray(currentCourse.modules) && currentCourse.modules.length > 0) {
            const firstMod = currentCourse.modules[0];
            if (firstMod.lessons && Array.isArray(firstMod.lessons) && firstMod.lessons.length > 0) {
                return firstMod.lessons.map((les, index) => ({
                    id: les.id || les.lessonId || `l_${index + 1}`,
                    title: les.title || les.name || `Lesson ${index + 1}`,
                    duration: les.duration || "10:00",
                    status: index === 0 ? "completed" : index === 1 ? "active" : index === 4 ? "locked" : "upcoming",
                }));
            }
        }
        return DEFAULT_LESSONS;
    })();

    const currentLesson = lessonsList.find((l) => l.id === activeLessonId) || lessonsList[1] || lessonsList[0];
    const courseTitle = currentCourse?.title || "Design Thinking";
    const moduleName = currentCourse?.moduleName || "Module 1 of 12";

    const handleLessonClick = (lesson) => {
        if (lesson.status === "locked") {
            toast.info("This lesson is locked. Complete previous lessons to unlock.");
            return;
        }
        setActiveLessonId(lesson.id);
        setIsPlaying(true);

        // Dispatch completeLessonInCourse to update backend & Redux
        if (id) {
            dispatch(completeLessonInCourse({ courseId: id, lessonId: lesson.id }))
                .unwrap()
                .then(() => {
                    toast.success(`Progress saved for ${lesson.title}!`);
                })
                .catch(() => {});
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 text-start text-white">
            {/* Top Breadcrumb Header */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 font-medium mb-6">
                <Link to="/catalog" className="hover:text-white transition-colors">
                    Catalog
                </Link>
                <ChevronRightIcon sx={{ fontSize: 16 }} />
                <Link to={`/courses/${id || 1}`} className="hover:text-white transition-colors">
                    {courseTitle}
                </Link>
                <ChevronRightIcon sx={{ fontSize: 16 }} />
                <span className="text-white font-semibold">{currentLesson.title}</span>
            </div>

            {/* Main 2-Column Container */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Sidebar - Modules & Lessons */}
                <div className="w-full lg:w-80 shrink-0 bg-[#16181F] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                        {/* Course Badge & Info Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 font-bold">
                                💡
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-base leading-tight">
                                    {courseTitle}
                                </h3>
                                <p className="text-gray-400 text-xs font-medium mt-0.5">
                                    {moduleName}
                                </p>
                            </div>
                        </div>

                        {/* Module Progress Bar */}
                        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-6 overflow-hidden">
                            <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                style={{ width: "25%" }}
                            />
                        </div>

                        {/* Lessons List */}
                        <div className="space-y-2">
                            {lessonsList.map((lesson) => {
                                const isActive = lesson.id === activeLessonId;
                                const isCompleted = lesson.status === "completed";
                                const isLocked = lesson.status === "locked";

                                return (
                                    <div
                                        key={lesson.id}
                                        onClick={() => handleLessonClick(lesson)}
                                        className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer select-none ${
                                            isActive
                                                ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30"
                                                : isLocked
                                                ? "opacity-50 hover:bg-white/5 text-gray-400 cursor-not-allowed"
                                                : "hover:bg-white/5 text-gray-300"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            {isCompleted ? (
                                                <CheckCircleIcon sx={{ fontSize: 20, color: isActive ? "#fff" : "#9ca3af" }} />
                                            ) : isActive ? (
                                                <PlayCircleIcon sx={{ fontSize: 20, color: "#fff" }} />
                                            ) : isLocked ? (
                                                <LockOutlinedIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                                            ) : (
                                                <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                                            )}
                                            <span className="text-sm font-medium truncate">
                                                {lesson.title}
                                            </span>
                                        </div>
                                        <span className={`text-xs ml-2 shrink-0 ${isActive ? "text-blue-100" : "text-gray-500"}`}>
                                            {lesson.duration}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Download Resources Button */}
                    <button className="w-full py-3 bg-[#202430] hover:bg-[#282d3c] text-gray-300 hover:text-white text-xs font-semibold rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer mt-8">
                        <DownloadOutlinedIcon fontSize="small" />
                        Download Resources
                    </button>
                </div>

                {/* Right Column - Video Player & Details */}
                <div className="flex-1 min-w-0 w-full">
                    {/* Video Player Display — Sleek Dark Stylized Backdrop (Without Image) */}
                    <div className="aspect-video w-full rounded-2xl bg-gradient-to-tr from-[#0b0e14] via-[#121722] to-[#1a2130] border border-white/10 relative overflow-hidden flex items-center justify-center shadow-2xl group">
                        {/* Background Ambient Ambient Studio Elements */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-black/80 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                        
                        {/* Top Right Counter Badge ("05") */}
                        <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 tracking-widest">
                            05
                        </div>

                        {/* Centered Circular Play Button Overlay */}
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600/20 backdrop-blur-md border border-blue-400/40 flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-blue-600/30 transition-all cursor-pointer group/btn"
                        >
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg group-hover/btn:bg-blue-500 transition-colors">
                                {isPlaying ? (
                                    <PauseIcon sx={{ fontSize: 32 }} />
                                ) : (
                                    <PlayArrowIcon sx={{ fontSize: 36, ml: "2px" }} />
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-8 border-b border-white/10 mt-8 mb-6 text-sm font-semibold">
                        <button
                            onClick={() => setActiveTab("about")}
                            className={`pb-3 transition-colors cursor-pointer ${
                                activeTab === "about"
                                    ? "text-white border-b-2 border-blue-500 font-bold"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            About
                        </button>
                        <button
                            onClick={() => setActiveTab("resources")}
                            className={`pb-3 transition-colors cursor-pointer ${
                                activeTab === "resources"
                                    ? "text-white border-b-2 border-blue-500 font-bold"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Resources
                        </button>
                        <button
                            onClick={() => setActiveTab("notes")}
                            className={`pb-3 transition-colors cursor-pointer ${
                                activeTab === "notes"
                                    ? "text-white border-b-2 border-blue-500 font-bold"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Notes
                        </button>
                        <button
                            onClick={() => setActiveTab("qna")}
                            className={`pb-3 transition-colors cursor-pointer ${
                                activeTab === "qna"
                                    ? "text-white border-b-2 border-blue-500 font-bold"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Q&A
                        </button>
                    </div>

                    {/* Tab Contents: About Section */}
                    {activeTab === "about" && (
                        <div>
                            <h2 className="text-white text-2xl font-bold mb-3">
                                Course Introduction
                            </h2>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                                Welcome to the core module of our Project Management series. In this lesson, we explore the foundational principles of Design Thinking and how it integrates into modern agile workflows. We'll cover the five stages: Empathize, Define, Ideate, Prototype, and Test.
                            </p>

                            {/* 2-Column Objectives & Pro Tips Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                {/* Left Card: Key Objectives */}
                                <Card className="bg-[#13161F]/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 text-white">
                                            <TaskAltIcon fontSize="small" className="text-blue-400" />
                                            <span className="text-xs font-bold tracking-wider uppercase">
                                                KEY OBJECTIVES
                                            </span>
                                        </div>
                                        <ul className="text-gray-400 text-xs sm:text-sm space-y-2.5 list-disc list-inside leading-relaxed">
                                            <li>Define customer pain points through empathy mapping</li>
                                            <li>Integrate design sprints into product roadmaps</li>
                                            <li>Validate early prototypes with real user testing</li>
                                        </ul>
                                    </div>
                                </Card>

                                {/* Right Card: Pro Tips */}
                                <Card className="bg-[#13161F]/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 text-white">
                                            <LightbulbOutlinedIcon fontSize="small" className="text-amber-400" />
                                            <span className="text-xs font-bold tracking-wider uppercase">
                                                PRO TIPS
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                                            "Always start with 'How Might We' questions before jumping into mental models. It opens up creative problem spaces without premature constraints."
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === "resources" && (
                        <div className="py-6 text-gray-400 text-sm">
                            <p className="mb-4">Downloadable lesson materials and slide decks:</p>
                            <ul className="space-y-2 text-blue-400 text-xs font-semibold">
                                <li className="cursor-pointer hover:underline">📄 Lesson 02 - Design Thinking Framework (PDF)</li>
                                <li className="cursor-pointer hover:underline">📊 Empathy Mapping Template (Figma / XLSX)</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === "notes" && (
                        <div className="py-6 text-gray-400 text-sm">
                            <textarea
                                rows={4}
                                placeholder="Type your personal lesson notes here..."
                                className="w-full p-4 rounded-xl bg-[#13161F] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm resize-none"
                            />
                        </div>
                    )}

                    {activeTab === "qna" && (
                        <div className="py-6 text-gray-400 text-sm">
                            <p>No questions submitted for this lesson yet. Be the first to ask!</p>
                        </div>
                    )}

                    {/* Footer Links */}
                    <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 pt-8 border-t border-white/5 gap-4">
                        <div>© 2024 EduFlow Learning Systems. All rights reserved.</div>
                        <div className="flex gap-6">
                            <span className="hover:text-gray-400 cursor-pointer">Help Center</span>
                            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
                            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
