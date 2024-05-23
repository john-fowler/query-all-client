import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Row } from '../db-types';

interface ResultsState {
    error: string;
    plan: string;
    columns: string[];
    data: Row[];
    planTime: number;
    execTime: number;
    currentPage: number;
    firstRowIdx: number;
}

const initialState: ResultsState = {
    error: '',
    plan: '',
    columns: [],
    data: [],
    planTime: 0,
    execTime: 0,
    currentPage: 0,
    firstRowIdx: 0,
};

const resultsSlice = createSlice({
    name: 'results',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        setPlan: (state, action: PayloadAction<string>) => {
            state.plan = action.payload;
        },
        setColumns: (state, action: PayloadAction<string[]>) => {
            state.columns = action.payload;
        },
        setData: (state, action: PayloadAction<Row[]>) => {
            state.data = action.payload;
        },
        setPlanTime: (state, action: PayloadAction<number>) => {
            state.planTime = action.payload;
        },
        setExecTime: (state, action: PayloadAction<number>) => {
            state.execTime = action.payload;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setFirstRowIdx: (state, action: PayloadAction<number>) => {
            state.firstRowIdx = action.payload;
        },
    },
});

export const {
    setError,
    setPlan,
    setColumns,
    setData,
    setPlanTime,
    setExecTime,
    setCurrentPage,
    setFirstRowIdx,
} = resultsSlice.actions;

export default resultsSlice.reducer;
