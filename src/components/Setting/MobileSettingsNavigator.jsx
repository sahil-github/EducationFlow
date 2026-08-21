import React, { useState, useRef, useEffect } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { SETTINGS_SECTIONS } from './SettingsSidebar';

/**
 * MobileSettingsNavigator
 *
 * Compact horizontal section navigator for mobile viewports (< lg).
 * Allows navigating with < Previous, Current Section Name, and Next > buttons,
 * plus a quick-select dropdown sheet when tapping the active section name.
 */
export default function MobileSettingsNavigator({ activeTab, onSelectSection }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentIndex = SETTINGS_SECTIONS.findIndex((s) => s.id === activeTab);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const currentSection = SETTINGS_SECTIONS[safeIndex];
    const ActiveIcon = currentSection?.icon;

    const hasPrevious = safeIndex > 0;
    const hasNext = safeIndex < SETTINGS_SECTIONS.length - 1;

    const handlePrevious = () => {
        if (hasPrevious) {
            const prevSection = SETTINGS_SECTIONS[safeIndex - 1];
            onSelectSection(prevSection.id);
        }
    };

    const handleNext = () => {
        if (hasNext) {
            const nextSection = SETTINGS_SECTIONS[safeIndex + 1];
            onSelectSection(nextSection.id);
        }
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    return (
        <div className="w-full flex flex-col gap-4 lg:hidden pb-2" ref={dropdownRef}>
            {/* Header Title & Tag */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-white font-bold text-2xl font-[Poppins]">Settings</h1>
                    <div className="self-start px-2 py-0.5 bg-[#1E1F2A] border border-white/10 rounded text-[10px] font-bold text-[#94A3B8] tracking-wider uppercase font-[Manrope]">
                        Profile & Settings
                    </div>
                </div>

                <div className="text-xs font-semibold text-[#64748B] font-[Manrope]">
                    {safeIndex + 1} / {SETTINGS_SECTIONS.length}
                </div>
            </div>

            {/* Navigator Bar (< Current Section >) */}
            <div className="relative w-full bg-[#16171D] border border-white/10 rounded-2xl p-1.5 flex items-center justify-between shadow-xl">
                {/* Previous Arrow (<) */}
                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={!hasPrevious}
                    className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-white/5 text-white transition-all cursor-pointer"
                    aria-label="Previous section"
                    title={hasPrevious ? `Go to ${SETTINGS_SECTIONS[safeIndex - 1].label}` : 'No previous section'}
                >
                    <ChevronLeftIcon sx={{ fontSize: 24 }} />
                </button>

                {/* Current Section Name (Clickable) */}
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex-1 mx-2 py-2 px-3 flex items-center justify-center gap-2 text-center rounded-xl hover:bg-white/5 active:scale-98 transition-all cursor-pointer select-none"
                    aria-label="Select section"
                >
                    {ActiveIcon && <ActiveIcon sx={{ fontSize: 18, color: '#3B82F6' }} />}
                    <span className="text-white font-semibold text-xs sm:text-sm font-[Poppins] truncate">
                        {currentSection?.label}
                    </span>
                    <UnfoldMoreIcon sx={{ fontSize: 16, color: '#64748B' }} />
                </button>

                {/* Next Arrow (>) */}
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!hasNext}
                    className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-white/5 text-white transition-all cursor-pointer"
                    aria-label="Next section"
                    title={hasNext ? `Go to ${SETTINGS_SECTIONS[safeIndex + 1].label}` : 'No next section'}
                >
                    <ChevronRightIcon sx={{ fontSize: 24 }} />
                </button>

                {/* Quick Selection Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#181922] border border-white/15 rounded-2xl p-2 shadow-2xl z-40 flex flex-col gap-1 animate-fadeIn">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-[#64748B] uppercase tracking-wider font-[Manrope]">
                            Jump to Section
                        </div>
                        {SETTINGS_SECTIONS.map((item, idx) => {
                            const Icon = item.icon;
                            const isActive = item.id === activeTab;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        onSelectSection(item.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold font-[Poppins] transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-[#1D61E7] text-white shadow-md'
                                            : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon sx={{ fontSize: 16, color: isActive ? '#FFFFFF' : '#94A3B8' }} />
                                        <span>{item.label}</span>
                                    </div>
                                    <span className="text-[10px] text-[#64748B] font-[Manrope]">
                                        {idx + 1}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
