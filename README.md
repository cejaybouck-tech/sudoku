# Sudoku (React + TypeScript + Vite)

A playable Sudoku built with React, TypeScript, Vite, and Tailwind CSS. Features note‑taking, mistake tracking, and an on‑page puzzle generator.

## Features

- Interactive 9×9 grid with row/column/box highlights
- Notes mode to pencil in candidates per cell
- Answer mode to commit a value
- Mistake tracking (3 strikes — you lose)
- Win detection when the board is fully revealed
- Built‑in generator (Easy button) with difficulty logic under the hood

## Demo

- Local development instructions below. Deploy the built `dist/` to any static host.

## Getting Started

Prerequisites:
- Node.js 18+ and npm

Install and run:
```bash
npm install
npm run dev
```
Vite will serve at http://localhost:5173 by default.

Build and preview:
```bash
npm run build
npm run preview
```

## How to Play

- Click a cell to select it.
- Use the Answer/Notes toggle:
  - Answer: commits a number to the selected cell (if valid).
  - Notes: toggles candidate numbers in the selected cell.
- Select a number (1–9) from the keypad:
  - Invalid answers increment mistakes. 3+ mistakes = You Lose.
  - Candidates are shown as small numbers inside a cell.
- Click the “Easy” button to generate a new puzzle.

## Game Rules and Logic

- A move is valid if the number does not appear in the same row, column, or 3×3 section.
- When you place a valid answer:
  - Candidate notes for that number are automatically removed from the affected row, column, and section.
- Victory is detected when all 81 cells are revealed.

## Architecture Overview

- React + TypeScript + Vite
- Tailwind CSS for styling
- State shape
  - Grid stored as `Map<number, Map<number, Box>>`
  - `Box = { visible: boolean; answer?: number; notes: number[] }`
- Context providers in `SudokuContainer.tsx` expose:
  - Container (grid), Selected cell, Mistakes
- Key modules
  - `src/util/BuildSudoku.tsx` — generates a full valid grid and hides cells for difficulty
  - `src/util/CheckNumber.tsx` — validation helpers (row/col/section checks)
  - `src/util/SetAnswer.tsx` — immutable updates, note propagation/removal
  - UI components: `DisplayBox`, `Row`, `AnswerSelector`, `MistakeDisplay`

### Puzzle Generation

- Creates a valid solved board, then hides a subset of values based on difficulty settings.
- UI currently exposes an “Easy” button; other difficulty presets exist in code and can be wired to buttons.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type‑check and build for production
- `npm run preview` — preview the build locally
- `npm run lint` — run ESLint

## Project Structure

- `src/components/`
  - `SudokuContainer.tsx` — app state, context providers, layout
  - `DisplayBox.tsx` — a single cell (answer/notes rendering, selection)
  - `Row.tsx` — renders a row of cells
  - `AnswerSelector.tsx` — keypad and Answer/Notes toggle
  - `MistakeDisplay.tsx` — win/lose and strike indicators
- `src/util/`
  - `BuildSudoku.tsx` — grid generation and difficulty masking
  - `CheckNumber.tsx` — validity checks
  - `SetAnswer.tsx` — update helpers

## Roadmap Ideas

- Expose Medium/Hard/Expert buttons
- Unique‑solution enforcement and richer generator
- Keyboard controls and undo/redo
- Mobile‑first layout refinements and accessibility passes

## License

Add your preferred license (e.g., MIT) in a `LICENSE` file.
