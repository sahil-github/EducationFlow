import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuizStats from "../../components/quiz/QuizStats";
import QuizFilters from "../../components/quiz/QuizFilters";
import QuizCard from "../../components/quiz/QuizCard";
import { fetchQuizzes } from "../../features/quiz/quizThunks";

export default function QuizDashboard() {
    const dispatch = useDispatch();

    const { quizzes = [], stats = {}, loading } = useSelector((state) => state.quiz);

    const [activeFilter, setActiveFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchQuizzes());
    }, [dispatch]);

    // Filter quizzes based on active tab and search query
    const filteredQuizzes = quizzes.filter((quiz) => {
        const matchesFilter =
            activeFilter === "all" ? true : quiz.status === activeFilter;

        const matchesSearch =
            searchQuery.trim() === ""
                ? true
                : quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  quiz.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-8 pb-20 text-white">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-[Poppins] tracking-tight">
                    My Quizzes
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 font-[Manrope] mt-1">
                    Track your academic progress and assignments.
                </p>
            </div>

            {/* Stats Cards */}
            <QuizStats stats={stats} />

            {/* Filter Tabs & Search */}
            <QuizFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Quiz Grid */}
            {filteredQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredQuizzes.map((quiz) => (
                        <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-gray-400 font-[Manrope]">
                    <p className="text-sm">No quizzes found matching your current filter.</p>
                    <button
                        onClick={() => {
                            setActiveFilter("all");
                            setSearchQuery("");
                        }}
                        className="mt-3 text-xs text-indigo-400 hover:underline font-semibold cursor-pointer"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
