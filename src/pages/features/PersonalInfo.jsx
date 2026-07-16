import React, { useState } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Inputs';
import Button from '../../components/Button';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import SampleModal from '../../components/SampleModal';
import { toast } from 'react-toastify';
import LockIcon from '@mui/icons-material/Lock';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
    getCurrentUser,
    saveCurrentUser,
    getUsers,
    saveUsers,
} from "../../utils/store"
// import SelectField from '../../components/SelectField';

function PersonalInfo() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = getCurrentUser();
    const [formData, setFormData] = useState({
        name: currentUser.name || '',
        location: currentUser.location || '',
        bio: currentUser.bio || '',
    });
    const [bioSamplesModal, setBioSamplesModal] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim() || !formData.location.trim()) {
            toast.error("Please fill in your Name and Location before continuing.");
            return;
        }
        setIsLoading(true);

        // Exclude email from formData — it is read-only and should not be submitted
        const { email: _ignored, ...editableData } = formData;

        const currentUser = getCurrentUser();
        const updatedUser = { ...currentUser, ...editableData };
        saveCurrentUser(updatedUser);

        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...editableData };
            saveUsers(users);
        }

        // Dispatch event so Navbar immediately updates its name display
        window.dispatchEvent(new Event('currentUserUpdate'));

        setIsLoading(false);
        navigate('/learning-goals');
    };

    return (
        <div className="flex justify-center items-center w-full min-h-screen px-4 sm:px-6 py-6 sm:py-6 ">
            <div className="w-full max-w-2xl flex flex-col gap-6">

                <div className="flex flex-col items-start gap-1">
                    <h1 className="font-[Poppins] text-lg sm:text-xl font-bold text-white">
                        Let's build your learner profile
                    </h1>
                    <p className="font-[Manrope] text-xs text-[#64748B]">
                        Tell us a bit about yourself to help us personalize your learning path.
                    </p>
                </div>

                <Card className="w-full bg-[#16161AB2] p-7 ">
                    <div className="flex flex-col gap-4">
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

                        <Input
                            size="small"
                            label="Full Name"
                            type="text"
                            placeholder="Alex Carter"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="text-white "
                        />

                        {/* Email — read-only, pre-filled from signup */}
                        <Input
                            size="small"
                            label="Email"
                            type="email"
                            placeholder="alex@example.com"
                            name="email"
                            value={currentUser.email}
                            readOnly
                            className="text-[#64748B] cursor-not-allowed"
                            leftIcon={<LockIcon fontSize="small" sx={{ color: '#64748B' }} />}
                            disabled
                        />

                        <div className="w-full">
                            <label className="text-white text-sm font-medium font-[Manrope] mb-1.5 block">Location</label>
                            <select
                                name="location"
                                value={formData.location}
                                leftIcon={<LocationOnIcon fontSize="small" sx={{ color: '#fff' }} />}
                                onChange={handleChange}
                                className="w-full h-[38px] px-3 rounded-[10px] border border-white/10 bg-black/50 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-sm transition-all font-[Manrope] appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center',
                                    backgroundSize: '16px',
                                }}
                            >
                                <option value="" disabled className="text-gray-900">Select your location</option>
                                <option value="San Francisco, CA" className="bg-[#1E1E2A] text-white">San Francisco, CA</option>
                                <option value="New York, NY" className="bg-[#1E1E2A] text-white">New York, NY</option>
                                <option value="London, UK" className="bg-[#1E1E2A] text-white">London, UK</option>
                                <option value="Bengaluru, India" className="bg-[#1E1E2A] text-white">Bengaluru, India</option>
                                <option value="Toronto, Canada" className="bg-[#1E1E2A] text-white">Toronto, Canada</option>
                                <option value="Sydney, Australia" className="bg-[#1E1E2A] text-white">Sydney, Australia</option>
                                <option value="Remote / Anywhere" className="bg-[#1E1E2A] text-white">Remote / Anywhere</option>
                            </select>
                        </div>

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
                            <p className=" text-sm text-gray-500 resize-none font-[Manrope]"> A few lines about your work,goals, or inetrests. Be real, be you. Need Inspiration? <span
                                className="text-[#6366F1]  cursor-pointer hover"
                                onClick={() => setBioSamplesModal(true)}
                            >
                                view samples
                            </span> </p>
                        </div>

                    </div>
                </Card>

                <div className="w-full flex items-center justify-end mt-2 gap-2 p-1">
                    <Button
                        variant="primary"
                        disabled={isLoading}
                        onClick={handleSubmit}
                        className="h-8 px-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs flex items-center gap-1"
                    >
                        Continue
                        <ArrowForwardIcon sx={{ fontSize: 14 }} />
                    </Button>
                </div>
            </div>
            <SampleModal
                open={bioSamplesModal}
                onClose={() => setBioSamplesModal(false)}
                onSelectSample={(sample) => {
                    setFormData(prev => ({ ...prev, bio: sample }));
                }}
            />
        </div>
    );
}

export default PersonalInfo;
