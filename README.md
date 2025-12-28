# Query All Client

Query All Client is a React + Redux web UI for running SQL-style queries against DynamoDB through a backend API. It provides a SQL editor, execution plans, result browsing, and a table catalog to help build queries. An optional chat assistant can stream responses and insert SQL into the editor.

## Features

- SQL editor with Go, Plan, and Cancel actions.
- Execution plan viewer.
- Results table with pagination and timing details.
- Table catalog drawer with search, primary key hints, and SQL token insertion.
- Chat assistant with streaming responses and a Use action for SQL snippets.

## Tech stack

- React 18 (Create React App)
- Redux Toolkit
- Material UI
- socket.io client
- react-resizable-layout

## Requirements

- Node.js and npm
- Backend API at `http://localhost:8080/v1`
- Socket.io server at `http://localhost:8080`

If your backend runs elsewhere, update `src/service/serviceTypes.ts` and `src/service/socket.ts`.

## Running locally

```bash
npm install
npm start
```

## Project structure

- `src/App.tsx` defines the main layout and pane wiring.
- `src/components` contains UI components for the editor, results, catalog, and chat.
- `src/redux` contains slices and async actions for SQL, results, catalog, and chat state.
- `src/service` contains API and socket clients.
- `docs` contains agent-friendly documentation for the project.

## Scripts

- `npm start` runs the dev server
- `npm run build` creates a production build
- `npm test` runs tests
- `npm run lint` runs ESLint
- `npm run lint:fix` fixes lint issues
- `npm run format` formats source files

## Docs for LLM agents

- `docs/PROJECT_OVERVIEW.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_FLOW.md`
