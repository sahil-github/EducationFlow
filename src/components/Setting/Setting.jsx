import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SettingsSidebar, { SETTINGS_SECTIONS } from './SettingsSidebar';
import MobileSettingsNavigator from './MobileSettingsNavigator';
import ProfileHeaderCard from './ProfileHeaderCard';
import IdentityDetailsCard from './IdentityDetailsCard';
import ContactRegionCard from './ContactRegionCard';
import GoalsCard from './GoalsCard';
import InterestsCard from './InterestsCard';
import SkillsCard from './SkillsCard';
import ItemSelectorModal from './ItemSelectorModal';
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
    patchProfile,
} from '../../features/profile/profileSlice';
import {
    updateGoals,
    updateInterests,
    updateSkills,
} from '../../features/profile/profileThunks';
import {
    detectUserCountry,
    validatePhoneNumber,
    COUNTRY_MAP,
} from '../../utils/localizationUtils';
import {
    DEFAULT_GOALS,
    DEFAULT_INTERESTS,
    DEFAULT_SKILLS,
} from '../../constants/constants';
import profileApi from '../../api/profileApi';

// Height of the sticky navbar — used to offset smooth-scroll so section
// headings are never hidden behind it on desktop. Matches Navbar.jsx minHeight: 64px.
const NAVBAR_HEIGHT = 64;
// Extra breathing room above the section heading on desktop
const SCROLL_OFFSET = 16;

// ── Normalization Helpers ──────────────────────────────────────────────────
const normalizeGoals = (rawGoals) => {
    if (!rawGoals) return [];
    if (Array.isArray(rawGoals)) {
        return rawGoals
            .map((item) => {
                if (typeof item === 'string') return item.trim();
                return item?.name || item?.value || item?.title || item?.id || '';
            })
            .filter(Boolean);
    }
    return [];
};

const normalizeInterests = (rawInterests) => {
    if (!rawInterests) return [];
    if (Array.isArray(rawInterests)) {
        return rawInterests
            .map((item) => {
                if (typeof item === 'string') return item.trim();
                return item?.name || item?.exname || item?.title || item?.id || '';
            })
            .filter(Boolean);
    }
    return [];
};

const normalizeSkills = (rawSkills) => {
    if (!rawSkills) return [];
    if (Array.isArray(rawSkills)) {
        return rawSkills
            .map((item) => {
                if (typeof item === 'string') return item.trim();
                return item?.name || item?.title || item?.id || '';
            })
            .filter(Boolean);
    }
    return [];
};

