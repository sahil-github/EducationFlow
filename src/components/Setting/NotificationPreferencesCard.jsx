import React from 'react';
import Switch from '@mui/material/Switch';

export default function NotificationPreferencesCard({ preferences, onToggle }) {
    const items = [
        {
            key: 'courseActivity',
            title: 'Course Activity',
            description: 'Updates on assignments, grades, and course announcements',
        },
        {
            key: 'liveSessions',
            title: 'Live Sessions',
            description: 'Reminders for upcoming webinars and Q&A sessions',
        },
        {
            key: 'newsletter',
            title: 'Newsletter & Recommendations',
            description: 'Monthly insights and curated courses based on your interests',
        },
    ];

    return (
        <div className="w-full bg-[#16171D]/90 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <h3 className="text-white font-bold text-sm font-[Poppins] tracking-wide pb-2 border-b border-white/5">
                Notification Preferences
            </h3>

            <div className="flex flex-col gap-5 pt-1">
                {items.map((item) => {
                    const isChecked = Boolean(preferences[item.key]);
                    return (
                        <div key={item.key} className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-0.5">
                                <h4 className="text-white text-xs font-semibold font-[Poppins]">
                                    {item.title}
                                </h4>
                                <p className="text-[#94A3B8] text-[11px] font-[Manrope]">
                                    {item.description}
                                </p>
                            </div>
                            <Switch
                                checked={isChecked}
                                onChange={(e) => onToggle(item.key, e.target.checked)}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#1D61E7',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#1D61E7',
                                    },
                                    '& .MuiSwitch-track': {
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                    },
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
