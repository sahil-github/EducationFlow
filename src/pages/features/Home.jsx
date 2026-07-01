import React from 'react';
import Sidebar from '../../components/Sidebar';
import Typography from '@mui/material/Typography';

function Home() {
    return (
        <Sidebar>
            <div className="p-8 max-w-4xl">
                <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 600, color: 'white' }}>
                    Welcome to EduFlow Cohort
                </Typography>
                <Typography paragraph sx={{ fontFamily: 'Manrope', color: '#A1A1AA' }}>
                    Access your personalized onboarding profile, coordinate with peers, self-rate your skills,
                    and map out your path of study. Select one of the onboarding steps from the sidebar to get started.
                </Typography>
            </div>
        </Sidebar>
    );
}

export default Home;
