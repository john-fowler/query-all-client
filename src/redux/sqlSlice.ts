import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SqlState {
  sql: string;
  plan: string;
  columns: string[];
  data: any[][];
  maxRows: number;
  resumeIdx: number;
  currentPage: number;
}

const initialState: SqlState = {
  sql: '',
  plan: '',
  columns: [],
  data: [],
  maxRows: 100,
  resumeIdx: 0,
  currentPage: 0,
};

const sqlSlice = createSlice({
  name: 'sql',
  initialState,
  reducers: {
    setSql: (state, action: PayloadAction<string>) => {
      state.sql = action.payload;
    },
    setPlan: (state, action: PayloadAction<string>) => {
      state.plan = action.payload;
    },
    setColumns: (state, action: PayloadAction<string[]>) => {
      state.columns = action.payload;
    },
    setData: (state, action: PayloadAction<any[][]>) => {
      state.data = action.payload;
    },
    setMaxRows: (state, action: PayloadAction<number>) => {
      state.maxRows = action.payload;
    },
    setResumeIdx: (state, action: PayloadAction<number>) => {
      state.resumeIdx = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setSql, setPlan, setColumns, setData, setMaxRows, setResumeIdx, setCurrentPage } = sqlSlice.actions;

export default sqlSlice.reducer;