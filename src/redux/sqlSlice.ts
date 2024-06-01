import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SqlState {
    sql: string;
    maxRows: number;
    resumeIdx: number | undefined;
    selectionStart: number;
    selectionEnd: number;
    executing: boolean;
}

const initialState: SqlState = {
    sql: '',
    maxRows: parseInt(localStorage.getItem('maxRows') ?? '100', 10),
    resumeIdx: undefined,
    selectionStart: 0,
    selectionEnd: 0,
    executing: false,
};

const sqlSlice = createSlice({
    name: 'sql',
    initialState,
    reducers: {
        setSql: (state, action: PayloadAction<string>) => {
            state.sql = action.payload;
        },
        setMaxRows: (state, action: PayloadAction<number>) => {
            state.maxRows = action.payload;
            localStorage.setItem('maxRows', action.payload.toString()); // Save to local storage
        },
        setResumeIdx: (state, action: PayloadAction<number | undefined>) => {
            state.resumeIdx = action.payload;
        },
        setSelection: (
            state,
            action: PayloadAction<{
                selectionStart: number;
                selectionEnd: number;
            }>,
        ) => {
            state.selectionStart = action.payload.selectionStart;
            state.selectionEnd = action.payload.selectionEnd;
        },
        insertSqlToken: (state, action: PayloadAction<{ token: string }>) => {
            const { token } = action.payload;
            const priorChar = state.sql[state.selectionStart - 1];
            const priorIsLetter = priorChar && priorChar.match(/[a-z0-9]/i);
            state.sql =
                state.sql.slice(0, state.selectionStart) +
                (priorIsLetter ? ', ' : '') +
                token +
                state.sql.slice(state.selectionEnd);
            localStorage.setItem('sql', state.sql); // Save to local storage
            // Update selection to reflect new position
            state.selectionStart += token.length + (priorIsLetter ? 2 : 0);
            state.selectionEnd = state.selectionStart;
        },
        setExecuting: (state, action: PayloadAction<boolean>) => {
            state.executing = action.payload;
        },
    },
});

export const {
    setSql,
    setMaxRows,
    setResumeIdx,
    setSelection,
    insertSqlToken,
    setExecuting,
} = sqlSlice.actions;

export default sqlSlice.reducer;
