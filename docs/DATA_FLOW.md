# Data Flow

This document summarizes how data moves through the UI for core user actions. File references point to the implementation points that orchestrate each flow.

## Query execution (Go and pagination)

1. The user clicks Go in `src/components/SqlInputArea.tsx`.
2. `src/App.tsx` calls the `execSql` thunk from `src/redux/actions.ts`.
3. `execSql` reads the SQL and max rows from `src/redux/sqlSlice.ts`, resets result state, and sets `executing`.
4. `execSql` calls `src/service/executeSql.ts`, which POSTs to `/v1/query` and returns an `ApiResponse<SqlResponse>`.
5. On success, `execSql` updates `src/redux/resultsSlice.ts` with columns, data, timing, and pagination, and updates `resumeIdx`.
6. `src/components/ResultsTable.tsx` renders the data and uses `resumeIdx` to request next/previous pages.

Canceling a query triggers `cancelExecution` in `src/service/executeSql.ts`, which aborts the in-flight request.

## Execution plan (Plan)

1. The user clicks Plan in `src/components/SqlInputArea.tsx`.
2. `src/App.tsx` calls the `getSqlPlan` thunk in `src/redux/actions.ts`.
3. `getSqlPlan` calls `src/service/fetchPlan.ts`, which POSTs to `/v1/query` with `planOnly: true`.
4. The plan text is stored in `src/redux/resultsSlice.ts` and rendered by `src/components/ExecutionPlan.tsx`.

## Table catalog browsing

1. `src/components/TableSelector.tsx` calls `listTables` on mount to fetch the table catalog from `/v1/tables`.
2. When a table is expanded, it calls `getTableDetails` to load columns and primary key info for that table.
3. Clicking a table or column calls `insertSqlToken` in `src/redux/sqlSlice.ts` to insert the token at the current cursor position.

## Chat assistant

1. The user enters a message in `src/components/ChatPane.tsx`.
2. `sendMessage` in `src/service/openAiApi.ts` emits a `sendMessage` event over the socket.
3. The backend streams responses on `receiveMessage`, and `appendAssistantChunk` in `src/redux/chatSlice.ts` appends text incrementally.
4. `src/components/ChatPane.tsx` renders the response and exposes a Use button for code blocks, which inserts SQL into the editor.
