import React from 'react';

const timezones = [
    "Central European Time (CET) - UTC+1",
    "Pacific Time (PT) - UTC-8",
    "Eastern Time (ET) - UTC-5",
    "Greenwich Mean Time (GMT) - UTC+0",
    "India Standard Time (IST) - UTC+5:30",
    "Australian Eastern Time (AEST) - UTC+10"
];

export default function ContactRegionCard({ values, onChange }) {
    const isCustomTimezone = values.timezone && !timezones.includes(values.timezone);

    return (
        <div className="w-full bg-[#16171D]/90 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <h3 className="text-white font-bold text-sm font-[Poppins] tracking-wide pb-2 border-b border-white/5">
                Contact & Region
            </h3>

            <div className="flex flex-col gap-4">
                {/* Timezone */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[#94A3B8] text-[10px] font-bold tracking-wider uppercase font-[Manrope]">
                        TIMEZONE
                    </label>
                    <div className="relative">
                        <select
                            name="timezone"
                            value={values.timezone || ""}
                            onChange={onChange}
                            className="w-full bg-[#121318] border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-[Manrope] focus:border-blue-500 focus:outline-none transition-all appearance-none cursor-pointer pr-10"
                            style={{
                                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 14px center',
                                backgroundSize: '16px',
                            }}
                        >
                            <option value="" disabled className="bg-[#16171D] text-gray-500">
                                Select Timezone
                            </option>
                            {isCustomTimezone && (
                                <option value={values.timezone} className="bg-[#16171D] text-white">
                                    {values.timezone}
                                </option>
                            )}
                            {timezones.map(tz => (
                                <option key={tz} value={tz} className="bg-[#16171D] text-white">
                                    {tz}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[#94A3B8] text-[10px] font-bold tracking-wider uppercase font-[Manrope]">
                        PHONE NUMBER
                    </label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={values.phoneNumber || ""}
                        onChange={onChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-[#121318] border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-[Manrope] focus:border-blue-500 focus:outline-none transition-all placeholder-gray-600"
                    />
                </div>
            </div>
        </div>
    );
}
