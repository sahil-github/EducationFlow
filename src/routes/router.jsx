import Login from '../pages/auth/login'
import SignUp from '../pages/auth/signup'
import Home from '../pages/features/Home'
import PersonalInfo from '../pages/features/PersonalInfo'
import LearningGoals from '../pages/features/LearningGoals'
import Interests from '../pages/features/Interest'
import SkillAssessment from '../pages/features/SkillAssesment'
import Review from '../pages/features/Review'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
                    <Route path="/home" element={<Home />} />
                    <Route element={<Mainlayout />}>

                        <Route path="/personal-info" element={<PersonalInfo />} />
                        <Route path="/learning-goals" element={<LearningGoals />} />
                        <Route path="/interests" element={<Interests />} />
                        <Route path="/skill-assessment" element={<SkillAssessment />} />
                        <Route path="/review" element={<Review />} />
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default AppRoutes
