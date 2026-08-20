import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { patchSettingsData } from '../../features/settings/settingsSlice';
import { updateUser } from '../../features/auth/authSlice';
import {
    detectUserCountry,
    validatePhoneNumber,
    COUNTRY_MAP,
} from '../../utils/localizationUtils';

// Height of the sticky navbar — used to offset smooth-scroll so headings
// aren't hidden behind the bar. Matches Navbar.jsx minHeight: 64px.
// const NAVBAR_HEIGHT = 64;

function Setting() {
    const dispatch = useDispatch();

    const { settingsData, loading: settingsLoading, saving: settingsSaving, notificationsSaving } = useSelector((state) => state.settings);
    const { profile } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);

    const currentUser = { ...authUser, ...profile };

    const [activeTab, setActiveTab] = useState('personal');

    // ── Section refs — one per sidebar menu item ────────────────────────────
    const sectionRefs = useRef({
        personal: null,
        security: null,
        notifications: null,
        subscription: null,
    });
    const contentRef = useRef(null);

    /**
     * Smoothly scrolls to the section that matches `sectionId`, offsetting
     * for the sticky navbar so the heading is never hidden behind it.
     * Also updates the active tab to keep the sidebar highlight in sync.
     */
    const scrollToSection = useCallback((sectionId) => {
        const section = sectionRefs.current[sectionId];
        const container = contentRef.current;

        if (!section || !container) return;

        setActiveTab(sectionId);

        const containerTop = container.getBoundingClientRect().top;
        const sectionTop = section.getBoundingClientRect().top;

        container.scrollTo({
            top: container.scrollTop + (sectionTop - containerTop),
            behavior: 'smooth',
        });
    }, []);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        headline: '',
        country: 'US',
        timezone: '',
        phoneNumber: '',
    });

    const [phoneError, setPhoneError] = useState(null);

    const [notificationPreferences, setNotificationPreferences] = useState({
        courseActivity: true,
        liveSessions: true,
        newsletter: false,
    });

    // Fetch settings data on mount
    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    // Populate state whenever settingsData or currentUser changes
    useEffect(() => {
        if (settingsData) {
            const identity = settingsData.identity || {};
            const contactRegion = settingsData.contactRegion || {};
            const notifs = settingsData.notifications || {};

            const detectedCountry = detectUserCountry(
                contactRegion.country || currentUser.country,
                contactRegion.timezone || currentUser.timezone
            );

            const initialTz = contactRegion.timezone || currentUser.timezone || COUNTRY_MAP[detectedCountry]?.defaultTimezone || '';
            const initialPhone = contactRegion.phoneNumber || currentUser.phoneNumber || currentUser.phone || '';

            setFormData({
                fullName: identity.fullName || currentUser.fullName || currentUser.name || '',
                email: identity.email || currentUser.email || '',
                headline: identity.headline || currentUser.headline || currentUser.bio || '',
                country: detectedCountry,
                timezone: initialTz,
                phoneNumber: initialPhone,
            });

            setNotificationPreferences({
                courseActivity: notifs.courseActivity ?? true,
                liveSessions: notifs.liveSessions ?? true,
                newsletter: notifs.newsletter ?? false,
            });
        } else if (currentUser?.fullName || currentUser?.name || currentUser?.email) {
            const detectedCountry = detectUserCountry(currentUser.country, currentUser.timezone);

            setFormData((prev) => ({
                fullName: currentUser.fullName || currentUser.name || prev.fullName,
                email: currentUser.email || prev.email,
                headline: currentUser.headline || currentUser.bio || prev.headline,
                country: detectedCountry || prev.country,
                phoneNumber: currentUser.phoneNumber || currentUser.phone || prev.phoneNumber,
                timezone: currentUser.timezone || COUNTRY_MAP[detectedCountry]?.defaultTimezone || prev.timezone,
            }));
        }
    }, [settingsData, authUser, profile]);

    // Validate phone number whenever phoneNumber or country changes
    useEffect(() => {
        if (formData.phoneNumber) {
            const valResult = validatePhoneNumber(formData.phoneNumber, formData.country);
            setPhoneError(valResult.error);
        } else {
            setPhoneError(null);
        }
    }, [formData.phoneNumber, formData.country]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'country') {
            const countryData = COUNTRY_MAP[value];
            setFormData((prev) => ({
                ...prev,
                country: value,
                timezone: countryData?.defaultTimezone || prev.timezone,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleNotificationToggle = (key, checked) => {
        setNotificationPreferences((prev) => ({
            ...prev,
            [key]: checked,
        }));
    };

    const handleDiscard = () => {
        if (settingsData) {
            const identity = settingsData.identity || {};
            const contactRegion = settingsData.contactRegion || {};
            const notifs = settingsData.notifications || {};

            const detectedCountry = detectUserCountry(contactRegion.country, contactRegion.timezone);

            setFormData({
                fullName: identity.fullName || '',
                email: identity.email || '',
                headline: identity.headline || '',
                country: detectedCountry,
                timezone: contactRegion.timezone || '',
                phoneNumber: contactRegion.phoneNumber || '',
            });

            setNotificationPreferences({
                courseActivity: notifs.courseActivity ?? true,
                liveSessions: notifs.liveSessions ?? true,
                newsletter: notifs.newsletter ?? false,
            });
        }
        setPhoneError(null);
        toast.info('Changes discarded.');
    };

    const handleSaveAll = async () => {
        // 1. Validate phone number before sending API request
        let finalPhoneNumber = formData.phoneNumber;
        if (formData.phoneNumber) {
            const valResult = validatePhoneNumber(formData.phoneNumber, formData.country);
            if (!valResult.isValid) {
                setPhoneError(valResult.error);
                toast.error(valResult.error || 'Please enter a valid phone number');
                return;
            }
            finalPhoneNumber = valResult.e164Format;
        }

        try {
            // 2. Send complete updated settings payload to backend APIs
            const [settingsRes, notifRes] = await Promise.all([
                dispatch(
                    updateSettingsThunk({
                        fullName: formData.fullName,
                        email: formData.email,
                        headline: formData.headline,
                        country: formData.country,
                        timezone: formData.timezone,
                        phoneNumber: finalPhoneNumber,
                    })
                ).unwrap(),
                dispatch(
                    updateNotificationPreferencesThunk(notificationPreferences)
                ).unwrap(),
            ]);

            // 3. Update Redux auth user & persistence on success
            const updatedUser = {
                ...currentUser,
                fullName: formData.fullName,
                name: formData.fullName,
                email: formData.email,
                headline: formData.headline,
                country: formData.country,
                phoneNumber: finalPhoneNumber,
                timezone: formData.timezone,
            };

            dispatch(updateUser(updatedUser));

            // 4. Persist the updated settings values to localStorage via the
            //    settings slice. This ensures the data survives page refresh
            //    even when the API response body doesn't echo back every field.
            dispatch(
                patchSettingsData({
                    identity: {
                        fullName: formData.fullName,
                        email: formData.email,
                        headline: formData.headline,
                    },
                    contactRegion: {
                        country: formData.country,
                        timezone: formData.timezone,
                        phoneNumber: finalPhoneNumber,
                    },
                    notifications: notificationPreferences,
                })
            );

            setPhoneError(null);

            const successMsg = settingsRes?.message || notifRes?.message || 'Settings updated successfully';
            toast.success(successMsg);
        } catch (err) {
            // 4. On failure: show actual backend error & preserve unsaved changes in UI
            const errorMsg = typeof err === 'string' ? err : err?.message || 'Failed to save settings updates.';
            toast.error(errorMsg);
        }
    };

    // Combine user & API identity for header card
    const headerUser = {
        ...currentUser,
        ...(settingsData?.identity || {}),
        fullName: formData.fullName || settingsData?.identity?.fullName || currentUser.fullName,
    };

    const isSaving = settingsLoading || settingsSaving || notificationsSaving;

    return (
        <div className="w-full min-h-screen bg-[#0F1015] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-10 font-[Manrope]">
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Settings Left Sidebar */}
                <div className="lg:sticky lg:top-20 lg:self-start">
                    <SettingsSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onScrollTo={scrollToSection}
                    />
                </div>

                {/* Main Settings Content Column */}
                <div
                    ref={contentRef}
                    className="flex-1 min-w-0 lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto"
                >
                    <div className="flex flex-col gap-6">
                        {/* Top Profile Header Card */}
                        <ProfileHeaderCard
                            user={headerUser}
                            onEditAvatar={() => toast.info('Avatar upload modal opened')}
                            onViewPublicProfile={() => toast.info('Navigating to public profile')}
                        />

                        {/* ── Personal Information section ── */}
                        <div
                            ref={(el) => { sectionRefs.current.personal = el; }}
                            id="section-personal"
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <IdentityDetailsCard values={formData} onChange={handleFormChange} />
                            <ContactRegionCard
                                values={formData}
                                onChange={handleFormChange}
                                phoneError={phoneError}
                            />
                        </div>

                        {/* ── Account Security section ── */}
                        <div
                            ref={(el) => { sectionRefs.current.security = el; }}
                            id="section-security"
                        >
                            <AccountSecurityCard
                                security={settingsData?.security}
                                onUpdatePassword={() => toast.info('Password update requested')}
                                onManage2FA={() => toast.info('Opening 2FA management')}
                            />
                        </div>

                        {/* ── Notifications section ── */}
                        <div
                            ref={(el) => { sectionRefs.current.notifications = el; }}
                            id="section-notifications"
                        >
                            <NotificationPreferencesCard
                                preferences={notificationPreferences}
                                onToggle={handleNotificationToggle}
                            />
                        </div>

                        {/* ── Subscription Plan section ── */}
                        <div
                            ref={(el) => { sectionRefs.current.subscription = el; }}
                            id="section-subscription"
                        >
                            <SubscriptionPlanCard
                                subscription={settingsData?.subscription}
                                countryCode={formData.country}
                                onChangePlan={() => toast.info('Change plan modal opened')}
                                onCancelSubscription={() => toast.warning('Cancel subscription requested')}
                            />
                        </div>

                        {/* Bottom Action Bar */}
                        <SettingsActionBar
                            onDiscard={handleDiscard}
                            onSave={handleSaveAll}
                            loading={isSaving}
                        />
                    </div>
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