import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

function Mainlayout() {
    // Check if the screen is mobile sized (under 900px roughly md breakpoint)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

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