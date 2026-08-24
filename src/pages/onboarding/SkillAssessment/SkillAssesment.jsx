import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Card from '../../../components/Card';
import Button from '../../../components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import CloseIcon from '@mui/icons-material/Close';
import Slider from '@mui/material/Slider';
import { toast } from 'react-toastify';

import { updateSkills, getProfile } from '../../../features/profile/profileThunks';
import { patchProfile } from '../../../features/profile/profileSlice';
import { updateUser } from '../../../features/auth/authSlice';
import { saveCurrentUser, upsertUser, getCurrentUser } from '../../../utils/storage';
import AddSkill from './AddSkill';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalizes any skill data shape into canonical skill objects:
 * { id, skillId, name, skillName, skill, title, level, score }
 *
 * Handles:
 * - { id: "JavaScript", level: 70 }       ← old format
 * - { name: "JavaScript", score: 70 }
 * - { skillName: "JavaScript", level: 70 }
 * - "JavaScript"                           ← plain string
 * - null / undefined
 */
export const normalizeSkillsFromRaw = (rawSkills) => {
    if (!Array.isArray(rawSkills) || rawSkills.length === 0) return null;

    return rawSkills.map((item) => {
        const name =
            typeof item === 'string'
                ? item.trim()
                : (item?.skillName || item?.name || item?.skill || item?.title || item?.id || '').trim();

        const level =
            typeof item === 'object' && item?.level !== undefined
                ? item.level
                : typeof item === 'object' && item?.score !== undefined
                ? item.score
                : 70;

        return {
            id: name,
            skillId: name,
            name: name,
            skillName: name,
            skill: name,
            title: name,
            level: level,
            score: level,
        };
    }).filter((s) => s.name); // drop empties
};

/** Default starter skills shown to new users */
const DEFAULT_SKILLS = [
    { id: 'Web Development', skillId: 'Web Development', name: 'Web Development', skillName: 'Web Development', skill: 'Web Development', title: 'Web Development', level: 70, score: 70 },
    { id: 'Public Speaking',  skillId: 'Public Speaking',  name: 'Public Speaking',  skillName: 'Public Speaking',  skill: 'Public Speaking',  title: 'Public Speaking',  level: 70, score: 70 },
    { id: 'UI/UX Design',    skillId: 'UI/UX Design',    name: 'UI/UX Design',    skillName: 'UI/UX Design',    skill: 'UI/UX Design',    title: 'UI/UX Design',    level: 70, score: 70 },
];

// ────────────────────────────────────────────────────────────────────────────

