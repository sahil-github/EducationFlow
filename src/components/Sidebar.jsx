import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import CommentIcon from '@mui/icons-material/Comment';
import Logo from '../assets/logo/Logo.png';

const drawerWidth = 240;

const navItems = [
    { text: 'Personal Info', icon: <PersonIcon />, route: '/personal-info' },
    { text: 'Learning Goals', icon: <TrackChangesIcon />, route: '/learning-goals' },
    { text: 'Interests', icon: <LightbulbIcon />, route: '/interests' },
    { text: 'Skill Assessment', icon: <StarBorderRoundedIcon />, route: '/skill-assessment' },
    { text: 'Review', icon: <CommentIcon />, route: '/review' },
];

export default function Sidebar({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(true);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: 'rgba(18, 18, 24, 0.80)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                        color: '#fff',
                    },
                }}
            >
                {/* Header: logo + close button */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 12px 12px',
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
                    <IconButton
                        onClick={() => setOpen(false)}
                        size="small"
                        sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#fff' } }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                </div>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

                <List sx={{ px: 1, pt: 1 }}>
                    {navItems.map(({ text, icon, route }) => {
                        const isActive = location.pathname === route;
                        return (
                            <ListItem key={text} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => navigate(route)}
                                    sx={{
                                        borderRadius: '12px',
                                        transition: 'all 0.2s',
                                        backgroundColor: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: isActive
                                                ? 'rgba(99,102,241,0.2)'
                                                : 'rgba(255,255,255,0.05)',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: isActive ? '#6366F1' : '#C7C4D8', minWidth: 36 }}>
                                        {icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={text}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                fontFamily: 'Poppins, sans-serif',
                                                fontWeight: isActive ? 600 : 400,
                                                fontSize: '0.85rem',
                                                color: isActive ? '#fff' : '#C7C4D8',
                                            },
                                        }}
                                    />
                                    {isActive && (
                                        <div style={{
                                            width: 4, height: 24,
                                            borderRadius: 4,
                                            backgroundColor: '#6366F1',
                                            marginLeft: 8,
                                        }} />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    overflowY: 'auto',
                    marginLeft: open ? 0 : `-${drawerWidth}px`,
                    transition: 'margin 0.25s ease',
                }}
            >
                {!open && (
                    <div style={{ padding: '12px 16px' }}>
                        <IconButton
                            onClick={() => setOpen(true)}
                            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </div>
                )}
                {children}
            </Box>
        </Box>
    );
}
