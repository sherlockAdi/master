import React from 'react';
import { Typography } from '@mui/material';

const HomePage = () => {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Welcome to the Master Management System
            </Typography>
            <Typography variant="body1">
                Use the sidebar to navigate between different master data tables.
            </Typography>
        </div>
    );
};

export default HomePage; 