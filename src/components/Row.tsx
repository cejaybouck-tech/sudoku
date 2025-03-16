import { useContext } from "react";
import DisplayBox from "./DisplayBox";
import { Container } from "./SudokuContainer";

function Row({ rowId }: { rowId: number }) {
  const { container } = useContext(Container);
  const row = !container.get(rowId) ? new Map() : container.get(rowId);
  const emptyArray = new Array(9);

  return (
    <div className="flex">
      {[...emptyArray].map((slot, index) => {
        return (
          <DisplayBox
            key={"key-" + index + rowId + slot}
            answer={row?.get(index).answer}
            row={rowId}
            col={index}
          />
        );
      })}
    </div>
  );
}

export default Row;
