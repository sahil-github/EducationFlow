import React from 'react';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';

export const SETTINGS_SECTIONS = [
    { id: 'personal', label: 'Personal Information', icon: PersonOutlineIcon },
    { id: 'security', label: 'Account Security', icon: SecurityOutlinedIcon },
    { id: 'notifications', label: 'Notifications', icon: NotificationsNoneOutlinedIcon },
    { id: 'subscription', label: 'Subscription Plan', icon: CreditCardOutlinedIcon },
];

export default function SettingsSidebar({ activeTab, setActiveTab, onScrollTo }) {
    return (
        <div className="w-full lg:w-64 flex flex-col gap-6 shrink-0">
            {/* Header Title & Tag */}
            <div className="flex flex-col gap-1.5">
                <h1 className="text-white font-bold text-2xl font-[Poppins]">Settings</h1>
                <div className="self-start px-2 py-0.5 bg-[#1E1F2A] border border-white/10 rounded text-[10px] font-bold text-[#94A3B8] tracking-wider uppercase font-[Manrope]">
                    Profile & Settings
                </div>
            </div>

            {/* Desktop Navigation Menu (Vertical list) */}
            <nav className="flex flex-col gap-2">
                {SETTINGS_SECTIONS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                if (onScrollTo) {
                                    onScrollTo(item.id);
                                } else {
                                    setActiveTab(item.id);
                                }
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-[Poppins] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                                isActive
                                    ? 'bg-[#1D61E7] text-white shadow-lg shadow-blue-500/20'
                                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Icon sx={{ fontSize: 18, color: isActive ? '#FFFFFF' : '#94A3B8' }} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
