import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  Loader2,
  Play,
  Save,
  Trash2,
  Edit2,
  FileAudio,
  Upload,
  Music,
  Award,
  Plus,
} from "lucide-react";
// import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

interface SpeechQuestion {
  id: string;
  type: "speech";
  prompt: string;
  expectedAnswer: string;
  alternatives: string[];
  language: string;
  maxAttempts: number;
  requireExactMatch: boolean;
  caseSensitive: boolean;
  audioFeedback: boolean;
  difficulty: "easy" | "medium" | "hard";
}

const SpeechRecognitionForm = () => {
  const [questions, setQuestions] = useState<SpeechQuestion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [prompt, setPrompt] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [alternativeInput, setAlternativeInput] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [requireExactMatch, setRequireExactMatch] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );

  // Speech recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  // Helper functions
  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addAlternative = () => {
    if (
      alternativeInput.trim() &&
      !alternatives.includes(alternativeInput.trim())
    ) {
      setAlternatives([...alternatives, alternativeInput.trim()]);
      setAlternativeInput("");
    }
  };

  const removeAlternative = (alt: string) => {
    setAlternatives(alternatives.filter((a) => a !== alt));
  };

  // Mock speech recognition (in real implementation, use Web Speech API)
  const startRecording = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setIsSupported(false);
      return;
    }

    setIsRecording(true);
    // Simulate recording (replace with actual Web Speech API)
    setTimeout(() => {
      setTranscript("Sample recognized speech");
      setIsRecording(false);
    }, 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const addQuestion = () => {
    if (!prompt.trim() || !expectedAnswer.trim()) return;

    const newQuestion: SpeechQuestion = {
      id: editingId || generateId(),
      type: "speech",
      prompt: prompt.trim(),
      expectedAnswer: expectedAnswer.trim(),
      alternatives,
      language,
      maxAttempts,
      requireExactMatch,
      caseSensitive,
      audioFeedback,
      difficulty,
    };

    if (editingId) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingId ? newQuestion : q)),
      );
      setEditingId(null);
    } else {
      setQuestions((prev) => [...prev, newQuestion]);
    }

    resetForm();
  };

  const resetForm = () => {
    setPrompt("");
    setExpectedAnswer("");
    setAlternatives([]);
    setAlternativeInput("");
    setLanguage("en-US");
    setMaxAttempts(3);
    setRequireExactMatch(false);
    setCaseSensitive(false);
    setAudioFeedback(true);
    setDifficulty("medium");
    setTranscript("");
  };

  const editQuestion = (question: SpeechQuestion) => {
    setPrompt(question.prompt);
    setExpectedAnswer(question.expectedAnswer);
    setAlternatives(question.alternatives);
    setLanguage(question.language);
    setMaxAttempts(question.maxAttempts);
    setRequireExactMatch(question.requireExactMatch);
    setCaseSensitive(question.caseSensitive);
    setAudioFeedback(question.audioFeedback);
    setDifficulty(question.difficulty);
    setEditingId(question.id);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="bg-background rounded-lg p-6">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold  text-foreground bg-clip-text">
              Speech Recognition Exercise
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create pronunciation and speaking exercises
            </p>
          </div>
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
            Total: {questions.length} exercises
          </Badge>
        </div>

        {/* Form Card */}
        <Card className="border-0 rounded-lg">
          <CardHeader className="bg-white border-b border-slate-100 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              {editingId ? (
                <Edit2 className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {editingId
                ? "Edit Speech Exercise"
                : "Create New Speech Exercise"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Prompt Section */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold flex items-center gap-2">
                <Play className="w-4 h-4 text-indigo-500" />
                Instruction/Prompt
              </Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Say the following sentence: The quick brown fox jumps over the lazy dog'"
                className="min-h-[80px] resize-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-400">
                Tell the learner what to say or read aloud
              </p>
            </div>

            {/* Expected Answer */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">
                  Expected Answer
                </Label>
                <Input
                  value={expectedAnswer}
                  onChange={(e) => setExpectedAnswer(e.target.value)}
                  placeholder="What the learner should say..."
                  className="focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                onClick={addQuestion}
                className="bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                {editingId ? "Update Exercise" : "Add Exercise"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        {questions.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-slate-50 rounded-t-xl">
              <CardTitle className="text-slate-800 text-lg">
                Exercise Bank
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-indigo-500">Speech</Badge>
                          <Badge variant="outline" className="capitalize">
                            {question.difficulty}
                          </Badge>
                          <Badge variant="outline">{question.language}</Badge>
                        </div>

                        <p className="text-sm font-medium text-slate-700">
                          {question.prompt}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600">
                            ✓ Expected: {question.expectedAnswer}
                          </span>
                          {question.alternatives.length > 0 && (
                            <span className="text-slate-500">
                              +{question.alternatives.length} alternatives
                            </span>
                          )}
                          <span className="text-slate-500">
                            Max attempts: {question.maxAttempts}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => editQuestion(question)}
                          className="hover:bg-indigo-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteQuestion(question.id)}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SpeechRecognitionForm;
