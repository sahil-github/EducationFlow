import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

function Mainlayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Sidebar open={sidebarOpen} close={setSidebarOpen}>
                <Outlet />
            </Sidebar>
        </>
    );
}

export default Mainlayout;