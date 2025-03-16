import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import Box from "./DisplayBox";
import Row from "./Row";
import AnswerSelector from "./AnswerSelector";
import buildSudokuContainer, {
  buildEmptyContainer,
  Difficulty,
} from "../util/BuildSudoku";

export interface Box {
  visible: boolean;
  answer: number | undefined;
  notes: Array<number>;
}

export interface Coordinate {
  row: number;
  col: number;
  answer: number | undefined;
}

interface SudokuContext {
  container: Map<number, Map<number, Box>>;
  setContainer: Dispatch<SetStateAction<Map<number, Map<number, Box>>>>;
}

interface SelectContext {
  selected: Coordinate;
  setSelected: Dispatch<SetStateAction<Coordinate>>;
}

export const Container = createContext<SudokuContext>({} as SudokuContext);
export const Selected = createContext<SelectContext>({} as SelectContext);

function SudokuContainer() {
  const [container, setContainer] = useState<Map<number, Map<number, Box>>>(
    buildEmptyContainer()
  );
  const [selected, setSelected] = useState<Coordinate>({
    row: -1,
    col: -1,
    answer: undefined,
  } as Coordinate);

  const scrambleContainer = (e: React.MouseEvent) => {
    e.preventDefault();
    setContainer(buildSudokuContainer());
    setSelected({} as Coordinate);
  };

  const emptyRows = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return (
    <section className="flex flex-col justify-center items-center w-full h-full">
      <Container.Provider value={{ container, setContainer }}>
        <Selected.Provider value={{ selected, setSelected }}>
          {emptyRows.map((value, index) => (
            <Row key={"rowkey-" + index} rowId={index} />
          ))}
          <AnswerSelector />
        </Selected.Provider>
      </Container.Provider>
      <button
        onClick={scrambleContainer}
        className="mt-4 border rounded-lg p-2 hover:bg-gray-300"
      >
        Scramble
      </button>
    </section>
  );
}

function oldBuildSudokuContainer(
  difficulty: Difficulty = { numbers: 26, missingNumbers: 0 }
) {
  const container = buildEmptyContainer();
  const columnsUsed = new Map();
  const rowsUsed = new Map();
  const randAnswers = shuffledNumberAmt(difficulty);

  for (let x = 0; x < randAnswers.length; x++) {
    buildNumber(
      x + 1,
      rowsUsed,
      columnsUsed,
      container,
      shuffledSections(randAnswers[x])
    );
  }

  return container;
}

function buildNumber(
  answer: number,
  rowsUsed: Map<number, Map<number, number>>,
  columnsUsed: Map<number, Map<number, number>>,
  container: Map<number, Map<number, Box>>,
  coordinates: Array<Array<number>>
) {
  if (coordinates.length < 1) return;

  console.log(coordinates);

  const rowStart = coordinates[0][0];
  const colStart = coordinates[0][1];
  const rowRand = Math.floor(Math.random() * 3) + rowStart;
  const colRand = Math.floor(Math.random() * 3) + colStart;
  let found = false;
  let loopFailed = false;

  console.log(" ");
  console.log("------------------ Number:", answer);
  console.log("row:", rowRand, "col:", colRand);
  console.log("rowStart:", rowStart, "colStart:", colStart);

  let row = rowRand;
  let rowCount = 0;
  /* search row */
  while (!found) {
    let col = colRand;
    let colCount = 0;
    /* search col */
    while (colCount < 3) {
      found = fillSection(answer, row, col, rowsUsed, columnsUsed, container);
      if (found) break;

      col++;
      colCount++;
      if (col > colStart + 2) col = colStart;
    }

    if (found) break;

    row++;
    rowCount++;
    if (row > rowStart + 2) row = rowStart;
    console.log("change row", row);

    //infinite loop failsafe
    if (rowCount > 2) {
      console.log("Failed to find slot for:", answer);
      console.log("section:", coordinates[0]);
      loopFailed = true;
      return;
    }
  }

  coordinates.splice(0, 1);
  if (loopFailed) return;
  buildNumber(answer, rowsUsed, columnsUsed, container, coordinates);
}

function fillSection(
  answer: number,
  row: number,
  col: number,
  rowsUsed: Map<number, Map<number, number>>,
  columnsUsed: Map<number, Map<number, number>>,
  container: Map<number, Map<number, Box>>
) {
  console.log("attempt -", "row:", row, "col:", col);
  //check if curr box is used
  const currBox = container.get(row)?.get(col)?.answer;
  if (currBox && currBox > 0) return false;

  //check if column is open
  const currCol = columnsUsed.get(col);
  if (currCol?.has(answer)) return false;

  //check if row is open
  const currRow = rowsUsed.get(row);
  if (currRow?.has(answer)) return false;

  console.log("setting number at: ", "row: " + row + " col:" + col);

  //build col/row if not built
  if (!columnsUsed.has(col)) columnsUsed.set(col, new Map());
  if (!rowsUsed.has(row)) rowsUsed.set(row, new Map());

  //add to col/rows
  rowsUsed.get(row)?.set(answer, answer);
  columnsUsed.get(col)?.set(answer, answer);

  //add to container
  container.get(row)?.set(col, createBox(answer));
  console.log("cols:", columnsUsed);
  console.log("rows:", rowsUsed);
  return true;
}

