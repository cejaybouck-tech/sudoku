import { useContext, useState, MouseEvent } from "react";
import { Container, Selected } from "./SudokuContainer";
import { isAvailable } from "../util/CheckNumber";
import { buildWithAnswer, buildWithNote } from "../util/SetAnswer";

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
    if (!selected.answer && selected.row < 0 && selected.col < 0) return;
    const answer = Number(e.currentTarget.innerHTML);

    if (isTakingNote) {
      setNote(answer);
      return;
    }

    setAnswer(answer);
  };

  const setAnswer = (answer: number) => {
    const setCoordinate = {
      row: selected.row,
      col: selected.col,
      answer: selected.answer,
    };

    const box = container.get(selected.row)?.get(selected.col);
    if (box?.visible) return;

    if (!isAvailable(answer, setCoordinate, container)) {
      //set up mistake system
      return;
    }

    setContainer(buildWithAnswer(answer, setCoordinate, container));
    setSelected((prev) => ({ ...prev, answer: answer }));
  };

  const setNote = (answer: number) => {
    const setCoordinate = {
      row: selected.row,
      col: selected.col,
      answer: selected.answer,
    };

    const box = container.get(selected.row)?.get(selected.col);

    if (box?.visible) return;

    setContainer(buildWithNote(answer, setCoordinate, container));
  };

  const box = container.get(selected.row)?.get(selected.col);

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
              box?.notes.includes(number) ? "border-green-400" : ""
            }
              ${isTakingNote ? "italic font-light" : ""}`}
          >
            {number}
          </button>
        ))}
      </div>
    </section>
  );
}

export default AnswerSelector;
