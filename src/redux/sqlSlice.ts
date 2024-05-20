import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableMetadata } from '../types';

interface SqlState {
  sql: string;
  plan: string;
  columns: string[];
  data: any[][];
  planTime: number;
  execTime: number;
  maxRows: number;
  resumeIdx: number;
  currentPage: number;
  tables: TableMetadata[];
  tableFilter: string;
}

const initialState: SqlState = {
  sql: '',
  plan: '',
  columns: [],
  data: [],
  planTime: 0,
  execTime: 0,
  maxRows: 100,
  resumeIdx: 0,
  currentPage: 0,
  tables: [],
  tableFilter: '',
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
    setPlanTime: (state, action: PayloadAction<number>) => {
      state.planTime = action.payload;
    },
    setExecTime: (state, action: PayloadAction<number>) => {
      state.execTime = action.payload;
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
    setTables: (state, action: PayloadAction<TableMetadata[]>) => {
      state.tables = action.payload;
    },
    updateTable: (state, action: PayloadAction<TableMetadata>) => {
      const index = state.tables.findIndex(t => t.name === action.payload.name);
      if (index !== -1) {
        state.tables[index] = action.payload;
      }
    },
    setTableFilter: (state, action: PayloadAction<string>) => {
      state.tableFilter = action.payload;
    }
  },
});

export const { setSql, setPlan, setColumns, setData, setPlanTime, setExecTime, setMaxRows, setResumeIdx, setCurrentPage, setTables, updateTable, setTableFilter } = sqlSlice.actions;

export default sqlSlice.reducer;