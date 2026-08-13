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
import {
    fetchSettings,
    updateSettingsThunk,
    updateNotificationPreferencesThunk,
} from '../../features/settings/settingsThunks';
import { updateUser } from '../../features/auth/authSlice';

function Setting() {
    const dispatch = useDispatch();

    const { settingsData, loading: settingsLoading, saving: settingsSaving } = useSelector((state) => state.settings);
    const { profile } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);

    const currentUser = { ...authUser, ...profile };

    const [activeTab, setActiveTab] = useState('personal');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        headline: '',
        timezone: '',
        phoneNumber: '',
    });

    const [notificationPreferences, setNotificationPreferences] = useState({
        courseActivity: true,
        liveSessions: true,
        newsletter: false,
    });

    // Fetch settings data on mount
    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    // Populate state whenever settingsData changes
    useEffect(() => {
        if (settingsData) {
            const identity = settingsData.identity || {};
            const contactRegion = settingsData.contactRegion || {};
            const notifs = settingsData.notifications || {};

            setFormData({
                fullName: identity.fullName || currentUser.fullName || currentUser.name || '',
                email: identity.email || currentUser.email || '',
                headline: identity.headline || currentUser.headline || currentUser.bio || '',
                timezone: contactRegion.timezone || currentUser.timezone || '',
                phoneNumber: contactRegion.phoneNumber || currentUser.phoneNumber || currentUser.phone || '',
            });

            setNotificationPreferences({
                courseActivity: notifs.courseActivity ?? true,
                liveSessions: notifs.liveSessions ?? true,
                newsletter: notifs.newsletter ?? false,
            });
        } else if (currentUser?.fullName || currentUser?.name || currentUser?.email) {
            setFormData((prev) => ({
                fullName: currentUser.fullName || currentUser.name || prev.fullName,
                email: currentUser.email || prev.email,
                headline: currentUser.headline || currentUser.bio || prev.headline,
                phoneNumber: currentUser.phoneNumber || currentUser.phone || prev.phoneNumber,
                timezone: currentUser.timezone || prev.timezone,
            }));
        }
    }, [settingsData, authUser, profile]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNotificationToggle = async (key, checked) => {
        const updatedNotifs = { ...notificationPreferences, [key]: checked };
        setNotificationPreferences(updatedNotifs);

        try {
            const res = await dispatch(updateNotificationPreferencesThunk(updatedNotifs)).unwrap();
            toast.success(res.message || 'Notification preferences updated');
        } catch (err) {
            // Revert state on error
            setNotificationPreferences(notificationPreferences);
            toast.error(err || 'Failed to update notification preferences');
        }
    };

    const handleDiscard = () => {
        if (settingsData) {
            const identity = settingsData.identity || {};
            const contactRegion = settingsData.contactRegion || {};
            const notifs = settingsData.notifications || {};

            setFormData({
                fullName: identity.fullName || '',
                email: identity.email || '',
                headline: identity.headline || '',
                timezone: contactRegion.timezone || '',
                phoneNumber: contactRegion.phoneNumber || '',
            });

            setNotificationPreferences({
                courseActivity: notifs.courseActivity ?? true,
                liveSessions: notifs.liveSessions ?? true,
                newsletter: notifs.newsletter ?? false,
            });
        }
        toast.info('Changes discarded.');
    };

    const handleSaveAll = async () => {
        try {
            const res = await dispatch(
                updateSettingsThunk({
                    fullName: formData.fullName,
                    headline: formData.headline,
                    timezone: formData.timezone,
                    phoneNumber: formData.phoneNumber,
                })
            ).unwrap();

            const updatedUser = {
                ...currentUser,
                fullName: formData.fullName,
                name: formData.fullName,
                headline: formData.headline,
                phoneNumber: formData.phoneNumber,
                timezone: formData.timezone,
            };

            dispatch(updateUser(updatedUser));
            toast.success(res.message || 'Profile & Settings updated successfully');
        } catch (err) {
            toast.error(err || 'Failed to save settings updates.');
        }
    };

    // Combine user & API identity for header card
    const headerUser = {
        ...currentUser,
        ...(settingsData?.identity || {}),
        fullName: formData.fullName || settingsData?.identity?.fullName || currentUser.fullName,
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
                        user={headerUser}
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
                        security={settingsData?.security}
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
                        subscription={settingsData?.subscription}
                        onChangePlan={() => toast.info('Change plan modal opened')}
                        onCancelSubscription={() => toast.warning('Cancel subscription requested')}
                    />

                    {/* Bottom Action Bar */}
                    <SettingsActionBar
                        onDiscard={handleDiscard}
                        onSave={handleSaveAll}
                        loading={settingsLoading || settingsSaving}
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