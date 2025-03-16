import { useContext } from "react";
import { Container, Coordinate, Selected } from "./SudokuContainer";

function DisplayBox({
  answer,
  row,
  col,
}: {
  answer: number;
  row: number;
  col: number;
}) {
  const { container } = useContext(Container);
  const { selected, setSelected } = useContext(Selected);
  const box = container.get(row)?.get(col);

  const onSelect = () => {
    if (row === selected.row && col === selected.col) {
      setSelected({} as Coordinate);
      return;
    }
    setSelected({ row, col, answer });
  };

  return (
    <div
      onClick={onSelect}
      className={`flex items-center justify-center w-[50px] h-[50px] text-3xl text-center border-b border-gray-500 border-r select-none hover:bg-green-300
        ${(row + 1) % 3 === 0 && row < 6 ? "border-b-4 border-b-black" : ""}
        ${(col + 1) % 3 === 0 && col < 6 ? "border-r-4 border-r-black" : ""}
        ${col === 0 ? "border-l" : ""} 
        ${row === 0 ? "border-t" : ""}`}
    >
      {(answer && box?.visible) ||
      (selected.col === col && selected.row === row) ? (
        <p
          className={`w-full h-full flex justify-center items-center
            ${selected.answer === answer ? "bg-green-200" : ""}
            ${
              selected.row === row && selected.col === col
                ? " bg-green-400"
                : ""
            }`}
        >
          {answer}
        </p>
      ) : (
        <div
          className={`text-xs grid grid-cols-3 w-full h-full ${
            selected.row === row && selected.col === col
              ? " border-2 border-green-400"
              : ""
          } ${
            box?.notes.includes(selected?.answer ? selected.answer : 0)
              ? "border border-green-400"
              : ""
          }`}
        >
          {box?.notes.map((note, index) => (
            <p className={`text-gray-600 `} key={index}>
              {note}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default DisplayBox;
