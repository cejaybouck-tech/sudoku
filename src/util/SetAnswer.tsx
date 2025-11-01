import { Box, Coordinate } from "../components/SudokuContainer";

export function buildWithAnswer(
  answer: number,
  coordinate: Coordinate,
  container: Map<number, Map<number, Box>>
) {
  const newContainer = new Map(container);
  removeRowNotes(answer, coordinate, newContainer);
  removeColNotes(answer, coordinate, newContainer);
  removeSectionNotes(answer, coordinate, newContainer);
  newContainer
    .get(coordinate.row)
    ?.set(coordinate.col, { answer: answer, visible: true, notes: [] });
  return newContainer;
}

export function buildWithNote(
  note: number,
  coordinate: Coordinate,
  container: Map<number, Map<number, Box>>
) {
  const newContainer = new Map(container);
  const box = newContainer.get(coordinate.row)?.get(coordinate.col);
  if (box?.notes.includes(note)) {
    const newNotes: Array<number> = box?.notes.filter(
      (noteCheck) => noteCheck !== note
    ) as Array<number>;
    newContainer.get(coordinate.row)?.set(coordinate.col, {
      answer: undefined,
      visible: false,
      notes: newNotes,
    });
    return newContainer;
  }

  box?.notes.push(note);
  return newContainer;
}

export function setAnswer(
  answer: number,
  coordinate: Coordinate,
  container: Map<number, Map<number, Box>>
) {
  removeRowNotes(answer, coordinate, container);
  removeColNotes(answer, coordinate, container);
  removeSectionNotes(answer, coordinate, container);
  container
    .get(coordinate.row)
    ?.set(coordinate.col, { answer: answer, visible: true, notes: [] });
}

function removeRowNotes(
  answer: number,
  coordinate: Coordinate,
  container: Map<number, Map<number, Box>>,
  skipSection: boolean = false
) {
  const row = container.get(coordinate.row);
  const colStart = coordinate.col - (coordinate.col % 3);

  for (let i = 0; i < 9; i++) {
    if (coordinate.col === i) continue;
    if (skipSection && i >= colStart && i <= colStart + 2) continue;
    const box = row?.get(i) as Box;
    const newBox = removeNote(box, answer);
    row?.set(i, newBox);
  }
}

function removeColNotes(
  answer: number,
  coordinate: Coordinate,
  container: Map<number, Map<number, Box>>,
  skipSection: boolean = false
) {
  const rowStart = coordinate.row - (coordinate.row % 3);

  for (let i = 0; i < 9; i++) {
    if (coordinate.row === i) continue;
    if (skipSection && i >= rowStart && i <= rowStart + 2) continue;
    const row = container.get(i);
    const box = row?.get(coordinate.col) as Box;
    const newBox = removeNote(box, answer);
    row?.set(coordinate.col, newBox);
  }
}

function removeSectionNotes(
  answer: number,
  coordinate: Coordinate,
  container: Map<number, Map<number, Box>>
) {
  const rowStart = coordinate.row - (coordinate.row % 3);
  const colStart = coordinate.col - (coordinate.col % 3);
  for (let row = rowStart; row < rowStart + 3; row++) {
    for (let col = colStart; col < colStart + 3; col++) {
      const box = container.get(row)?.get(col) as Box;
      const newBox = removeNote(box, answer);
      container.get(row)?.set(col, newBox);
    }
  }
}

function removeNote(box: Box, answer: number) {
  const newNotes = box.notes.filter((note) => note !== answer);

  const newBox = {
    answer: box.answer,
    visible: box.visible,
    notes: newNotes,
  } as Box;

  return newBox;
}
