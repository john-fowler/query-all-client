import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import { Box, Container, Paper, Stack } from '@mui/material';
import './App.css';
import SqlInputArea from './components/SqlInputArea';
import ExecutionPlan from './components/ExecutionPlan';
import ResultsTable from './components/ResultsTable';
import { useResizable } from 'react-resizable-layout';
import ResizeBar from './components/ResizeBar';
import CssBaseline from '@mui/material/CssBaseline';
import DrawerHeader from './components/DrawerHeader';
import Main from './components/Main';
import TopNavBar from './components/TopNavBar';
import LeftSideDrawer, { drawerWidth } from './components/LeftSideDrawer';
import ErrorPane from './components/ErrorPane';
import ChatPane from './components/ChatPane';
import { execSql, getSqlPlan } from './redux/actions';

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { error, plan, data } = useSelector(
        (state: RootState) => state.results,
    );
    const dataLength = data.length;
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
        initial: (2 * window.innerWidth) / 3,
        min: Math.min(400, window.innerWidth - 450),
        max: window.innerWidth - 450,
    });

    const handleGo = useCallback(() => {
        dispatch(execSql(0));
    }, [dispatch]);

    const handlePlan = useCallback(async () => {
        dispatch(getSqlPlan());
    }, [dispatch]);

    //  This memo is necessary to prevent the table from re-rendering
    //  during resize events
    const resultsTable = useMemo(() => {
        return dataLength > 0 ? <ResultsTable /> : null;
    }, [dataLength]);

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
                                    handleGo={handleGo}
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
                                {dataLength > 0 && (
                                    <Paper
                                        elevation={0}
                                        style={{
                                            padding: '0px',
                                            marginBottom: '0px',
                                        }}>
                                        <Box
                                            className='table-container'
                                            style={{
                                                height: bottomPaneHeight,
                                            }}>
                                            {resultsTable}
                                        </Box>
                                    </Paper>
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
