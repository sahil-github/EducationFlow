import React from 'react';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';

export default function AccountSecurityCard({ onUpdatePassword, onManage2FA }) {
    return (
        <div className="w-full bg-[#16171D]/90 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            {/* Header with Secure Badge */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h3 className="text-white font-bold text-sm font-[Poppins] tracking-wide">
                    Account Security
                </h3>
                <span className="px-2.5 py-0.5 bg-[#102A20] text-[#34D399] border border-emerald-500/20 rounded-full text-[10px] font-bold tracking-wider uppercase font-[Manrope]">
                    Secure
                </span>
            </div>

            {/* Grid Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                {/* Password Section */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                        <VpnKeyOutlinedIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <h4 className="text-white text-xs font-semibold font-[Poppins]">Password</h4>
                        <p className="text-[#94A3B8] text-[11px] font-[Manrope]">
                            Last changed 4 months ago
                        </p>
                        <button
                            type="button"
                            onClick={onUpdatePassword}
                            className="self-start text-[#3B82F6] hover:text-blue-400 text-xs font-semibold font-[Manrope] mt-1.5 transition-colors cursor-pointer"
                        >
                            Update password
                        </button>
                    </div>
                </div>

                {/* Two-Factor Authentication Section */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                        <PhoneAndroidOutlinedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <h4 className="text-white text-xs font-semibold font-[Poppins]">Two-Factor Authentication</h4>
                        <p className="text-[#94A3B8] text-[11px] font-[Manrope]">
                            Active via Authenticator App
                        </p>
                        <button
                            type="button"
                            onClick={onManage2FA}
                            className="self-start text-[#F59E0B] hover:text-amber-400 text-xs font-semibold font-[Manrope] mt-1.5 transition-colors cursor-pointer"
                        >
                            Manage methods
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
