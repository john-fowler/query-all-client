# AGENTS.md

Query All Client is a Create React App UI for running SQL-style queries against DynamoDB through a backend API. It focuses on query editing, execution plans, results browsing, and a table catalog. An optional chat assistant streams responses over socket.io.

## Quick start

- Install and run: `npm install`, then `npm start`.
- Tests: `npm test`.
- Linting: `npm run lint` or `npm run lint:fix`.
- Formatting: `npm run format`.

## Runtime dependencies

- REST API base URL: `http://localhost:8080/v1`.
- Socket.io server: `http://localhost:8080`.
- Update endpoints in `src/service/serviceTypes.ts` and `src/service/socket.ts`.

## Key entry points

- `src/index.tsx` mounts the Redux store and renders the app.
- `src/App.tsx` defines the main layout and pane wiring.
- `src/components` contains UI components.
- `src/redux` contains state slices and async thunks.
- `src/service` contains API and socket clients.

## Local persistence

- SQL text and max rows are stored in `localStorage`.

## Agent docs

- `docs/PROJECT_OVERVIEW.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_FLOW.md`

## Guardrails

- Keep API response types in sync with `src/service/serviceTypes.ts`.
- If the backend contract changes, update thunks in `src/redux/actions.ts`.
- Prefer updating documentation and AGENTS files when behavior changes.
