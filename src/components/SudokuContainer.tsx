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

export default SudokuContainer;
