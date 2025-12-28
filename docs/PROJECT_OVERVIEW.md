# Project Overview

Query All Client is a React + Redux web UI for running SQL-style queries against DynamoDB through a backend API. It focuses on fast iteration on queries, visibility into execution plans, and a table catalog to help build SQL.

## What the app does

- SQL editor with Go, Plan, and Cancel actions.
- Results table with pagination and timing details.
- Execution plan viewer.
- Table catalog drawer with searchable table/column list and SQL token insertion.
- Optional chat assistant that streams responses and can insert SQL into the editor.

## Runtime dependencies

- REST API at `http://localhost:8080/v1` for tables and query execution.
- Socket.io server at `http://localhost:8080` for chat streaming.
- Endpoints are hard-coded in `src/service/serviceTypes.ts` and `src/service/socket.ts`.

## Key entry points

- `src/index.tsx` mounts the Redux provider and renders the app.
- `src/App.tsx` defines the layout, panes, and primary UI wiring.
- `src/redux` contains state slices and async actions.
- `src/service` contains API and socket clients.

## Local persistence

- SQL text and the max rows setting are stored in `localStorage`.

## Where to read next

- `docs/ARCHITECTURE.md`
- `docs/DATA_FLOW.md`
