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
import Button from "../../components/Button";
// import { fetchCourseById, fetchCoursePlayer } from "../../features/courses/coursesThunks";
import { clearCoursePlayer } from "../../features/courses/coursesSlice";
// import { completeLessonInCourse } from "../../features/myLearning/myLearningThunks";
import { fetchCourseById, fetchCoursePlayer, completeLessonInCourse } from "../../features/courses/coursesThunks";
// Default fallback lesson structure
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

    const {
        currentCourse,
        coursePlayerData,
        coursePlayerLoading: loading,
        coursePlayerError: error,
    } = useSelector((state) => state.courses);

    const [activeTab, setActiveTab] = useState("about");
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [completedLessonIds, setCompletedLessonIds] = useState(new Set());

    useEffect(() => {
        if (id) {
            dispatch(fetchCoursePlayer(id));
            dispatch(fetchCourseById(id));
        }
        return () => {
            dispatch(clearCoursePlayer());
        };
    }, [dispatch, id]);

    // Normalize potential backend response nesting shapes
    const playerData = coursePlayerData?.data ?? coursePlayerData?.course ?? coursePlayerData;

    // Derive lessons list from API response (playlist or modules)
    const lessonsList = (() => {
        const playlist = playerData?.playlist || playerData?.lessons;
        if (playlist && Array.isArray(playlist) && playlist.length > 0) {
            return playlist.map((les, index) => ({
                id: les.id || les._id || les.lessonId || `l_${index + 1}`,
                title: les.title || les.name || `Lesson ${index + 1}`,
                duration: les.duration || "10:00",
                videoUrl: les.videoUrl || les.url || "",
                description: les.description || "",
                keyObjectives: les.keyObjectives || [],
                proTips: les.proTips || "",
                status: completedLessonIds.has(les.id || les._id || les.lessonId || `l_${index + 1}`)
                    ? "completed"
                    : les.status || (les.isCompleted ? "completed" : index === 0 ? "active" : "upcoming"),
            }));
        }

        const modules = playerData?.modules || currentCourse?.modules;
        if (modules && Array.isArray(modules) && modules.length > 0) {
            const allLessons = [];
            modules.forEach((mod, modIdx) => {
                if (Array.isArray(mod.lessons)) {
                    mod.lessons.forEach((les, lesIdx) => {
                        allLessons.push({
                            id: les.id || les._id || les.lessonId || `l_${modIdx + 1}_${lesIdx + 1}`,
                            title: les.title || les.name || `Lesson ${lesIdx + 1}`,
                            duration: les.duration || "10:00",
                            videoUrl: les.videoUrl || les.url || "",
                            description: les.description || "",
                            keyObjectives: les.keyObjectives || [],
                            proTips: les.proTips || "",
                            status: completedLessonIds.has(les.id || les._id || les.lessonId || `l_${modIdx + 1}_${lesIdx + 1}`)
                                ? "completed"
                                : les.status || (les.isCompleted ? "completed" : allLessons.length === 0 ? "active" : "upcoming"),
                        });
                    });
                }
            });
            if (allLessons.length > 0) return allLessons;
        }

        return DEFAULT_LESSONS;
    })();

    // Active lesson resolution
    const activeLessonObj = playerData?.activeLesson || (lessonsList.length > 0 ? lessonsList[0] : null);
    const activeLessonId = selectedLessonId || activeLessonObj?.id || activeLessonObj?._id || activeLessonObj?.lessonId || lessonsList[0]?.id || "l_1";
    const currentLesson = lessonsList.find((l) => l.id === activeLessonId) || activeLessonObj || lessonsList[0];

    const courseTitle = playerData?.title || playerData?.courseTitle || currentCourse?.title || "Design Thinking";
    const moduleName = playerData?.moduleName || playerData?.activeModule || currentCourse?.moduleName || "Module 1 of 12";
    const progressPercent = playerData?.progressPercentage ?? playerData?.progress ?? currentCourse?.progress ?? 25;

    // Active lesson details from API response
    const lessonDescription = currentLesson?.description || activeLessonObj?.description || "Welcome to the core module of our series. In this lesson, we explore foundational principles and how they integrate into modern agile workflows.";
    const keyObjectives = (Array.isArray(currentLesson?.keyObjectives) && currentLesson.keyObjectives.length > 0)
        ? currentLesson.keyObjectives
        : (Array.isArray(activeLessonObj?.keyObjectives) && activeLessonObj.keyObjectives.length > 0)
            ? activeLessonObj.keyObjectives
            : [
                "Define customer pain points through empathy mapping",
                "Integrate design sprints into product roadmaps",
                "Validate early prototypes with real user testing",
            ];
    const proTips = currentLesson?.proTips || activeLessonObj?.proTips || "Always start with 'How Might We' questions before jumping into mental models. It opens up creative problem spaces without premature constraints.";
    const resourcesList = playerData?.resources || [
        { title: "Lesson 02 - Design Thinking Framework (PDF)", type: "pdf" },
        { title: "Empathy Mapping Template (Figma / XLSX)", type: "template" },
    ];

    const [completingLesson, setCompletingLesson] = useState(false);

    const handleSelectLesson = (lesson) => {
        if (lesson.status === "locked") {
            toast.info("This lesson is locked. Complete previous lessons to unlock.");
            return;
        }
        setSelectedLessonId(lesson.id);
        setIsPlaying(true);
    };

    const handleCompleteLesson = async (targetLessonId) => {
        const lid = targetLessonId || activeLessonId;
        if (!id || !lid) return;
        if (completedLessonIds.has(lid)) {
            toast.info("Lesson is already marked as completed.");
            return;
        }
        setCompletingLesson(true);
        try {
            const res = await dispatch(completeLessonInCourse({ courseId: id, lessonId: lid })).unwrap();
            setCompletedLessonIds((prev) => new Set([...prev, lid]));
            const pct = res?.progressPercentage !== undefined ? `${res.progressPercentage}%` : "Progress saved";
            toast.success(`Lesson marked as completed (${pct})! 🎉`);

            // Advance to next lesson if available
            const currentIndex = lessonsList.findIndex((l) => l.id === lid);
            if (currentIndex !== -1 && currentIndex + 1 < lessonsList.length) {
                const nextLesson = lessonsList[currentIndex + 1];
                if (nextLesson && nextLesson.status !== "locked") {
                    setSelectedLessonId(nextLesson.id);
                }
            }
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to mark lesson complete");
        } finally {
            setCompletingLesson(false);
        }
    };

    if (loading && !coursePlayerData) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm font-medium">Loading course player...</p>
                </div>
            </div>
        );
    }

    if (error && !coursePlayerData) {
        return (
            <div className="w-full max-w-xl mx-auto p-6 text-center text-white mt-20">
                <Card className="p-8 border border-red-500/20 bg-red-950/10">
                    <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Course Player</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => navigate("/catalog")}>
                            Back to Catalog
                        </Button>
                        <Button variant="primary" onClick={() => dispatch(fetchCoursePlayer(id))}>
                            Retry
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

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
                <span className="text-white font-semibold">{currentLesson?.title || "Lesson"}</span>
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
                                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                            />
                        </div>

                        {/* Lessons List */}
                        <div className="space-y-2">
                            {lessonsList.map((lesson) => {
                                const isActive = lesson.id === activeLessonId;
                                const isCompleted = lesson.status === "completed" || completedLessonIds.has(lesson.id);
                                const isLocked = lesson.status === "locked";

                                return (
                                    <div
                                        key={lesson.id}
                                        onClick={() => handleSelectLesson(lesson)}
                                        className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer select-none ${isActive
                                                ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30"
                                                : isLocked
                                                    ? "opacity-50 hover:bg-white/5 text-gray-400 cursor-not-allowed"
                                                    : "hover:bg-white/5 text-gray-300"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!isLocked) handleCompleteLesson(lesson.id);
                                                }}
                                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                                title={isCompleted ? "Completed" : "Click to mark complete"}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircleIcon sx={{ fontSize: 20, color: isActive ? "#fff" : "#10b981" }} />
                                                ) : isActive ? (
                                                    <PlayCircleIcon sx={{ fontSize: 20, color: "#fff" }} />
                                                ) : isLocked ? (
                                                    <LockOutlinedIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                                                ) : (
                                                    <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                                                )}
                                            </button>
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
                    <button
                        onClick={() => setActiveTab("resources")}
                        className="w-full py-3 bg-[#202430] hover:bg-[#282d3c] text-gray-300 hover:text-white text-xs font-semibold rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer mt-8"
                    >
                        <DownloadOutlinedIcon fontSize="small" />
                        Download Resources
                    </button>
                </div>

                {/* Right Column - Video Player & Details */}
                <div className="flex-1 min-w-0 w-full">
                    {/* Video Player Display */}
                    <div className="aspect-video w-full rounded-2xl bg-gradient-to-tr from-[#0b0e14] via-[#121722] to-[#1a2130] border border-white/10 relative overflow-hidden flex items-center justify-center shadow-2xl group">
                        {currentLesson?.videoUrl && isPlaying ? (
                            <video
                                src={currentLesson.videoUrl}
                                controls
                                autoPlay
                                onEnded={() => handleCompleteLesson(currentLesson?.id)}
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        ) : (
                            <>
                                {/* Background Ambient Studio Elements */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-black/80 pointer-events-none" />
                                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                                {/* Top Right Counter Badge */}
                                <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 tracking-widest">
                                    {Math.round(progressPercent)}%
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
                            </>
                        )}
                    </div>

                    {/* Lesson Completion and Next Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 p-4 rounded-xl bg-[#16181F] border border-white/5">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-white">
                                {currentLesson?.title || "Lesson"}
                            </span>
                            {(completedLessonIds.has(currentLesson?.id) || currentLesson?.status === "completed") && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                    <CheckCircleIcon sx={{ fontSize: 14 }} /> Completed
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleCompleteLesson(currentLesson?.id)}
                                disabled={completingLesson || completedLessonIds.has(currentLesson?.id) || currentLesson?.status === "completed"}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${completedLessonIds.has(currentLesson?.id) || currentLesson?.status === "completed"
                                        ? "bg-white/5 text-gray-400 border border-white/10 cursor-default"
                                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/30"
                                    }`}
                            >
                                <CheckCircleIcon sx={{ fontSize: 16 }} />
                                {completingLesson ? "Saving..." : (completedLessonIds.has(currentLesson?.id) || currentLesson?.status === "completed") ? "Lesson Completed" : "Mark as Complete"}
                            </button>

                            {(() => {
                                const currentIndex = lessonsList.findIndex((l) => l.id === activeLessonId);
                                const nextLesson = currentIndex !== -1 && currentIndex + 1 < lessonsList.length ? lessonsList[currentIndex + 1] : null;
                                if (!nextLesson) return null;
                                return (
                                    <button
                                        onClick={() => handleSelectLesson(nextLesson)}
                                        disabled={nextLesson.status === "locked"}
                                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Next Lesson <ChevronRightIcon sx={{ fontSize: 16 }} />
                                    </button>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-8 border-b border-white/10 mt-8 mb-6 text-sm font-semibold">
                        <button
                            onClick={() => setActiveTab("about")}
                            className={`pb-3 transition-colors cursor-pointer ${activeTab === "about"
                                    ? "text-white border-b-2 border-blue-500 font-bold"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >
                            About
                        </button>
                        <button
                            onClick={() => setActiveTab("resources")}
                            className={`pb-3 transition-colors cursor-pointer ${activeTab === "resources"
                                    ? "text-white border-b-2 border-blue-500 font-bold"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Resources
                        </button>
                        <button
                            onClick={() => setActiveTab("notes")}
                            className={`pb-3 transition-colors cursor-pointer ${activeTab === "notes"
                                    ? "text-white border-b-2 border-blue-500 font-bold"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Notes
                        </button>
                        <button
                            onClick={() => setActiveTab("qna")}
                            className={`pb-3 transition-colors cursor-pointer ${activeTab === "qna"
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
                                {currentLesson?.title || "Lesson Overview"}
                            </h2>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                                {lessonDescription}
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
                                            {keyObjectives.map((obj, i) => (
                                                <li key={i}>{typeof obj === "string" ? obj : obj?.title || obj?.text || JSON.stringify(obj)}</li>
                                            ))}
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
                                            "{proTips}"
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === "resources" && (
                        <div className="py-6 text-gray-400 text-sm">
                            <p className="mb-4">Downloadable lesson materials and resources:</p>
                            <ul className="space-y-2 text-blue-400 text-xs font-semibold">
                                {resourcesList.map((res, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => {
                                            if (res.url) window.open(res.url, "_blank");
                                            else toast.info(`Resource: ${res.title || res.name || "Download initiated"}`);
                                        }}
                                        className="cursor-pointer hover:underline flex items-center gap-2"
                                    >
                                        <span>📄 {res.title || res.name || `Resource ${idx + 1}`}</span>
                                        {res.size && <span className="text-gray-500 font-normal">({res.size})</span>}
                                    </li>
                                ))}
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
