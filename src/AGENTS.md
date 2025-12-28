# src/AGENTS.md

This folder contains the React app source.

## Entry points

- `src/index.tsx` mounts the Redux store and renders `App`.
- `src/App.tsx` defines the primary layout and pane wiring.

## Key folders

- `src/components` UI components for SQL input, results, catalog, and chat.
- `src/redux` Redux Toolkit slices and async thunks.
- `src/service` API and socket clients.

## Shared types

- `src/db-types.ts` defines table metadata and query result types.
- `src/enums.ts` defines column type enums.

## Notes

- SQL text and max rows are stored in `localStorage` by `sqlSlice`.
- Execution requests are abortable via `executeSql`.
