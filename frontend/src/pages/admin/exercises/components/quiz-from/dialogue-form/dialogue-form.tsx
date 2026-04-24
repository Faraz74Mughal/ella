import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  Plus,
  Trash2,
  Edit2,
  XCircle,
  CheckCircle,
  MoveUp,
  MoveDown,
  Copy,
  Send,
  User,
  UserCircle,
  Mic,
  Play,
  Clock,
  Star,
  GripVertical,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types
interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  isCorrect?: boolean;
  expectedResponse?: string;
  alternatives?: string[];
  timeLimit?: number;
}

interface DialogueQuestion {
  id: string;
  type: "dialogue";
  title: string;
  description: string;
  scenario: string;
  speakers: string[];
  lines: DialogueLine[];
  mode: "complete" | "order" | "roleplay";
  difficulty: "easy" | "medium" | "hard";
  timePerResponse: number;
  allowHints: boolean;
  showFeedback: boolean;
  passingScore: number;
  tags: string[];
}

const DialogueForm = () => {
  const [questions, setQuestions] = useState<DialogueQuestion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scenario, setScenario] = useState("");
  const [speakers, setSpeakers] = useState<string[]>([
    "Speaker A",
    "Speaker B",
  ]);
  const [newSpeaker, setNewSpeaker] = useState("");
  const [mode, setMode] = useState<"complete" | "order" | "roleplay">(
    "complete",
  );
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [timePerResponse, setTimePerResponse] = useState(30);
  const [allowHints, setAllowHints] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);
  const [passingScore, setPassingScore] = useState(70);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string>("");
  // Dialogue lines
  const [lines, setLines] = useState<DialogueLine[]>([
    {
      id: generateId(),
      speaker: speakers[0],
      text: "",
      expectedResponse: "",
      alternatives: [],
    },
  ]);

  const [activeTab, setActiveTab] = useState("setup");

  function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Speaker management
  const addSpeaker = () => {
    if (newSpeaker.trim() && !speakers.includes(newSpeaker.trim())) {
      setSpeakers([...speakers, newSpeaker.trim()]);
      setNewSpeaker("");
    }
  };

  const removeSpeaker = (speaker: string) => {
    // if (speakers.length > 2) {
    setSpeakers(speakers.filter((s) => s !== speaker));
    // Update lines that used this speaker
    setLines(
      lines.map((line) =>
        line.speaker === speaker ? { ...line, speaker: speakers[0] } : line,
      ),
    );
    // }
  };

  // Dialogue line management
  const addLine = () => {
    setLines([
      ...lines,
      {
        id: generateId(),
        speaker: speakers[0],
        text: "",
        expectedResponse: "",
        alternatives: [],
      },
    ]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(lines.filter((line) => line.id !== id));
    }
  };

  const updateLine = (id: string, field: keyof DialogueLine, value: any) => {
    setLines(
      lines.map((line) =>
        line.id === id ? { ...line, [field]: value } : line,
      ),
    );
  };

  const moveLine = (id: string, direction: "up" | "down") => {
    const index = lines.findIndex((line) => line.id === id);
    if (direction === "up" && index > 0) {
      const newLines = [...lines];
      [newLines[index - 1], newLines[index]] = [
        newLines[index],
        newLines[index - 1],
      ];
      setLines(newLines);
    } else if (direction === "down" && index < lines.length - 1) {
      const newLines = [...lines];
      [newLines[index + 1], newLines[index]] = [
        newLines[index],
        newLines[index + 1],
      ];
      setLines(newLines);
    }
  };

  // Alternative answers for a line
  const addAlternative = (lineId: string, alternative: string) => {
    const line = lines.find((l) => l.id === lineId);
    if (
      line &&
      alternative.trim() &&
      !line.alternatives?.includes(alternative.trim())
    ) {
      updateLine(lineId, "alternatives", [
        ...(line.alternatives || []),
        alternative.trim(),
      ]);
    }
  };

  const removeAlternative = (lineId: string, alternative: string) => {
    const line = lines.find((l) => l.id === lineId);
    if (line) {
      updateLine(
        lineId,
        "alternatives",
        line.alternatives?.filter((a) => a !== alternative),
      );
    }
  };

  // Tags management
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Save dialogue
  const saveDialogue = () => {
    setError("");
    if (!title.trim() || lines.length === 0) {
      setError("Please fill in the title and add at least one dialogue line.");
      return;
    }
    if (speakers.length < 1) {
      setError("Please add at least one speakers.");
      return;
    }
    // Validate that all required fields are filled based on mode
    if (mode === "complete") {
      const hasMissingResponses = lines.some(
        (line) => !line.expectedResponse?.trim(),
      );
      console.log("hasMissingResponses", hasMissingResponses);

      if (hasMissingResponses) {
        setError("Please fill in expected responses for all lines");
        return;
      }
    }

    const newDialogue: DialogueQuestion = {
      id: editingId || generateId(),
      type: "dialogue",
      title: title.trim(),
      //   description: description.trim(),
      scenario: scenario.trim(),
      speakers,
      lines,
      mode,
      difficulty,
      timePerResponse,
      allowHints,
      showFeedback,
      passingScore,
      tags,
    };

    if (editingId) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingId ? newDialogue : q)),
      );
      setEditingId(null);
    } else {
      setQuestions((prev) => [...prev, newDialogue]);
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setScenario("");
    setSpeakers(["Speaker A", "Speaker B"]);
    setNewSpeaker("");
    setMode("complete");
    setDifficulty("medium");
    setTimePerResponse(30);
    setAllowHints(true);
    setShowFeedback(true);
    setPassingScore(70);
    setTags([]);
    setTagInput("");
    setLines([
      {
        id: generateId(),
        speaker: speakers[0],
        text: "",
        expectedResponse: "",
        alternatives: [],
      },
    ]);
    setEditingId(null);
    setActiveTab("setup");
  };

  const editDialogue = (dialogue: DialogueQuestion) => {
    setTitle(dialogue.title);
    setDescription(dialogue.description);
    setScenario(dialogue.scenario);
    setSpeakers(dialogue.speakers);
    setMode(dialogue.mode);
    setDifficulty(dialogue.difficulty);
    setTimePerResponse(dialogue.timePerResponse);
    setAllowHints(dialogue.allowHints);
    setShowFeedback(dialogue.showFeedback);
    setPassingScore(dialogue.passingScore);
    setTags(dialogue.tags);
    setLines(dialogue.lines);
    setEditingId(dialogue.id);
    setActiveTab("content");
  };

  const deleteDialogue = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Preview helpers
  const getModeIcon = () => {
    switch (mode) {
      case "complete":
        return <MessageSquare className="w-4 h-4" />;
      case "order":
        return <MoveUp className="w-4 h-4" />;
      case "roleplay":
        return <Users className="w-4 h-4" />;
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case "complete":
        return "Students fill in missing parts of the conversation";
      case "order":
        return "Students arrange dialogue lines in correct order";
      case "roleplay":
        return "Students choose appropriate responses in a role-play scenario";
    }
  };

  return (
    <div className="bg-background rounded-lg p-6">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold  text-foreground bg-clip-text">
              Dialogue/Conversation Exercise
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create interactive conversations and dialogue-based assessments
            </p>
          </div>
          <Badge
            variant="secondary"
            className="px-4 py-2 bg-slate-100 text-slate-700"
          >
            Total: {questions.length} dialogues
          </Badge>
        </div>

        {/* Main Form Card */}
        <Card className="border-0 rounded-lg ">
          <CardHeader className="bg-white border-b border-slate-100 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              {editingId ? (
                <Edit2 className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {editingId
                ? "Edit Dialogue Exercise"
                : "Create New Dialogue Exercise"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 rounded-none bg-slate-100">
                <TabsTrigger
                  value="setup"
                  className="data-[state=active]:bg-slate-500 data-[state=active]:text-white"
                >
                  Setup
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:bg-slate-500 data-[state=active]:text-white"
                >
                  Dialogue Content
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-slate-500 data-[state=active]:text-white"
                >
                  Preview
                </TabsTrigger>
              </TabsList>

              {/* Setup Tab */}
              <TabsContent value="setup" className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">
                      Dialogue Title
                    </Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Ordering at a Restaurant"
                      className="focus:ring-2 focus:ring-slate-500"
                    />
                  </div>

                  {/* <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">
                    Difficulty
                  </Label>
                  <div className="flex gap-2">
                    {(["easy", "medium", "hard"] as const).map((level) => (
                      <Button
                        key={level}
                        type="button"
                        variant={difficulty === level ? "default" : "outline"}
                        onClick={() => setDifficulty(level)}
                        className={difficulty === level ? "bg-slate-600" : ""}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div> */}
                </div>

                {/* <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">
                  Description
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the dialogue exercise..."
                  className="resize-none focus:ring-2 focus:ring-slate-500"
                  rows={2}
                />
              </div> */}

                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">
                    Scenario/Context
                  </Label>
                  <Textarea
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    placeholder="Describe the situation where this dialogue takes place..."
                    className="resize-none focus:ring-2 focus:ring-slate-500 bg-amber-50"
                    rows={3}
                  />
                </div>

                {/* Speakers */}
                <div className="space-y-3">
                  <Label className="text-slate-700 font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Speakers
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {speakers.map((speaker, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="px-2  py-3 flex items-center bg-slate-100 text-slate-700"
                      >
                        <UserCircle className="w-3 h-3 mr-1" />
                        {speaker}
                        {/* {speakers.length > 2 && ( */}
                        <div className=" cursor-pointer p-2 rounded ">
                          <XCircle
                            className="w-3 h-3  cursor-pointer hover:text-red-600"
                            onClick={() => removeSpeaker(speaker)}
                          />
                        </div>
                        {/* )} */}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSpeaker}
                      onChange={(e) => setNewSpeaker(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSpeaker()}
                      placeholder="Add New Speaker (e.g., Waiter, Customer)"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSpeaker}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Mode Selection
              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold">Dialogue Mode</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["complete", "order", "roleplay"] as const).map(m => (
                    <Card
                      key={m}
                      className={`cursor-pointer transition-all border-2 ${
                        mode === m ? "border-slate-500 bg-slate-50" : "border-slate-200"
                      }`}
                      onClick={() => setMode(m)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="font-semibold capitalize mb-1">{m}</div>
                        <div className="text-xs text-slate-500">
                          {m === "complete" && "Fill in blanks"}
                          {m === "order" && "Arrange order"}
                          {m === "roleplay" && "Choose responses"}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="text-xs text-slate-400">{getModeDescription()}</p>
              </div> */}

                {/* Settings */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg">
                <div className="space-y-2">
                  <Label className="text-slate-700">Time per Response (seconds)</Label>
                  <Input
                    type="number"
                    value={timePerResponse}
                    onChange={(e) => setTimePerResponse(parseInt(e.target.value) || 30)}
                    min={5}
                    max={300}
                    className="w-32"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700">Passing Score (%)</Label>
                  <Input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                    min={0}
                    max={100}
                    className="w-32"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700">Allow Hints</Label>
                  <Switch checked={allowHints} onCheckedChange={setAllowHints} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700">Show Feedback</Label>
                  <Switch checked={showFeedback} onCheckedChange={setShowFeedback} />
                </div>
              </div>
               */}
                {/* Tags */}
                {/* <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="e.g., restaurant, shopping, travel"
                    className="flex-1"
                  />
                  <Button
                  type="button" variant="outline" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="bg-slate-50">
                        #{tag}
                        <XCircle
                          className="w-3 h-3 ml-2 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
               */}
                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("content")}>
                    Next: Add Dialogue Lines →
                  </Button>
                </div>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-700 font-semibold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Dialogue Lines
                    </Label>
                    <Button type="button" variant="outline" onClick={addLine}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Line
                    </Button>
                  </div>

                  {/* Dialogue Lines */}
                  <div className="space-y-4">
                    {lines.map((line, index) => (
                      <Card
                        key={line.id}
                        className="relative border-l-4 border-l-slate-400"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {/* Move buttons */}
                            <div className="flex flex-col gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => moveLine(line.id, "up")}
                                disabled={index === 0}
                                className="h-6 w-6 p-0"
                              >
                                <MoveUp className="w-3 h-3" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => moveLine(line.id, "down")}
                                disabled={index === lines.length - 1}
                                className="h-6 w-6 p-0"
                              >
                                <MoveDown className="w-3 h-3" />
                              </Button>
                            </div>

                            <div className="flex-1 space-y-3">
                              {/* Speaker and line number */}
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className="bg-slate-100"
                                >
                                  Line {index + 1}
                                </Badge>
                                <select
                                  value={line.speaker}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "speaker",
                                      e.target.value,
                                    )
                                  }
                                  className="px-2 py-1 border rounded-md text-sm"
                                >
                                  {speakers.map((speaker) => (
                                    <option key={speaker} value={speaker}>
                                      {speaker}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Dialogue text */}
                              <div className="space-y-1">
                                <Label className="text-sm text-slate-600">
                                  Dialogue Text
                                </Label>
                                <Textarea
                                  value={line.text}
                                  onChange={(e) =>
                                    updateLine(line.id, "text", e.target.value)
                                  }
                                  placeholder="What does the speaker say?"
                                  className="resize-none text-sm"
                                  rows={2}
                                />
                              </div>

                              {/* Expected response (for complete mode) */}
                              {mode === "complete" && (
                                <div className="space-y-2 pl-4 border-l-2 border-dashed border-slate-200">
                                  <Label className="text-sm text-slate-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Expected Response / Blank Answer
                                  </Label>
                                  <Input
                                    value={line.expectedResponse || ""}
                                    onChange={(e) =>
                                      updateLine(
                                        line.id,
                                        "expectedResponse",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="What should the student say?"
                                    className="text-sm"
                                  />

                                  {/* Alternative answers */}
                                  <div className="space-y-1">
                                    <Label className="text-xs text-slate-500">
                                      Alternative Answers
                                    </Label>
                                    <div className="flex gap-2">
                                      <Input
                                        placeholder="Add alternative acceptable response"
                                        className="text-sm flex-1"
                                        onKeyPress={(e) => {
                                          if (e.key === "Enter") {
                                            addAlternative(
                                              line.id,
                                              (e.target as HTMLInputElement)
                                                .value,
                                            );
                                            (
                                              e.target as HTMLInputElement
                                            ).value = "";
                                          }
                                        }}
                                      />
                                    </div>
                                    {line.alternatives &&
                                      line.alternatives.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {line.alternatives.map((alt, idx) => (
                                            <Badge
                                              key={idx}
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              {alt}
                                              <XCircle
                                                className="w-3 h-3 ml-1 cursor-pointer"
                                                onClick={() =>
                                                  removeAlternative(
                                                    line.id,
                                                    alt,
                                                  )
                                                }
                                              />
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              )}

                              {/* Time limit for this line */}
                              {/* <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <Input
                                  type="number"
                                  value={line.timeLimit || timePerResponse}
                                  onChange={(e) =>
                                    updateLine(
                                      line.id,
                                      "timeLimit",
                                      parseInt(e.target.value),
                                    )
                                  }
                                  className="w-24 h-8 text-sm"
                                  placeholder="Time limit"
                                />
                                <span className="text-xs text-slate-400">
                                  seconds
                                </span>
                              </div> */}
                            </div>

                            {/* Remove button */}
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeLine(line.id)}
                              disabled={lines.length === 1}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("setup")}
                  >
                    ← Back to Setup
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("preview")}>
                    Preview Dialogue →
                  </Button>
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="p-6 space-y-6">
                <div className="space-y-4">
                  {/* Scenario Card */}
                  {scenario && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Play className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold text-amber-800">
                          Scenario
                        </span>
                      </div>
                      <p className="text-sm text-amber-700">{scenario}</p>
                    </div>
                  )}

                  {/* Dialogue Preview */}
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-semibold">
                      Dialogue Preview
                    </Label>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto p-2">
                      {lines.map((line, idx) => (
                        <div key={line.id} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                idx % 2 === 0 ? "bg-blue-100" : "bg-green-100"
                              }`}
                            >
                              {idx % 2 === 0 ? (
                                <User className="w-4 h-4 text-blue-600" />
                              ) : (
                                <UserCircle className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-slate-700">
                              {line.speaker}:
                            </div>
                            <div className="text-sm text-slate-600 mt-1">
                              {line.text || "[Empty - waiting for response]"}
                            </div>
                            {mode === "complete" && line.expectedResponse && (
                              <div className="mt-1 text-xs text-green-600 bg-green-50 inline-block px-2 py-0.5 rounded">
                                Expected: {line.expectedResponse}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mode-specific preview */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-sm text-slate-700 mb-2">
                      How it works:
                    </h4>
                    <p className="text-sm text-slate-600">
                      {getModeDescription()}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Badge variant="outline">
                        {lines.length} dialogue lines
                      </Badge>
                      <Badge variant="outline">
                        {speakers.length} speakers
                      </Badge>
                      <Badge variant="outline">
                        {timePerResponse}s per response
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("content")}
                  >
                    ← Edit Dialogue
                  </Button>
                  <Button
                    type="button"
                    onClick={saveDialogue}
                    className="bg-slate-600 hover:bg-slate-700"
                  >
                    {editingId ? "Update Exercise" : "Save Exercise"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Saved Dialogues List */}
        {questions.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-slate-50 rounded-t-xl">
              <CardTitle className="text-slate-800 text-lg">
                Saved Dialogues
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {questions.map((dialogue) => (
                  <div
                    key={dialogue.id}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-slate-500">Dialogue</Badge>
                          <Badge variant="outline" className="capitalize">
                            {dialogue.mode}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {dialogue.difficulty}
                          </Badge>
                        </div>

                        <h4 className="font-medium text-slate-800">
                          {dialogue.title}
                        </h4>
                        <p className="text-sm text-slate-500 line-clamp-2">
                          {dialogue.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {dialogue.lines.length} lines
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {dialogue.speakers.length} speakers
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {dialogue.passingScore}% to pass
                          </span>
                        </div>

                        {dialogue.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {dialogue.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => editDialogue(dialogue)}
                          className="hover:bg-slate-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteDialogue(dialogue.id)}
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

export default DialogueForm;
