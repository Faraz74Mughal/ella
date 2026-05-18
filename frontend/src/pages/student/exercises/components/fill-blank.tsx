import React from "react";

const FillBlank = ({
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
      <input
        type="text"
        value={answers[currentQ] || ""}
        onChange={(e) => handleAnswer(e.target.value)}
        placeholder="Type your answer..."
        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 font-medium"
      />
    </div>
  );
};

export default FillBlank;
