import Login from '../pages/auth/login'
import SignUp from '../pages/auth/signup'
import ForgotPassword from '../pages/auth/forgotPassword'
import Dashboard from '../pages/Dashboard/Dashboard'
import Catalog from '../pages/Catalog/Catalog'
import CourseDetails from '../pages/Catalog/CourseDetails'
import MyLearning from '../pages/MyLearning/MyLearning'
import PersonalInfo from '../pages/onboarding/PersonalInfo/PersonalInfo'
import LearningGoals from '../pages/onboarding/learning goals/LearningGoals'
import Interests from '../pages/onboarding/Interest/Interest'
import SkillAssessment from '../pages/onboarding/SkillAssessment/SkillAssesment'
import Review from '../pages/onboarding/Review'
import Setting from '../components/Setting/Setting'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Mainlayout from '../layout/Mainlayout';
import Authlayout from '../layout/Authlayout';
import { getCurrentUser } from '../utils/storage';

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

// ---------------------------------------------------------------------------
// Route Guards — all use Redux (state.auth) as the single source of truth.
// authSlice initializes from localStorage on app startup, so sessions survive
// page refreshes without guards ever reading localStorage directly.
// ---------------------------------------------------------------------------

const checkIsOnboarded = (user, profile) =>
    Boolean(
        user?.isOnboarded ||
        user?.onboardingCompleted ||
        profile?.isOnboarded ||
        profile?.onboardingCompleted
    );

/**
 * Prevents already-authenticated users from accessing public auth pages.
 * Redirects to /dashboard (onboarded) or /personal-info (not onboarded).
 */
const PublicOnlyGuard = () => {
    const { token, user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const authenticated = !!(token && (user?.email || profile?.email));
    const isOnboarded = checkIsOnboarded(user, profile);

    if (authenticated) {
        return isOnboarded
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/personal-info" replace />;
    }
    return <Outlet />;
};

/**
 * Blocks unauthenticated users from accessing any app route.
 */
const RequireAuth = () => {
    const { token, user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const authenticated = !!(token && (user?.email || profile?.email));

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

/**
 * Blocks users who haven't finished onboarding from accessing dashboard routes.
 */
const RequireCompletedOnboarding = () => {
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const isOnboarded = checkIsOnboarded(user, profile);

    if (!isOnboarded) {
        return <Navigate to="/personal-info" replace />;
    }
    return <Outlet />;
};

const OnboardingGuard = () => {
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const location = useLocation();

    const currentUser = { ...getCurrentUser(), ...user, ...profile };
    const path = location.pathname;
    const isOnboarded = checkIsOnboarded(user, profile);

    if (isOnboarded) {
        return <Navigate to="/dashboard" replace />;
    }

    if (
        path === "/interests" &&
        (!(currentUser.fullName || currentUser.name) || !currentUser.location)
    ) {
        return <Navigate to="/personal-info" replace />;
    }

    if (
        path === "/learning-goals" &&
        (!currentUser.interests || currentUser.interests.length === 0)
    ) {
        return <Navigate to="/interests" replace />;
    }

    if (
        path === "/skill-assessment" &&
        (!currentUser.learningGoal ||
            (Array.isArray(currentUser.learningGoal) &&
                currentUser.learningGoal.length === 0))
    ) {
        return <Navigate to="/learning-goals" replace />;
    }

    if (
        path === "/review" &&
        (!currentUser.skills || currentUser.skills.length === 0)
    ) {
        return <Navigate to="/skill-assessment" replace />;
    }

    return <Outlet />;
};
function AppRoutes() {
    return (
        <>
            <Router>
                <Routes>
                    <Route element={<PublicOnlyGuard />}>
                        <Route element={<Authlayout />}>
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />

                        </Route>
                    </Route>

                    <Route element={<RequireAuth />}>
                        <Route element={<Mainlayout />}>
                            <Route element={<RequireCompletedOnboarding />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path='/catalog' element={<Catalog />}></Route>
                                <Route path="/courses/:id" element={<CourseDetails />} />
                                <Route path='/my-learning' element={<MyLearning />}></Route>
                                <Route path='/setting' element={<Setting />}></Route>
                            </Route>

                            <Route element={<OnboardingGuard />}>
                                <Route path="/personal-info" element={<PersonalInfo />} />
                                <Route path="/interests" element={<Interests />} />
                                <Route path="/learning-goals" element={<LearningGoals />} />
                                <Route path="/skill-assessment" element={<SkillAssessment />} />
                                <Route path="/review" element={<Review />} />
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default AppRoutes
