# Architecture

This project is a Create React App (CRA) single-page app with Redux Toolkit state management. Material UI supplies the UI components and styling. Data is fetched from a backend service and shown in resizable panes.

## High-level layout

The main layout is wired in `src/App.tsx`:

- `TopNavBar` toggles the table drawer and the chat pane.
- `LeftSideDrawer` shows the table catalog with search and insertion helpers.
- The main content area contains:
  - `SqlInputArea` for query text and actions.
  - A horizontal resize bar between editor and results.
  - Results area that shows either `ErrorPane`, `ExecutionPlan`, or `ResultsTable`.
  - Optional `ChatPane` on the right with a vertical resize bar.

Resizing is driven by `react-resizable-layout` and the custom `ResizeBar` component.

## State slices

Redux slices live in `src/redux`:

- `sqlSlice` manages the SQL text, pagination cursor, selection range, and execution state. It also persists SQL and max rows to `localStorage`.
- `resultsSlice` stores columns, data rows, plan text, errors, timing, and pagination metadata.
- `catalogSlice` stores the table catalog and the filter string.
- `chatSlice` stores chat threads and messages with a default placeholder thread.

Async orchestration lives in `src/redux/actions.ts` and uses `createAsyncThunk`.

## Service layer

The UI talks to a backend via fetch and socket.io in `src/service`:

- `executeSql.ts` posts to `/v1/query` and uses an `AbortController` to cancel in-flight queries.
- `fetchPlan.ts` posts to `/v1/query` with `planOnly: true`.
- `listTables.ts` and `getTableDetails.ts` read table catalog metadata from `/v1/tables`.
- `openAiApi.ts` uses socket.io (`sendMessage` / `receiveMessage`) to stream assistant responses.
- `serviceTypes.ts` centralizes response types and the base API URL.
- `socket.ts` creates the socket.io client.

## Data models

Type definitions for table metadata and query results live in `src/db-types.ts`. These types are used across slices and services for consistent typing.
