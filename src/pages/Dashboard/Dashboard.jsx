import { useSelector } from 'react-redux';
import Card from "../../components/Card";
import { LocalFireDepartment, AccessTime, WorkspacePremium, SettingsOutlined, BarChartOutlined, DescriptionOutlined, CalendarToday, Star, MenuBook } from '@mui/icons-material';

export const Dashboard = () => {
    const { user: authUser } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const displayName = profile?.fullName || profile?.name || authUser?.fullName || authUser?.name || "Learner";

    const aboutUser = [
        { title: "Current Streak", value: "12 Days", icon: <LocalFireDepartment sx={{ color: '#f97316' }} /> },
        { title: "Time Learned", value: "24.5 hrs", icon: <AccessTime sx={{ color: '#60a5fa' }} /> },
        { title: "Courses Completed", value: "8", icon: <WorkspacePremium sx={{ color: '#facc15' }} /> }
    ];

    const coursesPending = [
        { module: 'Module 4 of 12', title: "Project Management Essentials", progress: 75, lessonsLeft: 3 },
        { module: 'Module 2 of 8', title: "Advanced Data Analytics", progress: 20, lessonsLeft: 12 },
        { module: 'Module 1 of 5', title: 'Design Thinking', progress: 5, lessonsLeft: 8 }
    ];

    const recommendations = [
        { title: "Leadership in Digital Age", rating: 4.8, students: "12k", tags: ["BUSINESS", "INTERMEDIATE"], icon: "⚡" },
        { title: "AI Fundamentals", rating: 4.9, students: "25k", tags: ["TECH", "BEGINNER"], icon: "🧠" }
    ];

    const liveClasses = [
        { day: 'TODAY', time: '4:00 PM', title: 'Scrum Master Q&A', with: 'Sarah Jenkins', active: true },
        { day: "TOMORROW", time: "10:30 AM", title: "Data Ethics Workshop", with: "Dr. Michael Chen", active: false },
        { day: "THU", time: "2:00 PM", title: "Python for ML Intro", with: "Alex Rivera", active: false }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-10 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column - Main Content */}
            <div className="col-span-1 lg:col-span-8 flex flex-col gap-12">

                {/* Welcome Section */}
                <Card className="p-8 bg-gradient-to-br from-[#1c1f28]/80 to-[#1c1f28]/40 border-t-blue-500/20">
                    <h1 className="text-white text-4xl font-bold mb-4">
                        Welcome back, {displayName}!
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-8">
                        You're doing great! You completed 4 lessons this week. Keep the momentum going to finish <span className="text-white font-semibold">Project Management</span> by Friday.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {aboutUser.map((item, index) => (
                            <div key={index} className="bg-[#13151a]/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-32">
                                <div className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-2">{item.title}</div>
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="text-white font-bold text-2xl">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Continue Learning */}
                <div>
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-white text-2xl font-bold tracking-wide">Continue Learning</h2>
                        <button className="text-blue-500 hover:text-blue-400 text-sm font-semibold tracking-wide transition-colors cursor-pointer">
                            View all
                        </button>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {coursesPending.map((course, index) => (
                            <Card key={index} className="min-w-[320px] max-w-[320px] bg-[#1c1f28]/60 overflow-hidden group cursor-pointer border-transparent hover:border-blue-500/50 transition-colors p-6">
                                <div className="text-blue-400 text-[10px] font-bold tracking-wider uppercase mb-3">
                                    {course.module}
                                </div>
                                <h3 className="text-white font-semibold text-xl mb-8 group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {course.title}
                                </h3>

                                <div className="mt-auto">
                                    <div className="flex justify-between items-end mb-3 text-xs font-medium text-gray-400">
                                        <span>{course.progress}% Complete</span>
                                        <span>{course.lessonsLeft} lessons left</span>
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
                </div>

                {/* Recommended for You */}
                <div>
                    <h2 className="text-white text-2xl font-bold tracking-wide mb-6">Recommended for You</h2>
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
                        <CalendarToday sx={{ color: '#9ca3af', fontSize: 20 }} />
                    </div>

                    <div className="space-y-6 mt-6">
                        {liveClasses.map((liveClass, index) => (
                            <div key={index} className={`relative pl-4 border-l-2 ${liveClass.active ? 'border-blue-500' : 'border-gray-700'}`}>
                                <div className={`text-[10px] font-bold tracking-wider uppercase mb-1 ${liveClass.active ? 'text-blue-400' : 'text-gray-400'}`}>
                                    {liveClass.day}, {liveClass.time}
                                </div>
                                <div className="text-white font-medium mb-1">{liveClass.title}</div>
                                <div className="text-xs text-gray-500 mb-4">with {liveClass.with}</div>

                                {liveClass.active ? (
                                    <button className="w-full py-2 bg-transparent border border-white/20 hover:border-blue-500 hover:bg-blue-500/10 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                                        Join Meeting
                                    </button>
                                ) : (
                                    <button className="w-full py-2 bg-transparent border border-white/10 hover:border-white/30 text-gray-300 text-sm font-medium rounded-lg transition-colors cursor-pointer">
                                        Set Reminder
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
                    </div>

                    <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-900/50 cursor-pointer border-none">
                        Download Resources
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;