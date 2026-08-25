// import React, { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import StarIcon from "@mui/icons-material/Star";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import BookIcon from "@mui/icons-material/Book";
// import PeopleIcon from "@mui/icons-material/People";
// import LayersIcon from "@mui/icons-material/Layers";
// import BookmarkIcon from "@mui/icons-material/Bookmark";
// import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
// import Card from "../../components/Card";
// import Button from "../../components/Button";
// import { fetchCourseById, enrollInCourse } from "../../features/courses/coursesThunks";
// import { clearCurrentCourse } from "../../features/courses/coursesSlice";
// import { saveCourseThunk } from "../../features/myLearning/myLearningThunks";

// export default function CourseDetails() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const {
//         currentCourse: course,
//         courseDetailsLoading: loading,
//         courseDetailsError: error,
//         enrollLoading,
//         enrollError,
//     } = useSelector((state) => state.courses);

//     const { saveLoading } = useSelector((state) => state.myLearning);
//     const [isSavedLocally, setIsSavedLocally] = React.useState(false);

//     useEffect(() => {
//         if (course) {
//             setIsSavedLocally(Boolean(course.isSaved));
//         }
//     }, [course]);


//     useEffect(() => {
//         if (id) {
//             dispatch(fetchCourseById(id));
//         }
//         return () => {
//             dispatch(clearCurrentCourse());
//         };
//     }, [dispatch, id]);

//     useEffect(() => {
//         if (enrollError) {
//             toast.error(enrollError);
//         }
//     }, [enrollError]);

//     const handleEnroll = async () => {
//         try {
//             await dispatch(enrollInCourse(id)).unwrap();
//             toast.success("Successfully enrolled in course! 🎉");
//             navigate("/my-learning");
//         } catch (err) {
//             // Error toast handled by useEffect above
//         }
//     };

//     const handleSave = async () => {
//         try {
//             const res = await dispatch(saveCourseThunk({ id, course })).unwrap();
//             const newStatus = typeof res?.isSaved === "boolean"
//                 ? res.isSaved
//                 : typeof res?.data?.isSaved === "boolean"
//                     ? res.data.isSaved
//                     : !isSavedLocally;
//             setIsSavedLocally(newStatus);
//             toast.success(newStatus ? "Course saved for later!" : "Course removed from saved!");
//             if (newStatus) {
//                 navigate("/my-learning");
//             }
//         } catch (err) {
//             toast.error(err || "Failed to update saved status.");
//         }
//     };


//     if (loading) {
//         return (
//             <div className="w-full min-h-screen flex items-center justify-center text-white">
//                 <div className="flex flex-col items-center gap-3">
//                     <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//                     <p className="text-gray-400 text-sm font-medium">Loading course details...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="w-full max-w-xl mx-auto p-6 text-center text-white mt-20">
//                 <Card className="p-8 border border-red-500/20 bg-red-950/10">
//                     <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Course</h2>
//                     <p className="text-gray-400 mb-6">{error}</p>
//                     <Button variant="primary" onClick={() => navigate("/catalog")}>
//                         Back to Catalog
//                     </Button>
//                 </Card>
//             </div>
//         );
//     }

//     if (!course) {
//         return (
//             <div className="w-full max-w-xl mx-auto p-6 text-center text-white mt-20">
//                 <Card className="p-8 border border-gray-800 bg-[#1A1D24]">
//                     <h2 className="text-xl font-bold text-gray-300 mb-2">Course Not Found</h2>
//                     <p className="text-gray-400 mb-6">The requested course could not be found.</p>
//                     <Button variant="primary" onClick={() => navigate("/catalog")}>
//                         Back to Catalog
//                     </Button>
//                 </Card>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full max-w-7xl mx-auto p-2 md:p-5 pb-20 text-start text-white">
//             {/* Back Button */}
//             <button
//                 onClick={() => navigate("/catalog")}
//                 className="flex items-center gap-2 text-gray-400 hover:text-white mt-2 mb-4 text-sm font-semibold transition-colors cursor-pointer"
//             >
//                 <ArrowBackIcon fontSize="small" />
//                 Catalog
//             </button>

