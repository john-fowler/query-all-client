import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableMetadata } from '../db-types';

interface CatalogState {
    tables: TableMetadata[];
    tableFilter: string;
}

const initialState: CatalogState = {
    tables: [],
    tableFilter: '',
};

const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {
        setTables: (state, action: PayloadAction<TableMetadata[]>) => {
            state.tables = action.payload;
        },
        updateTable: (state, action: PayloadAction<TableMetadata>) => {
            const index = state.tables.findIndex(
                (t) => t.name === action.payload.name,
            );
            if (index !== -1) {
                state.tables[index] = action.payload;
            }
        },
        setTableFilter: (state, action: PayloadAction<string>) => {
            state.tableFilter = action.payload;
        },
    },
});

export const { setTables, updateTable, setTableFilter } = catalogSlice.actions;

export default catalogSlice.reducer;
