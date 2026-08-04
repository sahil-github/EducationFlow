import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../features/profile/profileThunks';

function Mainlayout() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    // Check if the screen is mobile sized (under 900px roughly md breakpoint)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    // Fetch/refresh the backend profile whenever Mainlayout mounts.
    // This handles page refreshes: Redux is in-memory only, so a hard refresh
    // clears state.profile.profile. Re-fetching here ensures route guards
    // always have up-to-date isOnboarded / onboardingStep values.
    useEffect(() => {
        if (token) {
            dispatch(getProfile());
        }
    }, [dispatch, token]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 900;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
                <Outlet />
            </Sidebar>
        </>
    );
}

export default Mainlayout;