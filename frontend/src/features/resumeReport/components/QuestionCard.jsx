import { useState } from "react";

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-[0.6rem] border border-[#2a3348] bg-[#1c2230] transition-colors duration-200 hover:border-[#414d66]">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-start gap-3 bg-transparent px-4 py-3.5 text-left"
      >
        {/* Question number */}
        <span className="mt-0.5 shrink-0 rounded border border-[#ff2d78]/20 bg-[#ff2d78]/10 px-1.5 py-0.5 text-[0.7rem] font-bold text-[#ff2d78]">
          Q{index + 1}
        </span>

        {/* Question */}
        <p className="m-0 min-w-0 flex-1 text-sm font-medium leading-[1.5] text-[#e6edf3]">
          {item.question}
        </p>

        {/* Chevron */}
        <span
          className={`mt-0.5 shrink-0 text-[#7d8590] transition-all duration-200 ${
            open ? "rotate-180 text-[#ff2d78]" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="flex flex-col gap-3 border-t border-[#2a3348] px-4 pb-4 pt-3">
          {/* Intention */}
          <div className="flex flex-col gap-1.5">
            <span className="w-fit rounded border border-[#a78bfa]/20 bg-[#a78bfa]/10 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.06em] text-[#a78bfa]">
              Intention
            </span>

            <p className="m-0 text-[0.835rem] leading-[1.6] text-[#a4abb5]">
              {item.intention}
            </p>
          </div>

          {/* Model Answer */}
          <div className="flex flex-col gap-1.5">
            <span className="w-fit rounded border border-[#3fb950]/20 bg-[#3fb950]/10 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.06em] text-[#3fb950]">
              Model Answer
            </span>

            <p className="m-0 text-[0.835rem] leading-[1.6] text-[#a4abb5]">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;