//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
//                 {/* Left Column: Details */}
//                 <div className="lg:col-span-8 space-y-6">
//                     <div>
//                         <div className="flex flex-wrap gap-2.5 mb-3">
//                             <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md">
//                                 {course.category}
//                             </span>
//                             <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-md">
//                                 {course.level}
//                             </span>
//                         </div>
//                         <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mb-4">
//                             {course.title}
//                         </h1>
//                         <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
//                             {course.description}
//                         </p>
//                     </div>

//                     <div className="border-t border-b border-white/5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
//                         <div className="space-y-1">
//                             <span className="text-xs text-gray-500 font-semibold block uppercase">Rating<StarIcon sx={{ fontSize: 16, color: "#facc15" }} /></span>
//                             <div className="flex items-center gap-1">
//                                 <span className="font-bold text-white text-lg">{course.rating || "N/A"}</span>

//                             </div>
//                         </div>
//                         <div className="space-y-1">
//                             <span className="text-xs text-gray-500 font-semibold block uppercase">Students<PeopleIcon sx={{ fontSize: 16, color: "#60a5fa" }} /></span>
//                             <div className="flex items-center gap-1">
//                                 <span className="font-bold text-white text-lg">{course.studentsCount || course.students || 0}</span>

//                             </div>
//                         </div>
//                         <div className="space-y-1">
//                             <span className="text-xs text-gray-500 font-semibold block uppercase">Duration<AccessTimeIcon sx={{ fontSize: 16, color: "#34d399" }} /></span>
//                             <div className="flex items-center gap-1">
//                                 <span className="font-bold text-white text-lg">{course.duration}</span>

//                             </div>
//                         </div>
//                         <div className="space-y-1">
//                             <span className="text-xs text-gray-500 font-semibold block uppercase">Modules<LayersIcon sx={{ fontSize: 16, color: "#a78bfa" }} /></span>
//                             <div className="flex items-center gap-1">
//                                 <span className="font-bold text-white text-lg">{course.totalModules || course.modules || 0}</span>

//                             </div>
//                         </div>
//                     </div>

//                     <div className="space-y-4">
//                         <h2 className="text-xl font-bold text-white">Course Overview</h2>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div className="p-5 rounded-xl border border-gray-800 bg-[#1A1D24] flex items-start gap-4">
//                                 <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
//                                     <BookIcon className="text-blue-400" />
//                                 </div>
//                                 <div>
//                                     <h4 className="text-white font-bold text-sm mb-0.5">Lessons Count</h4>
//                                     <p className="text-gray-400 text-xs">{course.totalLessons || 0} lessons included</p>
//                                 </div>
//                             </div>
//                             <div className="p-5 rounded-xl border border-gray-800 bg-[#1A1D24] flex items-start gap-4">
//                                 <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
//                                     <LayersIcon className="text-indigo-400" />
//                                 </div>
//                                 <div>
//                                     <h4 className="text-white font-bold text-sm mb-0.5">Structured Modules</h4>
//                                     <p className="text-gray-400 text-xs">{course.totalModules || 0} course modules</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Column: Instructor & CTA Card */}
//                 <div className="lg:col-span-4 space-y-6">
//                     <Card className="p-6 border border-gray-800 bg-[#1A1D24] space-y-4 shadow-2xl">
//                         {/* Course Thumbnail or Placeholder */}
//                         <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 flex items-center justify-center shadow-inner border border-white/10 relative overflow-hidden">
//                             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
//                             <h2 className="text-white/10 text-4xl font-extrabold select-none absolute">EduFlow</h2>

//                             {course?.thumbnail && (
//                                 <img
//                                     src={course.thumbnail}
//                                     alt={course?.title || "Course Thumbnail"}
//                                     className="w-full h-full object-cover relative z-10"
//                                     onError={(e) => {
//                                         e.target.style.display = 'none';
//                                     }}
//                                 />
//                             )}

//                             {course?.rating != null && (
//                                 <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md rounded-md px-2 py-1 flex items-center gap-1 border border-white/10 z-20">
//                                     <StarIcon sx={{ fontSize: 14, color: '#facc15' }} />
//                                     <span className="text-white text-xs font-bold">{course.rating || "0.0"}</span>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="space-y-4">
//                             <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
//                                 <span className="text-gray-400">Instructor</span>
//                                 <span className="text-white font-semibold">{course.instructor}</span>
//                             </div>
//                             <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
//                                 <span className="text-gray-400">Difficulty</span>
//                                 <span className="text-white font-semibold">{course.level}</span>
//                             </div>
//                             <div className="flex justify-between items-center text-sm">
//                                 <span className="text-gray-400">Total Duration</span>
//                                 <span className="text-white font-semibold">{course.duration}</span>
//                             </div>
//                         </div>

