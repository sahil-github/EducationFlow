import { useState, useEffect } from 'react';
import Logo from '../assets/logo/Logo.png';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, Typography, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { getCurrentUser } from '../utils/storage';
import { Search, NotificationsOutlined, SettingsOutlined, LogoutOutlined } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';


function Navbar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

    // Read auth state from Redux — the single source of truth.
    const { token, user } = useSelector((state) => state.auth);
    const showAppNav = !!(token && user?.onboardingCompleted);

    useEffect(() => {
        const handleUserUpdate = () => {
            setCurrentUser(getCurrentUser());
        };

        window.addEventListener('currentUserUpdate', handleUserUpdate);
        window.addEventListener('storage', handleUserUpdate); 

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
        dispatch(logout());
        handleProfileClose();
        navigate('/login');
    };

    // Depending on user state, the hamburger menu should open either the
    // Onboarding Sidebar (via props) OR the Authenticated Mobile Nav (local state)
    const handleHamburgerClick = () => {
        if (showAppNav) {
            setMobileNavOpen(true);
        } else {
            setSidebarOpen(true);
        }
    };

    return (
        <nav className="sticky top-0 shadow-md z-50 bg-[#18181C]">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                minHeight: '64px'
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
                    {!sidebarOpen && !showAppNav && (
                        <IconButton
                            onClick={() => setSidebarOpen(true)}
                            sx={{ display: { xs: 'none', md: 'flex' }, color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    )}
                    {/*.................. Condition  if user login and onboarding proccess is completed.................  */}
                    {showAppNav && (
                        <div className="hidden md:flex gap-6 ml-10 text-sm text-gray-400 font-medium">
                            <NavLink to='/dashboard' end className={({ isActive }) =>
                                isActive ? "text-white border-b-2 border-blue-500 pb-1" : "text-gray-600"}>Dashboard</NavLink>
                            <NavLink to='/catalog' end className={({ isActive }) =>
                                isActive ? "text-white border-b-2 border-blue-500 pb-1" : "text-gray-600"}>Catalog</NavLink>
                            <NavLink to='/my-learning' end className={({ isActive }) =>
                                isActive ? "text-white border-b-2 border-blue-500 pb-1" : "text-gray-600"}>My Learning</NavLink>
                        </div>
                    )}
                    {/* upto this */}
                </div>

                {/* Right Side */}
                <div className='flex items-center gap-2 py-2'>


                    {/* Desktop: Notification + Profile Avatar */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                        {/*.................. Condition  if user login and onboarding proccess is completed.................  */}
                        {showAppNav && (
                            <>
                                <div className="relative hidden lg:block">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        className="bg-transparent border border-white/20 rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 w-48 xl:w-64 placeholder-gray-500"
                                    />
                                </div>
                                <IconButton sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
                                    <NotificationsOutlined />
                                </IconButton>
                                <IconButton sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
                                    <SettingsOutlined />
                                </IconButton>
                            </>
                        )}
                        {/* upto this */}

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
                            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' }, p: 0.5 }}
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
                            onClick={handleHamburgerClick}
                            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' }, p: 0.5 }}
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

            {/* Mobile Authenticated Navigation Drawer */}
            <Drawer
                anchor="top"
                open={mobileNavOpen}
                onClose={() => setMobileNavOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: '#18181C',
                        color: '#fff',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 700,
                        fontSize: 17,
                        color: '#6366F1',
                        letterSpacing: '0.03em',
                    }}>
                        EduFlow Menu
                    </span>
                    <IconButton onClick={() => setMobileNavOpen(false)} sx={{ color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <List sx={{ px: 2, py: 2 }}>
                    <ListItem disablePadding>
                        <ListItemButton 
                            component={NavLink} 
                            to="/dashboard" 
                            onClick={() => setMobileNavOpen(false)}
                            sx={{
                                borderRadius: '8px',
                                mb: 1,
                                '&.active': { backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }
                            }}
                        >
                            <ListItemText primary="Dashboard" primaryTypographyProps={{ fontFamily: 'Poppins', fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton 
                            component={NavLink} 
                            to="/catalog" 
                            onClick={() => setMobileNavOpen(false)}
                            sx={{
                                borderRadius: '8px',
                                mb: 1,
                                '&.active': { backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }
                            }}
                        >
                            <ListItemText primary="Catalog" primaryTypographyProps={{ fontFamily: 'Poppins', fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton 
                            component={NavLink} 
                            to="/my-learning" 
                            onClick={() => setMobileNavOpen(false)}
                            sx={{
                                borderRadius: '8px',
                                '&.active': { backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }
                            }}
                        >
                            <ListItemText primary="My Learning" primaryTypographyProps={{ fontFamily: 'Poppins', fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </nav>
    );
}

export default Navbar;
