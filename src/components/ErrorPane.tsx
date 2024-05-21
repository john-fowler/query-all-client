import React from 'react';
import { Paper, Typography, useTheme } from '@mui/material';

interface ErrorPaneProps {
    error: string;
}

const ErrorPane: React.FC<ErrorPaneProps> = ({ error }) => {
    const theme = useTheme();
    return (
        <Paper elevation={3} style={{ padding: '10px' }}>
            <Typography variant='h6' style={{ marginBottom: 20 }}>
                SQL Error
            </Typography>
            <Typography
                style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: `'Courier New', Courier, monospace`,
                    color: theme.palette.error.main,
                }}
                dangerouslySetInnerHTML={{
                    __html: error,
                }}
            />
        </Paper>
    );
};

export default ErrorPane;
