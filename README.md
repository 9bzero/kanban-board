<div align="center">

  # Kanban Board

  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

  **Drag-and-drop Kanban board for visual project management — built with zero external DnD libraries.**

  </div>

  ---

  ## Features

  - **4 columns** — Backlog · To Do · In Progress · Done
  - **Drag & drop** — native HTML5 DnD API, no external library needed
  - **Priority labels** — Low · Medium · High with color coding
  - **Persistent** — saves to `localStorage`, survives page refresh
  - **Dark theme** — designed for long work sessions

  ## Getting Started

  ```bash
  npm install && npm run dev
  ```

  ## How Drag & Drop Works

  Uses the native browser `DragEvent` API — no React DnD or other dependencies:

  ```tsx
  // On card: draggable + onDragStart stores card id + source column
  <div draggable onDragStart={() => onDragStart(card.id, col.id)} />

  // On column: onDragOver prevents default + onDrop moves the card
  <div onDragOver={e => e.preventDefault()} onDrop={() => onDrop(col.id)} />
  ```

  State is managed with a single `useState<Column[]>` — clean and predictable.

  ---

  <div align="center">Made with TypeScript · Part of my <a href="https://github.com/9bzero">developer portfolio</a></div>
  