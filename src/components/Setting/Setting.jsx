import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SettingsSidebar from './SettingsSidebar';
import ProfileHeaderCard from './ProfileHeaderCard';
import IdentityDetailsCard from './IdentityDetailsCard';
import ContactRegionCard from './ContactRegionCard';
import AccountSecurityCard from './AccountSecurityCard';
import NotificationPreferencesCard from './NotificationPreferencesCard';
import SubscriptionPlanCard from './SubscriptionPlanCard';
import SettingsActionBar from './SettingsActionBar';
import { getProfile, updatePersonalInfo } from '../../features/profile/profileThunks';
import { updateUser } from '../../features/auth/authSlice';

function Setting() {
    const dispatch = useDispatch();
    const { profile, loading: profileLoading } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);

    const currentUser = { ...authUser, ...profile };

    const [activeTab, setActiveTab] = useState('personal');

    const [formData, setFormData] = useState({
        fullName: 'Alex Rivera',
        email: 'alex.rivera@edu-flow.com',
        timezone: 'Central European Time (CET) - UTC+1',
        phoneNumber: '+1 (555) 000-0000',
    });

    const [notificationPreferences, setNotificationPreferences] = useState({
        courseActivity: true,
        liveSessions: true,
        newsletter: false,
    });

    const [saving, setSaving] = useState(false);

    // Sync Redux user state into form state when available
    useEffect(() => {
        if (currentUser?.fullName || currentUser?.name || currentUser?.email) {
            setFormData((prev) => ({
                ...prev,
                fullName: currentUser.fullName || currentUser.name || prev.fullName,
                email: currentUser.email || prev.email,
                phoneNumber: currentUser.phoneNumber || currentUser.phone || prev.phoneNumber,
                timezone: currentUser.timezone || prev.timezone,
            }));
        }
    }, [profile, authUser]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNotificationToggle = (key, checked) => {
        setNotificationPreferences((prev) => ({ ...prev, [key]: checked }));
    };

    const handleDiscard = () => {
        setFormData({
            fullName: currentUser.fullName || currentUser.name || 'Alex Rivera',
            email: currentUser.email || 'alex.rivera@edu-flow.com',
            timezone: currentUser.timezone || 'Central European Time (CET) - UTC+1',
            phoneNumber: currentUser.phoneNumber || currentUser.phone || '+1 (555) 000-0000',
        });
        setNotificationPreferences({
            courseActivity: true,
            liveSessions: true,
            newsletter: false,
        });
        toast.info('Changes discarded.');
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            await dispatch(
                updatePersonalInfo({
                    fullName: formData.fullName,
                    location: currentUser.location || '',
                    bio: currentUser.bio || '',
                    avatarUrl: currentUser.avatarUrl || '',
                })
            ).unwrap();

            const updatedUser = {
                ...currentUser,
                fullName: formData.fullName,
                name: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                timezone: formData.timezone,
            };

            dispatch(updateUser(updatedUser));
            toast.success('Settings updated successfully!');
        } catch (err) {
            toast.error(err || 'Failed to save settings updates.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#0F1015] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-10 font-[Manrope]">
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Settings Left Sidebar */}
                <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Main Settings Content Column */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Top Profile Header Card */}
                    <ProfileHeaderCard
                        user={currentUser}
                        onEditAvatar={() => toast.info('Avatar upload modal opened')}
                        onViewPublicProfile={() => toast.info('Navigating to public profile')}
                    />

                    {/* Identity Details & Contact Region Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <IdentityDetailsCard values={formData} onChange={handleFormChange} />
                        <ContactRegionCard values={formData} onChange={handleFormChange} />
                    </div>

                    {/* Account Security Card */}
                    <AccountSecurityCard
                        onUpdatePassword={() => toast.info('Password update requested')}
                        onManage2FA={() => toast.info('Opening 2FA management')}
                    />

                    {/* Notification Preferences Card */}
                    <NotificationPreferencesCard
                        preferences={notificationPreferences}
                        onToggle={handleNotificationToggle}
                    />

                    {/* Subscription Plan Card */}
                    <SubscriptionPlanCard
                        onChangePlan={() => toast.info('Change plan modal opened')}
                        onCancelSubscription={() => toast.warning('Cancel subscription requested')}
                    />

                    {/* Bottom Action Bar */}
                    <SettingsActionBar
                        onDiscard={handleDiscard}
                        onSave={handleSaveAll}
                        loading={saving || profileLoading}
                    />
                </div>
            </div>

            {/* Page Footer */}
            <footer className="w-full max-w-7xl mx-auto border-t border-white/5 pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#64748B]">
                <div>
                    <span className="font-bold text-white font-[Poppins]">EduFlow</span>
                    <span className="ml-2">© 2024 EduFlow Learning Systems. All rights reserved.</span>
                </div>

                <div className="flex flex-wrap gap-6 text-[#94A3B8]">
                    <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Help Center</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Contact Support</span>
                </div>
            </footer>
        </div>
    );
}

export default Setting;