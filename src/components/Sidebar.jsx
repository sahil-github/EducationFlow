import { useState, useEffect } from 'react';
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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import CommentIcon from '@mui/icons-material/Comment';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Logo from '../assets/logo/Logo.png';
const drawerWidth = 240;

const navItems = [
    { text: 'Personal Info', icon: <PersonIcon />, route: '/personal-info' },
    { text: 'Learning Goals', icon: <TrackChangesIcon />, route: '/learning-goals' },
    { text: 'Interests', icon: <LightbulbIcon />, route: '/interests' },
    { text: 'Skill Assessment', icon: <StarBorderRoundedIcon />, route: '/skill-assessment' },
    { text: 'Review', icon: <CommentIcon />, route: '/review' },
];

export default function Sidebar({ children, open, setOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Drawer
                variant={isMobile ? "temporary" : "persistent"}
                anchor="left"
                open={open}
                onClose={() => setOpen(false)}
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
                {/* Header: close button */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'between',
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


                        <IconButton
                            onClick={() => setOpen(false)}
                            size="small"
                            sx={{ color: '#fff' }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                </div>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

                <List sx={{ px: 1, pt: 1 }}>
                    {navItems.map(({ text, icon, route }) => {
                        const isActive = location.pathname === route;
                        return (
                            <ListItem key={text} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => {
                                        navigate(route);
                                        if (isMobile) {
                                            setOpen(false);
                                        }
                                    }}
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
                    padding: '0 24px',
                    marginLeft: isMobile ? 0 : (open ? 0 : `-${drawerWidth}px`),
                    transition: 'margin 0.25s ease',
                    // maxWidth: '1200px',
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
