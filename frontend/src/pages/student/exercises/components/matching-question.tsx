import { useState, useMemo } from "react";

// --- TypeScript Interfaces ---
interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

interface MatchingQuestionProps {
  data: {
    id: string;
    pairs?: MatchingPair[];
  };
  onAnswer: (answer: Record<string, string> | undefined) => void;
  userAnswer?: Record<string, string>;
}

const MatchingQuestion = ({ data, onAnswer, userAnswer }: MatchingQuestionProps) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  
  // Track the previous question ID to detect when the question transitions
  const [prevQuestionId, setPrevQuestionId] = useState<string>("");

  // Current matches object map: { leftId: rightId }
  const currentMatches = userAnswer || {};

  // Safely extract pairs with a stable fallback to assist the compiler's static analysis
  const pairs = data?.pairs ?? [];
  const questionId = data?.id ?? "";

  // --- RENDERING STATE ADJUSTMENT ---
  // If the question ID has changed, reset the selection state inline.
  // This updates the state during the current render pass, preventing cascading layout shifts.
  if (questionId !== prevQuestionId) {
    setSelectedLeft(null);
    setPrevQuestionId(questionId);
  }

  // Compute and shuffle the right column seamlessly whenever the pairs array changes
  const shuffledRight = useMemo(() => {
    if (pairs.length === 0) return [];

    const rightItems = pairs.map((p) => ({ id: p.id, text: p.right }));
    
    // Create a stable hash value from the unique question ID string
    let hash = 0;
    for (let k = 0; k < questionId.length; k++) {
      hash = (hash * 31 + questionId.charCodeAt(k)) | 0; // Stays cleanly as a signed 32-bit int
    }

    // Pure, simple deterministic pseudo-random generator (Mulberry32 variant)
    const rng = () => {
      hash |= 0;
      hash = (hash + 0x6d2b79f5) | 0;
      let t = Math.imul(hash ^ (hash >>> 15), 1 | hash);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    // Fisher-Yates shuffle using our custom stable seed math
    for (let i = rightItems.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [rightItems[i], rightItems[j]] = [rightItems[j], rightItems[i]];
    }
    
    return rightItems;
  }, [pairs, questionId]);

  const handleLeftClick = (pairId: string) => {
    setSelectedLeft(pairId);
  };

  const handleRightClick = (rightId: string) => {
    if (!selectedLeft) return;

    const updatedMatches = {
      ...currentMatches,
      [selectedLeft]: rightId,
    };

    onAnswer(updatedMatches);
    setSelectedLeft(null); // Clear selection for next click
  };

  const handleClearMatch = (leftId: string) => {
    const updatedMatches = { ...currentMatches };
    delete updatedMatches[leftId];
    onAnswer(Object.keys(updatedMatches).length > 0 ? updatedMatches : undefined);
  };

  return (
    <div className="space-y-6">
      <div className="text-center bg-slate-50 border border-slate-200 rounded-xl p-3">
        <p className="text-sm font-medium text-slate-600">
          Instructions: Click an option on the <span className="text-indigo-600 font-semibold">Left</span> first, then click its match on the <span className="text-indigo-600 font-semibold">Right</span>.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pronoun / Subject</p>
          {pairs.map((pair) => {
            const isSelected = selectedLeft === pair.id;
            const hasMatched = currentMatches[pair.id] !== undefined;
            const matchedRightText = shuffledRight.find((r) => r.id === currentMatches[pair.id])?.text;

            return (
              <div key={pair.id} className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleLeftClick(pair.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all
                    ${isSelected ? "border-indigo-500 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-200" : ""}
                    ${hasMatched && !isSelected ? "border-emerald-200 bg-emerald-50 text-emerald-800" : ""}
                    ${!hasMatched && !isSelected ? "border-slate-200 hover:border-slate-300" : ""}
                  `}
                >
                  {pair.left}
                </button>
                
                {hasMatched && (
                  <div className="flex items-center justify-between px-2 text-xs text-emerald-600 font-medium">
                    <span>Linked to: "{matchedRightText}"</span>
                    <button 
                      type="button" 
                      onClick={() => handleClearMatch(pair.id)}
                      className="text-slate-400 hover:text-red-500 underline"
                    >
                      Undo
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Predicate / Action</p>
          {shuffledRight.map((item) => {
            const isPaired = Object.values(currentMatches).includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                disabled={!selectedLeft || isPaired}
                onClick={() => handleRightClick(item.id)}
                className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all
                  ${isPaired ? "border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60" : ""}
                  ${!isPaired && selectedLeft ? "border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer" : ""}
                  ${!isPaired && !selectedLeft ? "border-slate-200 opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchingQuestion;