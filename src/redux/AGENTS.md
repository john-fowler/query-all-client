# src/redux/AGENTS.md

Redux Toolkit slices and async thunks live here.

## Store

- `store.ts` wires the reducers into a single store.

## Slices

- `sqlSlice.ts` stores SQL text, max rows, selection range, and execution state. Persists SQL and max rows to `localStorage`.
- `resultsSlice.ts` stores columns, data rows, plan text, errors, timings, and pagination metadata.
- `catalogSlice.ts` stores table metadata and the table filter string.
- `chatSlice.ts` stores chat threads and streaming assistant messages.

## Async actions

- `actions.ts` defines `execSql` and `getSqlPlan` using `createAsyncThunk`.
- These call the service layer in `src/service` and then update slice state.

## Notes

- Keep slice state normalized and focused on UI needs.
- If API responses change, update `serviceTypes.ts` and any dependent thunks.
