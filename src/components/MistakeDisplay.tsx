import React, { useContext } from "react";
import { Container, Mistake } from "./SudokuContainer";

function MistakeDisplay() {
  const { mistakes, setMistakes } = useContext(Mistake);
  const { container, setContainer } = useContext(Container);

  const isWinner = () => {
    let count = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const visible = container.get(row)?.get(col)?.visible;
        if (visible) count++;
      }
    }
    return count >= 81;
  };

  return (
    <section className="flex mb-4 text-6xl">
      {isWinner() ? (
        <p className="text-green-500 animate-bounce">You win!!!</p>
      ) : mistakes > 3 ? (
        <p className="text-red-500">You Lose</p>
      ) : (
        <div className="flex mb-4 text-6xl">
          <div
            className={`mr-4 ${
              mistakes < 1 ? "text-gray-100" : "text-red-500 animate-pulse"
            }`}
          >
            X
          </div>
          <div
            className={`mr-4 ${
              mistakes < 2 ? "text-gray-100" : "text-red-500 animate-pulse"
            }`}
          >
            X
          </div>
          <div
            className={` ${
              mistakes < 3 ? "text-gray-100" : "text-red-500 animate-pulse"
            }`}
          >
            X
          </div>
        </div>
      )}
    </section>
  );
}

export default MistakeDisplay;
