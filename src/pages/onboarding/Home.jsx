import React from 'react';
import Typography from '@mui/material/Typography';

function Home() {
    return (
        <div className=" max-w-4xl px-4 sm:px-6 py-6 sm:py-6">
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 600, color: 'white' }}>
                Welcome to EduFlow Cohort
            </Typography>
            <Typography paragraph sx={{ fontFamily: 'Manrope', color: '#A1A1AA' }}>
                Access your personalized onboarding profile, coordinate with peers, self-rate your skills,
                and map out your path of study. Select one of the onboarding steps from the sidebar to get started.
            </Typography>
        </div>
    );
}

export default Home;
