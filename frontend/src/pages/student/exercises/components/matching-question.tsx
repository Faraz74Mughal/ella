import { useState } from "react";

const MatchingQuestion = ({
  data,
  onAnswer,
  userAnswer,
}: {
  data: any;
  onAnswer: any;
  userAnswer: any;
}) => {
  const [matches, setMatches] = useState(userAnswer || {});
  const [selectedLeft, setSelectedLeft] = useState(null);

  const handleLeft = (left: any) => {
    if (selectedLeft === left) setSelectedLeft(null);
    else setSelectedLeft(left);
  };

  const handleRight = (right: any) => {
    if (!selectedLeft) return;
    const newMatches = { ...matches, [selectedLeft]: right };
    setMatches(newMatches);
    onAnswer(newMatches);
    setSelectedLeft(null);
  };

  const leftItems = data.pairs.map((p: { left: any }) => p.left);
  const rightItems = [...data.pairs.map((p: { right: any }) => p.right)].sort(
    () => Math.random() - 0.5,
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Match the items</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase">
            Column A
          </p>
          {leftItems.map((left: any) => (
            <button
              key={left}
              onClick={() => handleLeft(left)}
              className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all
                ${
                  selectedLeft === left
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : matches[left]
                      ? "border-slate-300 bg-slate-50"
                      : "border-slate-200 hover:border-indigo-300"
                }`}
            >
              {left}{" "}
              {matches[left] && (
                <span className="text-slate-400 ml-2">→ {matches[left]}</span>
              )}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase">
            Column B
          </p>
          {rightItems.map((right) => {
            const used = Object.values(matches).includes(right);
            return (
              <button
                key={right}
                onClick={() => handleRight(right)}
                disabled={used}
                className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all
                  ${
                    used
                      ? "border-slate-100 bg-slate-50 text-slate-300"
                      : selectedLeft
                        ? "border-indigo-300 bg-indigo-50 hover:border-indigo-500 cursor-pointer"
                        : "border-slate-200 text-slate-400"
                  }`}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchingQuestion;
