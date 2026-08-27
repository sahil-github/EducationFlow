import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { clearCurrentUser } from "../../utils/storage";
import Logo from "../../assets/logo/EduFlow_Logo.png";
// Icons
import GridViewIcon from "@mui/icons-material/GridView";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";

export default function StudentPortalSidebar({ activeSection = "assignments" }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearCurrentUser();
        dispatch(logout());
        navigate("/login");
    };

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: GridViewIcon, path: "/dashboard" },
        { id: "courses", label: "Courses", icon: SchoolOutlinedIcon, path: "/catalog" },
        { id: "assignments", label: "Assignments", icon: AssignmentOutlinedIcon, path: "/quizzes" },
        { id: "grades", label: "Grades", icon: StarOutlineOutlinedIcon, path: "/quizzes" },
        { id: "resources", label: "Resources", icon: FolderOutlinedIcon, path: "/catalog" },
    ];

    return (
        <aside className="w-60 bg-[#0B0F19] border-r border-white/5 flex flex-col justify-between py-6 px-4 shrink-0 min-h-screen">
            {/* <div> */}
            {/* Brand Logo Header */}
            {/* <div className="flex items-center gap-3 px-2 mb-6">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/25 shrink-0">
                        EF
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold font-[Poppins] text-sm tracking-wide leading-tight">
                            EduFlow
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase font-[Manrope]">
                            STUDENT PORTAL
                        </span>
                    </div>
                </div> */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={Logo} alt="Logo" style={{ width: 36, height: 36 }} />
                <span style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    fontSize: 17,
                    color: '#6366F1',
                    letterSpacing: '0.03em',
                }}>
                    EduFlow
                </span>

                {/* + New Request Button */}
                <button
                    type="button"
                    onClick={() => navigate("/catalog")}
                    className="w-full py-2.5 px-4 mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold font-[Poppins] transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <AddIcon sx={{ fontSize: 16 }} />
                    <span>New Request</span>
                </button>

                {/* Main Navigation Links */}
                <nav className="space-y-1.5 font-[Manrope]">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;

                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${isActive
                                    ? "bg-[#161B26] text-white border border-white/10 font-semibold shadow-sm"
                                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                                    }`}
                            >
                                <Icon
                                    sx={{
                                        fontSize: 18,
                                        color: isActive ? "#818CF8" : "#94A3B8",
                                    }}
                                />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Actions (Settings & Logout) */}
            <div className="space-y-1.5 pt-6 border-t border-white/5 font-[Manrope]">
                <NavLink
                    to="/setting"
                    className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all"
                >
                    <SettingsOutlinedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                    <span>Settings</span>
                </NavLink>

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
