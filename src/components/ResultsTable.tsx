/* eslint-disable no-nested-ternary */
import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { AppDispatch, RootState } from '../redux/store';
import { execSql } from '../redux/actions';

interface ResultsTableProps {}

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

const ResultsTable: React.FC<ResultsTableProps> = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const resumeIdx = useSelector((state: RootState) => state.sql.resumeIdx);
    const maxRows = useSelector((state: RootState) => state.sql.maxRows);
    const hasNext = useMemo(() => (resumeIdx ?? 0) > 0, [resumeIdx]);
    const { columns, data, planTime, execTime, currentPage, firstRowIdx } =
        useSelector((state: RootState) => state.results);

    const handleNextPage = useCallback(() => {
        dispatch(execSql(resumeIdx ?? 0));
    }, [dispatch, resumeIdx]);

    const handlePreviousPage = useCallback(() => {
        const newResumeIdx = firstRowIdx - maxRows;
        if (newResumeIdx >= 0) {
            dispatch(execSql(newResumeIdx));
        }
    }, [firstRowIdx, maxRows, dispatch]);

    return (
        <>
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
                        {data.map((row: Row, rowIndex) => (
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
                                <StyledTableCell colSpan={columns.length + 1}>
                                    <Typography
                                        align='center'
                                        className='no-results-text'
                                        style={{
                                            // display warning color
                                            color: theme.palette.warning.main,
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
        </>
    );
};

export default ResultsTable;
