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
import Card from "../../components/Card";
import Button from "../../components/Button";
import { fetchCourseById, enrollInCourse } from "../../features/courses/coursesThunks";
import { clearCurrentCourse } from "../../features/courses/coursesSlice";

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
        <div className="w-full max-w-5xl mx-auto p-4 md:p-10 pb-20 text-start text-white">
            {/* Back Button */}
            <button
                onClick={() => navigate("/catalog")}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm font-semibold transition-colors cursor-pointer"
            >
                <ArrowBackIcon fontSize="small" />
                Back to Catalog
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
                        <h1 className="text-white text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                            {course.title}
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                            {course.description}
                        </p>
                    </div>

                    <div className="border-t border-b border-white/5 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase">Rating</span>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-white text-lg">{course.rating || "N/A"}</span>
                                <StarIcon sx={{ fontSize: 16, color: "#facc15" }} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase">Students</span>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-white text-lg">{course.studentsCount || course.students || 0}</span>
                                <PeopleIcon sx={{ fontSize: 16, color: "#60a5fa" }} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase">Duration</span>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-white text-lg">{course.duration}</span>
                                <AccessTimeIcon sx={{ fontSize: 16, color: "#34d399" }} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase">Modules</span>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-white text-lg">{course.totalModules || course.modules || 0}</span>
                                <LayersIcon sx={{ fontSize: 16, color: "#a78bfa" }} />
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
                    <Card className="p-6 border border-gray-800 bg-[#1A1D24] space-y-6 shadow-2xl">
                        {/* Course Thumbnail or Placeholder */}
                        <div className="aspect-video w-full rounded-lg bg-gradient-to-tr from-blue-900 to-indigo-800 flex items-center justify-center text-3xl shadow-inner border border-white/10 relative overflow-hidden">
                            <span className="text-4xl">📚</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                <span className="text-gray-400">Instructor</span>
                                <span className="text-white font-semibold">{course.instructor}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
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
                    </Card>
                </div>
            </div>
        </div>
    );
}
