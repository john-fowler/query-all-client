import React from 'react';
import { Paper, Typography } from '@mui/material';

interface ExecutionPlanProps {
    plan: string;
    height: number;
}

const ExecutionPlan: React.FC<ExecutionPlanProps> = ({ plan, height }) => {
    return (
        <Paper
            elevation={3}
            style={{ padding: '10px', height, overflowY: 'auto' }}>
            <Typography variant='h6'>Execution Plan</Typography>
            <Typography
                style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: `'Courier New', Courier, monospace`,
                }}>
                {plan}
            </Typography>
        </Paper>
    );
};

export default ExecutionPlan;
