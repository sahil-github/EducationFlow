import { Button } from "@mui/material";
import Card from "../../components/Card";
import { Star, AccessTime, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { courses } from "../../constants/constants";
function Catalog() {


    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-10 pb-20">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-white text-2xl md:text-4xl font-bold mb-4">
                    Course Catalog
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                    Explore a curated library of high-impact courses designed for professionals who want to master the future of work.
                </p>
            </div>

            {/* Filter Bar */}
            <Card className="p-4 mb-8 bg-[#13151a]/80 border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-auto">
                    <span className="text-gray-400 text-sm">Categories:</span>
                    <div className="flex flex-wrap gap-2">
                        <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-medium transition-colors">All</button>
                        <button className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors cursor-pointer">Data Science</button>
                        <button className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors cursor-pointer">Design Thinking</button>
                        <button className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors cursor-pointer">Business</button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                        <span className="text-gray-400 text-sm">Difficulty:</span>
                        <select className="bg-transparent border border-white/20 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer">
                            <option className="bg-[#1c1f28]">All Levels</option>
                            <option className="bg-[#1c1f28]">Beginner</option>
                            <option className="bg-[#1c1f28]">Intermediate</option>
                            <option className="bg-[#1c1f28]">Advanced</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                        <span className="text-gray-400 text-sm">Sort:</span>
                        <select className="bg-transparent border border-white/20 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer">
                            <option className="bg-[#1c1f28]">Popularity</option>
                            <option className="bg-[#1c1f28]">Newest</option>
                            <option className="bg-[#1c1f28]">Rating</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {courses.map((course) => (
                    <Card key={course.id} className="bg-[#1c1f28]/60 overflow-hidden flex flex-col group cursor-pointer border-transparent hover:border-blue-500/50 transition-colors">
                        {/* Image Placeholder (Gradient) */}
                        <div className={`h-48 w-full bg-gradient-to-br relative overflow-hidden flex items-center justify-center p-4`}>
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-md px-2 py-1 flex items-center gap-1 border border-white/10">
                                <Star sx={{ fontSize: 14, color: '#facc15' }} />
                                <span className="text-white text-xs font-bold">{course.rating}</span>
                            </div>
                            <h2 className="text-white/20 text-xl font-bold text-center z-10 select-none px-4">EduFlow Course Catalog</h2>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-blue-400 text-[10px] font-bold tracking-wider uppercase">{course.category}</span>
                                <span className="text-gray-400 text-xs font-medium">{course.modules} Modules</span>
                            </div>

                            <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                                {course.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-6 flex-1">
                                {course.instructor}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                    <AccessTime sx={{ fontSize: 16 }} />
                                    <span>{course.duration}</span>
                                </div>
                                < Button className="px-5 py-2 bg-[#bfdbfe] hover:bg-blue-300 text-blue-900 text-sm font-semibold rounded-lg transition-colors cursor-pointer">
                                    View Course
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2">
                <button className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors cursor-pointer">
                    <KeyboardArrowLeft />
                </button>

                <button className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors cursor-pointer">
                    <KeyboardArrowRight />
                </button>
            </div>
        </div>
    );
}

export default Catalog;