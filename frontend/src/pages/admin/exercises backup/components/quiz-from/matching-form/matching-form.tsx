import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Trash2,
  Edit2,
  XCircle,
  HelpCircle,
  Shuffle,
  Link,
  Unlink,
} from "lucide-react";
import { useState } from "react";

interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

interface MatchingQuestion {
  id: string;
  title: string;
  type: "matching";
//   description: string;
  pairs: MatchingPair[];
  shuffleOptions: boolean;
}

const MatchingForm = ({ setContent }: { setContent: any }) => {
  const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
  const [pairs, setPairs] = useState<MatchingPair[]>([
    { id: generateId(), left: "", right: "" },
  ]);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [questions, setQuestions] = useState<MatchingQuestion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  // Generate unique ID
  function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add new pair
  const addPair = () => {
    setPairs([...pairs, { id: generateId(), left: "", right: "" }]);
  };

  // Remove pair
  const removePair = (id: string) => {
    if (pairs.length > 1) {
      setPairs(pairs.filter((pair) => pair.id !== id));
    } else {
      setError("You need at least one matching pair");
    }
  };

  // Update pair
  const updatePair = (id: string, field: keyof MatchingPair, value: string) => {
    setPairs(
      pairs.map((pair) =>
        pair.id === id ? { ...pair, [field]: value } : pair,
      ),
    );
    setError("");
  };

  // Add or update question
  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Please enter a title for this matching exercise");
      return;
    }

    if (pairs.some((pair) => !pair.left.trim() || !pair.right.trim())) {
      setError("Please fill in all matching pairs");
      return;
    }

    // Check for duplicate items
    const leftItems = pairs.map((p) => p.left.trim().toLowerCase());
    const rightItems = pairs.map((p) => p.right.trim().toLowerCase());

    if (new Set(leftItems).size !== leftItems.length) {
      setError("Left column items must be unique");
      return;
    }

    if (new Set(rightItems).size !== rightItems.length) {
      setError("Right column items must be unique");
      return;
    }