function SkillAssesment() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, profile } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);

    // ── Initialize skills from best available source ──────────────────────
    const [skills, setSkills] = useState(() => {
        const raw =
            profile?.skills ||
            authUser?.skills ||
            getCurrentUser()?.skills;

        const normalized = normalizeSkillsFromRaw(raw);
        return normalized ?? DEFAULT_SKILLS;
    });

    const [openModal, setOpenModal] = useState(false);

    // Fetch profile from backend on mount if not already in Redux
    useEffect(() => {
        if (!profile) {
            dispatch(getProfile());
        }
    }, [dispatch, profile]);

    // Rehydrate local skill state when Redux profile loads/updates after mount
    useEffect(() => {
        const raw =
            profile?.skills ||
            authUser?.skills ||
            getCurrentUser()?.skills;

        console.log('[SkillAssesment] raw profile.skills from backend:', raw);

        const normalized = normalizeSkillsFromRaw(raw);
        if (normalized && normalized.length > 0) {
            setSkills(normalized);
        }
    }, [profile, authUser]);

    // ── Helpers ──────────────────────────────────────────────────────────
    const getLevelLabel = (value) => {
        if (value <= 32) return 'Novice';
        if (value <= 62) return 'Intermediate';
        return 'Expert';
    };

    // ── Add skill ─────────────────────────────────────────────────────────
    const handleAddSkill = useCallback((skillName) => {
        const trimmed = skillName.trim();

        if (!trimmed) {
            toast.error('Please enter a skill name');
            return;
        }

        const alreadyExists = skills.some(
            (s) => s.name.toLowerCase() === trimmed.toLowerCase()
        );

        if (alreadyExists) {
            toast.error('This skill is already added');
            return;
        }

        const newSkill = {
            id: trimmed,
            skillId: trimmed,
            name: trimmed,
            skillName: trimmed,
            skill: trimmed,
            title: trimmed,
            level: 50,
            score: 50,
        };

        setSkills((prev) => [...prev, newSkill]);
        setOpenModal(false);
        toast.success(`${trimmed} added`);
    }, [skills]);

    // ── Remove skill ──────────────────────────────────────────────────────
    const handleRemoveSkill = useCallback((skillName) => {
        setSkills((prev) => prev.filter((s) => s.name !== skillName));
    }, []);

    // ── Slider change ─────────────────────────────────────────────────────
    const handleLevelChange = useCallback((skillName, value) => {
        setSkills((prev) =>
            prev.map((s) =>
                s.name === skillName
                    ? { ...s, level: value, score: value }
                    : s
            )
        );
    }, []);

    // ── Save & continue ───────────────────────────────────────────────────
    const handleContinue = async () => {
        // Build canonical payload — every field duplicated for max compatibility
        const payload = skills.map((s) => ({
            id: s.name,
            skillId: s.name,
            name: s.name,
            skillName: s.name,
            skill: s.name,
            title: s.name,
            level: s.level,
            score: s.level,
        }));

        try {
            console.log('Skills payload:', payload);
            await dispatch(updateSkills(payload)).unwrap();

            const updatedUser = {
                ...authUser,
                ...profile,
                skills: payload,
            };

            dispatch(updateUser(updatedUser));
            dispatch(patchProfile({ skills: payload }));
            saveCurrentUser(updatedUser);
            upsertUser(updatedUser);

            navigate('/review');
        } catch (err) {
            toast.error(
                typeof err === 'string'
                    ? err
                    : err?.message || 'Failed to save skills. Please try again.'
            );
        }
    };

    return (
        <div className="flex justify-center w-full min-h-screen px-4 sm:px-6 py-6">
            <div className="w-full max-w-3xl flex flex-col gap-6">

                {/* Heading */}
                <div className="flex flex-col items-start gap-1">
                    <h1 className="font-[Poppins] text-lg sm:text-xl font-bold text-white">
                        Rate your current skills
                    </h1>
                    <p className="font-[Manrope] text-xs text-[#64748B]">
                        Honest assessment helps us personalize your curriculum to bridge the gaps in your knowledge.
                    </p>
                </div>

                {/* Skills Card */}
                <Card className="flex flex-col gap-4 p-5">

                    {skills.map((skill) => (
                        <Card
                            key={skill.name}
                            className="w-full p-4 bg-[#1E293B66]"
                        >
                            <div className="flex flex-col gap-2">

                                {/* Skill Header */}
                                <div className="flex flex-row gap-4 justify-between items-center">
                                    <div className="flex flex-row gap-2 items-center min-w-0">
                                        <p className="text-[#6366F1] bg-gray-500/20 rounded-full p-2 shrink-0">
                                            <CodeIcon fontSize="small" />
                                        </p>
                                        <p className="text-white font-[Poppins] truncate">
                                            {skill.name}
                                        </p>
                                    </div>

                                    <div className="flex flex-row gap-2 items-center shrink-0">
                                        <p className="text-[#A1A1AA] bg-[#0F172A] px-2 py-1.5 rounded-lg text-xs font-bold font-[Manrope]">
                                            {getLevelLabel(skill.level)}
                                        </p>
                                        {/* Remove skill button */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill.name)}
                                            title={`Remove ${skill.name}`}
                                            className="text-[#64748B] hover:text-red-400 transition-colors p-1 rounded"
                                        >
                                            <CloseIcon sx={{ fontSize: 16 }} />
                                        </button>
                                    </div>
                                </div>

                                {/* Slider */}
                                <Slider
                                    size="small"
                                    value={skill.level}
                                    onChange={(_, value) => handleLevelChange(skill.name, value)}
                                    aria-label={`${skill.name} skill level`}
                                    valueLabelDisplay="auto"
                                    sx={{
                                        color: '#6366F1',
                                        '& .MuiSlider-thumb': { width: 14, height: 14 },
                                    }}
                                />

                                {/* Level Labels */}
                                <div className="flex justify-between text-[10px] text-[#A1A1AA] font-[Manrope] -mt-1">
                                    <span>Novice</span>
                                    <span>Intermediate</span>
                                    <span>Expert</span>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {/* Add Skill Button */}
                    <Button
                        className="text-[#A1A1AA] w-full border border-dashed border-gray-600 p-4 rounded-3xl text-xs font-bold font-[Manrope] hover:border-[#6366F1]/50 hover:text-[#6366F1] transition-colors"
                        variant="ghost"
                        onClick={() => setOpenModal(true)}
                    >
                        + Add another skill
                    </Button>

                </Card>

                {/* Navigation Buttons */}
                <div className="w-full flex items-center justify-between mt-1">
                    <Button
                        type="button"
                        onClick={() => navigate('/learning-goals')}
                        className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors font-[Manrope] text-sm cursor-pointer"
                        variant="ghost"
                    >
                        <ArrowBackIcon fontSize="small" />
                        Back
                    </Button>

                    <Button
                        variant="primary"
                        disabled={loading || skills.length === 0}
                        onClick={handleContinue}
                        className="h-8 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Continue'}
                        <ArrowForwardIcon sx={{ fontSize: 14 }} />
                    </Button>
                </div>

                {/* Add Skill Modal */}
                <AddSkill
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    onAddSkill={handleAddSkill}
                />
            </div>
        </div>
    );
}

export default SkillAssesment;