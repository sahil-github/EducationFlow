import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Card from '../../../components/Card';
import Button from '../../../components/Button';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';

import Slider from '@mui/material/Slider';
import { toast } from 'react-toastify';

import { updateSkills } from '../../../features/profile/profileThunks';
import { updateUser } from '../../../features/auth/authSlice';
import { saveCurrentUser, upsertUser } from '../../../utils/storage';

import AddSkill from './AddSkill';

function SkillAssesment() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, profile } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);

    const [skills, setSkills] = useState(() => {
        if (Array.isArray(profile?.skills) && profile.skills.length > 0) {
            return profile.skills;
        }

        return [
            {
                id: 'Web development',
                level: 70,
            },
            {
                id: 'Public speaking',
                level: 70,
            },
            {
                id: 'UI/UX Design',
                level: 70,
            },
        ];
    });

    const [openModal, setOpenModal] = useState(false);

    const getLevelLabel = (value) => {
        if (value <= 32) return 'Novice';
        if (value <= 62) return 'Intermediate';
        return 'Expert';
    };

    const handleAddSkill = (skillName) => {
        const trimmedSkill = skillName.trim();

        if (!trimmedSkill) {
            toast.error('Please enter a skill');
            return;
        }

        // Duplicate check
        const alreadyExists = skills.some(
            (skill) =>
                skill.id.toLowerCase() === trimmedSkill.toLowerCase()
        );

        if (alreadyExists) {
            toast.error('This skill is already added');
            return;
        }

        const newSkill = {
            id: trimmedSkill,
            level: 50,
        };

        setSkills((prev) => [...prev, newSkill]);

        setOpenModal(false);

        toast.success(`${trimmedSkill} added successfully`);
    };

    const handleContinue = async () => {
        try {
            await dispatch(updateSkills(skills)).unwrap();

            const updatedUserData = {
                ...authUser,
                ...profile,
                skills,
            };

            dispatch(updateUser(updatedUserData));
            saveCurrentUser(updatedUserData);
            upsertUser(updatedUserData);

            navigate('/review');
        } catch (err) {
            toast.error(
                err || 'Failed to save skills. Please try again.'
            );
        }
    };

    return (
        <div className="flex justify-center items-center w-full h-auto gap-4 px-4 sm:px-6 py-6">
            <div className="w-full max-w-3xl flex flex-col gap-6">

                {/* Heading */}
                <div className="flex flex-col items-start gap-1">
                    <h1 className="font-[Poppins] text-lg sm:text-xl font-bold text-white">
                        Rate your current skills
                    </h1>

                    <p className="font-[Manrope] text-xs text-[#64748B]">
                        Honest assessment helps us personalize your curriculum
                        to bridge the gaps in your knowledge.
                    </p>
                </div>

                {/* Skills */}
                <Card className="flex flex-col gap-5 p-5">

                    {skills.map((skill) => (
                        <Card
                            key={skill.id}
                            className="w-full p-4 bg-[#1E293B66]"
                        >
                            <div className="flex flex-col">

                                {/* Skill Header */}
                                <div className="flex flex-row gap-4 justify-between">

                                    <div className="flex flex-row gap-2 items-center">

                                        <p className="text-[#6366F1] bg-gray-500/20 rounded-full p-2">
                                            <CodeIcon fontSize="small" />
                                        </p>

                                        <p className="text-white font-[Poppins]">
                                            {skill.id}
                                        </p>

                                    </div>

                                    <div className="flex flex-row gap-2 justify-end">

                                        <p className="text-[#A1A1AA] bg-[#0F172A] p-2 rounded-lg text-xs font-bold font-[Manrope]">
                                            {getLevelLabel(skill.level)}
                                        </p>

                                    </div>

                                </div>

                                {/* Slider */}
                                <Slider
                                    size="small"
                                    value={skill.level}
                                    onChange={(e, value) => {
                                        setSkills((prev) =>
                                            prev.map((item) =>
                                                item.id === skill.id
                                                    ? {
                                                          ...item,
                                                          level: value,
                                                      }
                                                    : item
                                            )
                                        );
                                    }}
                                    aria-label={`${skill.id} skill level`}
                                    valueLabelDisplay="auto"
                                />

                                {/* Labels */}
                                <div className="flex justify-between text-[10px] text-[#A1A1AA] font-[Manrope]">
                                    <span>Novice</span>
                                    <span>Intermediate</span>
                                    <span>Expert</span>
                                </div>

                            </div>
                        </Card>
                    ))}

                    {/* Add Skill */}
                    <Button
                        className="text-[#A1A1AA] w-full border border-dashed border-gray-600 p-4 rounded-3xl text-xs font-bold font-[Manrope]"
                        variant="ghost"
                        onClick={() => setOpenModal(true)}
                    >
                        + Add another skill
                    </Button>

                </Card>

                {/* Navigation Buttons */}
                <div className="w-full flex items-center justify-between mt-2 p-1">

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
                        disabled={loading}
                        onClick={handleContinue}
                        className="h-8 px-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs flex items-center gap-1 disabled:opacity-50"
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