import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookIcon from "@mui/icons-material/Book";
import PeopleIcon from "@mui/icons-material/People";
import LayersIcon from "@mui/icons-material/Layers";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { fetchCourseById, enrollInCourse } from "../../features/courses/coursesThunks";
import { clearCurrentCourse } from "../../features/courses/coursesSlice";
import { saveCourseThunk } from "../../features/myLearning/myLearningThunks";

export default function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        currentCourse: course,
        courseDetailsLoading: loading,
        courseDetailsError: error,
        enrollLoading,
        enrollError,
    } = useSelector((state) => state.courses);

    const { saveLoading } = useSelector((state) => state.myLearning);
    const [isSavedLocally, setIsSavedLocally] = React.useState(false);

    useEffect(() => {
        if (course) {
            setIsSavedLocally(Boolean(course.isSaved));
        }
    }, [course]);


    useEffect(() => {
        if (id) {
            dispatch(fetchCourseById(id));
        }
        return () => {
            dispatch(clearCurrentCourse());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (enrollError) {
            toast.error(enrollError);
        }
    }, [enrollError]);

    const handleEnroll = async () => {
        try {
            await dispatch(enrollInCourse(id)).unwrap();
            toast.success("Successfully enrolled in course! 🎉");
            navigate("/my-learning");
        } catch (err) {
            // Error toast handled by useEffect above
        }
    };

    const handleSave = async () => {
        try {
            const res = await dispatch(saveCourseThunk(id)).unwrap();
            const newStatus = typeof res?.isSaved === "boolean"
                ? res.isSaved
                : typeof res?.data?.isSaved === "boolean"
                    ? res.data.isSaved
                    : !isSavedLocally;
            setIsSavedLocally(newStatus);
            toast.success(newStatus ? "Course saved for later!" : "Course removed from saved!");
        } catch (err) {
            toast.error(err || "Failed to update saved status.");
        }
    };


    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm font-medium">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-xl mx-auto p-6 text-center text-white mt-20">
                <Card className="p-8 border border-red-500/20 bg-red-950/10">
                    <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Course</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Button variant="primary" onClick={() => navigate("/catalog")}>
                        Back to Catalog
                    </Button>
                </Card>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="w-full max-w-xl mx-auto p-6 text-center text-white mt-20">
                <Card className="p-8 border border-gray-800 bg-[#1A1D24]">
                    <h2 className="text-xl font-bold text-gray-300 mb-2">Course Not Found</h2>
                    <p className="text-gray-400 mb-6">The requested course could not be found.</p>
                    <Button variant="primary" onClick={() => navigate("/catalog")}>
                        Back to Catalog
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-2 md:p-5 pb-20 text-start text-white">
            {/* Back Button */}
            <button
                onClick={() => navigate("/catalog")}
                className="flex items-center gap-2 text-gray-400 hover:text-white mt-2 mb-4 text-sm font-semibold transition-colors cursor-pointer"
            >
                <ArrowBackIcon fontSize="small" />
                Catalog
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Details */}
                <div className="lg:col-span-8 space-y-6">
                    <div>
                        <div className="flex flex-wrap gap-2.5 mb-3">
                            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md">
                                {course.category}
                            </span>
                            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-md">
                                {course.level}
                            </span>
                        </div>
                        <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mb-4">
                            {course.title}
                        </h1>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                            {course.description}
                        </p>
                    </div>

                    <div className="border-t border-b border-white/5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase">Rating<StarIcon sx={{ fontSize: 16, color: "#facc15" }} /></span>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-white text-lg">{course.rating || "N/A"}</span>

                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase">Students<PeopleIcon sx={{ fontSize: 16, color: "#60a5fa" }} /></span>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-white text-lg">{course.studentsCount || course.students || 0}</span>

                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase">Duration<AccessTimeIcon sx={{ fontSize: 16, color: "#34d399" }} /></span>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-white text-lg">{course.duration}</span>

                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase">Modules<LayersIcon sx={{ fontSize: 16, color: "#a78bfa" }} /></span>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-white text-lg">{course.totalModules || course.modules || 0}</span>

                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white">Course Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 rounded-xl border border-gray-800 bg-[#1A1D24] flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                    <BookIcon className="text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-0.5">Lessons Count</h4>
                                    <p className="text-gray-400 text-xs">{course.totalLessons || 0} lessons included</p>
                                </div>
                            </div>
                            <div className="p-5 rounded-xl border border-gray-800 bg-[#1A1D24] flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                    <LayersIcon className="text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-0.5">Structured Modules</h4>
                                    <p className="text-gray-400 text-xs">{course.totalModules || 0} course modules</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Instructor & CTA Card */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-6 border border-gray-800 bg-[#1A1D24] space-y-4 shadow-2xl">
                        {/* Course Thumbnail or Placeholder */}
                        <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 flex items-center justify-center shadow-inner border border-white/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                            <h2 className="text-white/10 text-4xl font-extrabold select-none absolute">EduFlow</h2>

                            {course?.thumbnail && (
                                <img
                                    src={course.thumbnail}
                                    alt={course?.title || "Course Thumbnail"}
                                    className="w-full h-full object-cover relative z-10"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}

                            {course?.rating != null && (
                                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md rounded-md px-2 py-1 flex items-center gap-1 border border-white/10 z-20">
                                    <StarIcon sx={{ fontSize: 14, color: '#facc15' }} />
                                    <span className="text-white text-xs font-bold">{course.rating || "0.0"}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-400">Instructor</span>
                                <span className="text-white font-semibold">{course.instructor}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-400">Difficulty</span>
                                <span className="text-white font-semibold">{course.level}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Total Duration</span>
                                <span className="text-white font-semibold">{course.duration}</span>
                            </div>
                        </div>

                        {course.isEnrolled ? (
                            <div className="space-y-3">
                                <button
                                    disabled
                                    className="w-full py-3 bg-gray-800 text-gray-500 rounded-xl text-sm font-semibold transition-colors cursor-not-allowed border border-white/5"
                                >
                                    Already Enrolled
                                </button>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate("/my-learning")}
                                    className="w-full py-3 text-center block text-sm font-semibold text-blue-400 hover:text-blue-300"
                                >
                                    Go to My Learning
                                </Button>
                            </div>
                        ) : (
                            <button
                                onClick={handleEnroll}
                                disabled={enrollLoading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/50 cursor-pointer disabled:opacity-50"
                            >
                                {enrollLoading ? "Enrolling..." : "Enroll in Course"}
                            </button>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={saveLoading}
                            className="w-full py-2.5 bg-transparent hover:bg-white/5 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-colors border border-gray-700 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isSavedLocally ? (
                                <>
                                    <BookmarkIcon fontSize="small" className="text-blue-400" />
                                    Saved
                                </>
                            ) : (
                                <>
                                    <BookmarkBorderIcon fontSize="small" />
                                    Save for Later
                                </>
                            )}
                        </button>
                    </Card>

                </div>
            </div>
        </div>
    );
}
