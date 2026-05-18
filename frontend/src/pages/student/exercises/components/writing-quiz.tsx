import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  CheckCircle2,
  X,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { saveStudentQuizSubmission } from "@/api/submission.service";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface WritingEvaluationResult {
  textSubmitted: string;
  score: number;
  critique: string;
  improvements: string;
  issuesFound: string[];
  wordCount: number;
}

interface WritingQuizProps {
  exercise: any;
}

const WritingQuiz = ({ exercise }: WritingQuizProps) => {
  const navigate = useNavigate();
  const contentList = exercise?.content ?? [];
  const q = contentList[0];

  const [userInput, setUserInput] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluationResult | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>((q?.timeLimit ?? 15) * 60);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const MAX_POINTS = 25;

  useEffect(() => {
    const trimmed = userInput.trim();
    if (!trimmed) {
      setWordCount(0);
      return;
    }

    setWordCount(trimmed.split(/\s+/).length);
  }, [userInput]);

  const handleSubmitWriting = useCallback(async () => {
    const trimmedText = userInput.trim();

    if (!trimmedText) {
      setEvaluation({
        textSubmitted: "[No text provided]",
        score: 0,
        critique: "No written content was submitted for assessment evaluation.",
        improvements:
          "Please make sure to write your paragraph content inside the provided text console window.",
        issuesFound: ["Missing text submissions."],
        wordCount: 0,
      });
      setShowResults(true);
      return;
    }

    setIsAnalyzing(true);
    setIsSaving(true);

    try {
      let penalty = 0;
      const issues: string[] = [];

      const lowerText = trimmedText.toLowerCase();
      const topicKeywords: Record<string, string[]> = {
        family: ["family", "mother", "father", "brother", "sister", "parents", "sibling", "son", "daughter", "grandpa", "grandma", "uncle", "aunt", "cousin", "wife", "husband"],
        hobby: ["hobby", "hobbies", "play", "game", "read", "book", "sport", "music", "watch", "movie", "listen", "paint", "cook", "swim"],
        routine: ["morning", "wake", "breakfast", "work", "school", "routine", "day", "night", "sleep", "always", "usually", "every"],
      };

      let assignedCategory = "family";
      if (q.topic.toLowerCase().includes("family")) assignedCategory = "family";
      else if (q.topic.toLowerCase().includes("hobby") || q.topic.toLowerCase().includes("hobbies")) assignedCategory = "hobby";
      else if (q.topic.toLowerCase().includes("routine") || q.topic.toLowerCase().includes("day")) assignedCategory = "routine";

      const matchedWords = topicKeywords[assignedCategory].filter((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "i");
        return regex.test(lowerText);
      });

      const MINIMUM_REQUIRED_MATCHES = 3;
      if (matchedWords.length < MINIMUM_REQUIRED_MATCHES) {
        penalty += 15;
        issues.push(
          `❌ Topic Relevancy Violation: Your writing does not appear to address the assigned topic ("${q.topic}"). Missing required vocabulary structural anchors.`,
        );
      }

      const params = new URLSearchParams();
      params.append("text", trimmedText);
      params.append("language", "en-US");

      const response = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      const data = await response.json();
      const matches = data.matches || [];

      matches.forEach((match: any) => {
        const catId = match.rule.category.id;
        let localPenalty = 2.0;
        let errorType = "Grammar Error";

        if (catId === "TYPOS" || catId === "MISSING_WORDS") {
          errorType = "Spelling Typo";
          localPenalty = 1.5;
        } else if (catId === "PUNCTUATION" || catId === "CASING") {
          errorType = "Punctuation/Casing";
          localPenalty = 1.0;
        }

        penalty += localPenalty;
        const errorSnippet = trimmedText.substring(match.offset, match.offset + match.length);
        const suggestion = match.replacements.slice(0, 2).map((r: any) => r.value).join(" / ");

        issues.push(
          `[${errorType}] near "${errorSnippet}": ${match.message} ${suggestion ? `(Try instead: ${suggestion})` : ""}`,
        );
      });

      if (wordCount < q.minimumWords) {
        penalty += 4;
        issues.push(
          `⚠️ Word count mismatch: You wrote ${wordCount} words, falling short of the required ${q.minimumWords} minimum words.`,
        );
      } else if (wordCount > q.maximumWords) {
        penalty += 2;
        issues.push(
          `⚠️ Word count threshold overrun: You wrote ${wordCount} words, exceeding the allowed ceiling of ${q.maximumWords} words.`,
        );
      }

      const calculatedScore = Math.max(0, MAX_POINTS - penalty);
      const calculatedPercentage = (calculatedScore / MAX_POINTS) * 100;
      const passed = calculatedPercentage >= (exercise.passing_percentage ?? 70);

      setEvaluation({
        textSubmitted: trimmedText,
        score: calculatedScore,
        critique:
          matchedWords.length < MINIMUM_REQUIRED_MATCHES
            ? "Submission structural layout rejected. The writing text copy is completely off-topic from the assigned family instruction parameters."
            : matches.length === 0
              ? "Excellent work! Your text is structurally relevant and free of grammatical deviations."
              : `Processed paragraph text. Identified ${matches.length} syntax discrepancies needing revision.`,
        improvements:
          matchedWords.length < MINIMUM_REQUIRED_MATCHES
            ? "You must rewrite the paragraph entirely. Ensure you write explicitly about family members (e.g., mother, father, brother) to pass."
            : matches.length === 0
              ? "Great composition layout. Keep testing your syntax using diverse vocabulary structures."
              : "Review the highlighted system logs carefully below to adjust your copy text.",
        issuesFound: issues,
        wordCount,
      });

      await saveStudentQuizSubmission({
        lesson_id: exercise.lesson_id,
        exercise_id: exercise._id,
        category: "writing",
        score_earned: Number(calculatedScore.toFixed(1)),
        max_score: MAX_POINTS,
        percentage: Math.round(calculatedPercentage),
        is_passed: passed,
        submitted_payload: {
          text_content: trimmedText,
          issues_found: issues,
          critique: "Analysis complete.",
          wordCount,
        },
      });

      setShowResults(true);
    } catch (err) {
      console.error("Syntax evaluation exception: ", err);
      toast.error("Error communicating with data validation pipelines.");
    } finally {
      setIsAnalyzing(false);
      setIsSaving(false);
    }
  }, [MAX_POINTS, exercise._id, exercise.lesson_id, exercise.passing_percentage, q.maximumWords, q.minimumWords, q.topic, userInput, wordCount]);

  useEffect(() => {
    if (showResults || !q || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          void handleSubmitWriting();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [handleSubmitWriting, q, showResults, timeLeft]);

  if (!exercise || contentList.length === 0 || !q) {
    return <div className="p-6 text-center text-slate-500">Loading module architecture...</div>;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const calculatedPercentage = evaluation ? (evaluation.score / MAX_POINTS) * 100 : 0;
  const passed = calculatedPercentage >= (exercise.passing_percentage ?? 70);

  const handleContinue = () => {
    if (passed) {
      toast.success("Great job! Moving to next lesson...");
      navigate("/student/lessons");
    } else {
      toast.info("Please try this lesson again.");
      navigate(`/student/lessons/${exercise.lesson_id}`);
    }
  };

  if (showResults && evaluation) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
              {passed ? <CheckCircle2 size={44} /> : <X size={44} />}
            </div>
            <h2 className="text-3xl font-bold text-slate-800">{passed ? "Writing Approved!" : "Revision Recommended"}</h2>
            <p className="text-sm text-slate-400 mt-1">Required Benchmark Standard: {exercise.passing_percentage}%</p>

            <div className="flex justify-center gap-12 my-6 border-y border-slate-100 py-4">
              <div>
                <p className="text-3xl font-black text-slate-800">
                  {Number(evaluation.score.toFixed(1))} <span className="text-sm font-medium text-slate-400">/ {MAX_POINTS}</span>
                </p>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Assigned Value Score</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-800">{Math.round(calculatedPercentage)}%</p>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Accuracy Profile</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-800">{evaluation.wordCount}</p>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Total Words Used</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2"><Sparkles size={18} className="text-indigo-500" /> Structural Writing Quality Assessment Report</h3>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {exercise.category} prompt assignment
              </span>
              <h4 className="text-lg font-bold text-slate-800 mt-2">{exercise.title}</h4>
              <p className="text-sm text-slate-500 italic mt-1">Topic Directive: {q.topic}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Your Submitted Entry Text Structure:</p>
              <p className="text-slate-700 whitespace-pre-wrap font-medium mt-1.5 leading-relaxed">"{evaluation.textSubmitted}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-xl">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">⚠️ Grammar & Mechanics Breakdown:</p>
                <p className="text-slate-700 mt-1 text-xs leading-relaxed">{evaluation.critique}</p>
              </div>
              <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-xl">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">🚀 Development Execution Advice:</p>
                <p className="text-slate-700 mt-1 text-xs leading-relaxed">{evaluation.improvements}</p>
              </div>
            </div>

            {evaluation.issuesFound.length > 0 && (
              <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl space-y-1">
                <p className="text-xs font-bold text-red-800 uppercase tracking-wide flex items-center gap-1">
                  <ShieldAlert size={14} /> Grammar, Spelling, & Punctuation Deviations Logged:
                </p>
                <ul className="list-none space-y-2 text-xs text-slate-600 mt-2">
                  {evaluation.issuesFound.map((issue, idx) => (
                    <li key={idx} className="bg-white p-2.5 rounded border border-red-100/50 shadow-sm leading-relaxed">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
      </div>
    );
  }

  const isOutOfRange = wordCount < q.minimumWords || wordCount > q.maximumWords;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
            <FileText size={16} className="text-indigo-500" />
            <span>Writing Target Profile</span>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-mono font-bold px-3 py-1 rounded-md ${timeLeft < 60 ? "bg-red-50 text-red-600 animate-pulse" : "bg-slate-100 text-slate-700"}`}>
              Time: {formatTime(timeLeft)}
            </span>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md">
              Value: {MAX_POINTS} Pts
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Composition Prompt:</p>
            <h3 className="text-xl font-bold text-slate-800 leading-snug">{q.topic}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center text-xs text-slate-500 font-semibold">
            <div>
              Target Lower Bound: <span className="text-slate-800 font-bold">{q.minimumWords} words</span>
            </div>
            <div>
              Target Upper Ceiling: <span className="text-slate-800 font-bold">{q.maximumWords} words</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Composition Console Area</label>
            <textarea
              disabled={isAnalyzing || timeLeft <= 0}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Start drafting your response details here..."
              rows={8}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 placeholder-slate-400 outline-none text-sm font-medium transition-all resize-none leading-relaxed shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <div className={`flex items-center gap-1 font-bold ${isOutOfRange && userInput.length > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              {isOutOfRange && userInput.length > 0 && <AlertTriangle size={14} />}
              <span>Words logged: {wordCount}</span>
            </div>
            <div className="text-slate-400">
              Level Profile: <span className="font-bold text-slate-600 uppercase">{exercise.level}</span>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={isAnalyzing || isSaving || userInput.trim().length === 0}
              onClick={handleSubmitWriting}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 text-sm shadow-md shadow-indigo-100 disabled:opacity-40 transition-all"
            >
              {isAnalyzing || isSaving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  {isSaving ? "Syncing Student Record Profile..." : "Running Linguistic Tests..."}
                </>
              ) : (
                "Submit and Calculate Score"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingQuiz;
