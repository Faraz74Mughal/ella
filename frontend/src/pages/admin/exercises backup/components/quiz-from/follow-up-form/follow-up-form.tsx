import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Headphones,
  Mic,
  Plus,
  Trash2,
  Edit2,
  XCircle,
  CheckCircle,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  Upload,
  FileAudio,
  Music,
  Clock,
  Award,
  Save,
  Settings,
  ListChecks,
  HelpCircle,
  Loader2,
  RefreshCw,
  Eye,
  Maximize2,
  Minimize2,
  FileText
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

// Types
interface ListeningQuestion {
  id: string;
  type: "listening";
  title: string;
  description: string;
  audioFile: AudioFile;
  transcript: string;
  questions: SubQuestion[];
  settings: ListeningSettings;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  duration: number; // in seconds
}

interface AudioFile {
  id: string;
  name: string;
  url: string;
  size: number;
  duration: number;
  format: "mp3" | "wav" | "ogg" | "m4a";
}

interface SubQuestion {
  id: string;
  type: "mcq" | "fill_blank" | "true_false" | "short_answer" | "ordering";
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  alternatives?: string[];
  points: number;
  timestamp?: number; // audio timestamp for this question
  feedback?: string;
}

interface ListeningSettings {
  allowMultipleAttempts: boolean;
  maxAttempts: number;
  showTranscript: boolean;
  allowPause: boolean;
  allowSeek: boolean;
  autoPlay: boolean;
  repeatAudio: boolean;
  timeLimit: number; // seconds for entire exercise
  passingScore: number;
  showFeedback: boolean;
}

