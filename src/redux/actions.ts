import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    setColumns,
    setCurrentPage,
    setData,
    setError,
    setExecTime,
    setFirstRowIdx,
    setPlan,
    setPlanTime,
} from './resultsSlice';
import { setExecuting, setResumeIdx } from './sqlSlice';
import { executeSql } from '../service/executeSql';
import { SqlPlanResponse, SqlResponse } from '../service/serviceTypes';
import { Row } from '../db-types';
import { fetchPlan } from '../service/fetchPlan';
import { RootState } from './store';

export const NO_ROWS: Row[] = [['no rows']];

// Define executeSqlThunk here
export const handleSqlError = createAsyncThunk(
    'sql/handleSqlError',
    async (err: string, { dispatch }) => {
        dispatch(setColumns([]));
        dispatch(setData([]));
        dispatch(setPlan(''));
        dispatch(setError(err));
    },
);

// Define executeSqlThunk here
export const getSqlPlan = createAsyncThunk(
    'sql/getSqlPlan',
    async (_arg, { dispatch, getState }) => {
        try {
            const state = getState() as RootState;
            const { sql } = state.sql;
            dispatch(setColumns([]));
            dispatch(setData([]));
            dispatch(setError(''));
            const result = await fetchPlan(sql);
            if (!result.success) {
                dispatch(
                    handleSqlError(
                        result.detailedError || result.error || 'Unknown error',
                    ),
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
    },
);

// Define executeSqlThunk here
export const execSql = createAsyncThunk(
    'sql/executeSql',
    async (resIdx: number, { dispatch, getState }) => {
        try {
            const state = getState() as RootState;
            const { sql, maxRows } = state.sql;
            dispatch(setPlan(''));
            dispatch(setColumns([]));
            dispatch(setData([]));
            dispatch(setError(''));
            dispatch(setExecuting(true));
            const result = await executeSql(sql, maxRows, resIdx);
            dispatch(setExecuting(false));
            if (!result.success) {
                dispatch(
                    handleSqlError(
                        result.detailedError || result.error || 'Unknown error',
                    ),
                );
            } else {
                const respData: SqlResponse = result.data!;
                dispatch(setColumns(respData.columns));
                dispatch(
                    setData(respData.data.length > 0 ? respData.data : NO_ROWS),
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
);
