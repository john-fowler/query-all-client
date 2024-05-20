import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import { Box, Container } from '@mui/material';
import './App.css';
import SqlInputArea from './components/SqlInputArea';
import ExecutionPlan from './components/ExecutionPlan';
import ResultsTable from './components/ResultsTable';
import { fetchPlan, executeSql } from './apiService';
import { useResizable } from 'react-resizable-layout';
import ResizeBar from './components/ResizeBar';
import { setResumeIdx } from './redux/sqlSlice';
import { setError, setPlan, setColumns, setData, setPlanTime, setExecTime, setCurrentPage } from './redux/resultsSlice';
import CssBaseline from '@mui/material/CssBaseline';
import DrawerHeader from './components/DrawerHeader';
import Main from './components/Main';
import TopNavBar from './components/TopNavBar';
import LeftSideDrawer, { drawerWidth } from './components/LeftSideDrawer';
import ErrorPane from './components/ErrorPane';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sql, maxRows, resumeIdx } = useSelector((state: RootState) => state.sql);
  const { error, plan, columns, data, planTime, execTime, currentPage } = useSelector((state: RootState) => state.results);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [open, setOpen] = React.useState(false);
  const { position, isDragging, separatorProps } = useResizable({
    axis: 'y',
    initial: 300,
    min: 300
  });

  const handleDrawerOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleError = useCallback(async (err: string) => {
    dispatch(setColumns([]));
    dispatch(setData([]));
    dispatch(setPlan(''));
    dispatch(setError(err));
  }, [dispatch]);

  const handlePlan = useCallback(async () => {
    try {
      dispatch(setColumns([]));
      dispatch(setData([]));
      dispatch(setError(''));
      const result = await fetchPlan(sql);
      if (result.error) {
        handleError(result.error);
      }
      else {
        dispatch(setPlan(result.plan));
      }
    } catch (error: Error | any) {
      console.error('Error fetching plan:', error);
      alert('Error fetching plan: ' + error.message);
    }
  }, [dispatch, handleError, sql]);

  const handleGo = useCallback(async (resumeIdx: number = 0) => {
    try {
      dispatch(setPlan(''));
      dispatch(setError(''));
      const result = await executeSql(sql, maxRows, resumeIdx);
      if (result.error) {
        handleError(result.error);
      }
      else {
        dispatch(setColumns(result.columns));
        dispatch(setData(result.data));
        dispatch(setPlanTime(result.planTime));
        dispatch(setExecTime(result.execTime));
        dispatch(setResumeIdx(resumeIdx + result.data.length));
        dispatch(setCurrentPage(resumeIdx / maxRows));
      }
    } catch (error: Error | any) {
      console.error('Error executing SQL:', error);
      alert('Error executing SQL: ' + error.message);
    }
  }, [dispatch, sql, maxRows, handleError]);

  const handleNextPage = useCallback(() => {
    handleGo(resumeIdx);
  }, [handleGo, resumeIdx]);

  const handlePreviousPage = useCallback(() => {
    const newResumeIdx = resumeIdx - maxRows * 2;
    if (newResumeIdx >= 0) {
      handleGo(newResumeIdx);
      dispatch(setResumeIdx(newResumeIdx));
    }
  }, [resumeIdx, maxRows, handleGo, dispatch]);

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
    <Container className="App" maxWidth={false}>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
        <TopNavBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <LeftSideDrawer open={open} handleDrawerClose={handleDrawerClose} />
      <Main open={open}>
        <DrawerHeader /> {/* This is to offset the size of the header */}

          <Box display="flex" sx={{ marginBottom: '10px', height: position - 125 }}>
            <SqlInputArea
              handleGo={() => handleGo(0)}
              handlePlan={handlePlan}
            />
          </Box>
          <ResizeBar
            dir={"horizontal"}
            isDragging={isDragging}
            {...separatorProps}
          />
          <Box sx={{ padding: '0px', margin: '0px', height: windowHeight - position - 90, maxWidth: windowWidth - (open ? drawerWidth : 0) - 100}}>
            {error && <ErrorPane error={error} />}
            {plan && <ExecutionPlan plan={plan} />}
            {data.length > 0 && (
                <ResultsTable
                  columns={columns}
                  data={data}
                  planTime={planTime}
                  execTime={execTime}
                  currentPage={currentPage}
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