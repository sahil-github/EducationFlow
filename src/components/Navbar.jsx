import Logo from '../assets/logo/Logo.png';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
function Navbar() {



    return (
        <nav className="sticky top-0 shadow-md">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={Logo} alt="Logo" style={{ width: 36, height: 36 }} />
                    <span style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 700,
                        fontSize: 17,
                        color: '#6366F1',
                        letterSpacing: '0.03em',
                    }}>
                        EduFlow
                    </span>
                </div>
                <div className='cursor-pointer p-3  ' >
                    <div className='flex items-center gap-3'>
                        <NotificationsIcon sx={{ fontSize: 25, }} />
                        <div className='p-2 bg-gray-900/50 rounded-full'>
                            <PersonIcon sx={{ fontSize: 30, color: 'white' }} />
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Navbar