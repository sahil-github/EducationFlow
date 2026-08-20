import React, { useState, useEffect, useRef } from "react";
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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";

import Card from "../../components/Card";
import Button from "../../components/Button";
import { clearCoursePlayer } from "../../features/courses/coursesSlice";
import {
    fetchCourseById,
    fetchCoursePlayer,
    completeLessonInCourse,
    getCourseNotes,
    addCourseNote,
    deleteCourseNote,
    getCourseQnA,
    addCourseQuestion,
    replyToQuestion,
    upvoteQuestion,
    getCourseResources,
    downloadCourseResource,
    fetchLessonById,
    saveLessonProgress,
} from "../../features/courses/coursesThunks";



export default function CoursePlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        currentCourse,
        coursePlayerData,
        coursePlayerLoading: loading,
        coursePlayerError: error,
        notesList,
        notesLoading,
        addingNote,
        deletingNoteId,
        qnaList,
        qnaLoading,
        addingQuestion,
        replyingQuestionId,
        upvotingQuestionId,
        resourcesList,
        resourcesLoading,
        downloadingResourceId,
        activeLessonData,
    } = useSelector((state) => state.courses);

    const [activeTab, setActiveTab] = useState("about");
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
    const [noteContent, setNoteContent] = useState("");
    const [videoTime, setVideoTime] = useState(0);

    // Q&A form states
    const [questionInput, setQuestionInput] = useState("");
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyInputs, setReplyInputs] = useState({});

    const [completingLesson, setCompletingLesson] = useState(false);
    const lastProgressSavedRef = useRef(0);
    const videoRef = useRef(null);

    // Load initial data on mount or course id change
    useEffect(() => {
        if (id) {
            dispatch(fetchCoursePlayer(id));
            dispatch(fetchCourseById(id));
            dispatch(getCourseNotes(id));
            dispatch(getCourseQnA(id));
            dispatch(getCourseResources(id));
        }
        return () => {
            dispatch(clearCoursePlayer());
        };
    }, [dispatch, id]);

    // Normalize potential backend response nesting shapes
    const playerData = coursePlayerData?.data ?? coursePlayerData?.course ?? coursePlayerData;

    // Derive lessons list from API response (playlist, lessons, modules, curriculum, or activeLesson)
    const lessonsList = (() => {
        const rawPlaylist = playerData?.playlist || playerData?.lessons || playerData?.curriculum || playerData?.syllabus || currentCourse?.playlist || currentCourse?.lessons || currentCourse?.curriculum;
        if (rawPlaylist && Array.isArray(rawPlaylist) && rawPlaylist.length > 0) {
            return rawPlaylist.map((les, index) => {
                const lid = les.id || les._id || les.lessonId || `l_${index + 1}`;
                return {
                    id: lid,
                    title: les.title || les.name || les.topic || `Lesson ${index + 1}`,
                    duration: les.duration || les.time || "10:00",
                    videoUrl: les.videoUrl || les.url || les.streamUrl || "",
                    description: les.description || "",
                    keyObjectives: les.keyObjectives || les.objectives || [],
                    proTips: les.proTips || les.tips || "",
                    status: completedLessonIds.has(lid)
                        ? "completed"
                        : les.status || (les.isCompleted ? "completed" : index === 0 ? "active" : "upcoming"),
                };
            });
        }

        const rawModules = playerData?.modules || currentCourse?.modules;
        if (rawModules && Array.isArray(rawModules) && rawModules.length > 0) {
            const allLessons = [];
            rawModules.forEach((mod, modIdx) => {
                const modLessons = mod.lessons || mod.items || mod.topics || mod.lectures || mod.content;
                if (Array.isArray(modLessons) && modLessons.length > 0) {
                    modLessons.forEach((les, lesIdx) => {
                        const lid = (typeof les === "object") ? (les.id || les._id || les.lessonId || `l_${modIdx + 1}_${lesIdx + 1}`) : `l_${modIdx + 1}_${lesIdx + 1}`;
                        const title = (typeof les === "object") ? (les.title || les.name || les.topic || `Lesson ${lesIdx + 1}`) : String(les);
                        allLessons.push({
                            id: lid,
                            title: title,
                            duration: (typeof les === "object" ? (les.duration || les.time) : null) || "10:00",
                            videoUrl: (typeof les === "object" ? (les.videoUrl || les.url || les.streamUrl) : "") || "",
                            description: (typeof les === "object" ? les.description : "") || "",
                            keyObjectives: (typeof les === "object" ? (les.keyObjectives || les.objectives) : []) || [],
                            proTips: (typeof les === "object" ? (les.proTips || les.tips) : "") || "",
                            status: completedLessonIds.has(lid)
                                ? "completed"
                                : (typeof les === "object" ? (les.status || (les.isCompleted ? "completed" : null)) : null) || (allLessons.length === 0 ? "active" : "upcoming"),
                        });
                    });
                } else if (typeof mod === "object" && (mod.title || mod.name)) {
                    const lid = mod.id || mod._id || `l_${modIdx + 1}`;
                    allLessons.push({
                        id: lid,
                        title: mod.title || mod.name,
                        duration: mod.duration || "10:00",
                        videoUrl: mod.videoUrl || mod.url || "",
                        description: mod.description || "",
                        keyObjectives: mod.keyObjectives || [],
                        proTips: mod.proTips || "",
                        status: completedLessonIds.has(lid)
                            ? "completed"
                            : mod.status || (mod.isCompleted ? "completed" : allLessons.length === 0 ? "active" : "upcoming"),
                    });
                }
            });
            if (allLessons.length > 0) return allLessons;
        }

        // If backend returned single activeLesson
        if (playerData?.activeLesson && typeof playerData.activeLesson === "object") {
            const al = playerData.activeLesson;
            const alId = al.id || al._id || al.lessonId || "l_active";
            return [{
                id: alId,
                title: al.title || al.name || "Active Lesson",
                duration: al.duration || "10:00",
                videoUrl: al.videoUrl || al.url || al.streamUrl || "",
                description: al.description || "",
                keyObjectives: al.keyObjectives || [],
                proTips: al.proTips || "",
                status: completedLessonIds.has(alId) ? "completed" : "active",
            }];
        }

        return [];
    })();

    // Active lesson resolution
    const activeLessonObj = playerData?.activeLesson || (lessonsList.length > 0 ? lessonsList[0] : null);
    const activeLessonId = selectedLessonId || activeLessonObj?.id || activeLessonObj?._id || activeLessonObj?.lessonId || lessonsList[0]?.id || "l_1";
    
    // Combine base lesson info with activeLessonData from fetchLessonById
    const currentLesson = {
        ...(lessonsList.find((l) => l.id === activeLessonId) || {}),
        ...(activeLessonObj || {}),
        ...(activeLessonData?.data ?? activeLessonData ?? {}),
    };

    const courseTitle = playerData?.title || playerData?.courseTitle || currentCourse?.title || "Design Thinking";
    const moduleName = playerData?.moduleName || playerData?.activeModule || currentCourse?.moduleName || "Module 1 of 12";
    const progressPercent = playerData?.progressPercentage ?? playerData?.progress ?? currentCourse?.progress ?? 25;

    // Active lesson details
    const lessonDescription = currentLesson?.description || "Welcome to this module. In this lesson, we explore foundational principles and practical applications.";
    const keyObjectives = (Array.isArray(currentLesson?.keyObjectives) && currentLesson.keyObjectives.length > 0)
        ? currentLesson.keyObjectives
        : [
            "Define customer pain points through empathy mapping",
            "Integrate design sprints into product roadmaps",
            "Validate early prototypes with real user testing",
        ];
    const proTips = currentLesson?.proTips || "Always start with 'How Might We' questions before jumping into mental models. It opens up creative problem spaces without premature constraints.";

    // Derived resources list
    const combinedResources = (Array.isArray(resourcesList) && resourcesList.length > 0)
        ? resourcesList
        : (playerData?.resources || [
            { id: "r_1", title: "Lesson Framework & Guide (PDF)", type: "pdf", size: "2.4 MB" },
            { id: "r_2", title: "Empathy Mapping Template (Figma)", type: "template", size: "1.1 MB" },
        ]);

    // Format seconds to MM:SS
    const formatTimestamp = (seconds) => {
        if (!seconds || isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    // Filter notes for the active lesson
    const currentLessonNotes = Array.isArray(notesList)
        ? notesList.filter((n) => {
            const lid = n.lessonId || n.lesson_id || n.lesson;
            return lid === activeLessonId || !lid;
        })
        : (notesList?.[activeLessonId] || []);

    // ── Handlers ─────────────────────────────────────────────────────────────

    // Select lesson
    const handleSelectLesson = (lesson) => {
        if (lesson.status === "locked") {
            toast.info("This lesson is locked. Complete previous lessons to unlock.");
            return;
        }
        setSelectedLessonId(lesson.id);
        setIsPlaying(true);
        if (id && lesson.id) {
            dispatch(fetchLessonById({ courseId: id, lessonId: lesson.id }));
        }
    };

    // Complete lesson
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
                    handleSelectLesson(nextLesson);
                }
            }
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to mark lesson complete");
        } finally {
            setCompletingLesson(false);
        }
    };

    // Video Progress Events
    const handleVideoTimeUpdate = (e) => {
        const currentTime = e.target.currentTime;
        setVideoTime(currentTime);
        const duration = e.target.duration || 1;

        // Save progress every ~12 seconds
        if (Math.abs(currentTime - lastProgressSavedRef.current) >= 12 && activeLessonId && id) {
            lastProgressSavedRef.current = currentTime;
            const percentage = Math.min(100, Math.round((currentTime / duration) * 100));
            dispatch(
                saveLessonProgress({
                    courseId: id,
                    lessonId: activeLessonId,
                    data: {
                        timestamp: formatTimestamp(currentTime),
                        percentage,
                        isCompleted: false,
                    },
                })
            );
        }
    };

    const handleVideoPause = (e) => {
        const currentTime = e.target.currentTime;
        const duration = e.target.duration || 1;
        if (activeLessonId && id) {
            const percentage = Math.min(100, Math.round((currentTime / duration) * 100));
            dispatch(
                saveLessonProgress({
                    courseId: id,
                    lessonId: activeLessonId,
                    data: {
                        timestamp: formatTimestamp(currentTime),
                        percentage,
                        isCompleted: false,
                    },
                })
            );
        }
    };

    const handleVideoEnded = (e) => {
        const duration = e.target.duration || e.target.currentTime;
        if (activeLessonId && id) {
            dispatch(
                saveLessonProgress({
                    courseId: id,
                    lessonId: activeLessonId,
                    data: {
                        timestamp: formatTimestamp(duration),
                        percentage: 100,
                        isCompleted: true,
                    },
                })
            );
        }
        handleCompleteLesson(activeLessonId);
    };

    // Notes Handlers
    const handleAddNote = async () => {
        if (!noteContent.trim()) {
            toast.info("Please enter a note.");
            return;
        }
        if (!id || !activeLessonId) {
            toast.error("Course or lesson information is missing.");
            return;
        }

        try {
            await dispatch(
                addCourseNote({
                    id,
                    data: {
                        lessonId: activeLessonId,
                        timestamp: formatTimestamp(videoTime),
                        content: noteContent.trim(),
                    },
                })
            ).unwrap();

            setNoteContent("");
            toast.success("Note added successfully!");
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to add note");
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!id || !noteId) return;
        try {
            await dispatch(deleteCourseNote({ id, noteId })).unwrap();
            toast.success("Note deleted.");
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to delete note");
        }
    };

    // Q&A Handlers
    const handleAddQuestion = async () => {
        if (!questionInput.trim()) {
            toast.info("Please enter your question.");
            return;
        }
        if (!id) return;

        try {
            await dispatch(
                addCourseQuestion({
                    id,
                    data: {
                        question: questionInput.trim(),
                        lessonId: activeLessonId,
                    },
                })
            ).unwrap();

            setQuestionInput("");
            toast.success("Question submitted!");
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to submit question");
        }
    };

    const handleReplyToQuestion = async (questionId) => {
        const text = replyInputs[questionId]?.trim();
        if (!text) {
            toast.info("Please type a reply.");
            return;
        }
        if (!id || !questionId) return;

        try {
            await dispatch(
                replyToQuestion({
                    id,
                    questionId,
                    data: { text },
                })
            ).unwrap();

            setReplyInputs((prev) => ({ ...prev, [questionId]: "" }));
            setActiveReplyId(null);
            toast.success("Reply posted!");
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to post reply");
        }
    };

    const handleUpvoteQuestion = async (questionId) => {
        if (!id || !questionId) return;
        try {
            await dispatch(upvoteQuestion({ id, questionId })).unwrap();
            toast.success("Upvoted!");
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to upvote");
        }
    };

    // Resource Download Handler
    const handleDownloadResource = async (res) => {
        const resId = res.id || res._id || res.resourceId;
        if (!resId) {
            if (res.url) {
                window.open(res.url, "_blank");
            } else {
                toast.info(`Resource: ${res.title || res.name || "Download initiated"}`);
            }
            return;
        }

        try {
            const blobData = await dispatch(
                downloadCourseResource({
                    id,
                    resourceId: resId,
                    fileName: res.title || res.name || "resource",
                })
            ).unwrap();

            if (blobData) {
                const blob = blobData instanceof Blob ? blobData : new Blob([blobData]);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = res.fileName || res.title || res.name || `resource_${resId}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                toast.success("Download started!");
            }
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to download resource");
        }
    };

    // ── Render States ────────────────────────────────────────────────────────
    if (loading && !coursePlayerData && lessonsList.length === 0) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm font-medium">Loading course player...</p>
                </div>
            </div>
        );
    }

    if ((error && !coursePlayerData) || (!loading && lessonsList.length === 0)) {
        return (
            <div className="w-full max-w-xl mx-auto p-6 text-center text-white mt-20">
                <Card className="p-8 border border-red-500/20 bg-red-950/10">
                    <h2 className="text-xl font-bold text-red-400 mb-2">
                        {error ? "Error Loading Course Player" : "No Lessons Found"}
                    </h2>
                    <p className="text-gray-400 mb-6">
                        {error || "This course does not have any active lessons available."}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => navigate("/catalog")}>
                            Back to Catalog
                        </Button>
                        <Button variant="primary" onClick={() => {
                            if (id) {
                                dispatch(fetchCoursePlayer(id));
                                dispatch(fetchCourseById(id));
                            }
                        }}>
                            Retry Loading Course
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
                                ref={videoRef}
                                src={currentLesson.videoUrl}
                                controls
                                autoPlay
                                onTimeUpdate={handleVideoTimeUpdate}
                                onPause={handleVideoPause}
                                onEnded={handleVideoEnded}
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
                                    onClick={() => setIsPlaying(true)}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600/20 backdrop-blur-md border border-blue-400/40 flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-blue-600/30 transition-all cursor-pointer group/btn"
                                >
                                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg group-hover/btn:bg-blue-500 transition-colors">
                                        <PlayArrowIcon sx={{ fontSize: 36, ml: "2px" }} />
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
                            Resources ({combinedResources.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("notes")}
                            className={`pb-3 transition-colors cursor-pointer ${activeTab === "notes"
                                ? "text-white border-b-2 border-blue-500 font-bold"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Notes ({currentLessonNotes.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("qna")}
                            className={`pb-3 transition-colors cursor-pointer ${activeTab === "qna"
                                ? "text-white border-b-2 border-blue-500 font-bold"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Q&A ({Array.isArray(qnaList) ? qnaList.length : 0})
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

                    {/* Tab Contents: Resources Section */}
                    {activeTab === "resources" && (
                        <div className="py-6 space-y-4">
                            <p className="text-gray-400 text-sm">Downloadable lesson materials and supplemental resources:</p>

                            {resourcesLoading && combinedResources.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">Loading resources...</div>
                            ) : combinedResources.length === 0 ? (
                                <p className="text-gray-500 text-sm py-4">No resources available for this course.</p>
                            ) : (
                                <div className="space-y-3">
                                    {combinedResources.map((res, idx) => {
                                        const resId = res.id || res._id || res.resourceId || `res_${idx}`;
                                        const isDownloading = downloadingResourceId === resId;

                                        return (
                                            <div
                                                key={resId}
                                                className="p-4 rounded-xl bg-[#13161F] border border-white/10 flex items-center justify-between gap-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm shrink-0">
                                                        📄
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white text-sm font-semibold">
                                                            {res.title || res.name || `Resource ${idx + 1}`}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                            <span className="uppercase">{res.type || "file"}</span>
                                                            {res.size && <span>• {res.size}</span>}
                                                            {res.description && <span>• {res.description}</span>}
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleDownloadResource(res)}
                                                    disabled={isDownloading}
                                                    className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                                                >
                                                    <DownloadOutlinedIcon sx={{ fontSize: 15 }} />
                                                    {isDownloading ? "Downloading..." : "Download"}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab Contents: Notes Section */}
                    {activeTab === "notes" && (
                        <div className="py-6 space-y-6">
                            {/* Add Note */}
                            <div className="space-y-3">
                                <textarea
                                    rows={4}
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                    placeholder="Type your personal lesson notes here..."
                                    className="w-full p-4 rounded-xl bg-[#13161F] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm resize-none"
                                />

                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                                        Timestamp: <span className="text-blue-400 font-semibold">{formatTimestamp(videoTime)}</span>
                                    </span>

                                    <button
                                        onClick={handleAddNote}
                                        disabled={addingNote || !noteContent.trim()}
                                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-md shadow-blue-900/30"
                                    >
                                        {addingNote ? "Saving..." : "Add Note"}
                                    </button>
                                </div>
                            </div>

                            {/* Existing Notes List */}
                            <div className="space-y-3 pt-2">
                                <h3 className="text-white font-semibold text-sm">
                                    Notes for this Lesson ({currentLessonNotes.length})
                                </h3>

                                {notesLoading && currentLessonNotes.length === 0 ? (
                                    <p className="text-gray-500 text-sm">Loading notes...</p>
                                ) : currentLessonNotes.length === 0 ? (
                                    <p className="text-gray-500 text-sm py-4">
                                        No notes for this lesson yet. Type above and click "Add Note" to save notes timestamped to this point in the video.
                                    </p>
                                ) : (
                                    currentLessonNotes.map((note, index) => {
                                        const noteId = note.id || note._id || note.noteId || index;
                                        const isDeleting = deletingNoteId === noteId;

                                        return (
                                            <div
                                                key={noteId}
                                                className="p-4 rounded-xl bg-[#13161F] border border-white/10 flex items-start justify-between gap-4"
                                            >
                                                <div className="space-y-1.5 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-blue-400 font-semibold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                                                            {note.timestamp || "00:00"}
                                                        </span>
                                                        {note.createdAt && (
                                                            <span className="text-[11px] text-gray-500">
                                                                {new Date(note.createdAt).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                        {note.content}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteNote(noteId)}
                                                    disabled={isDeleting}
                                                    className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                                                    title="Delete note"
                                                >
                                                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab Contents: Q&A Section */}
                    {activeTab === "qna" && (
                        <div className="py-6 space-y-6">
                            {/* Ask Question Box */}
                            <div className="p-4 rounded-xl bg-[#13161F] border border-white/10 space-y-3">
                                <h3 className="text-white font-semibold text-sm">Ask a Question</h3>
                                <textarea
                                    rows={3}
                                    value={questionInput}
                                    onChange={(e) => setQuestionInput(e.target.value)}
                                    placeholder="Have a question about this lesson? Ask instructors and peers..."
                                    className="w-full p-3 rounded-lg bg-[#0E1017] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm resize-none"
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleAddQuestion}
                                        disabled={addingQuestion || !questionInput.trim()}
                                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer transition-colors shadow-md shadow-blue-900/30"
                                    >
                                        {addingQuestion ? "Posting..." : "Ask Question"}
                                    </button>
                                </div>
                            </div>

                            {/* Q&A Questions List */}
                            <div className="space-y-4 pt-2">
                                <h3 className="text-white font-semibold text-sm">
                                    Community Questions ({Array.isArray(qnaList) ? qnaList.length : 0})
                                </h3>

                                {qnaLoading && (!qnaList || qnaList.length === 0) ? (
                                    <p className="text-gray-500 text-sm">Loading questions...</p>
                                ) : !Array.isArray(qnaList) || qnaList.length === 0 ? (
                                    <p className="text-gray-500 text-sm py-4">
                                        No questions submitted yet. Be the first to ask!
                                    </p>
                                ) : (
                                    qnaList.map((item, idx) => {
                                        const qId = item.id || item._id || item.questionId || idx;
                                        const isReplying = activeReplyId === qId;
                                        const isUpvoting = upvotingQuestionId === qId;
                                        const replies = Array.isArray(item.replies) ? item.replies : [];

                                        return (
                                            <div
                                                key={qId}
                                                className="p-5 rounded-xl bg-[#13161F] border border-white/10 space-y-4"
                                            >
                                                {/* Question Header & Content */}
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                                            <span className="font-semibold text-white">
                                                                {item.author?.name || item.author || item.userName || "Student"}
                                                            </span>
                                                            {item.createdAt && (
                                                                <span>• {new Date(item.createdAt).toLocaleDateString()}</span>
                                                            )}
                                                            {item.lessonId && (
                                                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[11px] text-gray-400">
                                                                    Lesson {item.lessonId}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-white text-sm font-medium leading-relaxed pt-1">
                                                            {item.question || item.title || item.content}
                                                        </p>
                                                    </div>

                                                    {/* Upvote Button */}
                                                    <button
                                                        onClick={() => handleUpvoteQuestion(qId)}
                                                        disabled={isUpvoting}
                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer shrink-0 ${item.isUpvoted
                                                            ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                                                            : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                                                            }`}
                                                    >
                                                        {item.isUpvoted ? (
                                                            <ThumbUpIcon sx={{ fontSize: 14 }} />
                                                        ) : (
                                                            <ThumbUpOutlinedIcon sx={{ fontSize: 14 }} />
                                                        )}
                                                        <span>{item.upvotes ?? 0}</span>
                                                    </button>
                                                </div>

                                                {/* Actions Bar */}
                                                <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-white/5 pt-3">
                                                    <button
                                                        onClick={() => setActiveReplyId(isReplying ? null : qId)}
                                                        className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                                                    >
                                                        <ChatBubbleOutlineIcon sx={{ fontSize: 15 }} />
                                                        <span>{replies.length} {replies.length === 1 ? "Reply" : "Replies"}</span>
                                                    </button>
                                                </div>

                                                {/* Replies list */}
                                                {replies.length > 0 && (
                                                    <div className="pl-4 border-l-2 border-white/10 space-y-3 pt-1">
                                                        {replies.map((reply, rIdx) => (
                                                            <div key={reply.id || reply._id || rIdx} className="space-y-1">
                                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                                    <span className="font-semibold text-gray-300">
                                                                        {reply.author?.name || reply.author || reply.userName || "Instructor / Peer"}
                                                                    </span>
                                                                    {reply.createdAt && (
                                                                        <span className="text-[11px]">• {new Date(reply.createdAt).toLocaleDateString()}</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-300 text-xs leading-relaxed">
                                                                    {reply.text || reply.content || reply.message}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Reply Input */}
                                                {isReplying && (
                                                    <div className="pt-2 flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={replyInputs[qId] || ""}
                                                            onChange={(e) =>
                                                                setReplyInputs((prev) => ({ ...prev, [qId]: e.target.value }))
                                                            }
                                                            placeholder="Write a reply..."
                                                            className="flex-1 px-3.5 py-2 rounded-lg bg-[#0E1017] border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") handleReplyToQuestion(qId);
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => handleReplyToQuestion(qId)}
                                                            disabled={replyingQuestionId === qId || !replyInputs[qId]?.trim()}
                                                            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer flex items-center gap-1"
                                                        >
                                                            <SendIcon sx={{ fontSize: 13 }} />
                                                            <span>Reply</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
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