function Setting() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { settingsData, loading: settingsLoading, saving: settingsSaving, notificationsSaving } = useSelector((state) => state.settings);
    const { profile, loading: profileLoading } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);

    const currentUser = { ...authUser, ...profile };

    const location = useLocation();
    const [activeTab, setActiveTab] = useState('personal');

    // ── Section refs — one per sidebar menu item (used for desktop smooth scroll) ──
    const sectionRefs = useRef({
        personal: null,
        security: null,
        notifications: null,
        subscription: null,
    });

    /**
     * Desktop scroll handler:
     * Smoothly scrolls the window to the section that matches `sectionId`,
     * offsetting for the sticky navbar height.
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

    /**
     * Listen to location.search changes (e.g. ?section=security) to update active tab and scroll to section.
     */
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const sec = searchParams.get('section');
        if (sec && ['personal', 'security', 'notifications', 'subscription'].includes(sec)) {
            setActiveTab(sec);
            if (sectionRefs.current[sec]) {
                const top =
                    sectionRefs.current[sec].getBoundingClientRect().top +
                    window.scrollY -
                    NAVBAR_HEIGHT -
                    SCROLL_OFFSET;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    }, [location.search]);

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

    // ── Goals, Interests & Skills State ─────────────────────────────────────
    const [goals, setGoals] = useState([]);
    const [interests, setInterests] = useState([]);
    const [skills, setSkills] = useState([]);

    // Modal Visibility State
    const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
    const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);

    // Modal Saving Loaders
    const [isSavingGoals, setIsSavingGoals] = useState(false);
    const [isSavingInterests, setIsSavingInterests] = useState(false);
    const [isSavingSkills, setIsSavingSkills] = useState(false);

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

        // Populate Goals, Interests, and Skills from profile / settingsData / authUser
        const rawGoals = profile?.goals || profile?.learningGoal || settingsData?.goals || currentUser.goals || currentUser.learningGoal;
        const rawInterests = profile?.interests || settingsData?.interests || currentUser.interests;
        const rawSkills = profile?.skills || settingsData?.skills || currentUser.skills;

        setGoals(normalizeGoals(rawGoals));
        setInterests(normalizeInterests(rawInterests));
        setSkills(normalizeSkills(rawSkills));
    }, [settingsData, authUser, profile]);

    // Validate phone number whenever phoneNumber or country changes (real-time feedback).
    useEffect(() => {
        const trimmed = formData.phoneNumber?.trim();
        if (trimmed) {
            const valResult = validatePhoneNumber(trimmed, formData.country);
            setPhoneError(valResult.error);
        } else {
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
                    newPhoneNumber = valResult.nationalNumber || currentPhone;
                } else {
                    newPhoneNumber = '';
                }
            }
            setPhoneError(null);

            setFormData((prev) => ({
                ...prev,
                country: newCountry,
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

    // ── Goals Handler (Save / Remove) ───────────────────────────────────────
    const handleSaveGoals = async (newGoals) => {
        setIsSavingGoals(true);
        try {
            await dispatch(updateGoals(newGoals)).unwrap();
            setGoals(newGoals);
            dispatch(patchProfile({ goals: newGoals, learningGoal: newGoals }));
            dispatch(updateUser({ ...currentUser, goals: newGoals, learningGoal: newGoals }));
            setIsGoalsModalOpen(false);
            toast.success("Learning goals updated successfully");
        } catch (err) {
            toast.error(typeof err === 'string' ? err : err?.message || "Failed to save learning goals");
        } finally {
            setIsSavingGoals(false);
        }
    };

    const handleRemoveGoal = async (goalToRemove) => {
        const goalName = typeof goalToRemove === 'string' ? goalToRemove : goalToRemove?.name || goalToRemove?.value || goalToRemove?.id;
        const updated = goals.filter((g) => {
            const name = typeof g === 'string' ? g : g?.name || g?.value || g?.id;
            return name !== goalName;
        });
        await handleSaveGoals(updated);
    };

    // ── Interests Handler (Save / Remove) ───────────────────────────────────
    const handleSaveInterests = async (newInterests) => {
        setIsSavingInterests(true);
        try {
            const payload = newInterests.map((item, idx) => ({ id: idx + 1, name: item }));
            await dispatch(updateInterests(payload)).unwrap();
            setInterests(newInterests);
            dispatch(patchProfile({ interests: payload }));
            dispatch(updateUser({ ...currentUser, interests: payload }));
            setIsInterestsModalOpen(false);
            toast.success("Interests updated successfully");
        } catch (err) {
            toast.error(typeof err === 'string' ? err : err?.message || "Failed to save interests");
        } finally {
            setIsSavingInterests(false);
        }
    };

    const handleRemoveInterest = async (interestToRemove) => {
        const intName = typeof interestToRemove === 'string' ? interestToRemove : interestToRemove?.name || interestToRemove?.exname || interestToRemove?.id;
        const updated = interests.filter((i) => {
            const name = typeof i === 'string' ? i : i?.name || i?.exname || i?.id;
            return name !== intName;
        });
        await handleSaveInterests(updated);
    };

    // ── Skills Handler (Save / Remove) ──────────────────────────────────────
    const handleSaveSkills = async (newSkills) => {
        setIsSavingSkills(true);
        try {
            const payload = newSkills.map((item) => ({ id: item, name: item, level: 70 }));
            await dispatch(updateSkills(payload)).unwrap();
            setSkills(newSkills);
            dispatch(patchProfile({ skills: payload }));
            dispatch(updateUser({ ...currentUser, skills: payload }));
            setIsSkillsModalOpen(false);
            toast.success("Skills & expertise updated successfully");
        } catch (err) {
            toast.error(typeof err === 'string' ? err : err?.message || "Failed to save skills");
        } finally {
            setIsSavingSkills(false);
        }
    };

    const handleRemoveSkill = async (skillToRemove) => {
        const skillName = typeof skillToRemove === 'string' ? skillToRemove : skillToRemove?.name || skillToRemove?.id || skillToRemove?.title;
        const updated = skills.filter((s) => {
            const name = typeof s === 'string' ? s : s?.name || s?.id || s?.title;
            return name !== skillName;
        });
        await handleSaveSkills(updated);
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

        // Restore Goals, Interests, and Skills
        const rawGoals = profile?.goals || profile?.learningGoal || currentUser.goals || currentUser.learningGoal;
        const rawInterests = profile?.interests || currentUser.interests;
        const rawSkills = profile?.skills || currentUser.skills;

        setGoals(normalizeGoals(rawGoals));
        setInterests(normalizeInterests(rawInterests));
        setSkills(normalizeSkills(rawSkills));

        // Also discard any unsaved avatar selection
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
            setAvatarFile(null);
        }
        setPhoneError(null);
        toast.info('Changes discarded.');
    };

    // ── Avatar selection handler ────────────────────────────────────────────
    const handleAvatarChange = useCallback((file, previewUrl) => {
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
        setAvatarFile(file);
        setAvatarPreview(previewUrl);
    }, [avatarPreview]);

    // ── Cleanup blob URL on unmount ─────────────────────────────────────────
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
            // 2. Upload avatar if a new image was selected
            if (avatarFile) {
                try {
                    const avatarRes = await profileApi.uploadAvatarFile(avatarFile);
                    const newAvatarUrl =
                        avatarRes?.data?.data?.avatarUrl ||
                        avatarRes?.data?.avatarUrl ||
                        avatarRes?.avatarUrl;

                    if (newAvatarUrl) {
                        dispatch(patchProfile({ avatarUrl: newAvatarUrl }));
                        dispatch(updateUser({ ...currentUser, avatarUrl: newAvatarUrl }));
                    }
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

            // 5. Persist the updated settings values
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
        avatarUrl: avatarPreview || currentUser.avatarUrl || currentUser.avatar,
    };

    const isSaving = settingsLoading || settingsSaving || notificationsSaving;

    // ── Section Render Helpers ──────────────────────────────────────────────
    const renderPersonalInformation = () => (
        <div className="flex flex-col gap-6">
            <ProfileHeaderCard
                user={headerUser}
                onAvatarChange={handleAvatarChange}
                onViewPublicProfile={() => navigate('/profile')}
            />

            {/* Identity Details & Contact Region */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <IdentityDetailsCard values={formData} onChange={handleFormChange} />
                <ContactRegionCard
                    values={formData}
                    onChange={handleFormChange}
                    phoneError={phoneError}
                />
            </div>

            {/* Goals & Interests (2 Columns on tablet/desktop, stacked on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GoalsCard
                    goals={goals}
                    onEdit={() => setIsGoalsModalOpen(true)}
                    onRemoveGoal={handleRemoveGoal}
                    loading={profileLoading || isSavingGoals}
                />
                <InterestsCard
                    interests={interests}
                    onEdit={() => setIsInterestsModalOpen(true)}
                    onRemoveInterest={handleRemoveInterest}
                    loading={profileLoading || isSavingInterests}
                />
            </div>

            {/* Skills & Expertise (Full Width Card) */}
            <SkillsCard
                skills={skills}
                onEdit={() => setIsSkillsModalOpen(true)}
                onRemoveSkill={handleRemoveSkill}
                loading={profileLoading || isSavingSkills}
            />
        </div>
    );

    const renderAccountSecurity = () => (
        <AccountSecurityCard
            security={settingsData?.security}
            onUpdatePassword={() => toast.info('Password update requested')}
            onManage2FA={() => toast.info('Opening 2FA management')}
        />
    );

    const renderNotifications = () => (
        <NotificationPreferencesCard
            preferences={notificationPreferences}
            onToggle={handleNotificationToggle}
        />
    );

    const renderSubscriptionPlan = () => (
        <SubscriptionPlanCard
            subscription={settingsData?.subscription}
            countryCode={formData.country}
            onChangePlan={() => toast.info('Change plan modal opened')}
            onCancelSubscription={() => toast.warning('Cancel subscription requested')}
        />
    );

    return (
        <div className="w-full min-h-screen text-white flex flex-col justify-between py-2 sm:py-4 font-[Manrope]">
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
                {/* Header Title */}
                <div className="mb-2">
                    <h1 className="text-white text-2xl md:text-3xl font-bold mb-1">Settings</h1>
                    <p className="text-[#94A3B8] text-sm">Manage your profile information, security, notifications, and subscription preferences.</p>
                </div>

                {/* ── Main Settings Content Column ── */}
                <div className="flex-1 min-w-0">
                    {/* ── Desktop Multi-Section View (All sections rendered in sequence for smooth scrolling) ── */}
                    <div className="hidden lg:flex flex-col gap-6">
                        {/* ── 1. Personal Information section ── */}
                        <div
                            ref={(el) => { sectionRefs.current.personal = el; }}
                            id="section-personal"
                        >
                            {renderPersonalInformation()}
                        </div>

                        {/* ── 2. Account Security section ── */}
                        <div
                            ref={(el) => { sectionRefs.current.security = el; }}
                            id="section-security"
                        >
                            {renderAccountSecurity()}
                        </div>

                        {/* ── 3. Notifications section ── */}
                        <div
                            ref={(el) => { sectionRefs.current.notifications = el; }}
                            id="section-notifications"
                        >
                            {renderNotifications()}
                        </div>

                        {/* ── 4. Subscription Plan section ── */}
                        <div
                            ref={(el) => { sectionRefs.current.subscription = el; }}
                            id="section-subscription"
                        >
                            {renderSubscriptionPlan()}
                        </div>

                        {/* Bottom Action Bar */}
                        <SettingsActionBar
                            onDiscard={handleDiscard}
                            onSave={handleSaveAll}
                            loading={isSaving}
                        />
                    </div>

                    {/* ── Mobile Section View (Only the active section is rendered) ── */}
                    <div className="flex lg:hidden flex-col gap-6">
                        {activeTab === 'personal' && renderPersonalInformation()}
                        {activeTab === 'security' && renderAccountSecurity()}
                        {activeTab === 'notifications' && renderNotifications()}
                        {activeTab === 'subscription' && renderSubscriptionPlan()}

                        {/* Bottom Action Bar */}
                        <SettingsActionBar
                            onDiscard={handleDiscard}
                            onSave={handleSaveAll}
                            loading={isSaving}
                        />
                    </div>
                </div>
            </div>

            {/* ── Edit Modals ──────────────────────────────────────────────── */}
            {/* 1. Goals Modal */}
            <ItemSelectorModal
                isOpen={isGoalsModalOpen}
                onClose={() => setIsGoalsModalOpen(false)}
                onSave={handleSaveGoals}
                title="Edit Learning Goals"
                subtitle="Update your primary learning objectives and goals"
                initialItems={goals}
                availableItems={DEFAULT_GOALS}
                allowCustom={true}
                saving={isSavingGoals}
            />

            {/* 2. Interests Modal */}
            <ItemSelectorModal
                isOpen={isInterestsModalOpen}
                onClose={() => setIsInterestsModalOpen(false)}
                onSave={handleSaveInterests}
                title="Edit Areas of Interest"
                subtitle="Update your topics and areas of interest"
                initialItems={interests}
                availableItems={DEFAULT_INTERESTS}
                allowCustom={true}
                saving={isSavingInterests}
            />

            {/* 3. Skills & Expertise Modal (Matches Reference Screenshot) */}
            <ItemSelectorModal
                isOpen={isSkillsModalOpen}
                onClose={() => setIsSkillsModalOpen(false)}
                onSave={handleSaveSkills}
                title="Edit Skills & Expertise"
                subtitle="Update your skills & expertise"
                initialItems={skills}
                availableItems={DEFAULT_SKILLS}
                allowCustom={true}
                saving={isSavingSkills}
            />

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