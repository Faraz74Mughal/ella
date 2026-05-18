import React from "react";

const MCQ = ({
  q,
  answers,
  currentQ,
  handleAnswer,
}: {
  q: any;
  answers: any;
  currentQ: any;
  handleAnswer: any;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
      <div className="space-y-2">
        {q.options?.map((opt: string, i: number) => {
          const selected = answers[currentQ] === opt;
          return (
            <button
              type="button"
              key={i}
              onClick={() => handleAnswer(opt)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3
                        ${selected ? "border-indigo-500 bg-indigo-50 text-indigo-800 font-medium" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"}`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? "border-indigo-500 bg-indigo-500" : "border-slate-300"}`}
              >
                {selected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
              <span className="font-medium">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MCQ;
