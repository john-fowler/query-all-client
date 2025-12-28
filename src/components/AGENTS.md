# src/components/AGENTS.md

UI components for the SQL editor, results, catalog, and chat.

## Main layout

- `TopNavBar.tsx` toggles the drawer and chat pane.
- `LeftSideDrawer.tsx` houses the table catalog search and list.
- `Main.tsx` and `DrawerHeader.tsx` handle layout spacing.
- `ResizeBar.tsx` renders draggable dividers.

## Query editor and results

- `SqlInputArea.tsx` manages SQL input, Go/Plan/Cancel actions, and row limits.
- `ResultsTable.tsx` renders results with pagination controls.
- `ExecutionPlan.tsx` shows plan text.
- `ErrorPane.tsx` shows query errors.

## Catalog

- `TableSelector.tsx` fetches table metadata and inserts tokens into the SQL editor.

## Chat

- `ChatPane.tsx` renders chat threads, streams assistant replies, and inserts SQL snippets.

## Notes

- Most components rely on Redux state and service calls; avoid duplicating data fetching logic.
