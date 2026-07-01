import React, { useState } from 'react';
import Card from '../../components/Card';
import Sidebar from '../../components/Sidebar';
import Input from '../../components/Inputs';
import Button from '../../components/Button';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import { useNavigate } from 'react-router-dom';

function PersonalInfo() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        location: '',
        bio: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Sidebar>
            <div className="flex justify-center items-center w-full min-h-screen px-4 sm:px-6 py-6 sm:py-6">
                <div className="w-full max-w-xl flex flex-col gap-6">

                    {/* Heading */}
                    <div className="flex flex-col items-start gap-1">
                        <h1 className="font-[Poppins] text-lg sm:text-xl font-bold text-white">
                            Let's build your learner profile
                        </h1>
                        <p className="font-[Manrope] text-xs text-[#64748B]">
                            Tell us a bit about yourself to help us personalize your learning path.
                        </p>
                    </div>

                    {/* Card container */}
                    <Card className="w-full">
                        <div className="flex flex-col gap-4">

                            {/* Photo Upload Row */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className="border border-white/10 bg-white/5 rounded-full p-4 shrink-0 relative">
                                    <AddAPhotoOutlinedIcon sx={{ color: 'white' }} />
                                    <div className="absolute right-[-2px] bottom-[-2px] bg-[#6366F1] border border-[#6366F1] rounded-full p-0.5 flex items-center justify-center">
                                        <EditIcon fontSize="small" sx={{ fontSize: 12, color: 'white' }} />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="font-[Poppins] text-base font-bold text-white leading-tight">
                                        Profile Picture
                                    </h2>
                                    <p className="font-[Manrope] text-[11px] text-[#64748B]">
                                        Upload a clear photo. JPG or PNG, max 5MB.
                                    </p>
                                </div>
                            </div>

                            {/* Full Name */}
                            <Input
                                size="small"
                                label="Full Name"
                                type="text"
                                placeholder="Alex Carter"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            {/* Email */}
                            <Input
                                size="small"
                                label="Email"
                                type="email"
                                placeholder="alex@example.com"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            {/* Location */}
                            <Input
                                size="small"
                                label="Location"
                                type="text"
                                placeholder="e.g. San Francisco, CA"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                leftIcon={<LocationPinIcon fontSize="small" />}
                            />

                            {/* Brief Bio */}
                            <div className="w-full space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-white text-sm font-medium font-[Manrope]">Brief Bio</label>
                                    <span className="text-[#64748B] text-xs font-[Manrope]">optional</span>
                                </div>
                                <textarea
                                    rows={3}
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about your background and what you're excited to learn..."
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-sm transition-all placeholder:text-gray-500 resize-none font-[Manrope]"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="w-full flex items-center justify-between mt-2 p-1">
                        <button
                            type="button"
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors font-[Manrope] text-sm cursor-pointer"
                        >
                            <ArrowBackIcon fontSize="small" />
                            <span>Back</span>
                        </button>

                        <Button
                            variant="primary"
                            disabled={isLoading}
                            onClick={() => navigate('/learning-goals')}
                            className="h-8 px-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs flex items-center gap-1"
                        >
                            Continue
                            <ArrowForwardIcon sx={{ fontSize: 14 }} />
                        </Button>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}

export default PersonalInfo;
