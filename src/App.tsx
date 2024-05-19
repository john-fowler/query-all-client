import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import { Container, Paper } from '@mui/material';
import './App.css';
import SqlInputArea from './components/SqlInputArea';
import ExecutionPlan from './components/ExecutionPlan';
import ResultsTable from './components/ResultsTable';
import { fetchPlan, executeSql } from './apiService';
import { useResizable } from 'react-resizable-layout';
import SampleSplitter from './components/SampleSplitter';
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
    <Container className="container-full-width App" maxWidth={false}>

      <Paper elevation={3} className="top-container" style={{ padding: '20px', marginTop: '20px', marginBottom: '20px', height: position - 80 }}>
        <SqlInputArea
          handleGo={() => handleGo(0)}
          handlePlan={handlePlan}
        />
      </Paper>
      <SampleSplitter
        dir={"horizontal"}
        isDragging={isDragging}
        {...separatorProps}
      />
      {plan && <ExecutionPlan plan={plan} />}
      {data.length > 0 && (

        <Paper elevation={3} style={{ padding: '0px', marginBottom: '0px', height: windowHeight - position - 20}}>
          <ResultsTable
            columns={columns}
            data={data}
            currentPage={currentPage}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            height={window.innerHeight - position - 20}
          />
        </Paper>
      )}
    </Container>
  );
};

export default App;