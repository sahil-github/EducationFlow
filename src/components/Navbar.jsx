import { useState, useEffect } from 'react';
import Logo from '../assets/logo/Logo.png';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/store';

function Navbar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

    useEffect(() => {
        const handleUserUpdate = () => {
            setCurrentUser(getCurrentUser());
        };

        window.addEventListener('currentUserUpdate', handleUserUpdate);
        window.addEventListener('storage', handleUserUpdate); // Also listen to cross-tab updates

        return () => {
            window.removeEventListener('currentUserUpdate', handleUserUpdate);
            window.removeEventListener('storage', handleUserUpdate);
        };
    }, []);

    const profileOpen = Boolean(anchorEl);

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('current_user');
        // Do NOT remove 'users', that's the database!
        handleProfileClose();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 shadow-md z-50 bg-[#18181C]">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px'
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
                            sx={{ display: { xs: 'none', md: 'flex' }, color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    )}
                </div>

                {/* Right Side */}
                <div className='cursor-pointer p-3'>

                    {/* Desktop: Notification + Profile Avatar */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                        <NotificationsIcon sx={{ fontSize: 25, color: '#C7C4D8' }} />

                        {/* Profile Avatar Button */}
                        <Box
                            onClick={handleProfileClick}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                cursor: 'pointer',
                                p: '6px 10px',
                                borderRadius: '24px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.10)' },
                                transition: 'background 0.2s',
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 28, height: 28,
                                    bgcolor: '#6366F1',
                                    fontSize: 13,
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 700,
                                }}
                            >
                                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 18 }} />}
                            </Avatar>

                        </Box>
                    </Box>

                    {/* Mobile: Hamburger menu */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
                        {/* Mobile profile icon */}
                        <IconButton
                            onClick={handleProfileClick}
                            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
                        >
                            <Avatar
                                sx={{
                                    width: 28, height: 28,
                                    bgcolor: '#6366F1',
                                    fontSize: 13,
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 700,
                                }}
                            >
                                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 18 }} />}
                            </Avatar>
                        </IconButton>
                        <IconButton
                            onClick={() => setSidebarOpen(true)}
                            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </div>
            </div>

            {/* Profile Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                open={profileOpen}
                onClose={handleProfileClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 150,
                        backgroundColor: '#1E1E2A',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        color: '#fff',
                    }
                }}
            >
                {/* User Info Header */}
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 14, color: '#fff' }}>
                        {currentUser.name || 'User'}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#64748B' }}>
                        {currentUser.email || ''}
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

                {/* Logout Option */}
                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        py: 1.5,
                        px: 2,
                        gap: 1.5,
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: 13,
                        color: '#F87171',
                        '&:hover': { backgroundColor: 'rgba(248,113,113,0.08)' },
                        borderRadius: '0 0 12px 12px',
                    }}
                >
                    <ListItemIcon sx={{ color: '#F87171', minWidth: 'auto' }}>
                        <LogoutIcon fontSize="small" /> Logout
                    </ListItemIcon>

                </MenuItem>
            </Menu>
        </nav>
    );
}

export default Navbar;

