/* eslint-disable no-nested-ternary */
import React from 'react';
import {
    Box,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    styled,
    tableCellClasses,
    useTheme,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import './ResultsTable.css';
import { Row } from '../db-types';

interface ResultsTableProps {
    columns: string[];
    data: Row[];
    currentPage: number;
    firstRowIdx: number;
    height: number;
    planTime: number;
    execTime: number;
    hasNext: boolean;
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

const TimingText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.disabled,
    fontSize: 'small',
}));

const ResultsTable: React.FC<ResultsTableProps> = ({
    columns,
    data,
    currentPage,
    firstRowIdx,
    height,
    planTime,
    execTime,
    hasNext,
    handlePreviousPage,
    handleNextPage,
}) => {
    const theme = useTheme();
    return (
        <Paper
            elevation={0}
            style={{
                padding: '0px',
                marginBottom: '0px',
            }}>
            <Box className='table-container' style={{ height }}>
                <TableContainer component={Paper} className='table-scroll'>
                    <Table stickyHeader size='small'>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell />
                                {columns.map((column, index) => (
                                    <StyledTableCell
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={index}
                                        className='table-cell'>
                                        {column}
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, rowIndex) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <StyledTableRow key={rowIndex}>
                                    <StyledTableCell
                                        className='table-cell'
                                        sx={{
                                            color: theme.palette.text.disabled,
                                        }}>
                                        {firstRowIdx + rowIndex + 1}
                                    </StyledTableCell>
                                    {row.map((cell, cellIndex) => (
                                        <StyledTableCell
                                            // eslint-disable-next-line react/no-array-index-key
                                            key={cellIndex}
                                            className='table-cell'>
                                            {cell === null || cell === undefined
                                                ? ''
                                                : typeof cell === 'object'
                                                  ? JSON.stringify(cell)
                                                  : cell}
                                        </StyledTableCell>
                                    ))}
                                </StyledTableRow>
                            ))}
                            {data.length === 0 && (
                                <StyledTableRow>
                                    <StyledTableCell
                                        colSpan={columns.length + 1}>
                                        <Typography
                                            align='center'
                                            className='no-results-text'
                                            style={{
                                                // display warning color
                                                color: theme.palette.warning
                                                    .main,
                                            }}>
                                            No results
                                        </Typography>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box
                    className='pagination-controls'
                    style={{
                        borderBottom: '1px solid #ccc',
                        borderLeft: '1px solid #ccc',
                        borderRight: '1px solid #ccc',
                    }}>
                    <IconButton
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}>
                        <ArrowBack />
                    </IconButton>
                    <Stack direction='column' alignItems='center'>
                        <Typography>
                            {data.length > 0 &&
                                `page ${currentPage + 1}: rows ${firstRowIdx + 1}-${firstRowIdx + data.length}`}
                        </Typography>
                        <TimingText>
                            plan time: {planTime}ms / exec time: {execTime}ms
                        </TimingText>
                    </Stack>
                    <IconButton onClick={handleNextPage} disabled={!hasNext}>
                        <ArrowForward />
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    );
};

export default ResultsTable;
