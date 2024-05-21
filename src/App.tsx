import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import { Box, Container } from '@mui/material';
import './App.css';
import SqlInputArea from './components/SqlInputArea';
import ExecutionPlan from './components/ExecutionPlan';
import ResultsTable from './components/ResultsTable';
import { executeSql } from './service/executeSql';
import { fetchPlan } from './service/fetchPlan';
import { useResizable } from 'react-resizable-layout';
import ResizeBar from './components/ResizeBar';
import { setResumeIdx } from './redux/sqlSlice';
import {
    setError,
    setPlan,
    setColumns,
    setData,
    setPlanTime,
    setExecTime,
    setCurrentPage,
    setFirstRowIdx,
} from './redux/resultsSlice';
import CssBaseline from '@mui/material/CssBaseline';
import DrawerHeader from './components/DrawerHeader';
import Main from './components/Main';
import TopNavBar from './components/TopNavBar';
import LeftSideDrawer, { drawerWidth } from './components/LeftSideDrawer';
import ErrorPane from './components/ErrorPane';
import { SqlPlanResponse, SqlResponse } from './service/serviceTypes';

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { sql, maxRows, resumeIdx } = useSelector(
        (state: RootState) => state.sql,
    );
    const {
        error,
        plan,
        columns,
        data,
        planTime,
        execTime,
        currentPage,
        firstRowIdx,
    } = useSelector((state: RootState) => state.results);
    const [windowHeight, setWindowHeight] = useState<number>(
        window.innerHeight,
    );
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    const [open, setOpen] = React.useState(false);
    const { position, isDragging, separatorProps } = useResizable({
        axis: 'y',
        initial: 300,
        min: 300,
    });

    const handleDrawerOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleError = useCallback(
        async (err: string) => {
            dispatch(setColumns([]));
            dispatch(setData([]));
            dispatch(setPlan(''));
            dispatch(setError(err));
        },
        [dispatch],
    );

    const handlePlan = useCallback(async () => {
        try {
            dispatch(setColumns([]));
            dispatch(setData([]));
            dispatch(setError(''));
            const result = await fetchPlan(sql);
            if (!result.success) {
                handleError(
                    result.detailedError || result.error || 'Unknown error',
                );
            } else {
                const respData: SqlPlanResponse = result.data!;
                dispatch(setPlan(respData.plan));
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: Error | any) {
            // eslint-disable-next-line no-console
            console.error('Error fetching plan:', err);
            // eslint-disable-next-line no-alert
            alert(`Error fetching plan: ${err.message}`);
        }
    }, [dispatch, handleError, sql]);

    const handleGo = useCallback(
        async (resIdx: number = 0) => {
            try {
                dispatch(setPlan(''));
                dispatch(setError(''));
                const result = await executeSql(sql, maxRows, resIdx);
                if (!result.success) {
                    handleError(
                        result.detailedError || result.error || 'Unknown error',
                    );
                } else {
                    const respData: SqlResponse = result.data!;
                    dispatch(setColumns(respData.columns));
                    dispatch(setData(respData.data));
                    dispatch(setPlanTime(respData.planTime));
                    dispatch(setExecTime(respData.execTime));
                    dispatch(setFirstRowIdx(respData.firstRowIdx));
                    dispatch(setResumeIdx(respData.resumeIdx));
                    dispatch(setCurrentPage(resIdx / maxRows));
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: Error | any) {
                // eslint-disable-next-line no-console
                console.error('Error fetching plan:', err);
                // eslint-disable-next-line no-alert
                alert(`Error fetching plan: ${err.message}`);
            }
        },
        [dispatch, sql, maxRows, handleError],
    );

    const handleNextPage = useCallback(() => {
        handleGo(resumeIdx);
    }, [handleGo, resumeIdx]);

    const handlePreviousPage = useCallback(() => {
        const newResumeIdx = firstRowIdx - maxRows;
        if (newResumeIdx >= 0) {
            handleGo(newResumeIdx);
            dispatch(setResumeIdx(newResumeIdx));
        }
    }, [firstRowIdx, maxRows, handleGo, dispatch]);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Container className='App' maxWidth={false}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <TopNavBar open={open} handleDrawerOpen={handleDrawerOpen} />
                <LeftSideDrawer
                    open={open}
                    handleDrawerClose={handleDrawerClose}
                />
                <Main open={open}>
                    <DrawerHeader />{' '}
                    {/* This is to offset the size of the header */}
                    <Box
                        display='flex'
                        sx={{ marginBottom: '10px', height: position - 125 }}>
                        <SqlInputArea
                            handleGo={() => handleGo(0)}
                            handlePlan={handlePlan}
                        />
                    </Box>
                    <ResizeBar
                        dir='horizontal'
                        isDragging={isDragging}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...separatorProps}
                    />
                    <Box
                        sx={{
                            padding: '0px',
                            margin: '0px',
                            height: windowHeight - position - 90,
                            maxWidth:
                                windowWidth - (open ? drawerWidth : 0) - 100,
                        }}>
                        {error && <ErrorPane error={error} />}
                        {plan && <ExecutionPlan plan={plan} />}
                        {data.length > 0 && (
                            <ResultsTable
                                columns={columns}
                                data={data}
                                planTime={planTime}
                                execTime={execTime}
                                currentPage={currentPage}
                                firstRowIdx={firstRowIdx}
                                hasNext={(resumeIdx ?? 0) > 0}
                                handlePreviousPage={handlePreviousPage}
                                handleNextPage={handleNextPage}
                                height={window.innerHeight - position - 20}
                            />
                        )}
                    </Box>
                </Main>
            </Box>
        </Container>
    );
};

export default App;
