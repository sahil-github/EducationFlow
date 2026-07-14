import Login from '../pages/auth/login'
import SignUp from '../pages/auth/signup'
import Home from '../pages/features/Home'
import PersonalInfo from '../pages/features/PersonalInfo'
import LearningGoals from '../pages/features/LearningGoals'
import Interests from '../pages/features/Interest'
import SkillAssessment from '../pages/features/SkillAssesment'
import Review from '../pages/features/Review'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import Mainlayout from '../layout/Mainlayout';
import Authlayout from '../layout/Authlayout';

export const ROUTES = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    HOME: '/home',
    PERSONAL_INFO: '/personal-info',
    LEARNING_GOALS: '/learning-goals',
    INTERESTS: '/interests',
    SKILL_ASSESSMENT: '/skill-assessment',
    REVIEW: '/review',
};

const isFullyOnboarded = () => {
    const user = JSON.parse(localStorage.getItem('current_user'));
    return !!(user && user.onboardingCompleted);
};

const RequireAuth = () => {
    const session = localStorage.getItem('current_user');
    if (!session) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

const OnboardingGuard = () => {
    const location = useLocation();
    const currentUser = JSON.parse(localStorage.getItem('current_user')) || {};

    if (isFullyOnboarded()) {
        return <Navigate to="/home" replace />;
    }

    const path = location.pathname;
    
    if (path === '/learning-goals' && (!currentUser.name || !currentUser.location)) {
        return <Navigate to="/personal-info" replace />;
    }
    if (path === '/interests' && (!currentUser.learningGoal || (Array.isArray(currentUser.learningGoal) && currentUser.learningGoal.length === 0))) {
        return <Navigate to="/learning-goals" replace />;
    }
    if (path === '/skill-assessment' && (!currentUser.interests || currentUser.interests.length === 0)) {
        return <Navigate to="/interests" replace />;
    }
    if (path === '/review' && !currentUser.skills) {
        return <Navigate to="/skill-assessment" replace />;
    }

    return <Outlet />;
};

function AppRoutes() {
    return (
        <>
            <Router>
                <Routes>
                    <Route element={<Authlayout />}>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Route>

                    <Route element={<RequireAuth />}>
                        <Route element={<Mainlayout />}>
                            <Route path="/home" element={<Home />} />
                            
                            <Route element={<OnboardingGuard />}>
                                <Route path="/personal-info" element={<PersonalInfo />} />
                                <Route path="/learning-goals" element={<LearningGoals />} />
                                <Route path="/interests" element={<Interests />} />
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
