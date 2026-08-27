import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Card from "../../components/Card";
import { LocalFireDepartment, AccessTime, WorkspacePremium, SettingsOutlined, BarChartOutlined, DescriptionOutlined, CalendarToday, Star, MenuBook } from '@mui/icons-material';
import {
    fetchDashboard,
    fetchLearningStats,
    fetchLiveClasses,
    fetchContinueLearning,
    fetchRecommendedCourses,
    fetchModuleExplorer,
    fetchDownloadResources,
    toggleLiveClassReminder,
} from '../../features/dashboard/dashThunks';
import { fetchMyLearning } from '../../features/myLearning/myLearningThunks';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Icon map for module explorer items
const MODULE_ICON_MAP = {
    settings: <SettingsOutlined fontSize="small" />,
    bar_chart: <BarChartOutlined fontSize="small" />,
    description: <DescriptionOutlined fontSize="small" />,
};

// Stat icons keyed by a type/key from API
const STAT_ICON_MAP = {
    streak: <LocalFireDepartment sx={{ color: '#f97316' }} />,
    time: <AccessTime sx={{ color: '#60a5fa' }} />,
    courses: <WorkspacePremium sx={{ color: '#facc15' }} />,
};

export const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Auth / profile
    const { user: authUser } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);

    // Dashboard Redux state
    const {
        summary,
        learningStats,
        liveClasses: reduxLiveClasses,
        continueLearning: reduxContinueLearning,
        recommendedCourses: reduxRecommendedCourses,
        moduleExplorer: reduxModuleExplorer,
        status,
    } = useSelector((state) => state.dashboard);

    // My Learning Redux state (for enrolled / in-progress courses)
    const { myLearning } = useSelector((state) => state.myLearning || {});
    const myLearningInProgress = myLearning?.inProgress || [];

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Continue Learning carousel
    const carouselRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollButtons = () => {
        const el = carouselRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    const scrollCarousel = (direction) => {
        const el = carouselRef.current;
        if (!el) return;
        const scrollAmount = el.clientWidth * 0.75;
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    // Seed initial arrow state once carousel content renders
    useEffect(() => {
        updateScrollButtons();
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showCalendar &&
                !event.target.closest(".calendar-container")
            ) {
                setShowCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showCalendar]);

    const displayName = profile?.fullName || profile?.name || authUser?.fullName || authUser?.name || summary?.user?.name || summary?.user?.fullName || "Learner";

    // Dispatch thunks on mount — always refresh Continue Learning to catch recent progress
    useEffect(() => {
        dispatch(fetchContinueLearning());
        dispatch(fetchMyLearning());
        if (status.summary === 'idle') dispatch(fetchDashboard());
        if (status.learningStats === 'idle') dispatch(fetchLearningStats());
        if (status.liveClasses === 'idle') dispatch(fetchLiveClasses());
        if (status.recommendedCourses === 'idle') dispatch(fetchRecommendedCourses());
        if (status.moduleExplorer === 'idle') dispatch(fetchModuleExplorer());
    }, [dispatch, status.summary, status.learningStats, status.liveClasses, status.recommendedCourses, status.moduleExplorer]);

    // -----------------------------------------------------------------------
    // Data adaptation: map API shapes → UI shapes
    // (All transformations done here in the container, not in child UI)
    // -----------------------------------------------------------------------

    // Banner / welcome text from summary
    const summaryData = summary?.data ?? summary;
    const bannerMessage = summaryData?.bannerMessage || summaryData?.banner?.message || summaryData?.message || null;
    const bannerHighlight = summaryData?.bannerHighlight || summaryData?.banner?.highlight || summaryData?.highlight || "Project Management";

    // Learning stats cards
    // API may return an array or an object; normalise to array of { title, value, icon }
    const aboutUser = (() => {
        // Show loading placeholder until BOTH summary AND learningStats have resolved.
        // This prevents the stale DB-column default values (e.g. 12 Days, 24.5 hrs, 8 courses)
        // that the composite /api/dashboard endpoint returns from ever flashing onscreen.
        const statsLoading =
            status.learningStats === 'idle' ||
            status.learningStats === 'pending' ||
            status.summary === 'idle' ||
            status.summary === 'pending';

        if (statsLoading) {
            return [
                { title: "Current Streak", value: "...", icon: <LocalFireDepartment sx={{ color: '#f97316' }} /> },
                { title: "Time Learned", value: "...", icon: <AccessTime sx={{ color: '#60a5fa' }} /> },
                { title: "Courses Completed", value: "...", icon: <WorkspacePremium sx={{ color: '#facc15' }} /> },
            ];
        }

        const rawStats = learningStats?.data ?? learningStats ?? summaryData?.stats;

        // If learningStats has a structured array
        if (Array.isArray(rawStats) && rawStats.length > 0) {
            return rawStats.map((stat) => ({
                title: stat.title || stat.label || stat.name || "",
                value: stat.value || stat.count || "",
                icon: STAT_ICON_MAP[stat.key] || STAT_ICON_MAP[stat.type] || <WorkspacePremium sx={{ color: '#facc15' }} />,
            }));
        }

        // If learningStats is a flat object with known keys
        if (rawStats && typeof rawStats === 'object') {
            const streak = rawStats.currentStreakDays ?? rawStats.currentStreak ?? rawStats.streak;
            const timeLearned = rawStats.timeLearnedHours ?? rawStats.timeLearned ?? rawStats.time_learned ?? rawStats.hoursLearned;
            const coursesCompleted = rawStats.coursesCompleted ?? rawStats.courses_completed;

            const result = [];
            if (streak !== undefined) result.push({ title: "Current Streak", value: typeof streak === 'number' ? `${streak} Days` : streak, icon: <LocalFireDepartment sx={{ color: '#f97316' }} /> });
            if (timeLearned !== undefined) result.push({ title: "Time Learned", value: typeof timeLearned === 'number' ? `${timeLearned} hrs` : timeLearned, icon: <AccessTime sx={{ color: '#60a5fa' }} /> });
            if (coursesCompleted !== undefined) result.push({ title: "Courses Completed", value: String(coursesCompleted), icon: <WorkspacePremium sx={{ color: '#facc15' }} /> });
            if (result.length > 0) return result;
        }

        // fetchLearningStats succeeded but returned no usable data — real user with 0 activity
        return [
            { title: "Current Streak", value: "0 Days", icon: <LocalFireDepartment sx={{ color: '#f97316' }} /> },
            { title: "Time Learned", value: "0 hrs", icon: <AccessTime sx={{ color: '#60a5fa' }} /> },
            { title: "Courses Completed", value: "0", icon: <WorkspacePremium sx={{ color: '#facc15' }} /> },
        ];
    })();


    // Continue learning — strictly map real enrolled / in-progress courses: { id, module, title, progress, lessonsLeft, currentLessonTitle, lastAccessed }
    const coursesPending = (() => {
        const rawData =
            (Array.isArray(reduxContinueLearning?.data) && reduxContinueLearning.data.length > 0 ? reduxContinueLearning.data : null) ??
            (Array.isArray(reduxContinueLearning) && reduxContinueLearning.length > 0 ? reduxContinueLearning : null) ??
            (Array.isArray(summaryData?.continueLearning) && summaryData.continueLearning.length > 0 ? summaryData.continueLearning : null) ??
            (Array.isArray(myLearningInProgress) && myLearningInProgress.length > 0 ? myLearningInProgress : null) ??
            [];

        const raw = Array.isArray(rawData) ? rawData : [];
        if (raw.length === 0) {
            return [];
        }

        return raw.map((item, idx) => {
            const courseId = item.id || item._id || item.courseId || (idx + 1).toString();
            const totalLessons = item.totalLessons || item.lessonsCount;
            const completedLessons = item.completedLessons || item.completedLessonsCount;
            const lessonsLeftCalc = (totalLessons != null && completedLessons != null)
                ? `${Math.max(0, totalLessons - completedLessons)} lessons left`
                : null;

            return {
                id: courseId,
                module: item.currentLessonTitle
                    ? item.currentLessonTitle
                    : (item.module || item.moduleLabel || item.currentModule || (item.totalModules ? `Module ${item.currentModuleNumber || 1} of ${item.totalModules}` : "In Progress")),
                title: item.title || item.courseName || item.name || "Untitled Course",
                progress: item.progress ?? item.progressPercent ?? item.completionPercent ?? 0,
                lessonsLeft: item.lessonsLeft !== undefined
                    ? `${item.lessonsLeft} lessons left`
                    : item.remainingLessons !== undefined
                    ? `${item.remainingLessons} lessons left`
                    : lessonsLeftCalc
                    ? lessonsLeftCalc
                    : item.lastAccessed
                    ? `Last accessed ${new Date(item.lastAccessed).toLocaleDateString()}`
                    : "In progress",
                currentLessonTitle: item.currentLessonTitle || null,
                lastAccessed: item.lastAccessed || null,
            };
        });
    })();

    // Recommended courses — map API shape to UI shape: { title, rating, students, tags, icon }
    const recommendations = (() => {
        const rawData = reduxRecommendedCourses?.data ?? reduxRecommendedCourses ?? summaryData?.recommended;
        const raw = Array.isArray(rawData) ? rawData : [];
        if (raw.length === 0) {
            // fallback mock
            return [
                { title: "Leadership in Digital Age", rating: 4.8, students: "12k", tags: ["BUSINESS", "INTERMEDIATE"], icon: "⚡" },
                { title: "AI Fundamentals", rating: 4.9, students: "25k", tags: ["TECH", "BEGINNER"], icon: "🧠" },
            ];
        }
        return raw.map((item) => ({
            title: item.title || item.courseName || item.name || "",
            rating: item.rating ?? item.averageRating ?? 0,
            students: item.students || item.studentCount || item.enrolledStudents || "0",
            tags: Array.isArray(item.tags) ? item.tags : (item.category ? [item.category] : []),
            icon: item.icon || item.emoji || "📚",
        }));
    })();

    // Live classes — map API shape to UI shape: { id, day, time, title, with, active, reminderSet }
    const liveClasses = (() => {
        const rawData = reduxLiveClasses?.data ?? reduxLiveClasses ?? summaryData?.liveClasses;
        const raw = Array.isArray(rawData) ? rawData : [];
        if (raw.length === 0) {
            // fallback mock (no id, so reminder button won't dispatch — preserved original behaviour)
            return [
                { day: 'TODAY', time: '4:00 PM', title: 'Scrum Master Q&A', with: 'Sarah Jenkins', active: true },
                { day: "TOMORROW", time: "10:30 AM", title: "Data Ethics Workshop", with: "Dr. Michael Chen", active: false },
                { day: "THU", time: "2:00 PM", title: "Python for ML Intro", with: "Alex Rivera", active: false },
            ];
        }
        return raw.map((item) => ({
            id: item.id || item._id || null,
            day: item.day || item.dayLabel || item.scheduledDay || "",
            time: item.time || item.scheduledTime || item.startTime || "",
            title: item.title || item.sessionTitle || item.name || "",
            with: item.with || item.instructor || item.instructorName || item.teacher || "",
            active: item.active ?? item.isLive ?? item.isActive ?? false,
            reminderSet: item.reminderSet ?? item.reminder_set ?? false,
        }));
    })();

    // Module explorer — map API shape to UI shape: { modules: [{ label, icon, active }] }
    const moduleExplorerModules = (() => {
        const rawData = reduxModuleExplorer?.data ?? reduxModuleExplorer ?? summaryData?.moduleExplorer;
        if (!rawData) {
            // fallback: original static items
            return null; // will render static below
        }
        // API may return { modules: [...] } or directly an array
        const modules = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.modules) ? rawData.modules : null);
        if (!modules || modules.length === 0) return null;
        return modules.map((m) => ({
            label: m.label || m.title || m.name || "",
            icon: m.icon ? (MODULE_ICON_MAP[m.icon] || null) : null,
            active: m.active ?? m.isActive ?? false,
        }));
    })();

    // Handle reminder button click
    const handleReminderClick = (liveClass) => {
        if (liveClass.id) {
            dispatch(toggleLiveClassReminder(liveClass.id));
        }
    };

    // Handle download resources button click
    const handleDownloadResources = () => {
        dispatch(fetchDownloadResources());
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-2 sm:py-4 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column - Main Content */}
            <div className="col-span-1 lg:col-span-8 flex flex-col gap-12">

                {/* Welcome Section */}
                <Card className="p-5 sm:p-8 bg-gradient-to-br from-[#1c1f28]/80 to-[#1c1f28]/40 border-t-blue-500/20">
                    <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                        Welcome back, {displayName}!
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-6 sm:mb-8">
                        {bannerMessage
                            ? <>{bannerMessage} <span className="text-white font-semibold">{bannerHighlight}</span></>
                            : <>You're doing great! You completed 4 lessons this week. Keep the momentum going to finish <span className="text-white font-semibold">Project Management</span> by Friday.</>
                        }
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                        {aboutUser.map((item, index) => (
                            <div key={index} className="bg-[#13151a]/60 border border-white/30 rounded-2xl p-6 flex flex-col justify-between h-25">
                                <div className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-2">{item.title}</div>
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="text-white font-bold text-2xl">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Continue Learning — displayed only when user has active enrolled/in-progress courses */}
                {coursesPending.length > 0 && (
                    <div>
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-white text-xl font-bold tracking-wide">Continue Learning</h2>
                        </div>

                        {/* Carousel wrapper — arrows sit outside the scroll container */}
                        <div className="flex items-center gap-2">
                            {/* Left arrow */}
                            <button
                                aria-label="Scroll left"
                                onClick={() => scrollCarousel('left')}
                                disabled={!canScrollLeft}
                                className={[
                                    "shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                                    "border transition-all duration-200",
                                    canScrollLeft
                                        ? "border-white/20 bg-[#1c1f28] text-white hover:bg-blue-600 hover:border-blue-500 cursor-pointer"
                                        : "border-white/5 bg-[#1c1f28]/40 text-white/20 cursor-not-allowed",
                                ].join(' ')}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {/* Scrollable cards container */}
                            <div
                                ref={carouselRef}
                                onScroll={updateScrollButtons}
                                className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 mb-2 scrollbar-hide flex-nowrap scroll-smooth"
                            >
                                {coursesPending.map((course, index) => (
                                    <Card
                                        key={course.id || index}
                                        onClick={() => navigate(course.id ? `/courses/${course.id}/learn` : "/catalog")}
                                        className="min-w-[260px] max-w-[260px] sm:min-w-[320px] sm:max-w-[320px] bg-[#1c1f28]/60 overflow-hidden group cursor-pointer border-transparent hover:border-blue-500/50 transition-colors p-5 sm:p-6 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="text-blue-400 text-[10px] font-bold tracking-wider uppercase mb-3">
                                                {course.module}
                                            </div>
                                            <h3 className="text-white font-semibold text-lg sm:text-xl mb-6 group-hover:text-blue-400 transition-colors line-clamp-2">
                                                {course.title}
                                            </h3>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex justify-between items-end mb-3 text-xs font-medium text-gray-400">
                                                <span>{course.progress}% Complete</span>
                                                <span>{course.lessonsLeft}</span>
                                            </div>

                                            <div className="w-full bg-[#13151a] rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-blue-500 h-1.5 rounded-full"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Right arrow */}
                            <button
                                aria-label="Scroll right"
                                onClick={() => scrollCarousel('right')}
                                disabled={!canScrollRight}
                                className={[
                                    "shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                                    "border transition-all duration-200",
                                    canScrollRight
                                        ? "border-white/20 bg-[#1c1f28] text-white hover:bg-blue-600 hover:border-blue-500 cursor-pointer"
                                        : "border-white/5 bg-[#1c1f28]/40 text-white/20 cursor-not-allowed",
                                ].join(' ')}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Recommended for You */}
                <div>
                    <h2 className="text-white text-xl  font-bold tracking-wide mb-6">Recommended for You</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {recommendations.map((course, index) => (
                            <Card key={index} className="bg-[#1c1f28]/60 border-transparent hover:border-blue-500/50 transition-colors cursor-pointer flex p-5 items-center gap-6">
                                <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-800 flex items-center justify-center text-3xl shadow-inner border border-white/10 shrink-0">
                                    {course.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg mb-1">{course.title}</h3>
                                    <div className="flex items-center text-sm text-gray-400 mb-3">
                                        <span>{course.rating}</span>
                                        <Star sx={{ fontSize: 16, color: '#facc15', mx: 0.5 }} />
                                        <span>• {course.students} students</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {course.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-white/5 text-gray-300 rounded-md border border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="col-span-1 lg:col-span-4 flex flex-col gap-8">

                {/* Live Classes */}
                <Card className="p-6 bg-[#1c1f28]/60">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                        <h3 className="text-white text-lg font-semibold">Live Classes</h3>
                        <button
                            type="button"
                            onClick={() => setShowCalendar((prev) => !prev)}
                            className="text-gray-400 hover:text-white transition-colors"
                            aria-label="Open calendar"
                        >
                            <CalendarMonthIcon sx={{ fontSize: 20 }} />
                        </button>
                        {showCalendar && (
                            <div className="absolute right-0 top-8 z-50 rounded-xl bg-[#1c1f28] shadow-xl">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateCalendar
                                        value={selectedDate}
                                        onChange={(newDate) => {
                                            setSelectedDate(newDate);
                                            setShowCalendar(false);
                                        }}
                                        sx={{
                                            color: "white",
                                            "& .MuiPickersCalendarHeader-label": {
                                                color: "white",
                                            },
                                            "& .MuiDayCalendar-weekDayLabel": {
                                                color: "white",
                                            },
                                            "& .MuiPickersDay-root": {
                                                color: "white",
                                            },
                                            "& .MuiPickersArrowSwitcher-button": {
                                                color: "white",
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6 mt-6">
                        {liveClasses.map((liveClass, index) => (
                            <div key={liveClass.id || index} className={`relative pl-4 border-l-2 ${liveClass.active ? 'border-blue-500' : 'border-gray-700'}`}>
                                <div className={`text-[10px] font-bold tracking-wider uppercase mb-1 ${liveClass.active ? 'text-blue-400' : 'text-gray-400'}`}>
                                    {liveClass.day} {liveClass.time}
                                </div>
                                <div className="text-white font-medium mb-1">{liveClass.title}</div>
                                <div className="text-xs text-gray-500 mb-4">with {liveClass.with}</div>

                                {liveClass.active ? (
                                    <button className="w-full py-2 bg-transparent border border-white/20 hover:border-blue-500 hover:bg-blue-500/10 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                                        Join Meeting
                                    </button>
                                ) : (
                                    <button
                                        className="w-full py-2 bg-transparent border border-white/10 hover:border-white/30 text-gray-300 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                                        onClick={() => handleReminderClick(liveClass)}
                                        disabled={status.reminder === 'pending'}
                                    >
                                        {liveClass.reminderSet ? 'Reminder Set' : 'Set Reminder'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Module Explorer */}
                <Card className="p-6 bg-[#1c1f28]/60">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                            <MenuBook />
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-semibold">Module Explorer</h3>
                            <div className="text-[10px] text-gray-500 tracking-wider font-bold uppercase">Navigation</div>
                        </div>
                    </div>

                    <div className="space-y-2 mb-8">
                        {moduleExplorerModules ? (
                            moduleExplorerModules.map((mod, index) => (
                                <button
                                    key={index}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors cursor-pointer border-none text-left ${mod.active
                                        ? 'bg-[#1e293b] text-blue-400'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white bg-transparent'
                                        }`}
                                >
                                    {mod.icon}
                                    <span className="text-sm font-medium">{mod.label}</span>
                                </button>
                            ))
                        ) : (
                            <>
                                <button className="w-full flex items-center gap-4 px-4 py-3 bg-[#1e293b] text-blue-400 rounded-xl transition-colors cursor-pointer border-none text-left">
                                    <span className="text-sm font-medium">Introduction</span>
                                </button>
                                <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors cursor-pointer border-none text-left bg-transparent">
                                    <SettingsOutlined fontSize="small" />
                                    <span className="text-sm font-medium">Design Thinking</span>
                                </button>
                                <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors cursor-pointer border-none text-left bg-transparent">
                                    <BarChartOutlined fontSize="small" />
                                    <span className="text-sm font-medium">Data Analysis</span>
                                </button>
                                <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors cursor-pointer border-none text-left bg-transparent">
                                    <DescriptionOutlined fontSize="small" />
                                    <span className="text-sm font-medium">Final Assessment</span>
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-900/50 cursor-pointer border-none"
                        onClick={handleDownloadResources}
                        disabled={status.downloadResources === 'pending'}
                    >
                        {status.downloadResources === 'pending' ? 'Downloading...' : 'Download Resources'}
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;