import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PenTool, Trash2, Edit2, Clock, Award, Target } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

// Types
interface WritingPrompt {
  id: string;
  title: string;
  description: string;
  wordCountMin: number;
  wordCountMax: number;
  timeLimit: number;
}


const WritingPracticeForm = () => {
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [wordCountMin, setWordCountMin] = useState(250);
  const [wordCountMax, setWordCountMax] = useState(500);
  const [timeLimit, setTimeLimit] = useState(60);
  function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }





  const savePrompt = () => {
    if (!title.trim()) return;

    const newPrompt: WritingPrompt = {
      id: editingId || generateId(),
      title: title.trim(),
      description: description.trim(),
      wordCountMin,
      wordCountMax,
      timeLimit,
    };

    if (editingId) {
      setPrompts((prev) =>
        prev.map((p) => (p.id === editingId ? newPrompt : p)),
      );
      setEditingId(null);
    } else {
      setPrompts((prev) => [...prev, newPrompt]);
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTopic("");
    setWordCountMin(250);
    setWordCountMax(500);
    setTimeLimit(60);
   
    setEditingId(null);
    setActiveTab("basic");
   
  };

  const deletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-teal-500" />
            Writing Practice with Automated Feedback
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Create essay prompts with AI-powered grammar and spelling feedback
          </p>
        </div>
        <Badge variant="secondary" className="bg-teal-100 text-teal-700">
          Total: {prompts.length} prompts
        </Badge>
      </div>

      {/* Main Form Card */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-teal-800 text-lg flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              {editingId ? "Edit Writing Prompt" : "Create Writing Prompt"}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">
                    Essay Title
                  </Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., The Impact of Social Media on Society"
                    className="focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">
                    Topic
                  </Label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Technology, Education, Environment"
                    className="focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">
                  Description
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the essay prompt..."
                  className="resize-none focus:ring-2 focus:ring-teal-500"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700">Minimum Words</Label>
                  <Input
                    type="number"
                    value={wordCountMin}
                    onChange={(e) =>
                      setWordCountMin(parseInt(e.target.value) || 0)
                    }
                    min={50}
                    max={5000}
                    className="focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">Maximum Words</Label>
                  <Input
                    type="number"
                    value={wordCountMax}
                    onChange={(e) =>
                      setWordCountMax(parseInt(e.target.value) || 0)
                    }
                    min={100}
                    max={10000}
                    className="focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">Time Limit (minutes)</Label>
                  <Input
                    type="number"
                    value={timeLimit}
                    onChange={(e) =>
                      setTimeLimit(parseInt(e.target.value) || 0)
                    }
                    min={15}
                    max={180}
                    className="focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => savePrompt()} className="bg-teal-600">
                  Save
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Saved Prompts List */}
      {prompts.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-slate-50 rounded-t-xl">
            <CardTitle className="text-slate-800 text-lg">
              Saved Writing Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-teal-500">Writing</Badge>
                        
                        <Badge variant="outline">
                          {prompt.wordCountMin}-{prompt.wordCountMax} words
                        </Badge>
                      </div>

                      <h4 className="font-medium text-slate-800">
                        {prompt.title}
                      </h4>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {prompt.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {prompt.timeLimit} min
                        </span>
                       
                      </div>
                    </div>

                    <div className="flex gap-2">
                     
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deletePrompt(prompt.id)}
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
  );
};

export default WritingPracticeForm;
