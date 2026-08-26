import { useState, useEffect, useRef } from 'react';
import Logo from '../assets/logo/Logo.png';
import PersonIcon from '@mui/icons-material/Person';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IconButton, Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, Typography, Drawer, List, ListItem, ListItemButton, ListItemText, CircularProgress, Badge } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { clearCurrentUser } from '../utils/storage';
import { Search, NotificationsOutlined, SettingsOutlined, LogoutOutlined, StarRounded } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import { courseApi } from '../api/courseApi';

// ---------------------------------------------------------------------------
// Search result dropdown component — kept local, not Redux-driven.
// ---------------------------------------------------------------------------
function SearchDropdown({ results, loading, error, searchTerm, onSelect }) {
    if (!searchTerm) return null;

    return (
        <div
            className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E2A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]"
            style={{ minWidth: 320, maxHeight: 420, overflowY: 'auto' }}
        >
            {loading && (
                <div className="flex items-center justify-center gap-2 py-6 text-gray-400 text-sm">
                    <CircularProgress size={16} sx={{ color: '#6366F1' }} />
                    <span>Searching...</span>
                </div>
            )}

            {!loading && error && (
                <div className="px-4 py-5 text-center text-red-400 text-sm">
                    <span>Search failed. Please try again.</span>
                </div>
            )}

            {!loading && !error && results.length === 0 && (
                <div className="px-4 py-5 text-center text-gray-400 text-sm">
                    No courses found for <span className="text-white font-semibold">"{searchTerm}"</span>
                </div>
            )}

            {!loading && !error && results.length > 0 && (
                <div className="py-1">
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
                        {results.length} result{results.length !== 1 ? 's' : ''} for "{searchTerm}"
                    </div>
                    {results.map((course) => (
                        <button
                            key={course.id || course._id}
                            onClick={() => onSelect(course)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-none bg-transparent cursor-pointer border-b border-white/5 last:border-b-0"
                        >
                            {/* Thumbnail or placeholder */}
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-900 to-blue-900 flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white/30 text-xs font-bold">EF</span>
                                )}
                            </div>
                            {/* Course info */}
                            <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-semibold font-[Poppins] truncate">{course.title}</div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    {course.instructor && (
                                        <span className="text-gray-400 text-xs truncate">{course.instructor?.name || course.instructor}</span>
                                    )}
                                    {course.category && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 font-semibold shrink-0">{course.category}</span>
                                    )}
                                </div>
                            </div>
                            {/* Rating */}
                            {course.rating != null && (
                                <div className="flex items-center gap-0.5 shrink-0">
                                    <StarRounded sx={{ fontSize: 13, color: '#facc15' }} />
                                    <span className="text-yellow-400 text-xs font-semibold">{Number(course.rating).toFixed(1)}</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main Navbar
// ---------------------------------------------------------------------------
function Navbar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    // Search state — local only, does NOT touch global Redux courses state
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const desktopSearchRef = useRef(null);
    const mobileSearchRef = useRef(null);

    // Single source of truth: Redux state populated by loginUser + getProfile thunks
    const { token, user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const cartItems = useSelector((state) => state.cart?.items || []);
    const cartCount = cartItems.length;

    // Show full app nav only when authenticated AND onboarding is complete
    const isOnboarded = user?.isOnboarded === true || String(user?.isOnboarded) === 'true' ||
        profile?.isOnboarded === true || String(profile?.isOnboarded) === 'true';
    const showAppNav = !!(token && isOnboarded);

    const profileOpen = Boolean(anchorEl);

    // -----------------------------------------------------------------------
    // Debounced search — fires 400ms after the user stops typing
    // -----------------------------------------------------------------------
    useEffect(() => {
        const trimmed = searchTerm.trim();

        // Empty search → clear results immediately, no API call
        if (!trimmed) {
            setSearchResults([]);
            setSearchError(null);
            setSearchLoading(false);
            return;
        }

        setSearchLoading(true);
        setSearchError(null);

        const debounceTimer = setTimeout(async () => {
            try {
                const response = await courseApi.getCourses({ search: trimmed, page: 1, limit: 6 });
                const data = response.data?.data ?? response.data ?? [];
                setSearchResults(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('[Navbar Search] API error:', err);
                setSearchError(err?.response?.data?.message || err?.message || 'Search failed');
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 400);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    // -----------------------------------------------------------------------
    // Close dropdown when clicking outside
    // -----------------------------------------------------------------------
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                desktopSearchRef.current && !desktopSearchRef.current.contains(e.target) &&
                mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)
            ) {
                setSearchFocused(false);
            } else if (
                desktopSearchRef.current && !desktopSearchRef.current.contains(e.target) &&
                !mobileSearchRef.current
            ) {
                setSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // -----------------------------------------------------------------------
    // Course selection from search dropdown
    // -----------------------------------------------------------------------
    const handleCourseSelect = (course) => {
        const id = course.id || course._id;
        setSearchTerm('');
        setSearchResults([]);
        setSearchFocused(false);
        setMobileSearchOpen(false);
        navigate(`/courses/${id}`);
    };

    // -----------------------------------------------------------------------
    // Profile handlers
    // -----------------------------------------------------------------------
    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        clearCurrentUser();
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

    const avatarLetter = profile?.fullName
        ? profile.fullName.charAt(0).toUpperCase()
        : user?.fullName
            ? user.fullName.charAt(0).toUpperCase()
            : user?.name
                ? user.name.charAt(0).toUpperCase()
                : null;

    const showDropdown = searchFocused && searchTerm.trim().length > 0;

    return (
        <nav className="sticky top-0 left-0 right-0 w-full shadow-md z-50 bg-[#18181C]">
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
                    {showAppNav && (
                        <div className="hidden md:flex items-center gap-6 ml-10 text-sm font-medium">
                            <NavLink to='/dashboard' end className={({ isActive }) =>
                                isActive ? 'text-white font-semibold border-b-2 border-blue-500 pb-1' : 'text-gray-300 hover:text-white transition-colors pb-1'}>Dashboard</NavLink>
                            <NavLink to='/catalog' end className={({ isActive }) =>
                                isActive ? 'text-white font-semibold border-b-2 border-blue-500 pb-1' : 'text-gray-300 hover:text-white transition-colors pb-1'}>Catalog</NavLink>
                            <NavLink to='/my-learning' end className={({ isActive }) =>
                                isActive ? 'text-white font-semibold border-b-2 border-blue-500 pb-1' : 'text-gray-300 hover:text-white transition-colors pb-1'}>My Learning</NavLink>
                            <NavLink to='/quizzes' end className={({ isActive }) =>
                                isActive ? 'text-white font-semibold border-b-2 border-blue-500 pb-1' : 'text-gray-300 hover:text-white transition-colors pb-1'}>Quizzes</NavLink>
                        </div>
                    )}
                </div>

                {/* Right Side */}
                <div className='flex items-center gap-1 md:gap-2 py-2'>

                    {/* App Navigation Icons (Search, Notifications, Settings) */}
                    {showAppNav && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, md: 2 } }}>

                            {/* Desktop search input with dropdown */}
                            <Box
                                ref={desktopSearchRef}
                                sx={{ display: { xs: 'none', md: 'flex' }, position: 'relative', alignItems: 'center' }}
                            >
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: 20, zIndex: 1 }} />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    className="bg-transparent border border-white/20 rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 w-48 xl:w-64 placeholder-gray-500"
                                />
                                {showDropdown && (
                                    <SearchDropdown
                                        results={searchResults}
                                        loading={searchLoading}
                                        error={searchError}
                                        searchTerm={searchTerm.trim()}
                                        onSelect={handleCourseSelect}
                                    />
                                )}
                            </Box>

                            {/* Mobile search icon button */}
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    onClick={() => setMobileSearchOpen(prev => !prev)}
                                    sx={{ color: mobileSearchOpen ? '#6366F1' : 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' }, p: 0.5 }}
                                >
                                    <Search sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Box>
                            {/* notifications */}
                            <IconButton
                                onClick={() => navigate("/notification")}
                                sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' }, p: { xs: 0.5, md: 1 } }}>
                                <NotificationsOutlined sx={{ fontSize: { xs: 20, md: 24 } }} />
                            </IconButton>
                            {/* cart */}
                            <IconButton
                                onClick={() => navigate("/cart")}
                                aria-label="View Cart"
                                sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' }, p: { xs: 0.5, md: 1 } }}
                            >
                                <Badge
                                    badgeContent={cartCount}
                                    color="primary"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: '#6366F1',
                                            color: '#fff',
                                            fontSize: 10,
                                            fontWeight: 700,
                                            height: 16,
                                            minWidth: 16,
                                            padding: '0 4px',
                                        }
                                    }}
                                >
                                    <ShoppingCartIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
                                </Badge>
                            </IconButton>

                            {/* settings */}
                            <IconButton
                                sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' }, p: { xs: 0.5, md: 1 } }}
                                onClick={() => navigate('/setting')}
                            >
                                <SettingsOutlined sx={{ fontSize: { xs: 20, md: 24 } }} />
                            </IconButton>
                        </Box>
                    )}

                    {/* Desktop Profile Avatar */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
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
                            <Avatar sx={{ width: 28, height: 28, bgcolor: '#6366F1', fontSize: 13, fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                                {avatarLetter || <PersonIcon sx={{ fontSize: 18 }} />}
                            </Avatar>
                        </Box>
                    </Box>

                    {/* Mobile: Hamburger menu & Profile */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.5 }}>
                        <IconButton
                            onClick={handleProfileClick}
                            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' }, p: 0.5 }}
                        >
                            <Avatar sx={{ width: 24, height: 24, bgcolor: '#6366F1', fontSize: 11, fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                                {avatarLetter || <PersonIcon sx={{ fontSize: 16 }} />}
                            </Avatar>
                        </IconButton>
                        <IconButton
                            onClick={handleHamburgerClick}
                            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' }, p: 0.5 }}
                        >
                            <MenuIcon sx={{ fontSize: 24 }} />
                        </IconButton>
                    </Box>
                </div>
            </div>

            {/* Mobile Search Expand Row */}
            {showAppNav && mobileSearchOpen && (
                <Box
                    ref={mobileSearchRef}
                    sx={{ display: { xs: 'flex', md: 'none' }, px: 2, pb: 1.5, flexDirection: 'column', gap: 0 }}
                >
                    <div className="flex items-center gap-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: 18 }} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                autoFocus
                                className="w-full bg-[#22222A] border border-white/20 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-gray-500"
                            />
                        </div>
                        <IconButton
                            onClick={() => { setMobileSearchOpen(false); setSearchTerm(''); setSearchResults([]); }}
                            sx={{ color: 'rgba(255,255,255,0.5)', p: 0.5 }}
                        >
                            <CloseIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </div>
                    {/* Mobile search dropdown */}
                    {searchFocused && searchTerm.trim().length > 0 && (
                        <div className="mt-1 bg-[#1E1E2A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden" style={{ maxHeight: 360, overflowY: 'auto' }}>
                            <SearchDropdown
                                results={searchResults}
                                loading={searchLoading}
                                error={searchError}
                                searchTerm={searchTerm.trim()}
                                onSelect={handleCourseSelect}
                            />
                        </div>
                    )}
                </Box>
            )}

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
                        {profile?.fullName || user?.fullName || user?.name || 'User'}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#bcc4cfff' }}>
                        {profile?.email || user?.email || ''}
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
                            sx={{ borderRadius: '8px', mb: 1, '&.active': { backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' } }}
                        >
                            <ListItemText primary="Dashboard" primaryTypographyProps={{ fontFamily: 'Poppins', fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to="/catalog"
                            onClick={() => setMobileNavOpen(false)}
                            sx={{ borderRadius: '8px', mb: 1, '&.active': { backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' } }}
                        >
                            <ListItemText primary="Catalog" primaryTypographyProps={{ fontFamily: 'Poppins', fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to="/my-learning"
                            onClick={() => setMobileNavOpen(false)}
                            sx={{ borderRadius: '8px', mb: 1, '&.active': { backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' } }}
                        >
                            <ListItemText primary="My Learning" primaryTypographyProps={{ fontFamily: 'Poppins', fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to="/cart"
                            onClick={() => setMobileNavOpen(false)}
                            sx={{ borderRadius: '8px', '&.active': { backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' } }}
                        >
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Cart</span>
                                        {cartCount > 0 && (
                                            <span className="px-2 py-0.5 text-xs bg-indigo-500 text-white rounded-full font-bold">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Box>
                                }
                                primaryTypographyProps={{ fontFamily: 'Poppins', fontWeight: 500 }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </nav>
    );
}

export default Navbar;
