import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import dashboardReducer from '../features/dashboard/dashSlice';
import coursesReducer from '../features/courses/coursesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        dashboard: dashboardReducer,
        courses: coursesReducer,
    }
});
