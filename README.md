# Sudoku

A fully playable Sudoku built with React, TypeScript, Vite, and Tailwind CSS.

🔗 **[Live Demo](https://very-simple-sudoku.vercel.app)**

---

## Features

- Interactive 9×9 grid with row, column, and box highlights
- **Answer mode** — commit a number to a selected cell
- **Notes mode** — pencil in candidate numbers per cell
- Automatic note propagation — placing an answer removes that candidate from all affected rows, columns, and sections
- Mistake tracking with 3-strike loss condition
- Win detection when all 81 cells are revealed
- On-page puzzle generator using a deterministic algorithm with cell-masking for difficulty

---

## Tech Stack

| Layer | Tech |
|---|---|
| UI | React 18, TypeScript, Tailwind CSS |
| Build | Vite |
| Deploy | Vercel |

---

## Architecture

State is managed via React Context with three providers exposed from `SudokuContainer.tsx`:

- **Container** — the full grid as `Map<number, Map<number, Box>>`
- **Selected** — the currently selected cell
- **Mistakes** — current strike count

Each cell is typed as:
```ts
type Box = {
  visible: boolean;
  answer?: number;
  notes: number[];
}
```

### Key Modules

| File | Responsibility |
|---|---|
| `src/util/BuildSudoku.tsx` | Deterministic puzzle generation and cell masking |
| `src/util/CheckNumber.tsx` | Row / column / section validation |
| `src/util/SetAnswer.tsx` | Immutable grid updates and note propagation |
| `src/components/SudokuContainer.tsx` | App state, context providers, layout |
| `src/components/DisplayBox.tsx` | Single cell rendering (answer + notes) |
| `src/components/AnswerSelector.tsx` | Number keypad and mode toggle |
| `src/components/MistakeDisplay.tsx` | Win/lose state and strike indicators |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # type-check and build
npm run preview    # preview the build locally
npm run lint       # ESLint
```

---

## How to Play

1. Click a cell to select it
2. Toggle between **Answer** and **Notes** mode using the selector
3. Click a number (1–9) from the keypad
   - In Answer mode: commits the number if valid; increments mistakes if not
   - In Notes mode: toggles that number as a candidate in the cell
4. Click **Easy** to generate a new puzzle
5. Three mistakes ends the game

---

## License

MIT
