import React from 'react';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import './ResultsTable.css';

interface ResultsTableProps {
  columns: string[];
  data: any[][];
  currentPage: number;
  height: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ columns, data, currentPage, height, handlePreviousPage, handleNextPage }) => {
  return (
    <Paper elevation={3} style={{ padding: '0px', marginBottom: '0px' }}>
      <Box className="table-container" style={{ height: height }}>
        <TableContainer component={Paper} className="table-scroll">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={index} className="table-cell">{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="table-cell">{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="pagination-controls">
          <IconButton onClick={handlePreviousPage} disabled={currentPage === 0}>
            <ArrowBack />
          </IconButton>
          <IconButton onClick={handleNextPage}>
            <ArrowForward />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ResultsTable;