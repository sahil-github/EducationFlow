import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Auth Pages
import Login from '../pages/auth/login';
import SignUp from '../pages/auth/signup';
import ForgotPassword from '../pages/auth/forgotPassword';

// Main App Pages
import Dashboard from '../pages/Dashboard/Dashboard';
import Catalog from '../pages/Catalog/Catalog';
import CourseDetails from '../pages/Catalog/CourseDetails';
import CoursePlayer from '../pages/Catalog/CoursePlayer';
import MyLearning from '../pages/MyLearning/MyLearning';
import Setting from '../components/Setting/Setting';
import Profile from '../pages/Profile/Profile';
import Cart from '../components/Cart';
import PaymentProcessing from '../components/PaymentProcessing';
import PaymentSuccess from '../components/PaymentSuccess';
import PaymentFailed from '../components/PaymentFailed';
import Notification from '../components/Notification';
import IntroMylearning from '../pages/MyLearning/IntroMylearning';
import Certificates from '../pages/Certificate/Certificate';
import CertificateDetails from '../pages/Certificate/CertificateDetails';

// Quiz Pages
import QuizDashboard from '../pages/quizzes/QuizDashboard';
import QuizInstructions from '../pages/quizzes/QuizInstructions';
import QuizAttempt from '../pages/quizzes/QuizAttempt';
import QuizResult from '../pages/quizzes/QuizResult';
import QuizeReview from '../pages/quizzes/QuizeReview';

// Onboarding Pages
import PersonalInfo from '../pages/onboarding/PersonalInfo/PersonalInfo';
import Interests from '../pages/onboarding/Interest/Interest';
import LearningGoals from '../pages/onboarding/learning goals/LearningGoals';
import SkillAssessment from '../pages/onboarding/SkillAssessment/SkillAssesment';
import Review from '../pages/onboarding/Review';

// Layouts & Components
import Mainlayout from '../layout/Mainlayout';
import Authlayout from '../layout/Authlayout';
import FullScreenLoader from '../components/FullScreenLoader';
import { getCurrentUser } from '../utils/storage';

// Thunks & Actions
import { getProfile } from '../features/profile/profileThunks';
import { setAuthInitialized, updateUser } from '../features/auth/authSlice';

export const ROUTES = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/dashboard',
    PERSONAL_INFO: '/personal-info',
    LEARNING_GOALS: '/learning-goals',
    INTERESTS: '/interests',
    SKILL_ASSESSMENT: '/skill-assessment',
    REVIEW: '/review',
    FORGOT_PASSWORD: '/forgot-password',
};

/**
 * Check if the user has completed the onboarding flow.
 * Considers both live profile and auth user fields.
 */
export const checkIsOnboarded = (user, profile) => {
    const flag =
        profile?.isOnboarded ??
        profile?.onboardingCompleted ??
        user?.isOnboarded ??
        user?.onboardingCompleted;

    return flag === true || String(flag) === 'true';
};

/**
 * Determine the exact onboarding sub-route based on the user's progress.
 */
export const resolveOnboardingStep = (user, profile) => {
    const step = profile?.onboardingStep ?? user?.onboardingStep;
    switch (step) {
        case 1:
            return '/personal-info';
        case 2:
            return '/interests';
        case 3:
            return '/learning-goals';
        case 4:
            return '/skill-assessment';
        case 5:
            return '/review';
        default:
            return '/personal-info';
    }
};

/**
 * PublicOnlyGuard:
 * Prevents authenticated users from landing on /login, /signup, or /forgot-password.
 * While auth is initializing, displays the FullScreenLoader to prevent frame flashing.
 */
const PublicOnlyGuard = () => {
    const { token, user, authInitialized } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);

    if (!authInitialized) {
        return <FullScreenLoader message="Checking authentication..." />;
    }

    const authenticated = !!(token && (user?.email || profile?.email || user?._id || profile?._id || user?.id));
    const isOnboarded = checkIsOnboarded(user, profile);

    if (authenticated) {
        return isOnboarded ? (
            <Navigate to="/dashboard" replace />
        ) : (
            <Navigate to={resolveOnboardingStep(user, profile)} replace />
        );
    }

    return <Outlet />;
};

/**
 * RequireAuth:
 * Blocks unauthenticated users from entering protected routes.
 * While auth state is initializing, displays FullScreenLoader instead of rendering protected pages.
 */
const RequireAuth = () => {
    const { token, user, authInitialized } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);

    if (!authInitialized) {
        return <FullScreenLoader message="Verifying session..." />;
    }

    const authenticated = !!(token && (user?.email || profile?.email || user?._id || profile?._id || user?.id));

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

/**
 * RequireCompletedOnboarding:
 * Ensures only users who have finalized onboarding can access the Dashboard and core pages.
 * Prevents any 1-frame rendering of Dashboard for new/incomplete users.
 */
