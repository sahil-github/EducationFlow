import React from 'react';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

/**
 * SkillsCard
 *
 * Displays the user's selected skills as tags with an Edit button
 * and individual remove (×) buttons.
 */
export default function SkillsCard({ skills = [], onEdit, onRemoveSkill, loading = false }) {
    const hasSkills = Array.isArray(skills) && skills.length > 0;

    return (
        <div className="w-full bg-[#16171D]/90 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <StarBorderRoundedIcon sx={{ fontSize: 18, color: '#34D399' }} />
                    <h3 className="text-white font-bold text-sm font-[Poppins] tracking-wide">
                        Skills & Expertise
                    </h3>
                </div>

                <button
                    type="button"
                    onClick={onEdit}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-[#93C5FD] hover:text-white text-xs font-semibold font-[Poppins] transition-all cursor-pointer disabled:opacity-50"
                >
                    <EditIcon sx={{ fontSize: 14 }} />
                    <span>Edit</span>
                </button>
            </div>

            {/* Content */}
            {hasSkills ? (
                <div className="flex flex-wrap gap-2 pt-1">
                    {skills.map((skill, index) => {
                        const skillName =
                            typeof skill === 'string'
                                ? skill
                                : skill?.name || skill?.id || skill?.title || String(skill);
                        return (
                            <span
                                key={index}
                                className="bg-[#181B22] border border-white/10 text-white text-xs font-medium font-[Manrope] px-3.5 py-1.5 rounded-xl flex items-center gap-2 group hover:border-white/20 transition-all select-none"
                            >
                                <span>{skillName}</span>
                                {onRemoveSkill && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveSkill(skill);
                                        }}
                                        className="text-gray-400 hover:text-red-400 p-0.5 rounded transition-colors cursor-pointer"
                                        title="Remove skill"
                                    >
                                        <CloseIcon sx={{ fontSize: 13 }} />
                                    </button>
                                )}
                            </span>
                        );
                    })}
                </div>
            ) : (
                <p className="text-[#94A3B8] text-xs font-[Manrope] py-2 italic">
                    No skills added yet. Click &ldquo;Edit&rdquo; to add your skills and expertise.
                </p>
            )}
        </div>
    );
}
