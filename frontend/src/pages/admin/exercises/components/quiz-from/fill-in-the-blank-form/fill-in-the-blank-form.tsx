import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Edit2,
  XCircle,
  HelpCircle,
  Hash,
} from "lucide-react";
import { useState } from "react";

interface FillBlank {
  id: string;
  sentence: string;
  type: "fillblank";
  correctAnswer: string;
  alternatives: string[];
}

const FillBlankForm = ({ setContent }: { setContent: any }) => {
  const [sentence, setSentence] = useState("");
  const [answer, setAnswer] = useState("");
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [alternativeInput, setAlternativeInput] = useState("");
  const [questions, setQuestions] = useState<FillBlank[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  // Generate unique ID
  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add alternative answer
  const addAlternative = () => {
    if (
      alternativeInput.trim() &&
      !alternatives.includes(alternativeInput.trim())
    ) {
      setAlternatives([...alternatives, alternativeInput.trim()]);
      setAlternativeInput("");
    }
  };

  // Remove alternative
  const removeAlternative = (alt: string) => {
    setAlternatives(alternatives.filter((a) => a !== alt));
  };

  // Add or update question
  const handleSubmit = () => {
    if (!sentence.trim()) {
      setError("Please enter the sentence");
      return;
    }

    if (!answer.trim()) {
      setError("Please enter the correct answer");
      return;
    }
    console.log("alternativeInput2", alternatives);

    if (alternatives.length == 0) {
      setError("Please enter at least one wrong option");
      return;
    }

    // Check if sentence contains a blank placeholder
    if (
      !sentence.includes("_____") &&
      !sentence.includes("___") &&
      !sentence.includes("{{blank}}")
    ) {
      setError("Please include a blank (_____) in your sentence");
      return;
    }

    const newQuestion: FillBlank = {
      id: editingId || generateId(),
      type: "fillblank",
      sentence: sentence.trim(),
      correctAnswer: answer.trim().toLowerCase(),

      alternatives: alternatives.map((alt) => alt.toLowerCase()),
    };

    // id: "3",
    // type: "fillblank",
    // sentence: "The _____ is the largest planet in our solar system.",
    // correctAnswer: "Jupiter",
    // alternatives: ["Jupiter", "jupiter"],

    if (editingId) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingId ? newQuestion : q)),
      );
      setEditingId(null);
    } else {
      setContent((prev: any) => [...prev, newQuestion]);
      setQuestions((prev) => [...prev, newQuestion]);
    }

    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setSentence("");
    setAnswer("");
    setAlternatives([]);
    setAlternativeInput("");
    setError("");
  };

  // Edit question
//   const handleEdit = (question: FillBlank) => {
//     setSentence(question.sentence);
//     setAnswer(question.correctAnswer);
//     setAlternatives(question.alternatives);
//     setEditingId(question.id);
//     setError("");
//   };

  // Delete question
 
  // Highlight the blank in sentence
  const highlightBlank = (text: string) => {
    return text.replace(/_____|___|\{\{blank\}\}/g, (match) => {
      return `<span class="bg-yellow-100 px-2 py-0.5 rounded font-mono text-yellow-800 border border-yellow-300">${match}</span>`;
    });
  };

  return (
    <div className="bg-background rounded-lg p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold  text-foreground bg-clip-text">
              Fill in the Blank Generator
            </h1>
            <p className="text-slate-500 mt-1">
              Create sentence completion exercises for your students
            </p>
          </div>
          <Badge
            variant="secondary"
            className="px-4 py-2 bg-slate-100 text-slate-700"
          >
            Total Questions: {questions.length}
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
              {editingId ? "Edit Question" : "Create New Fill in the Blank"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Sentence Input */}
            <div className="space-y-2">
              <Label className="text-slate-800 font-semibold flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Sentence with Blank
              </Label>
              <Textarea
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder="Example: The capital of France is _____."
                className="min-h-[100px] resize-none focus:ring-2 focus:ring-slate-500 font-mono"
              />
              <p className="text-xs text-slate-500">
                Use <span className="bg-slate-100 px-1 rounded">_____</span>{" "}
                (underscores) or
                <span className="bg-slate-100 px-1 rounded mx-1">
                  {"{{blank}}"}
                </span>{" "}
                to indicate where the blank should be
              </p>
            </div>

            {/* Answer Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-800 font-semibold">
                  Correct Answer
                </Label>
                <Input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the correct answer"
                  className="focus:ring-2 focus:ring-slate-500"
                />
              </div>

              {/* <div className="space-y-2">
                <Label className="text-slate-800 font-semibold">Options</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="caseSensitive"
                    checked={caseSensitive}
                    onChange={(e) => setCaseSensitive(e.target.checked)}
                    className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  />
                  <Label htmlFor="caseSensitive" className="text-sm font-normal text-slate-600">
                    Case sensitive matching
                  </Label>
                </div>
              </div> */}
              <div className="space-y-3">
                <Label className="text-slate-800 font-semibold flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Wrong Options
                </Label>

                <div className="flex gap-2">
                  <Input
                    value={alternativeInput}
                    onChange={(e) => setAlternativeInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addAlternative()}
                    placeholder="Add alternative options"
                    className="flex-1 focus:ring-2 focus:ring-slate-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAlternative}
                    className="bg-slate-50 hover:bg-slate-100"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {alternatives.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {alternatives.map((alt, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                        onClick={() => removeAlternative(alt)}
                      >
                        {alt}
                        <XCircle className="w-3 h-3 ml-2" />
                      </Badge>
                    ))}
                  </div>
                )}
                {/* <p className="text-xs text-slate-500">
                Add multiple possible correct answers (e.g., different word forms or synonyms)
              </p> */}
              </div>
            </div>

            {/* Alternative Answers */}

            {/* Preview Section */}
            {sentence && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Label className="text-slate-800 font-semibold mb-2 block">
                  Preview
                </Label>
                <div
                  className="text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html: highlightBlank(sentence),
                  }}
                />
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    <strong>Expected answer:</strong> {answer}
                    {alternatives.length > 0 &&
                      ` (or ${alternatives.join(", ")})`}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-primary"
              >
                {editingId ? "Update Question" : "Add Question"}
              </Button>
            </div>
          </CardContent>
        </Card>

       
      </div>
    </div>
  );
};

export default FillBlankForm;
