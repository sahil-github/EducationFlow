import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import dashboardReducer from '../features/dashboard/dashSlice';
import coursesReducer from '../features/courses/coursesSlice';
import myLearningReducer from '../features/myLearning/myLearningSlice';
import settingsReducer from '../features/settings/settingsSlice';
import cartReducer from '../features/addtoCart/cartSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        dashboard: dashboardReducer,
        courses: coursesReducer,
        myLearning: myLearningReducer,
        settings: settingsReducer,
        cart: cartReducer,
    }
});


