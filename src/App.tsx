import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
} from '@mui/material';
import './App.css';
import { fetchPlan, executeSql } from './apiService';

const App: React.FC = () => {
  const [sql, setSql] = useState('');
  const [plan, setPlan] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<any[][]>([]);
  const [maxRows, setMaxRows] = useState<number>(100);
  const [resumeIdx, setResumeIdx] = useState<number>(0);

  const handleSqlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSql(event.target.value);
  };

  const handleMaxRowsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxRows(Number(event.target.value));
  };

  const handlePlan = async () => {
    try {
      setColumns([]);
      setData([]);
      const result = await fetchPlan(sql);
      setPlan(result.plan);
    } catch (error: Error | any) {
      console.error('Error fetching plan:', error);
      alert('Error fetching plan: ' + error.message);
    }
  };

  const handleGo = async (resumeIdx: number = 0) => {
    try {
      setPlan('');
      const result = await executeSql(sql, maxRows, resumeIdx);
      setColumns(result.columns);
      setData(result.data);
      setResumeIdx(resumeIdx + result.data.length);
    } catch (error: Error | any) {
      console.error('Error executing SQL:', error);
      alert('Error executing SQL: ' + error.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <TextField
          label="Enter SQL"
          multiline
          rows={10}
          variant="outlined"
          fullWidth
          value={sql}
          onChange={handleSqlChange}
          margin="normal"
          className="monospaced-textarea"
        />
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField
              label="Max Rows"
              type="number"
              value={maxRows}
              onChange={handleMaxRowsChange}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handlePlan} style={{ marginRight: '10px' }}>
              Plan
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleGo()}>
              Go
            </Button>
          </Grid>
        </Grid>
        {plan && (
          <Paper elevation={3} style={{ whiteSpace: 'pre-wrap', marginTop: '20px', padding: '10px' }}>
            <Typography variant="h6">Execution Plan</Typography>
            <Typography>{plan}</Typography>
          </Paper>
        )}
        {data.length > 0 && (
          <>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell key={index}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2} display="flex" justifyContent="center">
              <Button variant="contained" onClick={() => handleGo(resumeIdx)}>
                Load More
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default App;