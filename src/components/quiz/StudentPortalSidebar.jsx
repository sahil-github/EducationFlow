import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { clearCurrentUser } from "../../utils/storage";

// Icons
import GridViewIcon from "@mui/icons-material/GridView";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function StudentPortalSidebar({ onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isSettingsPath =
        location.pathname.startsWith("/setting") ||
        location.pathname.startsWith("/settings") ||
        location.pathname === "/profile";

    const [settingsOpen, setSettingsOpen] = useState(isSettingsPath);

    useEffect(() => {
        if (isSettingsPath) {
            setSettingsOpen(true);
        }
    }, [isSettingsPath]);

    const handleLogout = () => {
        if (onClose) onClose();
        clearCurrentUser();
        dispatch(logout());
        navigate("/login");
    };

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: GridViewIcon, path: "/dashboard" },
        { id: "catalog", label: "Catalog", icon: SchoolOutlinedIcon, path: "/catalog" },
        { id: "my-learning", label: "My Learning", icon: AutoStoriesOutlinedIcon, path: "/my-learning" },
        { id: "assignments", label: "Assignments", icon: AssignmentOutlinedIcon, path: "/assignment" },
        { id: "quizzes", label: "Quizzes", icon: QuizOutlinedIcon, path: "/quizzes" },
        { id: "certificates", label: "Certificates", icon: WorkspacePremiumOutlinedIcon, path: "/certificates" },
        { id: "settings", label: "Settings", icon: SettingsOutlinedIcon, path: "/setting" },
    ];

    const settingsSubItems = [
        { id: "personal", label: "Personal Information", icon: PersonOutlineIcon, path: "/setting?section=personal" },
        { id: "security", label: "Account Security", icon: SecurityOutlinedIcon, path: "/setting?section=security" },
        { id: "notifications", label: "Notifications", icon: NotificationsNoneOutlinedIcon, path: "/setting?section=notifications" },
        { id: "subscription", label: "Subscription Plan", icon: CreditCardOutlinedIcon, path: "/setting?section=subscription" },
    ];

    const isItemActive = (item) => {
        const path = location.pathname;
        switch (item.id) {
            case "dashboard":
                return path === "/dashboard";
            case "catalog":
                return path === "/catalog" || path.startsWith("/courses");
            case "my-learning":
                return path === "/my-learning" || path === "/intro-mylearning";
            case "assignments":
                return (
                    path === "/assignment" ||
                    path.startsWith("/assignment") ||
                    path === "/empty-state-assignment" ||
                    path === "/assignment-submitted"
                );
            case "quizzes":
                return path.startsWith("/quizzes");
            case "certificates":
                return path.startsWith("/certificates") || path.startsWith("/certificate");
            case "settings":
                return isSettingsPath;
            default:
                return path === item.path;
        }
    };

    const handleNavClick = () => {
        if (onClose) onClose();
    };

    const handleSettingsClick = (e) => {
        e.preventDefault();
        setSettingsOpen((prev) => !prev);
        if (location.pathname !== "/setting") {
            navigate("/setting");
        }
    };

    return (
        <aside className="w-60 bg-[#0B0F19] border-r border-white/5 flex flex-col justify-between py-5 px-3.5 shrink-0 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden z-40">
            <div>
                {/* Main Navigation Links */}
                <nav className="space-y-1 font-[Manrope]">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isItemActive(item);
                        const isSettings = item.id === "settings";

                        if (isSettings) {
                            return (
                                <div key={item.id} className="space-y-1">
                                    <button
                                        type="button"
                                        onClick={handleSettingsClick}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border-none bg-transparent ${
                                            active
                                                ? "bg-[#161B26] text-white border border-white/10 font-semibold shadow-sm"
                                                : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon
                                                sx={{
                                                    fontSize: 18,
                                                    color: active ? "#818CF8" : "#94A3B8",
                                                }}
                                            />
                                            <span>{item.label}</span>
                                        </div>
                                        {settingsOpen ? (
                                            <KeyboardArrowDownIcon sx={{ fontSize: 16, color: active ? "#818CF8" : "#94A3B8" }} />
                                        ) : (
                                            <KeyboardArrowRightIcon sx={{ fontSize: 16, color: active ? "#818CF8" : "#94A3B8" }} />
                                        )}
                                    </button>

                                    {/* Settings Sub-menu */}
                                    {settingsOpen && (
                                        <div className="ml-3.5 pl-2 border-l border-white/10 space-y-0.5 mt-0.5">
                                            {settingsSubItems.map((subItem) => {
                                                const SubIcon = subItem.icon;
                                                const searchParams = new URLSearchParams(location.search);
                                                const currentSec = searchParams.get("section") || "personal";
                                                const isSubActive =
                                                    isSettingsPath && currentSec === subItem.id;

                                                return (
                                                    <NavLink
                                                        key={subItem.id}
                                                        to={subItem.path}
                                                        onClick={handleNavClick}
                                                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                                                            isSubActive
                                                                ? "bg-indigo-600/20 text-indigo-400 font-semibold"
                                                                : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                                                        }`}
                                                    >
                                                        <SubIcon sx={{ fontSize: 15, color: isSubActive ? "#818CF8" : "#94A3B8" }} />
                                                        <span>{subItem.label}</span>
                                                    </NavLink>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                onClick={handleNavClick}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                    active
                                        ? "bg-[#161B26] text-white border border-white/10 font-semibold shadow-sm"
                                        : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                                }`}
                            >
                                <Icon
                                    sx={{
                                        fontSize: 18,
                                        color: active ? "#818CF8" : "#94A3B8",
                                    }}
                                />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Actions (Logout) */}
            <div className="space-y-1.5 pt-6 border-t border-white/5 font-[Manrope]">
                <button
                    onClick={handleLogout}
                    type="button"
                    className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-white/[0.04] transition-all cursor-pointer text-left"
                >
                    <LogoutIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
