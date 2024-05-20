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
  Typography,
  styled,
  tableCellClasses,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import './ResultsTable.css';

interface ResultsTableProps {
  columns: string[];
  data: any[][];
  currentPage: number;
  height: number;
  planTime: number;
  execTime: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[700],
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: 'small',
}));

const ResultsTable: React.FC<ResultsTableProps> = ({ columns, data, currentPage, height, planTime, execTime, handlePreviousPage, handleNextPage }) => {
  return (
    <Paper elevation={3} style={{ padding: '0px', marginBottom: '0px' }}>
      <Box className="table-container" style={{ height: height }}>
        <TableContainer component={Paper} className="table-scroll">
          <Table stickyHeader size='small'>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <StyledTableCell key={index} className="table-cell">{column}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIndex) => (
                <StyledTableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <StyledTableCell key={cellIndex} className="table-cell">{cell}</StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="pagination-controls">
          <IconButton onClick={handlePreviousPage} disabled={currentPage === 0}>
            <ArrowBack />
          </IconButton>
          <Box>
            <StyledTypography>
              plan time: {planTime}ms / exec time: {execTime}ms
            </StyledTypography>
          </Box>
          <IconButton onClick={handleNextPage}>
            <ArrowForward />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ResultsTable;