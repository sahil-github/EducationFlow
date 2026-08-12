import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import Card from "../../components/Card";
import { Star, AccessTime, KeyboardArrowLeft, KeyboardArrowRight, Search } from '@mui/icons-material';
import { fetchCourses, fetchCategories } from "../../features/courses/coursesThunks";

function Catalog() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        courses,
        categories,
        totalPages,
        currentPage,
        hasMore,
        loading,
        error,
    } = useSelector((state) => state.courses);

    // Filter states
    const [category, setCategory] = useState("All");
    const [level, setLevel] = useState("All Levels");
    const [sort, setSort] = useState("Popularity");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 6;

    // Fetch categories on mount
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Fetch courses with debounce on search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(
                fetchCourses({
                    category,
                    level,
                    sort,
                    search,
                    page,
                    limit,
                })
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [dispatch, category, level, sort, search, page]);

    const handleCategoryChange = (cat) => {
        setCategory(cat);
        setPage(1);
    };

    const handleLevelChange = (lvl) => {
        setLevel(lvl);
        setPage(1);
    };

    const handleSortChange = (srt) => {
        setSort(srt);
        setPage(1);
    };

    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(1);
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-10 pb-20 text-start">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                    Course Catalog
                </h1>
                <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
                    Explore a curated library of high-impact courses designed for professionals who want to master the future of work.
                </p>
            </div>

            {/* Filter Bar */}
            <Card className="p-4 mb-8 bg-[#13151a]/80 border-white/5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3 w-full lg:w-auto">
                    <span className="text-gray-400 text-sm font-medium">Categories:</span>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleCategoryChange("All")}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${category === "All"
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                    : "bg-white/5 hover:bg-white/10 text-gray-300"
                                }`}
                        >
                            All
                        </button>
                        {categories.filter(cat => cat.toLowerCase() !== 'all').map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${category === cat
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                        : "bg-white/5 hover:bg-white/10 text-gray-300"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                        <span className="text-gray-400 text-sm">Difficulty:</span>
                        <select
                            value={level}
                            onChange={(e) => handleLevelChange(e.target.value)}
                            className="bg-[#1c1f28] border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="All Levels">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                        <span className="text-gray-400 text-sm">Sort:</span>
                        <select
                            value={sort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="bg-[#1c1f28] border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="Popularity">Popularity</option>
                            <option value="Newest">Newest</option>
                            <option value="Rating">Rating</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Error Message */}
            {error && (
                <div className="text-center text-red-400 py-10 bg-red-950/10 border border-red-500/10 rounded-xl mb-12">
                    <p className="font-semibold">Error Loading Courses</p>
                    <p className="text-sm mt-1 text-gray-400">{error}</p>
                </div>
            )}

            {/* Loading / Grid view */}
            {loading ? (
                <div className="w-full flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-xs font-semibold">Updating catalog...</p>
                    </div>
                </div>
            ) : (
                <>
                    {courses.length === 0 ? (
                        <div className="text-center text-gray-400 py-20 border border-white/5 rounded-xl mb-12 bg-[#1A1D24]/30">
                            <span className="text-4xl block mb-3">🔍</span>
                            <h3 className="font-semibold text-lg text-white mb-1">No courses found</h3>
                            <p className="text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                            {courses.map((course) => (
                                <Card
                                    key={course.id}
                                    onClick={() => navigate(`/courses/${course.id}`)}
                                    className="bg-[#1c1f28]/60 overflow-hidden flex flex-col group cursor-pointer border-transparent hover:border-blue-500/50 transition-all duration-300"
                                >
                                    {/* Image / Thumbnail placeholder */}
                                    <div className="h-48 w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 border-b border-white/5">
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                                        <h2 className="text-white/10 text-5xl font-extrabold select-none absolute">EduFlow</h2>
                                        
                                        {course.thumbnail && (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-10 bg-transparent text-transparent"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}

                                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-md px-2 py-1 flex items-center gap-1 border border-white/10 z-20">
                                            <Star sx={{ fontSize: 14, color: '#facc15' }} />
                                            <span className="text-white text-xs font-bold">{course.rating || "0.0"}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-1 text-start">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-blue-400 text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15">
                                                {course.category}
                                            </span>
                                            <span className="text-gray-400 text-xs font-medium">{course.totalModules || course.modules || 0} Modules</span>
                                        </div>

                                        <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3.5rem] leading-snug">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-2">
                                            by {course.instructor}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                                                <AccessTime sx={{ fontSize: 16, color: '#34d399' }} />
                                                <span>{course.duration}</span>
                                            </div>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/courses/${course.id}`);
                                                }}
                                                className="px-5 py-2 bg-[#bfdbfe] hover:bg-blue-300 text-blue-900 text-xs font-bold rounded-lg transition-colors cursor-pointer uppercase"
                                            >
                                                View Course
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <KeyboardArrowLeft />
                    </button>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages || !hasMore}
                        className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <KeyboardArrowRight />
                    </button>
                </div>
            )}
        </div>
    );
}

export default Catalog;