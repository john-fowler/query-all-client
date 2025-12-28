# src/service/AGENTS.md

Service clients for REST and socket.io.

## Base URLs

- REST API base URL is `API_BASE_URL` in `serviceTypes.ts`.
- Socket.io URL is in `socket.ts`.

## REST calls

- `executeSql.ts` posts to `/v1/query`, supports `maxRows` and `resumeIdx`, and uses an AbortController for cancellation.
- `fetchPlan.ts` posts to `/v1/query` with `planOnly: true`.
- `listTables.ts` and `getTableDetails.ts` read metadata from `/v1/tables`.

## Chat streaming

- `openAiApi.ts` emits `sendMessage` and listens for `receiveMessage` events.
- Messages are streamed and appended to the active thread.

## Notes

- Keep `ApiResponse` types aligned with backend responses.
- If endpoints change, update services and any dependent thunks in `src/redux/actions.ts`.
