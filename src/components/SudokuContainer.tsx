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
    buildEmptyContainer(false)
  );
  const [selected, setSelected] = useState<Coordinate>({
    row: -1,
    col: -1,
    answer: undefined,
  } as Coordinate);

  const difficultyClickHandler = (e: React.MouseEvent) => {
    const difficultyOptions = new Map([
      ["easy", { totalHidden: 40, missingNumbers: 0 } as Difficulty],
      ["medium", { totalHidden: 30, missingNumbers: 0 }],
      ["hard", { totalHidden: 25, missingNumbers: 1 }],
      ["expert", { totalHidden: 25, missingNumbers: 2 }],
    ]);
    e.preventDefault();
    const difficulty = e.currentTarget.innerHTML.toLowerCase();
    setContainer(buildSudokuContainer(difficultyOptions.get(difficulty)));
    setSelected({} as Coordinate);
  };

  const emptyRows = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return (
    <section className="flex flex-col justify-center items-center w-full h-full">
      <Container.Provider value={{ container, setContainer }}>
        <Selected.Provider value={{ selected, setSelected }}>
          {emptyRows.map((value, index) => (
            <Row key={"rowkey-" + index + value} rowId={index} />
          ))}
          <AnswerSelector />
        </Selected.Provider>
      </Container.Provider>
      <button
        onClick={difficultyClickHandler}
        className="mt-4 border rounded-lg p-2 hover:bg-gray-300"
      >
        Easy
      </button>
    </section>
  );
}

export default SudokuContainer;
