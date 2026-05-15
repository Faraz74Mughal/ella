import React from "react";

const TrueFalse = ({ q, answers, currentQ, handleAnswer }: { q: any; answers: any; currentQ: any; handleAnswer: any }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
      <div className="flex gap-3">
        {["True", "False"].map((val) => {
          const boolVal = val === "True";
          const selected = answers[currentQ] === boolVal;
          return (
            <button
              key={val}
              onClick={() => handleAnswer(boolVal)}
              className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all
                        ${selected ? "border-indigo-500 bg-indigo-50 text-indigo-800" : "border-slate-200 hover:border-indigo-300"}`}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TrueFalse;
