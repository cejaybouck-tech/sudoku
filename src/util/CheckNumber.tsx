import { Box, Coordinate } from "../components/SudokuContainer";

export function isAvailable(
  answer: number,
  coordinate: Coordinate,
  container: Map<number, Map<number, Box>>
) {
  if (isInRow(answer, coordinate, container)) return false;

  if (isInCol(answer, coordinate, container)) return false;

  if (isInSection(answer, coordinate, container)) return false;

  return true;
}

export function isInRow(
  answer: number,
  coordinate: Coordinate,
  container: Map<number, Map<number, Box>>
) {
  const row = container.get(coordinate.row);

  for (let i = 0; i < 9; i++) {
    if (i === coordinate.col) continue;

    if (row?.get(i)?.answer === answer) return true;
  }

  return false;
}

export function isInCol(
  answer: number,
  coordinate: Coordinate,
  container: Map<number, Map<number, Box>>
) {
  for (let i = 0; i < 9; i++) {
    if (i === coordinate.row) continue;

    const answerCheck = container.get(i)?.get(coordinate.col)?.answer;

    if (answerCheck === answer) return true;
  }

  return false;
}

export function isInSection(
  answer: number,
  coordinate: Coordinate,
  container: Map<number, Map<number, Box>>
) {
  const rowStart = coordinate.row - (coordinate.row % 3);
  const colStart = coordinate.col - (coordinate.col % 3);

  for (let row = rowStart; row < rowStart + 3; row++) {
    for (let col = colStart; col < colStart + 3; col++) {
      if (coordinate.row === row && coordinate.col === col) continue;

      const answerCheck = container.get(row)?.get(col)?.answer;
      if (answer === answerCheck) return true;
    }
  }

  return false;
}