const RequireCompletedOnboarding = () => {
    const { user, authInitialized } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);

    if (!authInitialized) {
        return <FullScreenLoader message="Loading your workspace..." />;
    }

    const isOnboarded = checkIsOnboarded(user, profile);

    if (!isOnboarded) {
        return <Navigate to={resolveOnboardingStep(user, profile)} replace />;
    }

    return <Outlet />;
};

/**
 * OnboardingGuard:
 * Protects onboarding sub-routes and ensures step sequencing.
 * If user is already onboarded, routes immediately to Dashboard.
 */
const OnboardingGuard = () => {
    const { user, authInitialized } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const location = useLocation();

    if (!authInitialized) {
        return <FullScreenLoader message="Preparing onboarding steps..." />;
    }

    const isOnboarded = checkIsOnboarded(user, profile);
    if (isOnboarded) {
        return <Navigate to="/dashboard" replace />;
    }

    const currentUser = { ...getCurrentUser(), ...user, ...profile };
    const path = location.pathname;

    if (
        path === '/interests' &&
        (!(currentUser.fullName || currentUser.name) || !currentUser.location)
    ) {
        return <Navigate to="/personal-info" replace />;
    }

    if (
        path === '/learning-goals' &&
        (!currentUser.interests || currentUser.interests.length === 0)
    ) {
        return <Navigate to="/interests" replace />;
    }

    const hasGoals = (() => {
        const lg = currentUser.learningGoal;
        const g = currentUser.goals;
        const hasLg = Array.isArray(lg) ? lg.length > 0 : Boolean(lg);
        const hasG = Array.isArray(g) ? g.length > 0 : Boolean(g);
        return hasLg || hasG;
    })();

    if (path === '/skill-assessment' && !hasGoals) {
        return <Navigate to="/learning-goals" replace />;
    }

    if (
        path === '/review' &&
        (!currentUser.skills || currentUser.skills.length === 0)
    ) {
        return <Navigate to="/skill-assessment" replace />;
    }

    return <Outlet />;
};

/**
 * Root Router with Session Verification Lifecyle
 */
function AppRoutes() {
    const dispatch = useDispatch();
    const { token, authInitialized } = useSelector((state) => state.auth);

    // Initial session verification & backend profile synchronization on app launch / refresh
    useEffect(() => {
        if (token && !authInitialized) {
            dispatch(getProfile())
                .unwrap()
                .then((profileData) => {
                    if (profileData) {
                        dispatch(updateUser(profileData));
                    }
                })
                .catch(() => {
                    // Handled inside extraReducers (handles 401/expired token)
                })
                .finally(() => {
                    dispatch(setAuthInitialized(true));
                });
        } else if (!token && !authInitialized) {
            dispatch(setAuthInitialized(true));
        }
    }, [token, authInitialized, dispatch]);

    return (
        <Router>
            <Routes>
                {/* Public Auth Routes */}
                <Route element={<PublicOnlyGuard />}>
                    <Route element={<Authlayout />}>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                    </Route>
                </Route>

                {/* Authenticated Routes */}
                <Route element={<RequireAuth />}>
                    <Route element={<Mainlayout />}>
                        {/* Onboarded User Routes (Dashboard & Learning Area) */}
                        <Route element={<RequireCompletedOnboarding />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/catalog" element={<Catalog />} />
                            <Route path="/courses/:id" element={<CourseDetails />} />
                            <Route path="/courses/:id/learn" element={<CoursePlayer />} />
                            <Route path="/my-learning" element={<MyLearning />} />
                            <Route path="/setting" element={<Setting />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/payment-processing" element={<PaymentProcessing />} />
                            <Route path="/payment-success" element={<PaymentSuccess />} />
                            <Route path="/payment-failed" element={<PaymentFailed />} />
                            <Route path="/notification" element={<Notification />} />
                            <Route path="/quizzes" element={<QuizDashboard />} />
                            <Route path="/quizzes/:quizId" element={<QuizInstructions />} />
                            <Route path="/quizzes/:quizId/attempt" element={<QuizAttempt />} />
                            <Route path="/quizzes/:quizId/result" element={<QuizResult />} />
                            <Route path="/quizzes/:quizId/result/review" element={<QuizeReview />} />
                            <Route path="/intro-mylearning" element={<IntroMylearning />} />
                            <Route path="/certificates" element={<Certificates />} />
                            <Route path="/certificate/:id" element={<CertificateDetails />} />
                        </Route>

                        {/* Onboarding Wizard Routes */}
                        <Route element={<OnboardingGuard />}>
                            <Route path="/personal-info" element={<PersonalInfo />} />
                            <Route path="/interests" element={<Interests />} />
                            <Route path="/learning-goals" element={<LearningGoals />} />
                            <Route path="/skill-assessment" element={<SkillAssessment />} />
                            <Route path="/review" element={<Review />} />
                        </Route>
                    </Route>
                </Route>

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