function buildSection(
  section: number,
  rowStart: number,
  colStart: number,
  rowsUsed: Map<number, Map<number, number>>,
  columnsUsed: Map<number, Map<number, number>>,
  container: Map<number, Map<number, Box>>,
  numbPool: Array<number>
) {
  if (numbPool.length < 1) return;
  let spotFound = false;

  console.log("---- Answer Start:", numbPool[0]);
  //console.log("columns: ", columnsUsed);
  //console.log("rows: ", rowsUsed);
  for (let row = rowStart; row < rowStart + 3; row++) {
    for (let col = colStart; col < colStart + 3; col++) {
      //make sure row/col used are built
      if (!columnsUsed.has(col)) columnsUsed.set(col, new Map());
      if (!rowsUsed.has(row)) rowsUsed.set(row, new Map());

      //check if curr box is used
      const currBox = container.get(row)?.get(col)?.answer;
      if (currBox && currBox > 0) continue;

      //check if column is open
      const currCol = columnsUsed.get(col);
      if (currCol?.has(numbPool[0])) {
        console.log("Col failed - swap start");
        spotFound = swapInSection(
          section,
          rowStart,
          colStart,
          rowsUsed,
          columnsUsed,
          container,
          numbPool,
          { row, col }
        );
        break;
      }

      //check if row is open
      const currRow = rowsUsed.get(row);
      if (currRow?.has(numbPool[0])) {
        console.log("row failed - swap start");
        spotFound = swapInSection(
          section,
          rowStart,
          colStart,
          rowsUsed,
          columnsUsed,
          container,
          numbPool,
          { row, col }
        );
        break;
      }

      console.log("Slot empty - adding answer");
      //set box at current location
      rowsUsed.get(row)?.set(numbPool[0], section);
      columnsUsed.get(col)?.set(numbPool[0], section);
      container.get(row)?.set(col, createBox(numbPool[0]));
      numbPool.splice(0, 1);
      spotFound = true;
      break;
    }
    if (spotFound) break;
  }

  if (!spotFound) return;

  buildSection(
    section,
    rowStart,
    colStart,
    rowsUsed,
    columnsUsed,
    container,
    numbPool
  );
}

function swapInSection(
  section: number,
  rowStart: number,
  colStart: number,
  rowsUsed: Map<number, Map<number, number>>,
  columnsUsed: Map<number, Map<number, number>>,
  container: Map<number, Map<number, Box>>,
  numbPool: Array<number>,
  switchSpot: { row: number; col: number }
) {
  let found = false;

  for (let row = rowStart; row < rowStart + 3; row++) {
    for (let col = colStart; col < colStart + 3; col++) {
      //make sure row/col used are built
      if (!columnsUsed.has(col)) columnsUsed.set(col, new Map());
      if (!rowsUsed.has(row)) rowsUsed.set(row, new Map());

      //check if column is open
      const currCol = columnsUsed.get(col);
      if (currCol?.has(numbPool[0]) && currCol.get(numbPool[0]) !== section)
        continue;
      console.log("swap - answer column check pass");

      //check if row is open
      const currRow = rowsUsed.get(row);
      if (currRow?.has(numbPool[0]) && currRow.get(numbPool[0]) !== section)
        continue;
      console.log("swap - answer row check pass");

      const shift = container.get(row)?.get(col)?.answer as number;

      //check if col is open for the shift at switch spot
      const shiftCol = columnsUsed.get(switchSpot.col);
      if (shiftCol?.has(shift) && shiftCol.get(shift) !== section) continue;
      console.log("swap - shift column check pass");

      //check if row is open for the shift at switch spot
      const shiftRow = rowsUsed.get(switchSpot.row);
      if (shiftRow?.has(shift) && shiftRow.get(shift) !== section) continue;
      console.log("swap - shift row check pass");

      console.log("swap - Swapping " + numbPool[0] + " with " + shift);
      console.log("swap start:", switchSpot);
      console.log("swap to: ", "row: " + row + " col: " + col);
      //add front of numbpool to sudoku spot and used maps
      container.get(row)?.set(col, createBox(numbPool[0]));
      rowsUsed.get(row)?.set(numbPool[0], section);
      columnsUsed.get(row)?.set(numbPool[0], section);

      //add shift back into the pool of numbers and remove current number in pool
      if (shift > 0) numbPool.push(shift);
      numbPool.splice(0, 1);
      found = true;
      break;
    }

    if (found) break;
  }

  return found;
}

function shuffledNumberAmt(difficulty: Difficulty) {
  const array = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  const numbersPer = Math.floor(
    difficulty.numbers / (9 - difficulty.missingNumbers)
  );
  let extra = difficulty.numbers % (9 - difficulty.missingNumbers);
  for (let i = 0; i < 9 - difficulty.missingNumbers; i++) {
    let amt = numbersPer;
    if (extra > 0) ++amt;
    array[i] = amt;
    --extra;
  }

  for (let i = 0; i < array.length; i++) {
    const random = Math.floor(Math.random() * (i + 1));
    [array[i], array[random]] = [array[random], array[i]];
  }

  return array;
}

function shuffledSections(numberAmt: number) {
  const coordinates = [
    [0, 0],
    [3, 0],
    [6, 0],
    [0, 3],
    [3, 3],
    [6, 3],
    [0, 6],
    [3, 6],
    [6, 6],
  ];

  for (let i = 0; i < coordinates.length; i++) {
    const random = Math.floor(Math.random() * (i + 1));
    [coordinates[i], coordinates[random]] = [
      coordinates[random],
      coordinates[i],
    ];
  }

  return coordinates.splice(0, numberAmt);
}

function createBox(answer: number) {
  return { visible: true, answer: answer, notes: [] } as Box;
}

export default SudokuContainer;
