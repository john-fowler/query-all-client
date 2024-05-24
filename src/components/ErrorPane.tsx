import React from 'react';
import { Paper, Typography, useTheme } from '@mui/material';

interface ErrorPaneProps {
    error: string;
    height: number;
}

const ErrorPane: React.FC<ErrorPaneProps> = ({ error, height }) => {
    const theme = useTheme();
    return (
        <Paper
            elevation={0}
            style={{
                padding: '10px',
                height,
                overflowY: 'auto',
                border: 1,
                borderStyle: 'solid',
                borderColor: '#ccc',
                borderRadius: 0,
            }}>
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
