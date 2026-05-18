import { useEffect, useState } from "react";
import ExerciseHeader from "./exercise-header";
import { Check, ChevronRight, Mic, Timer } from "lucide-react";
import MatchingQuestion from "./matching-question";
import Result from "./result";
import MCQ from "./mcq";
import FillBlank from "./fill-blank";

// --- TypeScript Interfaces ---
interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

interface Question {
  id: string;
  type:
    | "mcq"
    | "fill_blank"
    | "matching"
    | "true_false"
    | "dialogue"
    | "follow_up";
  question: string;
  options?: string[];
  pairs?: MatchingPair[];
  correctAnswer?: string | boolean;
  points?: number;
  speaker?: string;
  expectedAnswer?: string;
}

interface AnswersState {
  [key: number]: any;
}

interface GrammarQuizProps {
  exercise: any;
}

const GrammarQuiz = ({ exercise }: GrammarQuizProps) => {
  const totalPoints = exercise?.content?.length
    ? exercise.content.length * 2
    : 0;
  const [currentQ, setCurrentQ] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds per question
  const calculateScore = () => {
    let totalPoints = 0;

    exercise.content.forEach((question: Question, index: number) => {
      const userAnswer = answers[index];
      if (!userAnswer) return;

      if (question.type === "matching") {
        let allPairsCorrect = true;
        question.pairs?.forEach((pair: MatchingPair) => {
          if (userAnswer[pair.id] !== pair.id) {
            allPairsCorrect = false;
          }
        });
        if (allPairsCorrect) {
          totalPoints += 2;
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          totalPoints += 2;
        }
      }
    });

    setScore(totalPoints);
    setShowResults(true);
  };
  // --- Per-Question Timer Logic ---
  useEffect(() => {
    if (!exercise || !Array.isArray(exercise.content) || showResults) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);

          setAnswers((prev) => ({
            ...prev,
            [currentQ]: prev[currentQ] || "",
          }));

          const isLast = currentQ === exercise.content.length - 1;
          if (isLast) {
            calculateScore();
          } else {
            setCurrentQ((prev) => prev + 1);
            return 60;
          }
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQ, showResults, exercise]);

  // --- Guard Clause ---
  if (!exercise || !Array.isArray(exercise.content)) {
    return <div className="p-6 text-center">Loading exercise...</div>;
  }

  const q = exercise.content[currentQ];
  const isLast = currentQ === exercise.content.length - 1;
  const hasAnswered =
    answers[currentQ] !== undefined && answers[currentQ] !== "";

  const nextQuestion = () => {
    if (isLast) {
      calculateScore();
    } else {
      setCurrentQ((prev) => prev + 1);
      setTimeLeft(60);
    }
  };

  const handleAnswer = (answer: any) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: answer }));
  };

  const onBack = () => {
    window.history.back();
  };

  // --- Dynamic Results Layout Calculation ---
  const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
  const passed = percentage >= 50; // Pass mark set to 50% score accuracy

  if (showResults) {
    return (
      <Result
        score={score}
        totalPoints={totalPoints}
        passed={passed}
        percentage={percentage}
        onBack={onBack}
      />
    );
  }

  // --- Normal Quiz Running Mode ---
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <ExerciseHeader
          showResults={showResults}
          exercise={exercise}
          score={score}
          totalPoints={totalPoints}
        />

        {/* Top Info Bar: Progress & Question Timer */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <p className="text-sm text-slate-500 font-medium">
              Question {currentQ + 1} of {exercise.content.length}
            </p>
            <div className="w-48 bg-slate-100 rounded-full h-2 mt-1">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQ + 1) / exercise.content.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Individual Quiz Clock UI */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold text-sm ${timeLeft <= 10 ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : "bg-slate-50 text-slate-700 border-slate-200"}`}
          >
            <Timer size={16} />
            <span>0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft} mins</span>
          </div>
        </div>

        {/* Active Question Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {/* MCQ Type */}
          {q.type === "mcq" && (
            <MCQ
              q={q}
              answers={answers}
              currentQ={currentQ}
              handleAnswer={handleAnswer}
            />
          )}

          {/* Fill In The Blank Type */}
          {q.type === "fill_blank" && (
            <FillBlank
              q={q}
              answers={answers}
              currentQ={currentQ}
              handleAnswer={handleAnswer}
            />
          )}

          {/* Matching Type */}
          {q.type === "matching" && (
            <MatchingQuestion
              data={q}
              onAnswer={(ans: any) => handleAnswer(ans)}
              userAnswer={answers[currentQ]}
            />
          )}

          {/* True/False Type */}
          {q.type === "true_false" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {q.question}
              </h3>
              <div className="flex gap-3">
                {["True", "False"].map((val) => {
                  const boolVal = val === "True";
                  const selected = answers[currentQ] === boolVal;
                  return (
                    <button
                      type="button"
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
          )}

          {/* Dialogue / Speaking Types */}
          {(q.type === "dialogue" || q.type === "follow_up") && (
            <div className="space-y-4">
              {q.speaker && (
                <p className="text-xs font-semibold text-indigo-600 uppercase">
                  {q.speaker}
                </p>
              )}
              <h3 className="text-lg font-semibold text-slate-800">
                {q.question}
              </h3>
              <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-indigo-300 transition-colors">
                <button
                  type="button"
                  className="w-16 h-16 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center mx-auto mb-2"
                >
                  <Mic size={24} className="text-white" />
                </button>
                <p className="text-sm text-slate-500">
                  Tap to record your response
                </p>
              </div>
              <p className="text-xs text-slate-400">
                Expected: {q.expectedAnswer}
              </p>
            </div>
          )}
        </div>

        {/* Action Button Navigation */}
        <div className="flex justify-end mt-4 min-h-[40px]">
          {hasAnswered && (
            <>
              {isLast ? (
                <button
                  type="button"
                  onClick={calculateScore}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 transition-colors"
                >
                  <Check size={16} /> Submit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 transition-colors"
                >
                  Next <ChevronRight size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrammarQuiz;
