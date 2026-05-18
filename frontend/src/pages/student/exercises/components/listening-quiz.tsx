import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import ExerciseHeader from "./exercise-header"; // Adjust path if needed
import {
  Check,
  ChevronRight,
  Timer,
  FileText,
} from "lucide-react";
import ListeningMediaPlayer from "./listening-media-player";
import Result from "./result";
import { saveStudentQuizSubmission } from "@/api/submission.service";




interface ListeningQuizProps {
  exercise: any;
}

const ListeningQuiz = ({ exercise }: ListeningQuizProps) => {
  // Navigation indices tracking nested tracking layout
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Inline rendering transition optimization states
  const [prevExerciseId, setPrevExerciseId] = useState<string>("");

  // Answers flat map tracking unique question ID keys -> user selected answers
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const submissionSentRef = useRef(false);

  const tracks = useMemo(() => exercise?.content ?? [], [exercise?.content]);
  const exerciseId = exercise?._id ?? "";

  // Inline data synchronization pass avoiding post-render useEffect updates
  if (exerciseId !== prevExerciseId) {
    setCurrentTrackIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setTimeLeft(60);
    setShowTranscript(false);
    setPrevExerciseId(exerciseId);
  }

  const currentTrack = tracks[currentTrackIndex];
  const questions = currentTrack?.comprehensionQuestions ?? [];
  const currentQuestion = questions[currentQuestionIndex];

  // Map out linear total configurations for tracking total layout progression maps
  const trackingData = useMemo(() => {
    let totalQCount = 0;
    const flatList: Array<{ trackIdx: number; qIdx: number; qId: string }> = [];

    tracks.forEach((track:any, tIdx:number) => {
      (track.comprehensionQuestions ?? []).forEach((q:any, qIdx:number) => {
        totalQCount++;
        flatList.push({ trackIdx: tIdx, qIdx: qIdx, qId: q.id });
      });
    });

    return { totalQuestions: totalQCount, mapping: flatList };
  }, [tracks]);

  // Find where our active indices sit inside the comprehensive quiz layout flat map
  const activeFlattenedIndex = useMemo(() => {
    return trackingData.mapping.findIndex(
      (m) =>
        m.trackIdx === currentTrackIndex && m.qIdx === currentQuestionIndex,
    );
  }, [trackingData.mapping, currentTrackIndex, currentQuestionIndex]);

  // --- Dynamic Evaluation Parameters ---
  const totalMaxPoints =
    tracks.reduce(
      (acc: any, track: any) =>
        acc +
        (track.comprehensionQuestions?.reduce((sum: any) => sum + 2, 0) ?? 0),
      0,
    ) || exercise.points;
  const accuracyPercentage =
    totalMaxPoints > 0 ? (score / totalMaxPoints) * 100 : 0;
  const passed = accuracyPercentage >= (exercise.passing_percentage ?? 70);
  const isAbsoluteLast =
    activeFlattenedIndex === trackingData.totalQuestions - 1;

  const calculateFinalResults = useCallback(() => {
    let earnedPoints = 0;

    tracks.forEach((track: any) => {
      (track.comprehensionQuestions ?? []).forEach((q: any) => {
        const userSelection = answers[q.id];
        if (userSelection === q.correctAnswer) {
          earnedPoints += 2;
        }
      });
    });

    setScore(earnedPoints);
    setShowResults(true);
  }, [answers, tracks]);

  // Handle forcing blank data insertions if the timer lapses completely
  const advanceNavigation = useCallback(() => {
    if (isAbsoluteLast) {
      calculateFinalResults();
    } else {
      // Check if we move to next question in same track or hop to next track element
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setCurrentTrackIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
        setShowTranscript(false); // Auto close transcripts for fresh segments
      }
      setTimeLeft(60);
    }
  }, [
    currentQuestionIndex,
    calculateFinalResults,
    isAbsoluteLast,
    questions.length,
  ]);

  const handleTimeoutTransition = useCallback(() => {
    if (!currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: prev[currentQuestion.id] || "",
    }));
    advanceNavigation();
  }, [advanceNavigation, currentQuestion]);

  // --- Quiz Individual Item Countdown timer ---
  useEffect(() => {
    if (showResults || !currentQuestion) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          handleTimeoutTransition();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, handleTimeoutTransition, showResults]);

  useEffect(() => {
    if (!showResults || submissionSentRef.current || !exercise) return;

    submissionSentRef.current = true;

    const calculatedPercentage =
      totalMaxPoints > 0 ? (score / totalMaxPoints) * 100 : 0;
    const finalPassed = calculatedPercentage >= (exercise.passing_percentage ?? 70);

    void saveStudentQuizSubmission({
      lesson_id: exercise.lesson_id,
      exercise_id: exercise._id,
      category: "listening" as const,
      score_earned: score,
      max_score: totalMaxPoints,
      percentage: calculatedPercentage,
      is_passed: finalPassed,
      submitted_payload: {
        answers,
        currentTrackIndex,
        currentQuestionIndex,
        showTranscript,
      },
    }).catch((error) => {
      console.error("Failed to submit listening quiz result:", error);
    });
  }, [
    answers,
    currentQuestionIndex,
    currentTrackIndex,
    exercise,
    score,
    showResults,
    showTranscript,
    totalMaxPoints,
  ]);

  if (!exercise || tracks.length === 0 || !currentQuestion) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading module content...
      </div>
    );
  }

  const hasAnswered =
    answers[currentQuestion.id] !== undefined &&
    answers[currentQuestion.id] !== "";

  const handleAnswer = (answerValue: any) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerValue }));
  };

  const onBack = () => {
    window.history.back();
  };

  // --- Render Results Summary Screen ---
  if (showResults) {
    return (
      <Result
        onBack={onBack}
        passed={passed}
        percentage={Math.round(accuracyPercentage)}
        score={score}      
        totalPoints={totalMaxPoints}
        exercise={exercise}
      />
      // <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      //   <div className="max-w-2xl w-full mx-auto space-y-6">
      //     <button
      //       type="button"
      //       onClick={onBack}
      //       className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium transition-colors"
      //     >
      //       <ChevronLeft size={20} /> Back
      //     </button>

      //     <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
      //       <div
      //         className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? "bg-green-100" : "bg-red-100"}`}
      //       >
      //         {passed ? (
      //           <CheckCircle2 size={48} className="text-green-600" />
      //         ) : (
      //           <X size={48} className="text-red-600" />
      //         )}
      //       </div>

      //       <h2 className="text-3xl font-bold mb-2 text-slate-800">
      //         {passed ? "Great Job!" : "Keep Practicing!"}
      //       </h2>
      //       <p className="text-sm text-slate-400 max-w-sm mx-auto">
      //         {passed
      //           ? `Passed! You exceeded the required track score threshold of ${exercise.passing_percentage}%.`
      //           : `You scored ${Math.round(accuracyPercentage)}% but need at least ${exercise.passing_percentage}% to pass this listening module.`}
      //       </p>

      //       <div className="flex justify-center gap-12 my-8 border-y border-slate-100 py-4">
      //         <div>
      //           <p className="text-3xl font-black text-slate-800">
      //             {score}{" "}
      //             <span className="text-sm font-medium text-slate-400">
      //               / {totalMaxPoints}
      //             </span>
      //           </p>
      //           <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-0.5">
      //             Points
      //           </p>
      //         </div>
      //         <div>
      //           <p className="text-3xl font-black text-slate-800">
      //             {Math.round(accuracyPercentage)}%
      //           </p>
      //           <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-0.5">
      //             Accuracy
      //           </p>
      //         </div>
      //       </div>

      //       <button
      //         type="button"
      //         onClick={onBack}
      //         className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all w-full sm:w-auto"
      //       >
      //         Continue
      //       </button>
      //     </div>
      //   </div>
      // </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Core Header wrapper setup */}
        <ExerciseHeader
          showResults={showResults}
          exercise={exercise}
          score={score}
          totalPoints={totalMaxPoints}
        />

        {/* Global Progress Tracking Meta-bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <p className="text-sm text-slate-500 font-medium">
              Question {activeFlattenedIndex + 1} of{" "}
              {trackingData.totalQuestions}
              <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                Track {currentTrackIndex + 1}/{tracks.length}
              </span>
            </p>
            <div className="w-48 bg-slate-100 rounded-full h-2 mt-1">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{
                  width: `${((activeFlattenedIndex + 1) / trackingData.totalQuestions) * 100}%`,
                }}
              />
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold text-sm ${timeLeft <= 10 ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : "bg-slate-50 text-slate-700 border-slate-200"}`}
          >
            <Timer size={16} />
            <span>0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft} mins</span>
          </div>
        </div>

        {/* Native HTML Audio Stream Controller Deck Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <ListeningMediaPlayer fileUrl={currentTrack.file} />

          {/* Collapsible Document Transcript Drawer */}
          {currentTrack.transcript && (
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-500 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <FileText size={14} />{" "}
                  {showTranscript ? "Hide Transcript" : "Show Transcript"}
                </span>
                <ChevronRight
                  size={14}
                  className={`transform transition-transform ${showTranscript ? "rotate-90" : ""}`}
                />
              </button>
              {showTranscript && (
                <div className="p-4 bg-white border-t border-slate-100 text-sm text-slate-600 italic leading-relaxed">
                  "{currentTrack.transcript}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nested Active Question Card Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
              Comprehension Prompt
            </span>
            <span className="text-xs font-medium text-slate-400">
              {currentQuestion.points} Points
            </span>
          </div>

          {/* MCQ Question Variant Block */}
          {currentQuestion.type === "mcq" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {currentQuestion.question}
              </h3>
              <div className="space-y-2">
                {currentQuestion.options?.map((opt: string, i: number) => {
                  const isSelected = answers[currentQuestion.id] === opt;
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3
                        ${isSelected ? "border-indigo-500 bg-indigo-50 text-indigo-800 font-medium" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-indigo-500 bg-indigo-500" : "border-slate-300"}`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* True/False Question Variant Block */}
          {currentQuestion.type === "true_false" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {currentQuestion.question}
              </h3>
              <div className="flex gap-3">
                {[true, false].map((val) => {
                  const isSelected = answers[currentQuestion.id] === val;
                  return (
                    <button
                      type="button"
                      key={val.toString()}
                      onClick={() => handleAnswer(val)}
                      className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all text-center
                        ${isSelected ? "border-indigo-500 bg-indigo-50 text-indigo-800" : "border-slate-200 hover:border-indigo-300"}`}
                    >
                      {val ? "True" : "False"}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fill In The Blank Question Variant Block */}
          {currentQuestion.type === "fill_blank" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {currentQuestion.question}
              </h3>
              <input
                type="text"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type the missing words..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 font-medium transition-all"
              />
            </div>
          )}
        </div>

        {/* Multi-step Footer Action Buttons */}
        <div className="flex justify-end min-h-10">
          {hasAnswered && (
            <button
              type="button"
              onClick={advanceNavigation}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
            >
              {isAbsoluteLast ? (
                <>
                  <Check size={16} /> Submit Quiz
                </>
              ) : (
                <>
                  Next Question <ChevronRight size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeningQuiz;
