import React, { useState } from 'react';
import { Container, Paper } from '@mui/material';
import './App.css';
import SqlInputArea from './components/SqlInputArea';
import ExecutionPlan from './components/ExecutionPlan';
import ResultsTable from './components/ResultsTable';
import { fetchPlan, executeSql } from './apiService';
import { useResizable } from 'react-resizable-layout';
import SampleSplitter from './components/SampleSplitter';

const App: React.FC = () => {
  const [sql, setSql] = useState('');
  const [plan, setPlan] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<any[][]>([]);
  const [maxRows, setMaxRows] = useState<number>(100);
  const [resumeIdx, setResumeIdx] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { position, isDragging, separatorProps } = useResizable({
    axis: 'y',
    initial: 250,
    min: 250
  })

  const handlePlan = async () => {
    try {
      setColumns([]);
      setData([]);
      const result = await fetchPlan(sql);
      setPlan(result.plan);
    } catch (error: Error | any) {
      console.error('Error fetching plan:', error);
      alert('Error fetching plan: ' + error.message);
    }
  };

  const handleGo = async (resumeIdx: number = 0) => {
    try {
      setPlan('');
      const result = await executeSql(sql, maxRows, resumeIdx);
      setColumns(result.columns);
      setData(result.data);
      setResumeIdx(resumeIdx + result.data.length);
      setCurrentPage(resumeIdx / maxRows);
    } catch (error: Error | any) {
      console.error('Error executing SQL:', error);
      alert('Error executing SQL: ' + error.message);
    }
  };

  const handleNextPage = () => {
    handleGo(resumeIdx);
  };

  const handlePreviousPage = () => {
    const newResumeIdx = resumeIdx - maxRows * 2;
    if (newResumeIdx >= 0) {
      handleGo(newResumeIdx);
      setResumeIdx(newResumeIdx);
    }
  };

  return (
    <Container className="container-full-width App" maxWidth={false}>

      <Paper elevation={3} className="top-container" style={{ padding: '20px', marginTop: '20px', marginBottom: '20px', height: position - 80 }}>
        <SqlInputArea
          sql={sql}
          setSql={setSql}
          maxRows={maxRows}
          setMaxRows={setMaxRows}
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

        <Paper elevation={3} style={{ padding: '0px', marginBottom: '0px', height: window.innerHeight - position - 20}}>
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