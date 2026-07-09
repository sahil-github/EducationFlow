// d/my-app/src/components/Navbar.jsx
import Logo from '../assets/logo/Logo.png';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu'; // Added MenuIcon
import { IconButton, Box } from '@mui/material'; // Added Box

function Navbar({ sidebarOpen, setSidebarOpen }) {
    return (
        <nav className="sticky top-0 shadow-md z-50 bg-[#18181C]">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px' // Added padding for spacing
            }}>
                {/* Left Side: Brand Logo, Name, and Collapsed Sidebar Chevron */}
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
                    {!sidebarOpen && (
                        <IconButton
                            onClick={() => setSidebarOpen(true)}
                            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    )}
                </div>


                <div className='cursor-pointer p-3'>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
                        <NotificationsIcon sx={{ fontSize: 25, color: '#C7C4D8' }} />
                        <Box sx={{ p: '8px', bg: 'gray-900/50', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <PersonIcon sx={{ fontSize: 24, color: 'white' }} />
                        </Box>
                    </Box>

                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            onClick={() => setSidebarOpen(true)}
                            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
