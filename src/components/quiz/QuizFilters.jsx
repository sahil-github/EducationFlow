import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function QuizFilters({
    activeFilter = "all",
    onFilterChange,
    searchQuery = "",
    onSearchChange,
}) {
    const filterTabs = [
        { id: "all", label: "All" },
        { id: "available", label: "Available" },
        { id: "in-progress", label: "In Progress" },
        { id: "completed", label: "Completed" },
    ];

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#161B26] border border-white/5 rounded-2xl overflow-x-auto">
                {filterTabs.map((tab) => {
                    const isActive = activeFilter === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onFilterChange && onFilterChange(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold font-[Poppins] transition-all cursor-pointer whitespace-nowrap ${
                                isActive
                                    ? "bg-[#222B3D] text-white shadow-sm border border-white/10"
                                    : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Search Input & Filter Button */}
            <div className="flex items-center gap-2.5">
                <div className="relative flex-1 sm:w-64">
                    <SearchIcon
                        sx={{
                            fontSize: 18,
                            color: "#94A3B8",
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                        placeholder="Search quizzes..."
                        className="w-full bg-[#161B26] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 font-[Manrope] focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>

                <button
                    type="button"
                    className="p-2 bg-[#161B26] border border-white/10 hover:border-white/20 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                    title="Filter options"
                >
                    <FilterListIcon sx={{ fontSize: 18 }} />
                </button>
            </div>
        </div>
    );
}