//                         {course.isEnrolled ? (
//                             <div className="space-y-3">
//                                 <button
//                                     onClick={() => navigate(`/courses/${id}/learn`)}
//                                     className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/50 cursor-pointer flex items-center justify-center gap-2"
//                                 >
//                                     <span>Continue to Course Player</span>
//                                 </button>
//                                 <Button
//                                     variant="ghost"
//                                     onClick={() => navigate("/my-learning")}
//                                     className="w-full py-2 text-center block text-xs font-semibold text-gray-400 hover:text-white"
//                                 >
//                                     Go to My Learning
//                                 </Button>
//                             </div>
//                         ) : (
//                             <button
//                                 onClick={handleEnroll}
//                                 disabled={enrollLoading}
//                                 className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/50 cursor-pointer disabled:opacity-50"
//                             >
//                                 {enrollLoading ? "Enrolling..." : "Enroll in Course"}
//                             </button>
//                         )}

//                         <button
//                             onClick={handleSave}
//                             disabled={saveLoading}
//                             className="w-full py-2.5 bg-transparent hover:bg-white/5 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-colors border border-gray-700 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
//                         >
//                             {isSavedLocally ? (
//                                 <>
//                                     <BookmarkIcon fontSize="small" className="text-blue-400" />
//                                     Saved
//                                 </>
//                             ) : (
//                                 <>
//                                     <BookmarkBorderIcon fontSize="small" />
//                                     Save for Later
//                                 </>
//                             )}
//                         </button>
//                     </Card>

//                 </div>
//             </div>
//         </div>
//     );
// }


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// MUI Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookIcon from "@mui/icons-material/Book";
import PeopleIcon from "@mui/icons-material/People";
import LayersIcon from "@mui/icons-material/Layers";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CodeIcon from "@mui/icons-material/Code";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import QuizIcon from "@mui/icons-material/Quiz";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

// Components
import Card from "../../components/Card";
import Button from "../../components/Button";

