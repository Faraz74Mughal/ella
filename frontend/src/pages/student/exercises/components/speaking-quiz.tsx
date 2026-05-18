import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, Square, CheckCircle2, X, ShieldAlert, Sparkles, Bot, MessageSquare } from "lucide-react";
import { saveStudentQuizSubmission } from "@/api/submission.service";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// --- TypeScript Interfaces ---
interface SpeakingContent {
  id: string;
  type: "follow_up" | "dialogue";
  question: string;
  points: number; // Will be overridden dynamically to 5 points internally
  expectedAnswer: string;
  speaker?: string;
}



interface RealEvaluationResult {
  transcript: string;
  score: number; // Dynamic grammar math result out of 5
  critique: string;
  improvements: string;
  issuesFound: string[];
}

interface SpeakingQuizProps {
  exercise: any;
}

const SpeakingQuiz = ({ exercise }: SpeakingQuizProps) => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  const [evaluations, setEvaluations] = useState<Record<string, RealEvaluationResult>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  const recognitionRef = useRef<any>(null);
  const submissionSentRef = useRef(false);
  const contentList = exercise?.content ?? [];
  const q = contentList[currentQ];

  // --- Dynamic Point Normalization ---
  // Each question is given exactly 5 points regardless of the original data values
  const POINTS_PER_QUESTION = 5;
  const totalMaxPoints = contentList.length * POINTS_PER_QUESTION;

  const handleContinue = () => {
    const resultPercentage = totalMaxPoints > 0 ? (totalEarnedScore / totalMaxPoints) * 100 : 0;
    const finalPassed = resultPercentage >= (exercise.passing_percentage ?? 75);

    if (finalPassed) {
      toast.success("Excellent! Moving to next lesson...");
      navigate("/student/lessons");
    } else {
      toast.info("Please try this lesson again.");
      navigate(`/student/lessons/${exercise.lesson_id}`);
    }
  };

  // Initialize Web Speech API Engine
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("This browser does not support native Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setLiveTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error: ", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const stopSpeechCapture = useCallback(async () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      await analyzeGrammarLive(liveTranscript, q);
    }
  }, [isRecording, liveTranscript, q]);

  const totalEarnedScore = Object.values(evaluations).reduce((sum, item) => sum + item.score, 0);
  const globalPercentage = totalMaxPoints > 0 ? (totalEarnedScore / totalMaxPoints) * 100 : 0;
  const passed = globalPercentage >= (exercise.passing_percentage ?? 75);

  // Countdown timer loop
  useEffect(() => {
    if (showResults || !q) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (isRecording) stopSpeechCapture();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQ, showResults, q, isRecording, stopSpeechCapture]);

  useEffect(() => {
    if (!showResults || submissionSentRef.current || !exercise) return;

    submissionSentRef.current = true;

    const resultScore = Object.values(evaluations).reduce(
      (sum, item) => sum + item.score,
      0,
    );
    const resultPercentage =
      totalMaxPoints > 0 ? (resultScore / totalMaxPoints) * 100 : 0;
    const finalPassed = resultPercentage >= (exercise.passing_percentage ?? 75);

    void saveStudentQuizSubmission({
      lesson_id: (exercise as any).lesson_id,
      exercise_id: String(exercise._id),
      category: "speaking" as const,
      score_earned: resultScore,
      max_score: totalMaxPoints,
      percentage: resultPercentage,
      is_passed: finalPassed,
      submitted_payload: {
        evaluations,
        transcripts: Object.values(evaluations).map((item) => item.transcript),
        currentQuestionIndex: currentQ,
      },
    }).catch((error) => {
      console.error("Failed to submit speaking quiz result:", error);
    });
  }, [currentQ, evaluations, exercise, showResults, totalMaxPoints]);

  if (!exercise || contentList.length === 0 || !q) {
    return <div className="p-6 text-center text-slate-500">Loading modules...</div>;
  }

  const startSpeechCapture = () => {
    setLiveTranscript("");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      toast.error("Speech recognition engine is not ready or supported on this device.");
    }
  };

  // Real Grammar Assessment Engine via LanguageTool API
  const analyzeGrammarLive = async (textToTest: string, currentQuestion: SpeakingContent) => {
    if (!textToTest || textToTest.trim().length === 0) {
      setEvaluations((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          transcript: "[No speech detected]",
          score: 0,
          critique: "The system did not record any clear spoken input language.",
          improvements: "Please try unmuting your mic and speaking clearly directly into your machine interface.",
          issuesFound: ["Empty recording stream."]
        }
      }));
      return;
    }

    setIsAnalyzing(true);
    try {
      const params = new URLSearchParams();
      params.append("text", textToTest);
      params.append("language", "en-US");

      const response = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      const data = await response.json();
      const matches = data.matches || [];

      let penalty = 0;
      const issues: string[] = [];

      matches.forEach((match: any) => {
        const isGrammar = match.rule.category.id === "GRAMMAR" || match.rule.category.id === "MISTAKES";
        // Scale down penalty weights so a student doesn't hit 0 points immediately on small typos
        penalty += isGrammar ? 1.5 : 0.5; 

        const wrongSegment = textToTest.substring(match.offset, match.offset + match.length);
        const advice = match.replacements.slice(0, 2).map((r: any) => r.value).join(" / ");
        issues.push(`Error near "${wrongSegment}": ${match.message} ${advice ? `(Suggested alternative: ${advice})` : ""}`);
      });

      // Calculate score out of a max base of 5 points
      const calculatedScore = Math.max(0, POINTS_PER_QUESTION - penalty);

      setEvaluations((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          transcript: textToTest,
          score: calculatedScore,
          critique: matches.length === 0 
            ? "Excellent job! The grammar engine verified your sentence structure and found zero syntax errors."
            : `Detected ${matches.length} grammatical inconsistencies during vocal execution.`,
          improvements: matches.length === 0
            ? "Your sentence layout flows cleanly. Focus next on conversational flexibility."
            : "Review the flagged text components below to trace common structural mistakes.",
          issuesFound: issues
        }
      }));

    } catch (err) {
      console.error("API error: ", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const advanceQuiz = () => {
    if (currentQ < contentList.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setLiveTranscript("");
      setTimeLeft(60);
    } else {
      setShowResults(true);
    }
  };

  // Dynamic final evaluation scoring mechanics
  // --- RESULTS SUMMARY SCREEN ---
  if (showResults) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
              {passed ? <CheckCircle2 size={44} /> : <X size={44} />}
            </div>
            <h2 className="text-3xl font-bold text-slate-800">{passed ? "Test Passed!" : "Test Failed"}</h2>
            <p className="text-sm text-slate-400 mt-1">Passing Requirement Standard: {exercise.passing_percentage}%</p>
            <div className="flex justify-center gap-12 my-6 border-y border-slate-100 py-4">
              <div>
                <p className="text-3xl font-black text-slate-800">
                  {Number(totalEarnedScore.toFixed(1))} <span className="text-sm font-medium text-slate-400">/ {totalMaxPoints}</span>
                </p>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Real Grammar Points</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-800">{Math.round(globalPercentage)}%</p>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Calculated Fluency</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2"><Sparkles size={18} className="text-indigo-500"/> Real-time Linguistic Diagnosis Reports</h3>
          <div className="space-y-4">
            {contentList.map((item: SpeakingContent) => {
              const res = evaluations[item.id];
              return (
                <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full uppercase tracking-wider">{item.type} prompt</span>
                      <h4 className="text-base font-semibold text-slate-800 mt-2">{item.question}</h4>
                    </div>
                    <p className="text-lg font-black text-indigo-600 shrink-0">
                      {res ? Number(res.score.toFixed(1)) : 0} <span className="text-xs text-slate-400 font-medium">/ {POINTS_PER_QUESTION} pts</span>
                    </p>
                  </div>

                  {res ? (
                    <div className="space-y-3 text-sm">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Speech-to-Text Raw Output:</p>
                        <p className="text-slate-700 italic font-medium mt-1">"{res.transcript}"</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-amber-50/60 border border-amber-100 p-3.5 rounded-xl">
                          <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">⚠️ Grammar Analysis Summary:</p>
                          <p className="text-slate-700 mt-1 text-xs">{res.critique}</p>
                        </div>
                        <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-xl">
                          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">🚀 Action Plan for Improvement:</p>
                          <p className="text-slate-700 mt-1 text-xs">{res.improvements}</p>
                        </div>
                      </div>
                      {res.issuesFound.length > 0 && (
                        <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl space-y-1">
                          <p className="text-xs font-bold text-red-800 uppercase tracking-wide flex items-center gap-1"><ShieldAlert size={14}/> Dynamic Linguistic Violations Logged:</p>
                          <ul className="list-none space-y-1 text-xs text-slate-600 mt-1.5">
                            {res.issuesFound.map((issue, i) => (
                              <li key={i} className="bg-white p-2 rounded border border-red-100/50">{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No recording data available for evaluation.</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              className={`px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 text-sm shadow-md transition-all ${
                passed
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-green-100"
                  : "bg-amber-600 text-white hover:bg-amber-700 shadow-amber-100"
              }`}
            >
              {passed ? "Proceed to Next Lesson" : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE INTERACTIVE WORKFLOW SCREEN ---
  const dynamicResultRecorded = evaluations[q.id] !== undefined;
  const isDialogueMode = q.type === "dialogue";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-sm font-semibold text-slate-600">Question {currentQ + 1} of {contentList.length}</span>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md">Value: {POINTS_PER_QUESTION} Pts</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          
          {/* Dynamic Dialogue Mode Speaker Profile Row */}
          {isDialogueMode && (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
                <Bot size={22} className="animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interlocutor</p>
                <p className="text-sm font-bold text-slate-800">{q.speaker || "AI Interviewer"}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isDialogueMode ? "Conversation Prompt:" : "Spoken Directive Prompt:"}
            </p>
            <h3 className="text-xl font-bold text-slate-800 leading-snug flex items-start gap-2">
              {isDialogueMode && <MessageSquare size={20} className="text-indigo-500 shrink-0 mt-1" />}
              <span>{q.question}</span>
            </h3>
          </div>

          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center space-y-4">
            {isRecording ? (
              <div className="space-y-2">
                <button type="button" onClick={stopSpeechCapture} className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                  <Square size={24} className="fill-white"/>
                </button>
                <p className="text-sm font-bold text-red-600">Microphone Stream Live... Tap to Stop</p>
                {liveTranscript && (
                  <div className="mt-4 p-3 bg-white border border-slate-100 rounded-xl text-xs text-slate-500 italic max-w-md mx-auto shadow-inner">
                    "{liveTranscript}"
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <button type="button" disabled={isAnalyzing} onClick={startSpeechCapture} className="w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center mx-auto shadow-md disabled:opacity-50">
                  <Mic size={24}/>
                </button>
                <p className="text-sm font-bold text-slate-700">
                  {isAnalyzing ? "Processing Grammar Check..." : dynamicResultRecorded ? "Response Logged. Tap to Re-record" : "Tap to Open Audio Channel"}
                </p>
                <p className="text-xs text-slate-400">Time left: {timeLeft}s</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            {dynamicResultRecorded && !isRecording && !isAnalyzing && (
              <button type="button" onClick={advanceQuiz} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 text-sm shadow-md shadow-indigo-100">
                {currentQ === contentList.length - 1 ? "Calculate Real Final Score" : "Next Assignment"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SpeakingQuiz;