const FollowUpForm = () => {
  const [questions, setQuestions] = useState<ListeningQuestion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Audio player refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [transcript, setTranscript] = useState("");
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  // Sub-questions
  const [subQuestions, setSubQuestions] = useState<SubQuestion[]>([
    { id: "1", type: "mcq", text: "", options: ["", "", "", ""], correctAnswer: "", points: 10 }
  ]);
  
  // Settings
  const [settings, setSettings] = useState<ListeningSettings>({
    allowMultipleAttempts: true,
    maxAttempts: 3,
    showTranscript: false,
    allowPause: true,
    allowSeek: true,
    autoPlay: false,
    repeatAudio: false,
    timeLimit: 300,
    passingScore: 70,
    showFeedback: true
  });
  
  // Preview state
  const [previewAudio, setPreviewAudio] = useState<string | null>(null);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({});
  
  function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Audio handling
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        setAudioFile({
          id: generateId(),
          name: file.name,
          url,
          size: file.size,
          duration: audio.duration,
          format: file.name.split('.').pop()?.toLowerCase() as any
        });
        setDuration(audio.duration);
      });
    }
  };
  
  // Sub-question management
  const addSubQuestion = () => {
    setSubQuestions([
      ...subQuestions,
      { id: generateId(), type: "mcq", text: "", options: ["", "", "", ""], correctAnswer: "", points: 10 }
    ]);
  };
  
  const removeSubQuestion = (id: string) => {
    if (subQuestions.length > 1) {
      setSubQuestions(subQuestions.filter(q => q.id !== id));
    }
  };
  
  const updateSubQuestion = (id: string, field: keyof SubQuestion, value: any) => {
    setSubQuestions(subQuestions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };
  
  const updateOption = (qId: string, optionIndex: number, value: string) => {
    setSubQuestions(subQuestions.map(q => {
      if (q.id === qId && q.options) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };
  
  const addOption = (qId: string) => {
    setSubQuestions(subQuestions.map(q => {
      if (q.id === qId && q.options) {
        return { ...q, options: [...q.options, ""] };
      }
      return q;
    }));
  };
  
  const removeOption = (qId: string, optionIndex: number) => {
    setSubQuestions(subQuestions.map(q => {
      if (q.id === qId && q.options && q.options.length > 2) {
        const newOptions = q.options.filter((_, i) => i !== optionIndex);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };
  
  // Tags management
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  // Audio player controls for preview
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Save listening exercise
  const saveListeningExercise = () => {
    if (!title.trim() || !audioFile) {
      alert("Please provide a title and upload an audio file");
      return;
    }
    
    if (subQuestions.some(q => !q.text.trim() || !q.correctAnswer)) {
      alert("Please fill in all question fields");
      return;
    }
    
    const newExercise: ListeningQuestion = {
      id: editingId || generateId(),
      type: "listening",
      title: title.trim(),
      description: description.trim(),
      audioFile,
      transcript: transcript.trim(),
      questions: subQuestions,
      settings,
      difficulty,
      tags,
      duration: audioFile.duration
    };
    
    if (editingId) {
      setQuestions(prev => prev.map(q => q.id === editingId ? newExercise : q));
      setEditingId(null);
    } else {
      setQuestions(prev => [...prev, newExercise]);
    }
    
    resetForm();
  };
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTranscript("");
    setAudioFile(null);
    setDifficulty("medium");
    setTags([]);
    setTagInput("");
    setSubQuestions([
      { id: "1", type: "mcq", text: "", options: ["", "", "", ""], correctAnswer: "", points: 10 }
    ]);
    setSettings({
      allowMultipleAttempts: true,
      maxAttempts: 3,
      showTranscript: false,
      allowPause: true,
      allowSeek: true,
      autoPlay: false,
      repeatAudio: false,
      timeLimit: 300,
      passingScore: 70,
      showFeedback: true
    });
    setEditingId(null);
    setActiveTab("basic");
  };
  
  const editExercise = (exercise: ListeningQuestion) => {
    setTitle(exercise.title);
    setDescription(exercise.description);
    setTranscript(exercise.transcript);
    setAudioFile(exercise.audioFile);
    setDifficulty(exercise.difficulty);
    setTags(exercise.tags);
    setSubQuestions(exercise.questions);
    setSettings(exercise.settings);
    setEditingId(exercise.id);
    setActiveTab("basic");
    
    if (exercise.audioFile) {
      setDuration(exercise.audioFile.duration);
      setPreviewAudio(exercise.audioFile.url);
    }
  };
  
  const deleteExercise = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };
  
  // Render question type specific form
  const renderQuestionForm = (question: SubQuestion, idx: number) => {
    switch(question.type) {
      case "mcq":
        return (
          <div className="space-y-3 pl-6 border-l-2 border-blue-200">
            <Label className="text-sm font-medium">Options</Label>
            {question.options?.map((opt, optIdx) => (
              <div key={optIdx} className="flex gap-2 items-center">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correctAnswer === opt}
                  onChange={() => updateSubQuestion(question.id, "correctAnswer", opt)}
                  className="w-4 h-4"
                />
                <Input
                  value={opt}
                  onChange={(e) => updateOption(question.id, optIdx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                  className="flex-1"
                />
                {question.options && question.options.length > 2 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeOption(question.id, optIdx)}
                    className="text-red-500"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addOption(question.id)}
              className="mt-2"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Option
            </Button>
          </div>
        );
      
      case "fill_blank":
        return (
          <div className="space-y-3 pl-6 border-l-2 border-purple-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-sm">Correct Answer</Label>
                <Input
                  value={question.correctAnswer as string}
                  onChange={(e) => updateSubQuestion(question.id, "correctAnswer", e.target.value)}
                  placeholder="Expected answer"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Alternative Answers (comma separated)</Label>
                <Input
                  value={question.alternatives?.join(", ") || ""}
                  onChange={(e) => updateSubQuestion(question.id, "alternatives", e.target.value.split(",").map(s => s.trim()))}
                  placeholder="synonym1, synonym2"
                />
              </div>
            </div>
          </div>
        );
      
      case "true_false":
        return (
          <div className="space-y-3 pl-6 border-l-2 border-green-200">
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={question.correctAnswer === "true"}
                  onChange={() => updateSubQuestion(question.id, "correctAnswer", "true")}
                  className="w-4 h-4"
                />
                <span>True</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={question.correctAnswer === "false"}
                  onChange={() => updateSubQuestion(question.id, "correctAnswer", "false")}
                  className="w-4 h-4"
                />
                <span>False</span>
              </label>
            </div>
          </div>
        );
      
      case "short_answer":
        return (
          <div className="space-y-3 pl-6 border-l-2 border-orange-200">
            <div className="space-y-1">
              <Label className="text-sm">Expected Answer Keywords</Label>
              <Textarea
                value={question.correctAnswer as string}
                onChange={(e) => updateSubQuestion(question.id, "correctAnswer", e.target.value)}
                placeholder="Enter keywords or expected answer pattern"
                rows={2}
              />
              <p className="text-xs text-slate-400">
                Separate keywords with commas for flexible matching
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-blue-500" />
            Listening Comprehension
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Create audio-based listening exercises with follow-up questions
          </p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Total: {questions.length} exercises
        </Badge>
      </div>
      
      {/* Main Form Card */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              {editingId ? "Edit Listening Exercise" : "Create Listening Exercise"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="text-blue-600"
            >
              {isPreviewMode ? <Minimize2 className="w-4 h-4 mr-1" /> : <Maximize2 className="w-4 h-4 mr-1" />}
              {isPreviewMode ? "Close Preview" : "Test Preview"}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 rounded-none bg-blue-50">
              <TabsTrigger value="basic" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="audio" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Audio & Transcript
              </TabsTrigger>
              <TabsTrigger value="questions" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Questions
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Settings
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Preview
              </TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Exercise Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., News Report: Climate Change"
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Difficulty Level</Label>
                  <div className="flex gap-2">
                    {(["easy", "medium", "hard"] as const).map(level => (
                      <Button
                        key={level}
                        type="button"
                        variant={difficulty === level ? "default" : "outline"}
                        onClick={() => setDifficulty(level)}
                        className={difficulty === level ? "bg-blue-600" : ""}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of what students will listen to..."
                  className="resize-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              
              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <ListChecks className="w-4 h-4" />
                  Tags / Topics
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="e.g., business, news, conversation, lecture"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-700">
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
              
              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("audio")} className="bg-blue-600">
                  Next: Upload Audio →
                </Button>
              </div>
            </TabsContent>
            
            {/* Audio & Transcript Tab */}
            <TabsContent value="audio" className="p-6 space-y-6">
              {/* Audio Upload */}
              <div className="space-y-4">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <FileAudio className="w-4 h-4 text-blue-600" />
                  Audio File
                </Label>
                
                {!audioFile ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                      id="audio-upload"
                    />
                    <label htmlFor="audio-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 mb-1">Click to upload audio file</p>
                      <p className="text-xs text-slate-400">MP3, WAV, OGG, M4A (Max 50MB)</p>
                    </label>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileAudio className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">{audioFile.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {formatTime(audioFile.duration)}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAudioFile(null)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Audio Preview */}
                    <div className="space-y-2">
                      <audio
                        ref={audioRef}
                        src={audioFile.url}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={togglePlayPause}
                          className="w-10 h-10 rounded-full"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <div className="flex-1">
                          <Slider
                            value={[currentTime]}
                            onValueChange={handleSeek}
                            max={duration}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                        <span className="text-sm text-slate-600">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Transcript */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Transcript (Optional)
                </Label>
                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste the full transcript of the audio here. This can be shown to students if enabled in settings."
                  className="min-h-[200px] font-mono text-sm resize-none"
                />
                <p className="text-xs text-slate-400">
                  Providing a transcript helps students check their answers and improves accessibility
                </p>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("basic")}>
                  ← Back
                </Button>
                <Button onClick={() => setActiveTab("questions")}>
                  Next: Add Questions →
                </Button>
              </div>
            </TabsContent>
            
            {/* Questions Tab */}
            <TabsContent value="questions" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  Comprehension Questions
                </Label>
                <Button type="button" variant="outline" onClick={addSubQuestion}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Question
                </Button>
              </div>
              
              <div className="space-y-6">
                {subQuestions.map((question, idx) => (
                  <Card key={question.id} className="border-l-4 border-l-blue-400">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {/* Question Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <Badge variant="outline" className="bg-blue-50">
                              Q{idx + 1}
                            </Badge>
                            <select
                              value={question.type}
                              onChange={(e) => updateSubQuestion(question.id, "type", e.target.value)}
                              className="px-2 py-1 border rounded-md text-sm"
                            >
                              <option value="mcq">Multiple Choice</option>
                              <option value="true_false">True/False</option>
                              <option value="fill_blank">Fill in the Blank</option>
                              <option value="short_answer">Short Answer</option>
                            </select>
                            
                            <div className="flex items-center gap-2 ml-auto">
                              <Label className="text-sm text-slate-500">Points:</Label>
                              <Input
                                type="number"
                                value={question.points}
                                onChange={(e) => updateSubQuestion(question.id, "points", parseInt(e.target.value) || 0)}
                                className="w-20 h-8 text-sm"
                                min={0}
                                max={100}
                              />
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeSubQuestion(question.id)}
                            disabled={subQuestions.length === 1}
                            className="text-red-500 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Question Text */}
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Question Text</Label>
                          <Textarea
                            value={question.text}
                            onChange={(e) => updateSubQuestion(question.id, "text", e.target.value)}
                            placeholder="Enter your question based on the audio..."
                            className="resize-none"
                            rows={2}
                          />
                        </div>
                        
                        {/* Audio Timestamp (Optional) */}
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <Input
                            type="number"
                            value={question.timestamp || ""}
                            onChange={(e) => updateSubQuestion(question.id, "timestamp", parseInt(e.target.value) || undefined)}
                            placeholder="Timestamp in seconds (e.g., 45)"
                            className="w-32 h-8 text-sm"
                            step={1}
                          />
                          <span className="text-xs text-slate-400">
                            Reference point in audio where answer can be found
                          </span>
                        </div>
                        
                        {/* Question Type Specific Fields */}
                        {renderQuestionForm(question, idx)}
                        
                        {/* Feedback */}
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Feedback (Optional)</Label>
                          <Textarea
                            value={question.feedback || ""}
                            onChange={(e) => updateSubQuestion(question.id, "feedback", e.target.value)}
                            placeholder="Provide feedback for this question..."
                            className="text-sm resize-none bg-amber-50"
                            rows={1}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("audio")}>
                  ← Back
                </Button>
                <Button onClick={() => setActiveTab("settings")}>
                  Next: Configure Settings →
                </Button>
              </div>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">General Settings</h4>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Allow Multiple Attempts</Label>
                    <Switch
                      checked={settings.allowMultipleAttempts}
                      onCheckedChange={(val) => setSettings({...settings, allowMultipleAttempts: val})}
                    />
                  </div>
                  
                  {settings.allowMultipleAttempts && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <Label className="text-sm">Maximum Attempts</Label>
                      <Input
                        type="number"
                        value={settings.maxAttempts}
                        onChange={(e) => setSettings({...settings, maxAttempts: parseInt(e.target.value) || 1})}
                        className="w-20 h-8"
                        min={1}
                        max={10}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Show Transcript to Students</Label>
                    <Switch
                      checked={settings.showTranscript}
                      onCheckedChange={(val) => setSettings({...settings, showTranscript: val})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Show Feedback After Answering</Label>
                    <Switch
                      checked={settings.showFeedback}
                      onCheckedChange={(val) => setSettings({...settings, showFeedback: val})}
                    />
                  </div>
                </div>
                
                {/* Audio Player Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Audio Player Settings</h4>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Allow Pause/Play</Label>
                    <Switch
                      checked={settings.allowPause}
                      onCheckedChange={(val) => setSettings({...settings, allowPause: val})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Allow Seeking (Skip Forward/Back)</Label>
                    <Switch
                      checked={settings.allowSeek}
                      onCheckedChange={(val) => setSettings({...settings, allowSeek: val})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Auto-Play Audio</Label>
                    <Switch
                      checked={settings.autoPlay}
                      onCheckedChange={(val) => setSettings({...settings, autoPlay: val})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Allow Audio Replay</Label>
                    <Switch
                      checked={settings.repeatAudio}
                      onCheckedChange={(val) => setSettings({...settings, repeatAudio: val})}
                    />
                  </div>
                </div>
              </div>
              
              {/* Time & Scoring */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700">Time Limit (seconds)</Label>
                  <Input
                    type="number"
                    value={settings.timeLimit}
                    onChange={(e) => setSettings({...settings, timeLimit: parseInt(e.target.value) || 0})}
                    min={30}
                    max={3600}
                  />
                  <p className="text-xs text-slate-400">0 = no time limit</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700">Passing Score (%)</Label>
                  <Input
                    type="number"
                    value={settings.passingScore}
                    onChange={(e) => setSettings({...settings, passingScore: parseInt(e.target.value) || 0})}
                    min={0}
                    max={100}
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("questions")}>
                  ← Back
                </Button>
                <Button onClick={() => setActiveTab("preview")}>
                  Go to Preview →
                </Button>
              </div>
            </TabsContent>
            
            {/* Preview Tab */}
            <TabsContent value="preview" className="p-6 space-y-6">
              {audioFile ? (
                <div className="space-y-6">
                  {/* Audio Player Preview */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">Audio Player Preview</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={togglePlayPause}
                          className="w-12 h-12 rounded-full bg-white"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        <div className="flex-1">
                          <Slider
                            value={[currentTime]}
                            onValueChange={handleSeek}
                            max={duration}
                            step={0.1}
                            className="w-full"
                            disabled={!settings.allowSeek}
                          />
                        </div>
                        <span className="text-sm font-mono">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        <Button size="sm" variant="ghost" disabled>
                          <SkipBack className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" disabled>
                          <Volume2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" disabled>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-center text-slate-500">
                        {!settings.allowPause && "Pause disabled • "}
                        {!settings.allowSeek && "Seeking disabled • "}
                        {settings.autoPlay && "Auto-play enabled"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Questions Preview */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700">Questions Preview</h4>
                    {subQuestions.map((question, idx) => (
                      <Card key={question.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="bg-blue-50">
                              Q{idx + 1} ({question.points} pts)
                            </Badge>
                            <div className="flex-1 space-y-2">
                              <p className="text-sm font-medium">{question.text}</p>
                              
                              {question.type === "mcq" && question.options && (
                                <div className="space-y-2">
                                  {question.options.map((opt, optIdx) => (
                                    <label key={optIdx} className="flex items-center gap-2 text-sm">
                                      <input type="radio" name={`preview-${question.id}`} className="w-4 h-4" />
                                      <span>{String.fromCharCode(65 + optIdx)}. {opt || `Option ${optIdx + 1}`}</span>
                                    </label>
                                  ))}
                                </div>
                              )}
                              
                              {question.type === "true_false" && (
                                <div className="flex gap-4">
                                  <label className="flex items-center gap-2">
                                    <input type="radio" name={`preview-${question.id}`} /> True
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <input type="radio" name={`preview-${question.id}`} /> False
                                  </label>
                                </div>
                              )}
                              
                              {question.type === "fill_blank" && (
                                <Input placeholder="Type your answer..." className="max-w-md" />
                              )}
                              
                              {question.type === "short_answer" && (
                                <Textarea placeholder="Type your answer..." rows={3} className="max-w-md" />
                              )}
                              
                              {question.timestamp && (
                                <div className="text-xs text-blue-600 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Audio reference: {formatTime(question.timestamp)}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Transcript Preview */}
                  {settings.showTranscript && transcript && (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-700 mb-2">Transcript</h4>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{transcript}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("settings")}>
                      ← Back to Settings
                    </Button>
                    <Button onClick={saveListeningExercise} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? "Update Exercise" : "Save Exercise"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Headphones className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Upload an audio file to see preview</p>
                  <Button variant="outline" onClick={() => setActiveTab("audio")} className="mt-4">
                    Go to Audio Upload
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Saved Exercises List */}
      {questions.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-slate-50 rounded-t-xl">
            <CardTitle className="text-slate-800 text-lg">
              Saved Listening Exercises
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {questions.map((exercise) => (
                <div key={exercise.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500">Listening</Badge>
                        <Badge variant="outline" className="capitalize">
                          {exercise.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {formatTime(exercise.duration)}
                        </Badge>
                        <Badge variant="outline">
                          {exercise.questions.length} questions
                        </Badge>
                      </div>
                      
                      <h4 className="font-medium text-slate-800">{exercise.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2">{exercise.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {exercise.settings.passingScore}% to pass
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {exercise.settings.timeLimit}s time limit
                        </span>
                        {exercise.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {exercise.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editExercise(exercise)}
                        className="hover:bg-blue-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteExercise(exercise.id)}
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

export default FollowUpForm;