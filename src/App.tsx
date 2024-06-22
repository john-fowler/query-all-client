import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import { Box, Container, Stack } from '@mui/material';
import './App.css';
import SqlInputArea from './components/SqlInputArea';
import ExecutionPlan from './components/ExecutionPlan';
import ResultsTable from './components/ResultsTable';
import { executeSql } from './service/executeSql';
import { fetchPlan } from './service/fetchPlan';
import { useResizable } from 'react-resizable-layout';
import ResizeBar from './components/ResizeBar';
import { setExecuting, setResumeIdx } from './redux/sqlSlice';
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
import ChatPane from './components/ChatPane';
import { Row } from './db-types';

const NO_ROWS: Row[] = [['no rows']];

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
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [chatOpen, setChatOpen] = React.useState(false);
    const {
        position: verticalPosition,
        isDragging: isVerticalDragging,
        separatorProps: verticalSeparatorProps,
    } = useResizable({
        axis: 'y',
        initial: 300,
        min: 300,
    });
    const {
        position: horizontalPosition,
        isDragging: isHorizontalDragging,
        separatorProps: horizontalSeparatorProps,
    } = useResizable({
        axis: 'x',
        initial: window.innerWidth / 2,
        min: 450,
    });

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
                dispatch(setColumns([]));
                dispatch(setData([]));
                dispatch(setError(''));
                dispatch(setExecuting(true));
                const result = await executeSql(sql, maxRows, resIdx);
                dispatch(setExecuting(false));
                if (!result.success) {
                    handleError(
                        result.detailedError || result.error || 'Unknown error',
                    );
                } else {
                    const respData: SqlResponse = result.data!;
                    dispatch(setColumns(respData.columns));
                    dispatch(
                        setData(
                            respData.data.length > 0 ? respData.data : NO_ROWS,
                        ),
                    );
                    dispatch(setPlanTime(respData.planTime));
                    dispatch(setExecTime(respData.execTime));
                    dispatch(setFirstRowIdx(respData.firstRowIdx));
                    dispatch(setResumeIdx(respData.resumeIdx));
                    dispatch(setCurrentPage(resIdx / maxRows));
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: Error | any) {
                dispatch(setExecuting(false));
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

    const {
        mainHeight,
        topPaneHeight,
        bottomPaneHeight,
        leftPaneWidth,
        rightPaneWidth,
    } = useMemo(() => {
        return {
            mainHeight: windowHeight - 112,
            topPaneHeight: verticalPosition - 125,
            bottomPaneHeight: windowHeight - verticalPosition - 30,
            leftPaneWidth:
                (chatOpen ? horizontalPosition - 55 : windowWidth - 90) -
                (drawerOpen ? drawerWidth : 0),
            rightPaneWidth: windowWidth - horizontalPosition - 52,
        };
    }, [
        windowHeight,
        verticalPosition,
        chatOpen,
        horizontalPosition,
        windowWidth,
        drawerOpen,
    ]);

    return (
        <Container className='App' maxWidth={false}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <TopNavBar
                    drawerOpen={drawerOpen}
                    setDrawerOpen={setDrawerOpen}
                    chatOpen={chatOpen}
                    setChatOpen={setChatOpen}
                />
                <LeftSideDrawer open={drawerOpen} />
                <Main open={drawerOpen}>
                    <DrawerHeader />
                    {/* This is to offset the size of the header */}
                    <Stack direction='row' alignItems='stretch'>
                        <Box flex={1}>
                            <Box
                                display='flex'
                                sx={{
                                    marginBottom: '10px',
                                    height: topPaneHeight,
                                }}>
                                <SqlInputArea
                                    handleGo={() => handleGo(0)}
                                    handlePlan={handlePlan}
                                />
                            </Box>
                            <ResizeBar
                                dir='horizontal'
                                isDragging={isVerticalDragging}
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                {...verticalSeparatorProps}
                            />
                            <Box
                                sx={{
                                    padding: '0px',
                                    margin: '0px',
                                    height: bottomPaneHeight,
                                    maxWidth: leftPaneWidth,
                                }}>
                                {error && (
                                    <ErrorPane
                                        error={error}
                                        height={bottomPaneHeight}
                                    />
                                )}
                                {plan && (
                                    <ExecutionPlan
                                        plan={plan}
                                        height={bottomPaneHeight}
                                    />
                                )}
                                {data.length > 0 && (
                                    <ResultsTable
                                        columns={columns}
                                        data={data === NO_ROWS ? [] : data}
                                        planTime={planTime}
                                        execTime={execTime}
                                        currentPage={currentPage}
                                        firstRowIdx={firstRowIdx}
                                        hasNext={(resumeIdx ?? 0) > 0}
                                        handlePreviousPage={handlePreviousPage}
                                        handleNextPage={handleNextPage}
                                        height={bottomPaneHeight}
                                    />
                                )}
                            </Box>
                        </Box>
                        {chatOpen && (
                            <Box
                                display='flex'
                                flexDirection='row'
                                alignItems='stretch'
                                sx={{
                                    width: rightPaneWidth,
                                    marginLeft: '10px',
                                }}>
                                <ResizeBar
                                    dir='vertical'
                                    isDragging={isHorizontalDragging}
                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                    {...horizontalSeparatorProps}
                                />
                                <ChatPane height={mainHeight} />
                            </Box>
                        )}
                    </Stack>
                </Main>
            </Box>
        </Container>
    );
};

export default App;