console.log("pairs",pairs);

    const newQuestion: MatchingQuestion = {
      id: editingId || generateId(),
      type: "matching",
      title: title.trim(),
    //   description: description.trim(),
      pairs: [...pairs],
      shuffleOptions,
    };

    // id: "5",
    // type: "matching",
    // title: "Countries and Capitals",
    // pairs: [
    //   { left: "France", right: "Paris" },
    //   { left: "Germany", right: "Berlin" },
    //   { left: "Japan", right: "Tokyo" },
    // ],

    if (editingId) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingId ? newQuestion : q)),
      );
      setEditingId(null);
    } else {
      setContent((prev: any[]) => [...prev, newQuestion]);
      setQuestions((prev) => [...prev, newQuestion]);
    }

    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    // setDescription("");
    setPairs([{ id: generateId(), left: "", right: "" }]);
    setShuffleOptions(true);
    setError("");
  };

  // Edit question
  const handleEdit = (question: MatchingQuestion) => {
    setTitle(question.title);
    // setDescription(question.description);
    setPairs(question.pairs);
    setShuffleOptions(question.shuffleOptions);
    setEditingId(question.id);
    setError("");
  };

  // Delete question
  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Duplicate question
  const handleDuplicate = (question: MatchingQuestion) => {
    const newQuestion = {
      ...question,
      id: generateId(),
      title: `${question.title} (Copy)`,
      pairs: question.pairs.map((pair) => ({ ...pair, id: generateId() })),
    };
    setQuestions([...questions, newQuestion]);
  };

  // Get shuffled pairs for display
  const getShuffledPairs = (pairs: MatchingPair[]) => {
    if (!shuffleOptions) return pairs;
    const shuffled = [...pairs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return (
    <div className="bg-background rounded-lg p-6">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold  text-foreground bg-clip-text">
              Matching Pair
            </h1>
            <p className="text-slate-500 mt-1">
              Create matching exercises by pairing related items
            </p>
          </div>
          <Badge
            variant="secondary"
            className="px-4 py-2 bg-slate-100 text-slate-700"
          >
            Total Exercises: {questions.length}
          </Badge>
        </div>

        {/* Form Card */}
        <Card className="border-0 rounded-lg ">
          <CardHeader className="bg-white border-b border-slate-100 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              {editingId ? (
                <Edit2 className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {editingId
                ? "Edit Matching Exercise"
                : "Create New Matching Exercise"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Title and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-salt-800 font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Exercise Title
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Countries and Capitals"
                  className="focus:ring-2 focus:ring-salt-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-salt-800 font-semibold flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  Options
                </Label>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="shuffleOptions"
                    checked={shuffleOptions}
                    onChange={(e) => setShuffleOptions(e.target.checked)}
                    className="rounded border-salt-300 text-salt-600 focus:ring-salt-500"
                  />
                  <Label
                    htmlFor="shuffleOptions"
                    className="text-sm font-normal text-slate-600"
                  >
                    Shuffle right column items (recommended)
                  </Label>
                </div>
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label className="text-salt-800 font-semibold">
                Description (Optional)
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add instructions or context for this matching exercise..."
                className="resize-none focus:ring-2 focus:ring-salt-500"
                rows={2}
              />
            </div> */}

            {/* Matching Pairs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-salt-800 font-semibold">
                  Matching Pairs
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPair}
                  size="sm"
                  className="bg-salt-50 hover:bg-salt-100"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Pair
                </Button>
              </div>

              <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-2 gap-4 px-4 py-2 bg-salt-50 rounded-lg">
                  <div className="font-semibold text-salt-800">
                    Column A (Terms)
                  </div>
                  <div className="font-semibold text-salt-800">
                    Column B (Matches)
                  </div>
                </div>

                {/* Pairs */}
                {pairs.map((pair, index) => (
                  <div
                    key={pair.id}
                    className="grid grid-cols-2 gap-4 items-start"
                  >
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">
                        Item {index + 1}
                      </Label>
                      <Input
                        value={pair.left}
                        onChange={(e) =>
                          updatePair(pair.id, "left", e.target.value)
                        }
                        placeholder="e.g., France"
                        className="focus:ring-2 focus:ring-salt-500"
                      />
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs text-slate-500">
                          Matches with
                        </Label>
                        <Input
                          value={pair.right}
                          onChange={(e) =>
                            updatePair(pair.id, "right", e.target.value)
                          }
                          placeholder="e.g., Paris"
                          className="focus:ring-2 focus:ring-salt-500"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePair(pair.id)}
                        className="mt-6 hover:bg-red-100 hover:text-red-600"
                        disabled={pairs.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            {pairs.some((p) => p.left || p.right) && (
              <div className="p-4 bg-salt-50 rounded-lg border border-salt-200">
                <Label className="text-salt-800 font-semibold mb-3 block">
                  Preview
                </Label>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-salt-700 mb-2">Column A</h4>
                    <ul className="space-y-2">
                      {pairs.map((pair, idx) => (
                        <li key={pair.id} className="text-sm text-slate-700">
                          {idx + 1}. {pair.left || "_____"}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-salt-700 mb-2">
                      Column B{" "}
                      {shuffleOptions && (
                        <span className="text-xs text-slate-500">
                          (Shuffled)
                        </span>
                      )}
                    </h4>
                    <ul className="space-y-2">
                      {getShuffledPairs(pairs).map((pair, idx) => (
                        <li key={pair.id} className="text-sm text-slate-700">
                          {String.fromCharCode(65 + idx)}.{" "}
                          {pair.right || "_____"}
                        </li>
                      ))}
                    </ul>
                  </div>
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
                className="bg-gradient-to-r from-salt-600 bg-primary"
              >
                {editingId ? "Update Exercise" : "Create Exercise"}
              </Button>
            </div>
          </CardContent>
        </Card>

      

        {/* Empty State */}
        {/* {questions.length === 0 && (
          <Card className="border-0 shadow-xl">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-salt-100 rounded-full flex items-center justify-center">
                  <Link className="w-8 h-8 text-salt-400" />
                </div>
                <h3 className="text-lg font-semibold text-salt-700">
                  No matching exercises yet
                </h3>
                <p className="text-slate-500">
                  Create your first matching exercise by pairing items above
                </p>
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
};

export default MatchingForm;
