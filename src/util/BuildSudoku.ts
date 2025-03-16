import { Box, Coordinate } from "../components/SudokuContainer";
import { isInCol, isInRow, isInSection } from "./CheckNumber";
import { setAnswer } from "./SetAnswer";

export interface Difficulty {
  totalHidden: number;
  missingNumbers: number;
}

export default function buildSudokuContainer(
  difficulty: Difficulty = { totalHidden: 50, missingNumbers: 0 }
) {
  let container = new Map();

  while (!isAllAnswersFilled(container)) {
    container = buildEmptyContainer();

    for (let row = 0; row < 8; row++) {
      buildRow(row, container);
    }
  }

  setDifficulty(container, difficulty);

  return container;
}

function setDifficulty(
  container: Map<number, Map<number, Box>>,
  difficulty: Difficulty
) {
  let numbersLeft = difficulty.totalHidden;
  console.log("setting difficulty: ", difficulty);
  //removeMissingNumbers();
  while (numbersLeft >= 0) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const box = container.get(row)?.get(col);
        if (!box?.visible) continue;

        const random = Math.floor(Math.random() * 10) > 6; //30% success rate
        if (random) {
          container
            .get(row)
            ?.set(col, { answer: box.answer, visible: false, notes: [] });
          --numbersLeft;
          if (numbersLeft < 0) return;
        }
      }
    }
    console.log("options left:", numbersLeft);
  }
}

function isAllAnswersFilled(container: Map<number, Map<number, Box>>) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const answer = container.get(row)?.get(col)?.answer;
      if (!answer) return false;
    }
  }

  return true;
}

function buildRow(row: number, container: Map<number, Map<number, Box>>) {
  for (let i = 0; i < 9; i++) {
    const answer = findSmallestOptions(row, container);

    /* check column for open slot */
    for (let col = 0; col < 9; col++) {
      const box = container.get(row)?.get(col);
      const coord = { row: row, col: col } as Coordinate;

      /* if answer is in the row, skip this answer */
      if (isInRow(answer, coord, container)) break;

      /* if box is taken, skip box*/
      if (box && box.answer) continue;

      /* if answer is in section, skip to next box */
      if (isInSection(answer, coord, container)) continue;

      /* if answer is in col, skip to next box */
      if (isInCol(answer, coord, container)) continue;

      setAnswer(answer, coord, container);
      secureFinalOptions(container);
      break;
    }
  }
}

function findSmallestOptions(
  row: number,
  container: Map<number, Map<number, Box>>
) {
  let smallest = { answer: 0, amt: 10 };
  let answers = [
    { answer: 1, amt: 0 },
    { answer: 2, amt: 0 },
    { answer: 3, amt: 0 },
    { answer: 4, amt: 0 },
    { answer: 5, amt: 0 },
    { answer: 6, amt: 0 },
    { answer: 7, amt: 0 },
    { answer: 8, amt: 0 },
    { answer: 9, amt: 0 },
  ];

  /* find amount of answers available in row */
  for (let col = 0; col < 9; col++) {
    if (container.get(row)?.get(col)?.answer) continue;
    const notes = container.get(row)?.get(col)?.notes;
    notes?.map((note) => {
      answers[note - 1].amt++;
    });
  }

  /* scramble the answers */
  for (let i = 0; i < answers.length; i++) {
    const random = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[random]] = [answers[random], answers[i]];
  }

  /* find lowest answer amount */
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].amt < 1) continue;
    if (smallest.amt > answers[i].amt) {
      smallest = answers[i];
    }
  }

  return smallest.answer;
}

function secureFinalOptions(container: Map<number, Map<number, Box>>) {
  let answerFound = true;
  while (answerFound) {
    answerFound = false;

    /* loop through entire map */
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const box = container.get(row)?.get(col);
        if (box?.answer) continue;
        const coord = { row, col } as Coordinate;

        /* single number left in box notes */
        if (box?.notes && box.notes.length === 1) {
          answerFound = true;
          setAnswer(box.notes[0], coord, container);
          continue;
        }
      }
    }
  }
}

export function buildEmptyContainer() {
  const emptyContainer = new Map();

  for (let row = 0; row < 9; row++) {
    emptyContainer.set(row, new Map());
    for (let col = 0; col < 9; col++) {
      emptyContainer.get(row).set(col, {
        answer: undefined,
        visible: true,
        notes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      } as Box);
    }
  }

  return emptyContainer;
}
