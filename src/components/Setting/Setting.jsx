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
import { patchProfile } from '../../features/profile/profileSlice';
import {
    detectUserCountry,
    validatePhoneNumber,
    COUNTRY_MAP,
} from '../../utils/localizationUtils';
import profileApi from '../../api/profileApi';

// Height of the sticky navbar — used to offset smooth-scroll so section
// headings are never hidden behind it. Matches Navbar.jsx minHeight: 64px.
const NAVBAR_HEIGHT = 64;
// Extra breathing room above the section heading
const SCROLL_OFFSET = 16;

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

    /**
     * Smoothly scrolls the PAGE (window) to the section that matches
     * `sectionId`, offsetting for the sticky navbar height so the heading
     * is never hidden behind it. Also keeps the sidebar highlight in sync.
     */
    const scrollToSection = useCallback((sectionId) => {
        const section = sectionRefs.current[sectionId];
        if (!section) return;

        setActiveTab(sectionId);

        const top =
            section.getBoundingClientRect().top +
            window.scrollY -
            NAVBAR_HEIGHT -
            SCROLL_OFFSET;

        window.scrollTo({ top, behavior: 'smooth' });
    }, []);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        bio: '',
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

    // ── Avatar local state — file + blob preview URL ─────────────────────────
    const [avatarPreview, setAvatarPreview] = useState(null); // ObjectURL string
    const [avatarFile, setAvatarFile] = useState(null);       // File object

    // Fetch settings data on mount
    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    const hasUserEditedForm = useRef(false);

    // Populate state whenever settingsData or currentUser changes (only if user hasn't made active edits)
    useEffect(() => {
        if (hasUserEditedForm.current) {
            return;
        }

        if (settingsData) {
            const identity = settingsData.identity || {};
            const contactRegion = settingsData.contactRegion || {};
            const notifs = settingsData.notifications || {};

            const detectedCountry = detectUserCountry(
                contactRegion.country || currentUser.country,
                contactRegion.timezone || currentUser.timezone
            );

            const initialTz = contactRegion.timezone || currentUser.timezone || COUNTRY_MAP[detectedCountry]?.defaultTimezone || '';
            const rawPhone = contactRegion.phoneNumber ?? currentUser.phoneNumber ?? currentUser.phone ?? '';

            // Validate and sanitize phone number for the detected country
            let initialPhone = '';
            if (rawPhone && String(rawPhone).trim()) {
                const val = validatePhoneNumber(rawPhone, detectedCountry);
                if (val.isValid) {
                    initialPhone = val.nationalNumber || rawPhone;
                }
            }

            setFormData({
                fullName: identity.fullName || currentUser.fullName || currentUser.name || '',
                email: identity.email || currentUser.email || '',
                bio: identity.bio || currentUser.bio || '',
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
        } else if (currentUser?.fullName || currentUser?.name || currentUser?.email || currentUser?.country) {
            const detectedCountry = detectUserCountry(currentUser.country, currentUser.timezone);
            const rawPhone = currentUser.phoneNumber || currentUser.phone || '';
            let initialPhone = '';
            if (rawPhone && String(rawPhone).trim()) {
                const val = validatePhoneNumber(rawPhone, detectedCountry);
                if (val.isValid) {
                    initialPhone = val.nationalNumber || rawPhone;
                }
            }

            setFormData((prev) => ({
                fullName: currentUser.fullName || currentUser.name || prev.fullName,
                email: currentUser.email || prev.email,
                bio: currentUser.bio || prev.bio,
                headline: currentUser.headline || currentUser.bio || prev.headline,
                country: detectedCountry || prev.country,
                phoneNumber: initialPhone,
                timezone: currentUser.timezone || COUNTRY_MAP[detectedCountry]?.defaultTimezone || prev.timezone,
            }));
        }
    }, [settingsData, authUser, profile]);

    // Validate phone number whenever phoneNumber or country changes (real-time feedback).
    // Empty field is not flagged in real-time — that check only happens on Save.
    useEffect(() => {
        const trimmed = formData.phoneNumber?.trim();
        if (trimmed) {
            const valResult = validatePhoneNumber(trimmed, formData.country);
            setPhoneError(valResult.error);
        } else {
            // Clear any existing error when the field is emptied so the user
            // isn't stuck seeing an error until they hit Save.
            setPhoneError(null);
        }
    }, [formData.phoneNumber, formData.country]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        hasUserEditedForm.current = true;
        if (name === 'country') {
            const newCountry = value;
            const countryData = COUNTRY_MAP[newCountry];

            // Revalidate current phone against the newly selected country
            let newPhoneNumber = '';
            const currentPhone = formData.phoneNumber?.trim();
            if (currentPhone) {
                const valResult = validatePhoneNumber(currentPhone, newCountry);
                if (valResult.isValid) {
                    // Valid for the new country -> preserve it
                    newPhoneNumber = valResult.nationalNumber || currentPhone;
                } else {
                    // Invalid for the new country -> clear it immediately!
                    newPhoneNumber = '';
                }
            }
            setPhoneError(null);

            setFormData((prev) => ({
                ...prev,
                country: newCountry,
                // Auto-update timezone to the country's default when country changes
                timezone: countryData?.defaultTimezone || prev.timezone,
                phoneNumber: newPhoneNumber,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleNotificationToggle = (key, checked) => {
        hasUserEditedForm.current = true;
        setNotificationPreferences((prev) => ({
            ...prev,
            [key]: checked,
        }));
    };

    const handleDiscard = () => {
        hasUserEditedForm.current = false;
        if (settingsData) {
            const identity = settingsData.identity || {};
            const contactRegion = settingsData.contactRegion || {};
            const notifs = settingsData.notifications || {};

            const detectedCountry = detectUserCountry(contactRegion.country, contactRegion.timezone);
            const rawPhone = contactRegion.phoneNumber || '';
            let initialPhone = '';
            if (rawPhone && String(rawPhone).trim()) {
                const val = validatePhoneNumber(rawPhone, detectedCountry);
                if (val.isValid) {
                    initialPhone = val.nationalNumber || rawPhone;
                }
            }

            setFormData({
                fullName: identity.fullName || '',
                email: identity.email || '',
                bio: identity.bio || '',
                headline: identity.headline || '',
                country: detectedCountry,
                timezone: contactRegion.timezone || '',
                phoneNumber: initialPhone,
            });

            setNotificationPreferences({
                courseActivity: notifs.courseActivity ?? true,
                liveSessions: notifs.liveSessions ?? true,
                newsletter: notifs.newsletter ?? false,
            });
        }
        // Also discard any unsaved avatar selection
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
            setAvatarFile(null);
        }
        setPhoneError(null);
        toast.info('Changes discarded.');
    };

    // ── Avatar selection handler — triggered by ProfileHeaderCard ────────────
    const handleAvatarChange = useCallback((file, previewUrl) => {
        // Revoke any previous preview to avoid memory leaks
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
        setAvatarFile(file);
        setAvatarPreview(previewUrl);
    }, [avatarPreview]);

    // ── Cleanup blob URL when component unmounts ─────────────────────────────
    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSaveAll = async () => {
        const phoneNumber = formData.phoneNumber?.trim();

        if (!phoneNumber) {
            setPhoneError('Phone number is required');
            toast.error('Phone number is required');
            return;
        }

        const valResult = validatePhoneNumber(phoneNumber, formData.country);
        if (!valResult.isValid) {
            setPhoneError(valResult.error);
            toast.error(valResult.error || 'Please enter a valid phone number');
            return;
        }
        const finalPhoneNumber = valResult.e164Format;

        try {
            // 2. Upload avatar if the user selected a new image
            if (avatarFile) {
                try {
                    const avatarRes = await profileApi.uploadAvatarFile(avatarFile);
                    const newAvatarUrl =
                        avatarRes?.data?.data?.avatarUrl ||
                        avatarRes?.data?.avatarUrl ||
                        avatarRes?.avatarUrl;

                    if (newAvatarUrl) {
                        // Update profile Redux state so avatar persists immediately
                        dispatch(patchProfile({ avatarUrl: newAvatarUrl }));
                        dispatch(updateUser({ ...currentUser, avatarUrl: newAvatarUrl }));
                    }
                    // Clear the pending file — it has been uploaded
                    URL.revokeObjectURL(avatarPreview);
                    setAvatarPreview(null);
                    setAvatarFile(null);
                } catch (avatarErr) {
                    console.warn(
                        '[Settings] Avatar file upload failed — backend may not yet support multipart/form-data.',
                        avatarErr
                    );
                    toast.warning('Avatar could not be saved — backend multipart upload not yet supported.');
                }
            }

            // 3. Send complete updated settings payload to backend APIs
            const [settingsRes, notifRes] = await Promise.all([
                dispatch(
                    updateSettingsThunk({
                        fullName: formData.fullName,
                        email: formData.email,
                        headline: formData.headline,
                        country: formData.country,
                        timezone: formData.timezone,
                        phoneNumber: finalPhoneNumber || null,
                    })
                ).unwrap(),
                dispatch(
                    updateNotificationPreferencesThunk(notificationPreferences)
                ).unwrap(),
            ]);

            // 4. Update Redux auth user & persistence on success
            const updatedUser = {
                ...currentUser,
                fullName: formData.fullName,
                name: formData.fullName,
                email: formData.email,
                headline: formData.headline,
                country: formData.country,
                phoneNumber: finalPhoneNumber || '',
                phone: finalPhoneNumber || '',
                timezone: formData.timezone,
                bio: formData.bio,
            };

            dispatch(updateUser(updatedUser));

            // 5. Persist the updated settings values to localStorage via the
            //    settings slice. This ensures the data survives page refresh.
            dispatch(
                patchSettingsData({
                    identity: {
                        fullName: formData.fullName,
                        email: formData.email,
                        headline: formData.headline,
                        bio: formData.bio,
                    },
                    contactRegion: {
                        country: formData.country,
                        timezone: formData.timezone,
                        phoneNumber: finalPhoneNumber || '',
                    },
                    notifications: notificationPreferences,
                })
            );

            hasUserEditedForm.current = false;
            setPhoneError(null);

            const successMsg = settingsRes?.message || notifRes?.message || 'Settings updated successfully';
            toast.success(successMsg);
        } catch (err) {
            // On failure: show actual backend error & preserve unsaved changes in UI
            const errorMsg = typeof err === 'string' ? err : err?.message || 'Failed to save settings updates.';
            toast.error(errorMsg);
        }
    };

    // Combine user & API identity for header card
    const headerUser = {
        ...currentUser,
        ...(settingsData?.identity || {}),
        fullName: formData.fullName || settingsData?.identity?.fullName || currentUser.fullName,
        bio: formData.bio || settingsData?.identity?.bio || currentUser.bio,
        // Show blob preview if user has selected an image but not yet saved
        avatarUrl: avatarPreview || currentUser.avatarUrl || currentUser.avatar,
    };

    const isSaving = settingsLoading || settingsSaving || notificationsSaving;

    return (
        <div className="w-full min-h-screen bg-[#0F1015] text-white flex flex-col justify-between p-3.5 sm:p-6 lg:p-10 font-[Manrope]">
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-12">
                {/* Settings Left Sidebar — sticky on desktop, never scrolls independently */}
                <div className="lg:sticky lg:top-20 lg:self-start">
                    <SettingsSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onScrollTo={scrollToSection}
                    />
                </div>

                {/* Main Settings Content Column — no inner scroll; page handles scrolling */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-6">
                        {/* Top Profile Header Card */}
                        <ProfileHeaderCard
                            user={headerUser}
                            onAvatarChange={handleAvatarChange}
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