// Redux
import {
    fetchCourseById,
    enrollInCourse,
} from "../../features/courses/coursesThunks";
import { clearCurrentCourse } from "../../features/courses/coursesSlice";
import { saveCourseThunk } from "../../features/myLearning/myLearningThunks";
import { dummyCoursePricing, dummyCourseContent } from "../../constants/constants";




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

    const { saveLoading } = useSelector(
        (state) => state.myLearning
    );

    const [isSavedLocally, setIsSavedLocally] = useState(false);
    const [openModule, setOpenModule] = useState(1);
    const [openFaq, setOpenFaq] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | SAVE STATUS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (course) {
            setIsSavedLocally(Boolean(course.isSaved));
        }
    }, [course]);


    /*
    |--------------------------------------------------------------------------
    | FETCH COURSE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (id) {
            dispatch(fetchCourseById(id));
        }

        return () => {
            dispatch(clearCurrentCourse());
        };
    }, [dispatch, id]);


    /*
    |--------------------------------------------------------------------------
    | ENROLL ERROR
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (enrollError) {
            toast.error(enrollError);
        }
    }, [enrollError]);


    /*
    |--------------------------------------------------------------------------
    | ENROLL
    |--------------------------------------------------------------------------
    */

    const handleEnroll = async () => {
        try {
            await dispatch(enrollInCourse(id)).unwrap();

            toast.success(
                "Successfully enrolled in course! 🎉"
            );

            navigate("/my-learning");
        } catch (err) {
            // Error toast handled by useEffect
        }
    };


    /*
    |--------------------------------------------------------------------------
    | SAVE FOR LATER
    |--------------------------------------------------------------------------
    | Your original save functionality is preserved.
    |--------------------------------------------------------------------------
    */

    const handleSave = async () => {
        try {
            const res = await dispatch(
                saveCourseThunk({
                    id,
                    course,
                })
            ).unwrap();

            const newStatus =
                typeof res?.isSaved === "boolean"
                    ? res.isSaved
                    : typeof res?.data?.isSaved === "boolean"
                        ? res.data.isSaved
                        : !isSavedLocally;

            setIsSavedLocally(newStatus);

            toast.success(
                newStatus
                    ? "Course saved for later!"
                    : "Course removed from saved!"
            );

            if (newStatus) {
                navigate("/my-learning");
            }
        } catch (err) {
            toast.error(
                err || "Failed to update saved status."
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | DUMMY DATA → API READY
    |--------------------------------------------------------------------------
    */

    const whatYouWillLearn =
        course?.whatYouWillLearn ||
        dummyCourseContent.whatYouWillLearn;

    const modules =
        course?.modulesData ||
        course?.courseModules ||
        dummyCourseContent.modules;

    const projects =
        course?.projects ||
        dummyCourseContent.projects;

    const technologies =
        course?.technologies ||
        dummyCourseContent.technologies;

    const requirements =
        course?.requirements ||
        dummyCourseContent.requirements;

    const targetAudience =
        course?.targetAudience ||
        dummyCourseContent.targetAudience;

    const includes =
        course?.includes ||
        dummyCourseContent.includes;

    const about =
        course?.about ||
        dummyCourseContent.about;

    const instructorData =
        typeof course?.instructor === "object"
            ? course.instructor
            : dummyCourseContent.instructor;

    const faqs =
        course?.faqs ||
        dummyCourseContent.faqs;
    const pricing =
        course?.pricing ||
        dummyCoursePricing;


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm font-medium">
                        Loading course details...
                    </p>
                </div>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <div className="w-full max-w-xl mx-auto p-6 text-center text-white mt-20">
                <Card className="p-8 border border-red-500/20 bg-red-950/10">
                    <h2 className="text-xl font-bold text-red-400 mb-2">
                        Error Loading Course
                    </h2>
                    <p className="text-gray-400 mb-6">
                        {error}
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => navigate("/catalog")}
                    >
                        Back to Catalog
                    </Button>
                </Card>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | COURSE NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (!course) {
        return (
            <div className="w-full max-w-xl mx-auto p-6 text-center text-white mt-20">
                <Card className="p-8 border border-gray-800 bg-[#1A1D24]">
                    <h2 className="text-xl font-bold text-gray-300 mb-2">
                        Course Not Found
                    </h2>
                    <p className="text-gray-400 mb-6">
                        The requested course could not be found.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => navigate("/catalog")}
                    >
                        Back to Catalog
                    </Button>
                </Card>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | MAIN UI
    |--------------------------------------------------------------------------
    */

    return (
        <div className="w-full max-w-7xl mx-auto p-2 md:p-5 pb-20 text-start text-white">
            {/* =========================================================
                BACK BUTTON
            ========================================================= */}
            <button
                onClick={() => navigate("/catalog")}
                className="flex items-center gap-2 text-gray-400 hover:text-white mt-2 mb-4 text-sm font-semibold transition-colors cursor-pointer"
            >
                <ArrowBackIcon fontSize="small" />
                Catalog
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* =====================================================
                    LEFT COLUMN
                ===================================================== */}
                <div className="lg:col-span-8 space-y-8">

                    {/* =================================================
                        COURSE HEADER
                    ================================================= */}

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


                    {/* =================================================
                        STATS
                    ================================================= */}

                    <div className="border-t border-b border-white/5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase">
                                Rating
                                <StarIcon
                                    sx={{
                                        fontSize: 16,
                                        color: "#facc15",
                                        ml: 0.5,
                                    }}
                                />
                            </span>
                            <span className="font-bold text-white text-lg">
                                {course.rating || "N/A"}
                            </span>
                        </div>


                        <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase">
                                Students
                                <PeopleIcon
                                    sx={{
                                        fontSize: 16,
                                        color: "#60a5fa",
                                        ml: 0.5,
                                    }}
                                />
                            </span>

                            <span className="font-bold text-white text-lg">
                                {course.studentsCount ||
                                    course.students ||
                                    0}
                            </span>
                        </div>


                        <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase">
                                Duration
                                <AccessTimeIcon
                                    sx={{
                                        fontSize: 16,
                                        color: "#34d399",
                                        ml: 0.5,
                                    }}
                                />
                            </span>
                            <span className="font-bold text-white text-lg">
                                {course.duration}
                            </span>
                        </div>


                        <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase">
                                Modules
                                <LayersIcon
                                    sx={{
                                        fontSize: 16,
                                        color: "#a78bfa",
                                        ml: 0.5,
                                    }}
                                />
                            </span>

                            <span className="font-bold text-white text-lg">
                                {course.totalModules ||
                                    course.modules ||
                                    modules.length}
                            </span>
                        </div>
                    </div>


                    {/* =================================================
                        COURSE OVERVIEW
                    ================================================= */}

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">
                            Course Overview
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Lessons */}
                            <div className="p-5 rounded-xl border border-gray-800 bg-[#1A1D24] flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                    <BookIcon className="text-blue-400" />
                                </div>


                                <div>
                                    <h4 className="text-white font-bold text-sm mb-0.5">
                                        Lessons Count
                                    </h4>
                                    <p className="text-gray-400 text-xs">
                                        {course.totalLessons || 48} lessons included
                                    </p>
                                </div>
                            </div>


                            {/* Modules */}

                            <div className="p-5 rounded-xl border border-gray-800 bg-[#1A1D24] flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                    <LayersIcon className="text-indigo-400" />
                                </div>


                                <div>
                                    <h4 className="text-white font-bold text-sm mb-0.5">
                                        Structured Modules
                                    </h4>
                                    <p className="text-gray-400 text-xs">
                                        {course.totalModules ||
                                            modules.length} course modules
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* =================================================
                        WHAT YOU WILL LEARN
                    ================================================= */}

                    <section>
                        <div className="mb-5">
                            <h2 className="text-xl font-bold text-white">
                                What You'll Learn
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">
                                Skills and concepts you will gain after completing this course.
                            </p>
                        </div>


                        <Card className="p-5 md:p-6 border border-gray-800 bg-[#1A1D24]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                {whatYouWillLearn.map(
                                    (item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3"
                                        >
                                            <CheckCircleIcon
                                                sx={{
                                                    fontSize: 19,
                                                    color: "#60a5fa",
                                                    marginTop: "2px",
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {item}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </Card>

                    </section>


                    {/* =================================================
                        COURSE CONTENT
                    ================================================= */}

                    <section>
                        <div className="mb-5">
                            <h2 className="text-xl font-bold text-white">
                                Course Content
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">
                                {course.totalModules || modules.length} modules •{" "}
                                {course.totalLessons || 48} lessons
                            </p>
                        </div>

                        <div className="space-y-2">
                            {modules.map((module, index) => {
                                const moduleId =
                                    module.id || index + 1;
                                const isOpen =
                                    openModule === moduleId;
                                return (
                                    <div
                                        key={moduleId}
                                        className="border border-gray-800 rounded-xl overflow-hidden bg-[#1A1D24]"
                                    >
                                        {/* MODULE HEADER */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenModule(
                                                    isOpen
                                                        ? null
                                                        : moduleId
                                                )
                                            }
                                            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                                    <LayersIcon
                                                        sx={{
                                                            fontSize: 19,
                                                            color: "#a78bfa",
                                                        }}
                                                    />
                                                </div>


                                                <div>
                                                    <h3 className="text-sm font-semibold text-white">
                                                        Module {index + 1}:{" "}
                                                        {module.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {module.lessons?.length || 0} lessons
                                                        {module.duration
                                                            ? ` • ${module.duration}`
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>


                                            <ExpandMoreIcon
                                                className={`text-gray-400 transition-transform ${isOpen
                                                    ? "rotate-180"
                                                    : ""
                                                    }`}
                                            />

                                        </button>


                                        {/* LESSONS */}

                                        {isOpen && (
                                            <div className="border-t border-gray-800">
                                                {module.lessons?.map(
                                                    (
                                                        lesson,
                                                        lessonIndex
                                                    ) => (

                                                        <div
                                                            key={
                                                                lessonIndex
                                                            }
                                                            className="flex items-center gap-3 px-5 py-3 border-b last:border-b-0 border-gray-800/70 hover:bg-white/[0.02]"
                                                        >
                                                            <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                                                                <span className="text-[10px] font-bold text-gray-500">
                                                                    {String(
                                                                        lessonIndex +
                                                                        1
                                                                    ).padStart(
                                                                        2,
                                                                        "0"
                                                                    )}
                                                                </span>
                                                            </div>


                                                            <span className="text-sm text-gray-300">
                                                                {lesson}
                                                            </span>

                                                        </div>
                                                    )
                                                )}

                                            </div>
                                        )}

                                    </div>
                                );
                            })}

                        </div>

                    </section>


                    {/* =================================================
                        PROJECTS
                    ================================================= */}

                    <section>
                        <div className="mb-5">
                            <h2 className="text-xl font-bold text-white">
                                Projects You'll Build
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">
                                Apply what you learn through practical projects.
                            </p>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {projects.map(
                                (project, index) => (
                                    <Card
                                        key={index}
                                        className="p-5 border border-gray-800 bg-[#1A1D24] hover:border-blue-500/30 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                                            <AssignmentIcon className="text-blue-400" />

                                        </div>


                                        <h3 className="text-white font-bold text-sm mb-2">
                                            {project.title}
                                        </h3>


                                        <p className="text-gray-400 text-xs leading-relaxed mb-4">
                                            {project.description}
                                        </p>


                                        <div className="flex items-center gap-2 text-[11px] text-blue-400">

                                            <CodeIcon
                                                sx={{
                                                    fontSize: 15,
                                                }}
                                            />

                                            {project.technology}

                                        </div>

                                    </Card>

                                )
                            )}

                        </div>

                    </section>


                    {/* =================================================
                        ABOUT THIS COURSE
                    ================================================= */}

                    <section>

                        <h2 className="text-xl font-bold text-white mb-4">
                            About This Course
                        </h2>


                        <Card className="p-6 border border-gray-800 bg-[#1A1D24]">

                            <div className="space-y-4">

                                {about.map(
                                    (paragraph, index) => (

                                        <p
                                            key={index}
                                            className="text-sm text-gray-400 leading-7"
                                        >
                                            {paragraph}
                                        </p>

                                    )
                                )}

                            </div>

                        </Card>

                    </section>


                    {/* =================================================
                        TECHNOLOGIES
                    ================================================= */}

                    <section>

                        <h2 className="text-xl font-bold text-white mb-4">
                            Technologies You'll Learn
                        </h2>


                        <div className="flex flex-wrap gap-2">

                            {technologies.map(
                                (technology, index) => (

                                    <span
                                        key={index}
                                        className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold"
                                    >
                                        {technology}
                                    </span>

                                )
                            )}

                        </div>

                    </section>


                    {/* =================================================
                        REQUIREMENTS + TARGET AUDIENCE
                    ================================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                        {/* REQUIREMENTS */}

                        <section>

                            <h2 className="text-xl font-bold text-white mb-4">
                                Requirements
                            </h2>


                            <Card className="p-5 border border-gray-800 bg-[#1A1D24]">

                                <div className="space-y-3">

                                    {requirements.map(
                                        (
                                            requirement,
                                            index
                                        ) => (

                                            <div
                                                key={index}
                                                className="flex items-start gap-3"
                                            >

                                                <CheckCircleIcon
                                                    sx={{
                                                        fontSize: 17,
                                                        color: "#60a5fa",
                                                        marginTop: "2px",
                                                    }}
                                                />

                                                <span className="text-sm text-gray-400">
                                                    {requirement}
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            </Card>

                        </section>


                        {/* TARGET AUDIENCE */}

                        <section>

                            <h2 className="text-xl font-bold text-white mb-4">
                                Who This Course Is For
                            </h2>


                            <Card className="p-5 border border-gray-800 bg-[#1A1D24]">

                                <div className="space-y-3">

                                    {targetAudience.map(
                                        (
                                            audience,
                                            index
                                        ) => (

                                            <div
                                                key={index}
                                                className="flex items-start gap-3"
                                            >

                                                <PersonIcon
                                                    sx={{
                                                        fontSize: 17,
                                                        color: "#a78bfa",
                                                        marginTop: "2px",
                                                    }}
                                                />

                                                <span className="text-sm text-gray-400">
                                                    {audience}
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            </Card>

                        </section>

                    </div>


                    {/* =================================================
                        INSTRUCTOR
                    ================================================= */}

                    <section>

                        <h2 className="text-xl font-bold text-white mb-4">
                            About Your Instructor
                        </h2>


                        <Card className="p-6 border border-gray-800 bg-[#1A1D24]">

                            <div className="flex flex-col sm:flex-row gap-5">

                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0">

                                    <PersonIcon
                                        sx={{
                                            color: "white",
                                            fontSize: 32,
                                        }}
                                    />

                                </div>


                                <div className="flex-1">

                                    <h3 className="text-white font-bold text-lg">
                                        {instructorData.name}
                                    </h3>

                                    <p className="text-blue-400 text-sm mt-1">
                                        {instructorData.role}
                                    </p>


                                    <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                                        {instructorData.experience}
                                    </p>


                                    <div className="flex flex-wrap gap-5 mt-4">

                                        <div>

                                            <span className="text-yellow-400 font-bold">
                                                ★{" "}
                                                {instructorData.rating}
                                            </span>

                                            <p className="text-gray-500 text-xs">
                                                Instructor Rating
                                            </p>

                                        </div>


                                        <div>

                                            <span className="text-white font-bold">
                                                {
                                                    instructorData.students
                                                }
                                            </span>

                                            <p className="text-gray-500 text-xs">
                                                Students
                                            </p>

                                        </div>


                                        <div>

                                            <span className="text-white font-bold">
                                                {
                                                    instructorData.courses
                                                }
                                            </span>

                                            <p className="text-gray-500 text-xs">
                                                Courses
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </Card>

                    </section>


                    {/* =================================================
                        FAQ
                    ================================================= */}

                    <section>

                        <div className="mb-5">

                            <h2 className="text-xl font-bold text-white">
                                Frequently Asked Questions
                            </h2>

                            <p className="text-sm text-gray-400 mt-1">
                                Everything you need to know before starting.
                            </p>

                        </div>


                        <div className="space-y-2">

                            {faqs.map(
                                (faq, index) => {

                                    const isOpen =
                                        openFaq === index;

                                    return (

                                        <div
                                            key={index}
                                            className="border border-gray-800 rounded-xl bg-[#1A1D24] overflow-hidden"
                                        >

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenFaq(
                                                        isOpen
                                                            ? null
                                                            : index
                                                    )
                                                }
                                                className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-white/[0.03] cursor-pointer"
                                            >

                                                <div className="flex items-center gap-3">

                                                    <QuizIcon
                                                        sx={{
                                                            fontSize: 19,
                                                            color: "#60a5fa",
                                                        }}
                                                    />

                                                    <span className="text-sm font-semibold text-white">
                                                        {
                                                            faq.question
                                                        }
                                                    </span>

                                                </div>


                                                <ExpandMoreIcon
                                                    className={`text-gray-400 transition-transform ${isOpen
                                                        ? "rotate-180"
                                                        : ""
                                                        }`}
                                                />

                                            </button>


                                            {isOpen && (

                                                <div className="px-12 pb-5">

                                                    <p className="text-sm text-gray-400 leading-relaxed">
                                                        {
                                                            faq.answer
                                                        }
                                                    </p>

                                                </div>

                                            )}

                                        </div>

                                    );
                                }
                            )}

                        </div>

                    </section>

                </div>


                {/* =====================================================
                    RIGHT SIDEBAR
                ===================================================== */}

                <div className="lg:col-span-4 space-y-6">


                    {/* =================================================
                        COURSE CTA CARD
                    ================================================= */}

                    <Card className="p-6 border border-gray-800 bg-[#1A1D24] space-y-5 shadow-2xl lg:sticky lg:top-24">


                        {/* COURSE IMAGE */}

                        <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 flex items-center justify-center shadow-inner border border-white/10 relative overflow-hidden">

                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>


                            <h2 className="text-white/10 text-4xl font-extrabold select-none absolute">
                                EduFlow
                            </h2>


                            {course?.thumbnail && (

                                <img
                                    src={course.thumbnail}
                                    alt={
                                        course?.title ||
                                        "Course Thumbnail"
                                    }
                                    className="w-full h-full object-cover relative z-10"
                                    onError={(e) => {
                                        e.target.style.display =
                                            "none";
                                    }}
                                />

                            )}


                            {course?.rating != null && (

                                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md rounded-md px-2 py-1 flex items-center gap-1 border border-white/10 z-20">

                                    <StarIcon
                                        sx={{
                                            fontSize: 14,
                                            color: "#facc15",
                                        }}
                                    />

                                    <span className="text-white text-xs font-bold">
                                        {course.rating ||
                                            "0.0"}
                                    </span>

                                </div>

                            )}

                        </div>


                        {/* COURSE INFO */}

                        <div className="space-y-4">

                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">

                                <span className="text-gray-400">
                                    Instructor
                                </span>

                                <span className="text-white font-semibold text-right">
                                    {
                                        instructorData.name
                                    }
                                </span>

                            </div>


                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">

                                <span className="text-gray-400">
                                    Difficulty
                                </span>

                                <span className="text-white font-semibold">
                                    {course.level}
                                </span>

                            </div>


                            <div className="flex justify-between items-center text-sm">

                                <span className="text-gray-400">
                                    Total Duration
                                </span>

                                <span className="text-white font-semibold">
                                    {course.duration}
                                </span>

                            </div>

                            {/* =================================================
    COURSE PRICING
================================================= */}

                            <div className="border-t border-white/5 pt-5">

                                <div className="flex items-end gap-3">

                                    {/* Current Price */}
                                    <span className="text-3xl font-extrabold text-white">
                                        ₹{pricing.price}
                                    </span>

                                    {/* Original Price */}
                                    {pricing.originalPrice && (
                                        <span className="text-sm text-gray-500 line-through mb-1">
                                            ₹{pricing.originalPrice}
                                        </span>
                                    )}

                                    {/* Discount */}
                                    {pricing.discount && (
                                        <span className="text-sm text-green-400 font-semibold mb-1">
                                            {pricing.discount}% off
                                        </span>
                                    )}

                                </div>


                                {/* Pricing Message */}

                                <p className="text-xs text-gray-500 mt-2">
                                    Get full access to this course and start learning today.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            THIS COURSE INCLUDES
                        ================================================= */}

                        <div className="border-t border-white/5 pt-5">

                            <h3 className="text-white font-bold text-sm mb-4">
                                This Course Includes
                            </h3>


                            <div className="space-y-3">

                                {includes.map(
                                    (item, index) => (

                                        <div
                                            key={index}
                                            className="flex items-center gap-3"
                                        >

                                            <CheckCircleIcon
                                                sx={{
                                                    fontSize: 16,
                                                    color: "#60a5fa",
                                                }}
                                            />

                                            <span className="text-gray-400 text-xs">
                                                {item}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            ENROLL BUTTON
                        ================================================= */}

                        {course.isEnrolled ? (

                            <div className="space-y-3">

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/courses/${id}/learn`
                                        )
                                    }
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/50 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    Continue to Course Player
                                </button>


                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        navigate(
                                            "/my-learning"
                                        )
                                    }
                                    className="w-full py-2 text-center block text-xs font-semibold text-gray-400 hover:text-white"
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
                                {enrollLoading
                                    ? "Enrolling..."
                                    : "Enroll in Course"}
                            </button>

                        )}


                        {/* =================================================
                            SAVE FOR LATER
                            THIS IS PRESERVED
                        ================================================= */}

                        <button
                            onClick={handleSave}
                            disabled={saveLoading}
                            className="w-full py-2.5 bg-transparent hover:bg-white/5 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-colors border border-gray-700 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >

                            {isSavedLocally ? (

                                <>
                                    <BookmarkIcon
                                        fontSize="small"
                                        className="text-blue-400"
                                    />

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


                    {/* =================================================
                        CERTIFICATE CARD
                    ================================================= */}

                    {/* <Card className="p-5 border border-indigo-500/20 bg-indigo-500/5">

                        <div className="flex items-start gap-3">

                            <WorkspacePremiumIcon
                                className="text-indigo-400"
                                sx={{
                                    fontSize: 28,
                                }}
                            />

                            <div>

                                <h3 className="text-white text-sm font-bold">
                                    Earn a Certificate
                                </h3>

                                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                                    Complete the course and earn a
                                    certificate to showcase your new
                                    skills.
                                </p>

                            </div>

                        </div>

                    </Card> */}

                </div>

            </div>

        </div>
    );
}