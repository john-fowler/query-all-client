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
import { setPlan, setColumns, setData, setResumeIdx, setCurrentPage } from './redux/sqlSlice';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sql, plan, columns, data, maxRows, resumeIdx, currentPage } = useSelector((state: RootState) => state.sql);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const { position, isDragging, separatorProps } = useResizable({
    axis: 'y',
    initial: 250,
    min: 250
  })

  const handlePlan = useCallback(async () => {
    try {
      dispatch(setColumns([]));
      dispatch(setData([]));
      const result = await fetchPlan(sql);
      dispatch(setPlan(result.plan));
    } catch (error: Error | any) {
      console.error('Error fetching plan:', error);
      alert('Error fetching plan: ' + error.message);
    }
  }, [dispatch, sql]);

  const handleGo = useCallback(async (resumeIdx: number = 0) => {
    try {
      dispatch(setPlan(''));
      const result = await executeSql(sql, maxRows, resumeIdx);
      dispatch(setColumns(result.columns));
      dispatch(setData(result.data));
      dispatch(setResumeIdx(resumeIdx + result.data.length));
      dispatch(setCurrentPage(resumeIdx / maxRows));
    } catch (error: Error | any) {
      console.error('Error executing SQL:', error);
      alert('Error executing SQL: ' + error.message);
    }
  }, [dispatch, sql, maxRows]);

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
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container className="App" maxWidth={false}>

      <Box display="flex" sx={{ margin: '20px 0px', height: position - 40 }}>
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
      <Box sx={{ padding: '0px', margin: '0px', height: windowHeight - position - 60}}>
        {plan && <ExecutionPlan plan={plan} />}
        {data.length > 0 && (

            <ResultsTable
              columns={columns}
              data={data}
              currentPage={currentPage}
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
              height={window.innerHeight - position - 20}
            />
        )}
      </Box>
    </Container>
  );
};

export default App;