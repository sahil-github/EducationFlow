import Card from '../../components/Card';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Box,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { fetchMyLearning } from "../../features/myLearning/myLearningThunks";

const courseFilters = [
    { value: "all", label: "All Courses" },
    { value: "inProgress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

// Resolve the real course ID from various backend shapes
const getRealCourseId = (course) => {
    if (!course) return null;
    if (course.course && typeof course.course === "object") {
        return course.course.id || course.course._id || course.course.courseId;
    }
    if (course.courseId && typeof course.courseId === "object") {
        return course.courseId.id || course.courseId._id;
    }
    const id = course.courseId || course.id || course._id;
    if (id && !String(id).startsWith("sv_") && !String(id).startsWith("save_")) {
        return id;
    }
    return course.courseId || course.id || course._id;
};

const getRealTitle = (course) =>
    course?.course?.title || course?.course?.name ||
    course?.title || course?.courseName || course?.name || "Untitled Course";

const getRealCategory = (course) =>
    course?.course?.category || course?.course?.categoryName ||
    course?.category || course?.categoryName || "Course";

const getRealDuration = (course) =>
    course?.course?.duration || course?.course?.totalDuration ||
    course?.duration || course?.totalDuration || "Self-paced";

function MyLearning() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");
    const dispatch = useDispatch();

    // myLearningSlice is the single source of truth (CourseDetails.saveCourseThunk writes here)
    const {
        myLearning,
        loading: myLearningLoading,
        error: myLearningError,
    } = useSelector((state) => state.myLearning);

    const inProgressList  = Array.isArray(myLearning?.inProgress)   ? myLearning.inProgress   : [];
    const savedForLaterList = Array.isArray(myLearning?.savedForLater) ? myLearning.savedForLater : [];
    const completedList   = Array.isArray(myLearning?.completed)     ? myLearning.completed     : [];

    useEffect(() => {
        dispatch(fetchMyLearning());
    }, [dispatch]);

    const handleFilterChange = (_, newFilter) => {
        if (newFilter !== null) setFilter(newFilter);
    };

    // ── Map raw API objects to UI shapes ──────────────────────────────────────

    // Exclude any inProgress courses that have already reached 100% or are flagged complete
    // (handles the case where backend still returns them in inProgress after last-lesson completion)
    const activeInProgress = inProgressList.filter(
        (c) => (c.progress ?? c.progressPercent ?? 0) < 100 && !c.isCompleted
    );

    const learningCourses = activeInProgress.map((course, idx) => {
        const id = getRealCourseId(course) || idx;
        const progress = course.progress ?? course.progressPercent ?? 0;
        const lessonsLeft = (course.totalLessons != null && course.completedLessons != null)
            ? course.totalLessons - course.completedLessons
            : null;
        const timeLeftText =
            course.currentLessonTitle ? `Lesson: ${course.currentLessonTitle}` :
            course.timeLeft ? course.timeLeft :
            lessonsLeft != null ? `${lessonsLeft} lessons left` :
            course.lastAccessed
                ? `Last: ${new Date(course.lastAccessed).toLocaleDateString()}`
                : "";
        return {
            id,
            category: getRealCategory(course),
            title: getRealTitle(course),
            progress,
            timeLeft: timeLeftText,
            buttonText: progress > 0 ? "Continue Lesson" : "Start Course",
        };
    });

    const savedCourses = savedForLaterList.map((course, idx) => ({
        id: getRealCourseId(course) || idx,
        category: getRealCategory(course),
        title: getRealTitle(course),
        duration: getRealDuration(course),
    }));

    // Also collect any inProgress items that hit 100% but backend hasn't moved them yet
    const locallyCompleted = inProgressList
        .filter((c) => (c.progress ?? c.progressPercent ?? 0) >= 100 || c.isCompleted)
        .map((course, idx) => ({
            id: getRealCourseId(course) || `lc_${idx}`,
            title: getRealTitle(course),
            category: getRealCategory(course),
            duration: getRealDuration(course),
            certificateDate: course.completedAt
                ? `Completed ${new Date(course.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                : "100% Complete",
        }));

    const completedCourses = [
        ...completedList
            .filter((item, index, self) => {
                const id = getRealCourseId(item);
                return index === self.findIndex((t) => getRealCourseId(t) === id);
            })
            .map((course, idx) => ({
                id: getRealCourseId(course) || idx,
                title: getRealTitle(course),
                category: getRealCategory(course),
                duration: getRealDuration(course),
                certificateDate: course.certificateDate ||
                    (course.completedAt
                        ? `Completed ${new Date(course.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                        : "100% Complete"),
            })),
        // Merge locally-detected completions without duplicating
        ...locallyCompleted.filter(
            (lc) => !completedList.some((c) => String(getRealCourseId(c)) === String(lc.id))
        ),
    ];

    // ── Error state ───────────────────────────────────────────────────────────
    if (myLearningError && !myLearningLoading) {
        return (
            <div className="w-full max-w-7xl mx-auto p-4 md:p-10 pb-20">
                <h1 className="text-white text-2xl md:text-3xl font-bold mb-4">My Learning</h1>
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <p className="text-red-400 text-sm">{myLearningError}</p>
                    <button
                        onClick={() => dispatch(fetchMyLearning())}
                        className="px-6 py-2.5 bg-[#0759d9] hover:bg-[#054dbb] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-10 pb-20">

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">My Learning</h1>
                    <p className="text-gray-400 text-sm sm:text-base md:text-md max-w-2xl leading-relaxed">
                        Track your progress and continue where you left off in your learning journey.
                    </p>
                </div>
                <Box sx={{ width: "100%", maxWidth: { xs: "100%", lg: 340 } }}>
                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={handleFilterChange}
                        aria-label="course filter"
                        sx={{
                            width: "100%",
                            height: { xs: 35, sm: 40, md: 45 },
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
                                    fontSize: { xs: "10px", sm: "12px", md: "14px" },
                                    fontWeight: 500,
                                    letterSpacing: "0.2px",
                                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
                                    "&.Mui-selected": {
                                        backgroundColor: "#0759d9",
                                        color: "#ffffff",
                                        "&:hover": { backgroundColor: "#0759d9" },
                                    },
                                }}
                            >
                                {item.label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            </div>

            {/* ── In Progress ─────────────────────────────────────────────── */}
            {(filter === "all" || filter === "inProgress") && (
                <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                        <PlayCircleIcon fontSize="medium" className="text-[#0759d9]" />
                        In Progress
                    </h2>
                    {myLearningLoading ? (
                        <p className="text-gray-500 text-sm">Loading...</p>
                    ) : learningCourses.length === 0 ? (
                        <p className="text-gray-500 text-sm">No courses in progress.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {learningCourses.map((course) => (
                                <Card
                                    className="flex flex-col justify-between p-5 rounded-xl border border-gray-800 bg-[#1A1D24] text-start h-full"
                                    key={course.id}
                                >
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
                                                    style={{ width: `${Math.min(100, Math.max(0, course.progress))}%` }}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(course.id ? `/courses/${course.id}/learn` : "/catalog")}
                                            className="w-full py-2.5 bg-[#0759d9] hover:bg-[#054dbb] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                                        >
                                            {course.buttonText}
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Saved for Later + Completed (side by side, "all" view) ──── */}
            {filter === "all" && (
                <div className="flex flex-col lg:flex-row gap-8 mt-10">

                    {/* Saved for Later */}
                    <div className="flex-1">
                        <h2 className="text-white text-xl font-semibold mb-4">Saved for Later</h2>
                        {myLearningLoading ? (
                            <p className="text-gray-500 text-sm">Loading...</p>
                        ) : savedCourses.length === 0 ? (
                            <p className="text-gray-500 text-sm">No courses saved for later.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {savedCourses.map((course) => (
                                    <Card
                                        className="flex flex-col justify-between p-5 rounded-xl border border-gray-800 bg-[#1A1D24] hover:border-gray-700 transition-all cursor-pointer"
                                        key={course.id}
                                        onClick={() => navigate(course.id ? `/courses/${course.id}` : "/catalog")}
                                    >
                                        <div>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">
                                                {course.category}
                                            </span>
                                            <h3 className="text-white font-bold text-base mb-2 line-clamp-2 hover:text-blue-400 transition-colors">
                                                {course.title}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                                            <span>🕒</span> {course.duration}
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Completed */}
                    <div className="w-full lg:w-80 flex flex-col gap-4">
                        <h2 className="text-white text-xl font-semibold mb-4">Completed</h2>
                        {myLearningLoading ? (
                            <p className="text-gray-500 text-sm">Loading...</p>
                        ) : completedCourses.length === 0 ? (
                            <p className="text-gray-500 text-sm">No completed courses yet.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {completedCourses.map((course) => (
                                    <Card
                                        className="p-5 rounded-xl border border-gray-800 bg-[#1A1D24] flex flex-col gap-2 hover:border-gray-700 transition-all cursor-pointer"
                                        key={course.id}
                                        onClick={() => navigate(course.id ? `/courses/${course.id}/learn` : "/catalog")}
                                    >
                                        {course.category && (
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
                                                {course.category}
                                            </span>
                                        )}
                                        <h3 className="text-white font-bold text-base hover:text-blue-400 transition-colors">
                                            {course.title}
                                        </h3>
                                        {course.duration && (
                                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                                <span>🕒</span> {course.duration}
                                            </p>
                                        )}
                                        <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 self-start px-2 py-0.5 rounded-md font-medium uppercase tracking-wider">
                                            ✓ {course.certificateDate}
                                        </span>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Filter: Completed only ──────────────────────────────────── */}
            {filter === "completed" && (
                <div className="mt-6">
                    <h2 className="text-white text-xl font-semibold mb-4">Completed</h2>
                    {myLearningLoading ? (
                        <p className="text-gray-500 text-sm">Loading...</p>
                    ) : completedCourses.length === 0 ? (
                        <p className="text-gray-500 text-sm">No completed courses yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {completedCourses.map((course) => (
                                <Card
                                    className="p-5 rounded-xl border border-gray-800 bg-[#1A1D24] flex flex-col gap-3 hover:border-gray-700 transition-all cursor-pointer"
                                    key={course.id}
                                    onClick={() => navigate(course.id ? `/courses/${course.id}/learn` : "/catalog")}
                                >
                                    {course.category && (
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
                                            {course.category}
                                        </span>
                                    )}
                                    <h3 className="text-white font-bold text-base hover:text-blue-400 transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>
                                    {course.duration && (
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <span>🕒</span> {course.duration}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-md font-medium uppercase tracking-wider">
                                            ✓ {course.certificateDate}
                                        </span>
                                        <span className="text-xs font-bold text-green-400">100%</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default MyLearning;