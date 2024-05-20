import React from 'react';
import { Paper, Typography } from '@mui/material';

interface ExecutionPlanProps {
  plan: string;
}

const ExecutionPlan: React.FC<ExecutionPlanProps> = ({ plan }) => {
  return (
    <Paper elevation={3} style={{ padding: '10px' }}>
      <Typography variant="h6">Execution Plan</Typography>
      <Typography style={{ whiteSpace: 'pre-wrap', fontFamily: `'Courier New', Courier, monospace` }}>{plan}</Typography>
    </Paper>
  );
};

export default ExecutionPlan;