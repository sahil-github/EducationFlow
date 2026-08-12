import { useSelector } from "react-redux";
import Card from "../../components/Card";
import { LocalFireDepartment, AccessTime, WorkspacePremium } from '@mui/icons-material';

const WelcomeSection = () => {
    const { user: authUser } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const displayName = profile?.fullName || profile?.name || authUser?.fullName || authUser?.name || "Learner";

    const Aboutuser = [{ id: 1, title: "Current Streak", value: "12 Days", icon: <LocalFireDepartment /> }, { id: 2, title: "Time Learned", value: "24.5 hrs", icon: <AccessTime /> }, { id: 3, title: "Courses Completed", value: "8", icon: <WorkspacePremium /> }]
    return (
        <Card className="p-5 sm:p-8 bg-gradient-to-br from-[#1c1f28]/80 to-[#1c1f28]/40 border-t-blue-500/20">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Welcome back, {displayName}!
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-6 sm:mb-8">
                You're doing great! You completed 4 lessons this week. Keep the momentum going to finish <span className="text-white font-semibold">Project Management</span> by Friday.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {Aboutuser.map((item) =>
                    < div key={item.id} className="bg-[#13151a]/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-32">
                        <div className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-2">{item.title}</div>
                        <div className="flex items-center gap-3">
                            {item.icon}
                            <span className="text-white font-bold text-2xl">{item.value}</span>
                        </div>
                    </div>
                )}
            </div>
        </Card >
    );
};

export default WelcomeSection;
