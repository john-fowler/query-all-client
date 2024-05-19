import React, { useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import './SqlInputArea.css';

interface SqlInputAreaProps {
  sql: string;
  setSql: (sql: string) => void;
  maxRows: number;
  setMaxRows: (maxRows: number) => void;
  handleGo: () => void;
  handlePlan: () => void;
}

const SqlInputArea: React.FC<SqlInputAreaProps> = ({ sql, setSql, maxRows, setMaxRows, handleGo, handlePlan }) => {
  const handleSqlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newSql = event.target.value;
    setSql(newSql);
    localStorage.setItem('sql', newSql); // Save to local storage
  };

  const handleMaxRowsChange = (event: SelectChangeEvent<number>) => {
    setMaxRows(Number(event.target.value));
  };

  useEffect(() => {
    const savedSql = localStorage.getItem('sql');
    if (savedSql) {
      setSql(savedSql);
    }
  }, [setSql]);

  return (
    <Box className="sql-input-container">
      <Box className="flex-item">
        <TextField
          variant="outlined"
          multiline
          fullWidth
          placeholder="SELECT * FROM ..."
          value={sql}
          onChange={handleSqlChange}
          InputProps={{
            style: { 
              height: '100%', 
              alignItems: 'flex-start',
              fontFamily: 'Courier New, Courier, monospace'  // Apply monospace font directly
            },
          }}
          className="sql-textarea"
        />
      </Box>
      <Box className="buttons-dropdown-container">
        <Box className="buttons-container">
          <Button variant="contained" color="secondary" onClick={handleGo} className="button">
            Go
          </Button>
          <Button variant="contained" color="primary" onClick={handlePlan} className="button">
            Plan
          </Button>
        </Box>
        <Box className="dropdown-container">
          <FormControl variant="outlined" className="dropdown">
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={maxRows}
              onChange={handleMaxRowsChange}
              label="Rows per page"
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={250}>250</MenuItem>
              <MenuItem value={500}>500</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default SqlInputArea;