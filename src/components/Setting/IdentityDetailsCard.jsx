import React from 'react';

export default function IdentityDetailsCard({ values, onChange }) {
    return (
        <div className="w-full bg-[#16171D]/90 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4">
            <h3 className="text-white font-bold text-sm font-[Poppins] tracking-wide pb-2 border-b border-white/5">
                Identity Details
            </h3>

            <div className="flex flex-col gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[#94A3B8] text-[10px] font-bold tracking-wider uppercase font-[Manrope]">
                        FULL NAME
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={values.fullName}
                        onChange={onChange}
                        placeholder="Alex Rivera"
                        className="w-full bg-[#121318] border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-[Manrope] focus:border-blue-500 focus:outline-none transition-all placeholder-gray-600"
                    />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[#94A3B8] text-[10px] font-bold tracking-wider uppercase font-[Manrope]">
                        EMAIL ADDRESS
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={onChange}
                        placeholder="alex.rivera@edu-flow.com"
                        className="w-full bg-[#121318] border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-[Manrope] focus:border-blue-500 focus:outline-none transition-all placeholder-gray-600"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[#94A3B8] text-[10px] font-bold tracking-wider uppercase font-[Manrope]">
                        BIO
                    </label>
                    <textarea
                        name="bio"
                        value={values.bio}
                        onChange={onChange}
                        placeholder="Frontend Developer with 2+ years of experience in building web applications."
                        className="w-full bg-[#121318] border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-[Manrope] focus:border-blue-500 focus:outline-none transition-all placeholder-gray-600"
                    />
                </div>
            </div>
        </div>
    );
}
