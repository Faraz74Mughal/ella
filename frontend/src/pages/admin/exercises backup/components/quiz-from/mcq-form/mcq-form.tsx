import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

interface Mcq {
  id: string;
  question: string;
  type: "mcq";
  options: string[];
  correctAnswer: string | null;
}

const McqForm = ({ setContent }: { setContent: any }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [mcqs, setMcqs] = useState<Mcq[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  // Generate unique ID
  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Handle option change
  const handleOptionChange = (value: string, index: number) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
    setError("");
  };

  // Add or update MCQ
  const handleSubmit = () => {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    if (correctIndex === null) {
      setError("Please select the correct answer");
      return;
    }

    if (options.some((opt) => !opt.trim())) {
      setError("All options must be filled");
      return;
    }
  
    const newMcq: Mcq = {
      id: editingId || generateId(),
      question: question.trim(),
      type: "mcq",
      options: [...options],
      correctAnswer: options[correctIndex],
    };
    if (editingId) {
      setMcqs((prev) =>
        prev.map((mcq) => (mcq.id === editingId ? newMcq : mcq)),
      );
      setEditingId(null);
    } else {
      setContent((prev: any) => [...prev, newMcq]);
      setMcqs((prev) => [...prev, newMcq]);
    }

    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(null);
    setError("");
  };

  // Edit MCQ
  // const handleEdit = (mcq: Mcq) => {
  //   setQuestion(mcq.question);
  //   setOptions(mcq.options);
  //   const correctIdx = mcq.options.findIndex((opt) => opt === mcq.correctIndex);
  //   setCorrectIndex(correctIdx);
  //   setEditingId(mcq.id);
  //   setError("");
  // };

 
  // Add new option
  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  // Remove option
  const removeOption = (index: number) => {
    if (options.length > 2) {
      const updated = options.filter((_, i) => i !== index);
      setOptions(updated);
      if (correctIndex === index) {
        setCorrectIndex(null);
      } else if (correctIndex !== null && correctIndex > index) {
        setCorrectIndex(correctIndex - 1);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              MCQ
            </h1>
            <p className="text-slate-500 mt-1">
              Create and manage multiple choice questions
            </p>
          </div>
          <Badge variant="secondary" className="px-4 py-2">
            Total MCQs: {mcqs.length}
          </Badge>
        </div>

        {/* Form Card */}
        <Card className="border-0 ">
          <CardHeader className="bg-white border-b border-slate-200 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              {editingId ? (
                <Edit2 className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {editingId ? "Edit Question" : "Create New Question"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Question Input */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Question
              </Label>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question here..."
                className="min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Options Grid */}
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold">
                Answer Options
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((opt, index) => (
                  <Card
                    key={index}
                    className={`relative transition-all ${correctIndex === index ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-slate-600">
                              Option {String.fromCharCode(65 + index)}
                            </Label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setCorrectIndex(index)}
                                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                  correctIndex === index
                                    ? "bg-green-500 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                {correctIndex === index ? (
                                  <CheckCircle className="w-3 h-3 inline mr-1" />
                                ) : null}
                                Mark as Answer
                              </button>
                              {options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(index)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          <Input
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(e.target.value, index)
                            }
                            placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {options.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  className="w-full mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              )}
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

export default McqForm;
