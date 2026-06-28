# kanban-board

Drag-and-drop Kanban board. Everything saves to localStorage.

## Features

- Drag cards between columns using the HTML5 Drag API
- Add, rename, and delete columns
- Cards have title, description, priority, and due date
- Overdue cards get a red highlight
- Columns show card count

## Run

```bash
npm install
npm run dev
```

## Notes

State is entirely in localStorage. There is no backend. Refreshing the page preserves your board; clearing browser data wipes it. Export/import as JSON is on the todo list.