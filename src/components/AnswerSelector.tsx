import React, { useContext, useState, MouseEvent } from "react";
import { Container, Selected } from "./SudokuContainer";
import { isAvailable } from "../util/CheckNumber";
import { buildWithAnswer } from "../util/SetAnswer";

function AnswerSelector() {
  const [isTakingNote, setIsTakingNote] = useState<boolean>(false);
  const { selected, setSelected } = useContext(Selected);
  const { container, setContainer } = useContext(Container);

  const row = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleAnswer = () => {
    setIsTakingNote(false);
  };

  const handleNotes = () => {
    setIsTakingNote(true);
  };

  const handleSelect = (e: MouseEvent<HTMLButtonElement>) => {
    if (selected.row < 0 || selected.answer) return;

    const answer = Number(e.currentTarget.innerHTML);
    const setCoordinate = {
      row: selected.row,
      col: selected.col,
      answer: selected.answer,
    };

    if (!isAvailable(answer, setCoordinate, container)) {
      return;
    }

    setContainer(buildWithAnswer(answer, setCoordinate, container));
    setSelected((prev) => ({ ...prev, answer: answer }));
  };

  return (
    <section className="">
      <div className="flex justify-center mt-4 text-xl">
        <button
          onClick={handleAnswer}
          className={`border rounded px-2 mr-2 ${
            !isTakingNote ? "bg-yellow-200" : ""
          }`}
        >
          Answer
        </button>
        <button
          onClick={handleNotes}
          className={`border rounded px-2 italic ${
            isTakingNote ? "bg-yellow-200" : ""
          }`}
        >
          Notes
        </button>
      </div>
      <div className="flex text-3xl">
        {row.map((number) => (
          <button
            key={"answer-" + number}
            onClick={handleSelect}
            className={`w-[50px] h-[50px] border  mt-2 mr-1 flex justify-center items-center transition duration-300 hover:-translate-y-2 ${
              isTakingNote ? "italic font-light" : ""
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </section>
  );
}

export default AnswerSelector;
