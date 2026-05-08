import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Video,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Plus,
  Trash2,
  Edit2,
  XCircle,
  CheckCircle,
  Download,
  Upload,
  FileVideo,
  Clock,
  Award,
  Save,
  Settings,
  
  Film,
  Users,
  Newspaper,
  Briefcase,
  Heart,
  AlertCircle,
  RefreshCw,
  Eye,
  Mic,
  Subtitles,
  BookOpen,
  Target,
  Lightbulb,
  FileText,
  HelpCircle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

// Types
type VideoScenarioType = "interview" | "news" | "documentary" | "roleplay" | "case_study" | "training";

interface VideoScenario {
  id: string;
  type: "video";
  title: string;
  description: string;
  scenarioType: VideoScenarioType;
  videoFile: VideoFile;
  thumbnail?: string;
  transcript: string;
  subtitles: Subtitle[];
  scenes: Scene[];
  questions: VideoQuestion[];
  settings: VideoSettings;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  tags: string[];
  learningObjectives: string[];
}

interface VideoFile {
  id: string;
  name: string;
  url: string;
  size: number;
  duration: number;
  format: "mp4" | "webm" | "mov";
  resolution: string;
}

interface Subtitle {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  language: string;
}

interface Scene {
  id: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  keyMoments: string[];
  characters?: string[];
  location?: string;
}

interface VideoQuestion {
  id: string;
  type: "mcq" | "true_false" | "fill_blank" | "short_answer" | "reflection";
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  alternatives?: string[];
  points: number;
  timestamp: number;
  sceneId?: string;
  feedback?: string;
  requiresExplanation?: boolean;
}

interface VideoSettings {
  allowMultipleAttempts: boolean;
  maxAttempts: number;
  showSubtitles: boolean;
  subtitleLanguage: string;
  allowPause: boolean;
  allowSeek: boolean;
  allowSpeedControl: boolean;
  autoPlay: boolean;
  loopVideo: boolean;
  showTranscript: boolean;
  requireWatching: boolean;
  minWatchPercentage: number;
  timeLimit: number;
  passingScore: number;
  showFeedback: boolean;
  allowNotes: boolean;
}

const VideoScenariosForm = () => {
  const [scenarios, setScenarios] = useState<VideoScenario[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Video player refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scenarioType, setScenarioType] = useState<VideoScenarioType>("interview");
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [transcript, setTranscript] = useState("");
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [objectiveInput, setObjectiveInput] = useState("");
  
  // Questions
  const [questions, setQuestions] = useState<VideoQuestion[]>([
    { id: "1", type: "mcq", text: "", options: ["", "", "", ""], correctAnswer: "", points: 10, timestamp: 0 }
  ]);
  
  // Settings
  const [settings, setSettings] = useState<VideoSettings>({
    allowMultipleAttempts: true,
    maxAttempts: 3,
    showSubtitles: false,
    subtitleLanguage: "en",
    allowPause: true,
    allowSeek: true,
    allowSpeedControl: true,
    autoPlay: false,
    loopVideo: false,
    showTranscript: false,
    requireWatching: true,
    minWatchPercentage: 80,
    timeLimit: 0,
    passingScore: 70,
    showFeedback: true,
    allowNotes: true
  });
  
  function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Video handling
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        setVideoFile({
          id: generateId(),
          name: file.name,
          url,
          size: file.size,
          duration: video.duration,
          format: file.name.split('.').pop()?.toLowerCase() as any,
          resolution: `${video.videoWidth}x${video.videoHeight}`
        });
        setDuration(video.duration);
      });
    }
  };
  
  // Scene management
  const addScene = () => {
    setScenes([
      ...scenes,
      { id: generateId(), title: "", description: "", startTime: 0, endTime: 0, keyMoments: [] }
    ]);
  };
  
  const removeScene = (id: string) => {
    setScenes(scenes.filter(s => s.id !== id));
  };
  
  const updateScene = (id: string, field: keyof Scene, value: any) => {
    setScenes(scenes.map(scene => 
      scene.id === id ? { ...scene, [field]: value } : scene
    ));
  };
  
  const captureCurrentTime = () => {
    return currentTime;
  };
  
  const setSceneTime = (sceneId: string, field: "startTime" | "endTime") => {
    updateScene(sceneId, field, currentTime);
  };
  
  // Subtitle management
  const addSubtitle = () => {
    setSubtitles([
      ...subtitles,
      { id: generateId(), startTime: currentTime, endTime: currentTime + 5, text: "", language: "en" }
    ]);
  };
  
  const updateSubtitle = (id: string, field: keyof Subtitle, value: any) => {
    setSubtitles(subtitles.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ));
  };
  
  const removeSubtitle = (id: string) => {
    setSubtitles(subtitles.filter(s => s.id !== id));
  };
  
  // Question management
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: generateId(), type: "mcq", text: "", options: ["", "", "", ""], correctAnswer: "", points: 10, timestamp: currentTime }
    ]);
  };
  
  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };
  
  const updateQuestion = (id: string, field: keyof VideoQuestion, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };
  
  const updateOption = (qId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };
  
  const addOption = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options) {
        return { ...q, options: [...q.options, ""] };
      }
      return q;
    }));
  };
  
  const removeOption = (qId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options && q.options.length > 2) {
        const newOptions = q.options.filter((_, i) => i !== optionIndex);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };
  
  // Tags and objectives
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const addObjective = () => {
    if (objectiveInput.trim() && !learningObjectives.includes(objectiveInput.trim())) {
      setLearningObjectives([...learningObjectives, objectiveInput.trim()]);
      setObjectiveInput("");
    }
  };
  
  const removeObjective = (objective: string) => {
    setLearningObjectives(learningObjectives.filter(o => o !== objective));
  };
  
  // Video player controls
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
      setPlaybackRate(nextRate);
    }
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Save scenario
  const saveScenario = () => {
    if (!title.trim() || !videoFile) {
      alert("Please provide a title and upload a video file");
      return;
    }
    
    const newScenario: VideoScenario = {
      id: editingId || generateId(),
      type: "video",
      title: title.trim(),
      description: description.trim(),
      scenarioType,
      videoFile,
      thumbnail,
      transcript: transcript.trim(),
      subtitles,
      scenes,
      questions,
      settings,
      difficulty,
      duration: videoFile.duration,
      tags,
      learningObjectives
    };
    
    if (editingId) {
      setScenarios(prev => prev.map(s => s.id === editingId ? newScenario : s));
      setEditingId(null);
    } else {
      setScenarios(prev => [...prev, newScenario]);
    }
    
    resetForm();
  };
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setScenarioType("interview");
    setVideoFile(null);
    setThumbnail("");
    setTranscript("");
    setSubtitles([]);
    setScenes([]);
    setDifficulty("medium");
    setTags([]);
    setTagInput("");
    setLearningObjectives([]);
    setObjectiveInput("");
    setQuestions([
      { id: "1", type: "mcq", text: "", options: ["", "", "", ""], correctAnswer: "", points: 10, timestamp: 0 }
    ]);
    setSettings({
      allowMultipleAttempts: true,
      maxAttempts: 3,
      showSubtitles: false,
      subtitleLanguage: "en",
      allowPause: true,
      allowSeek: true,
      allowSpeedControl: true,
      autoPlay: false,
      loopVideo: false,
      showTranscript: false,
      requireWatching: true,
      minWatchPercentage: 80,
      timeLimit: 0,
      passingScore: 70,
      showFeedback: true,
      allowNotes: true
    });
    setEditingId(null);
    setActiveTab("basic");
  };
  
  const editScenario = (scenario: VideoScenario) => {
    setTitle(scenario.title);
    setDescription(scenario.description);
    setScenarioType(scenario.scenarioType);
    setVideoFile(scenario.videoFile);
    setThumbnail(scenario.thumbnail || "");
    setTranscript(scenario.transcript);
    setSubtitles(scenario.subtitles);
    setScenes(scenario.scenes);
    setDifficulty(scenario.difficulty);
    setTags(scenario.tags);
    setLearningObjectives(scenario.learningObjectives);
    setQuestions(scenario.questions);
    setSettings(scenario.settings);
    setEditingId(scenario.id);
    setActiveTab("basic");
  };
  
  const deleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  };
  
  // Get scenario type icon and color
  const getScenarioTypeInfo = (type: VideoScenarioType) => {
    switch(type) {
      case "interview":
        return { icon: Users, color: "blue", label: "Interview" };
      case "news":
        return { icon: Newspaper, color: "red", label: "News Report" };
      case "documentary":
        return { icon: Film, color: "purple", label: "Documentary" };
      case "roleplay":
        return { icon: Briefcase, color: "green", label: "Role Play" };
      case "case_study":
        return { icon: BookOpen, color: "orange", label: "Case Study" };
      case "training":
        return { icon: Target, color: "indigo", label: "Training" };
      default:
        return { icon: Video, color: "gray", label: "Video" };
    }
  };
  
  // Render question form
  const renderQuestionForm = (question: VideoQuestion, idx: number) => {
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
                  onChange={() => updateQuestion(question.id, "correctAnswer", opt)}
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
      
      case "true_false":
        return (
          <div className="space-y-3 pl-6 border-l-2 border-green-200">
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={question.correctAnswer === "true"}
                  onChange={() => updateQuestion(question.id, "correctAnswer", "true")}
                  className="w-4 h-4"
                />
                <span>True</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={question.correctAnswer === "false"}
                  onChange={() => updateQuestion(question.id, "correctAnswer", "false")}
                  className="w-4 h-4"
                />
                <span>False</span>
              </label>
            </div>
          </div>
        );
      
      case "fill_blank":
        return (
          <div className="space-y-3 pl-6 border-l-2 border-purple-200">
            <Input
              value={question.correctAnswer as string}
              onChange={(e) => updateQuestion(question.id, "correctAnswer", e.target.value)}
              placeholder="Correct answer"
            />
            <Input
              value={question.alternatives?.join(", ") || ""}
              onChange={(e) => updateQuestion(question.id, "alternatives", e.target.value.split(",").map(s => s.trim()))}
              placeholder="Alternative answers (comma separated)"
            />
          </div>
        );
      
      case "reflection":
        return (
          <div className="space-y-3 pl-6 border-l-2 border-orange-200">
            <Textarea
              value={question.feedback || ""}
              onChange={(e) => updateQuestion(question.id, "feedback", e.target.value)}
              placeholder="Provide reflection prompt or guiding questions..."
              rows={3}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={question.requiresExplanation}
                onChange={(e) => updateQuestion(question.id, "requiresExplanation", e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Require detailed explanation</span>
            </label>
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
            <Video className="w-5 h-5 text-red-500" />
            Video-Based Scenarios
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Create interactive video scenarios with comprehension questions and scene markers
          </p>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-700">
          Total: {scenarios.length} scenarios
        </Badge>
      </div>
      
      {/* Main Form Card */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-red-800 text-lg flex items-center gap-2">
              <Video className="w-5 h-5" />
              {editingId ? "Edit Video Scenario" : "Create Video Scenario"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="text-red-600"
            >
              {isPreviewMode ? <Minimize2 className="w-4 h-4 mr-1" /> : <Maximize2 className="w-4 h-4 mr-1" />}
              {isPreviewMode ? "Close Preview" : "Preview Mode"}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 rounded-none bg-red-50">
              <TabsTrigger value="basic" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs">
                Basic
              </TabsTrigger>
              <TabsTrigger value="video" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs">
                Video
              </TabsTrigger>
              <TabsTrigger value="scenes" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs">
                Scenes
              </TabsTrigger>
              <TabsTrigger value="subtitles" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs">
                Subtitles
              </TabsTrigger>
              <TabsTrigger value="questions" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs">
                Questions
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs">
                Settings
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs">
                Preview
              </TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Scenario Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Job Interview: Customer Service Position"
                    className="focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Scenario Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["interview", "news", "documentary", "roleplay", "case_study", "training"] as VideoScenarioType[]).map(type => {
                      const { icon: Icon, color, label } = getScenarioTypeInfo(type);
                      return (
                        <Button
                          key={type}
                          type="button"
                          variant={scenarioType === type ? "default" : "outline"}
                          onClick={() => setScenarioType(type)}
                          className={`${scenarioType === type ? `bg-${color}-600` : ''} justify-start`}
                          size="sm"
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the scenario and what students will learn..."
                  className="resize-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Difficulty</Label>
                  <div className="flex gap-2">
                    {(["easy", "medium", "hard"] as const).map(level => (
                      <Button
                        key={level}
                        type="button"
                        variant={difficulty === level ? "default" : "outline"}
                        onClick={() => setDifficulty(level)}
                        className={difficulty === level ? "bg-red-600" : ""}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Learning Objectives */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-600" />
                  Learning Objectives
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={objectiveInput}
                    onChange={(e) => setObjectiveInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                    placeholder="e.g., Identify key interview questions, Analyze body language"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={addObjective}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {learningObjectives.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {learningObjectives.map((obj, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-red-100 text-red-700">
                        {obj}
                        <XCircle
                          className="w-3 h-3 ml-2 cursor-pointer"
                          onClick={() => removeObjective(obj)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="e.g., business, communication, leadership"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="outline">
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
                <Button onClick={() => setActiveTab("video")} className="bg-red-600">
                  Next: Upload Video →
                </Button>
              </div>
            </TabsContent>
            
            {/* Video Tab */}
            <TabsContent value="video" className="p-6 space-y-6">
              {/* Video Upload */}
              <div className="space-y-4">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <FileVideo className="w-4 h-4 text-red-600" />
                  Video File
                </Label>
                
                {!videoFile ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <Video className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 mb-1">Click to upload video file</p>
                      <p className="text-xs text-slate-400">MP4, WebM, MOV (Max 500MB)</p>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileVideo className="w-8 h-8 text-red-600" />
                        <div>
                          <p className="font-medium">{videoFile.name}</p>
                          <p className="text-xs text-slate-500">
                            {formatTime(videoFile.duration)} • {videoFile.resolution} • {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setVideoFile(null)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Video Preview */}
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        src={videoFile.url}
                        className="w-full max-h-[400px] object-contain"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                      />
                      
                      {/* Custom Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="space-y-2">
                          <Slider
                            value={[currentTime]}
                            onValueChange={handleSeek}
                            max={duration}
                            step={0.1}
                            className="cursor-pointer"
                          />
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={togglePlayPause}
                                className="text-white hover:bg-white/20"
                              >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={toggleMute}
                                className="text-white hover:bg-white/20"
                              >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              </Button>
                              <span className="text-xs font-mono">
                                {formatTime(currentTime)} / {formatTime(duration)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {settings.allowSpeedControl && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={changePlaybackRate}
                                  className="text-white hover:bg-white/20 text-xs"
                                >
                                  {playbackRate}x
                                </Button>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-white hover:bg-white/20"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Current Time Display */}
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-mono">Current Time: {formatTime(currentTime)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(currentTime.toString());
                        }}
                      >
                        Copy Timestamp
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Transcript */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  Transcript (Optional)
                </Label>
                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste the full transcript of the video here..."
                  className="min-h-[150px] font-mono text-sm resize-none"
                />
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("basic")}>
                  ← Back
                </Button>
                <Button onClick={() => setActiveTab("scenes")}>
                  Next: Add Scenes →
                </Button>
              </div>
            </TabsContent>
            
            {/* Scenes Tab */}
            <TabsContent value="scenes" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-600" />
                  Video Scenes / Chapters
                </Label>
                <Button type="button" variant="outline" onClick={addScene}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Scene at {formatTime(currentTime)}
                </Button>
              </div>
              
              {scenes.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No scenes added yet. Click "Add Scene" to mark important sections.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scenes.map((scene, idx) => (
                    <Card key={scene.id} className="border-l-4 border-l-red-400">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-red-50">
                                Scene {idx + 1}
                              </Badge>
                              <span className="text-sm font-mono text-slate-500">
                                {formatTime(scene.startTime)} - {formatTime(scene.endTime)}
                              </span>
                            </div>
                            <Button                              size="sm"
                              variant="ghost"
                              onClick={() => removeScene(scene.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Input
                            value={scene.title}
                            onChange={(e) => updateScene(scene.id, "title", e.target.value)}
                            placeholder="Scene title"
                          />
                          
                          <Textarea
                            value={scene.description}
                            onChange={(e) => updateScene(scene.id, "description", e.target.value)}
                            placeholder="Scene description"
                            rows={2}
                          />
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Start Time</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  value={scene.startTime}
                                  onChange={(e) => updateScene(scene.id, "startTime", parseFloat(e.target.value))}
                                  step={0.1}
                                  className="flex-1"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSceneTime(scene.id, "startTime")}
                                >
                                  Use Current
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">End Time</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  value={scene.endTime}
                                  onChange={(e) => updateScene(scene.id, "endTime", parseFloat(e.target.value))}
                                  step={0.1}
                                  className="flex-1"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSceneTime(scene.id, "endTime")}
                                >
                                  Use Current
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("video")}>
                  ← Back
                </Button>
                <Button onClick={() => setActiveTab("subtitles")}>
                  Next: Add Subtitles →
                </Button>
              </div>
            </TabsContent>
            
            {/* Subtitles Tab */}
            <TabsContent value="subtitles" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <Subtitles className="w-4 h-4 text-red-600" />
                  Subtitles / Closed Captions
                </Label>
                <Button type="button" variant="outline" onClick={addSubtitle}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Subtitle at {formatTime(currentTime)}
                </Button>
              </div>
              
              {subtitles.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Subtitles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No subtitles added yet. Add subtitles for better accessibility.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {subtitles.map((sub, idx) => (
                    <div key={sub.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg">
                      <div className="flex-shrink-0 text-xs font-mono text-slate-500 pt-2">
                        {formatTime(sub.startTime)} → {formatTime(sub.endTime)}
                      </div>
                      <div className="flex-1">
                        <Input
                          value={sub.text}
                          onChange={(e) => updateSubtitle(sub.id, "text", e.target.value)}
                          placeholder="Subtitle text"
                          className="mb-1"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={sub.startTime}
                            onChange={(e) => updateSubtitle(sub.id, "startTime", parseFloat(e.target.value))}
                            step={0.1}
                            className="w-24 h-8 text-xs"
                            placeholder="Start"
                          />
                          <Input
                            type="number"
                            value={sub.endTime}
                            onChange={(e) => updateSubtitle(sub.id, "endTime", parseFloat(e.target.value))}
                            step={0.1}
                            className="w-24 h-8 text-xs"
                            placeholder="End"
                          />
                          <select
                            value={sub.language}
                            onChange={(e) => updateSubtitle(sub.id, "language", e.target.value)}
                            className="px-2 py-1 border rounded-md text-sm"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="zh">Chinese</option>
                          </select>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeSubtitle(sub.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("scenes")}>
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
                  <HelpCircle className="w-4 h-4 text-red-600" />
                  Comprehension Questions
                </Label>
                <Button type="button" variant="outline" onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Question at {formatTime(currentTime)}
                </Button>
              </div>
              
              <div className="space-y-6">
                {questions.map((question, idx) => (
                  <Card key={question.id} className="border-l-4 border-l-red-400">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {/* Question Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <Badge variant="outline" className="bg-red-50">
                              Q{idx + 1}
                            </Badge>
                            <select
                              value={question.type}
                              onChange={(e) => updateQuestion(question.id, "type", e.target.value)}
                              className="px-2 py-1 border rounded-md text-sm"
                            >
                              <option value="mcq">Multiple Choice</option>
                              <option value="true_false">True/False</option>
                              <option value="fill_blank">Fill in the Blank</option>
                              <option value="reflection">Reflection Question</option>
                            </select>
                            
                            <div className="flex items-center gap-2 ml-auto">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <Input
                                type="number"
                                value={question.timestamp}
                                onChange={(e) => updateQuestion(question.id, "timestamp", parseFloat(e.target.value))}
                                className="w-24 h-8 text-sm"
                                step={0.1}
                                placeholder="Timestamp"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuestion(question.id, "timestamp", currentTime)}
                                className="text-xs"
                              >
                                Use Current
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Label className="text-sm text-slate-500">Points:</Label>
                              <Input
                                type="number"
                                value={question.points}
                                onChange={(e) => updateQuestion(question.id, "points", parseInt(e.target.value) || 0)}
                                className="w-20 h-8 text-sm"
                                min={0}
                                max={100}
                              />
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeQuestion(question.id)}
                            disabled={questions.length === 1}
                            className="text-red-500 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Question Text */}
                        <Textarea
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                          placeholder="Enter your question based on the video..."
                          className="resize-none"
                          rows={2}
                        />
                        
                        {/* Scene Association */}
                        {scenes.length > 0 && (
                          <select
                            value={question.sceneId || ""}
                            onChange={(e) => updateQuestion(question.id, "sceneId", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                          >
                            <option value="">Associate with scene (optional)</option>
                            {scenes.map((scene, idx) => (
                              <option key={scene.id} value={scene.id}>
                                Scene {idx + 1}: {scene.title} ({formatTime(scene.startTime)})
                              </option>
                            ))}
                          </select>
                        )}
                        
                        {/* Question Type Specific Fields */}
                        {renderQuestionForm(question, idx)}
                        
                        {/* Feedback */}
                        <Textarea
                          value={question.feedback || ""}
                          onChange={(e) => updateQuestion(question.id, "feedback", e.target.value)}
                          placeholder="Feedback for this question (shown after answering)"
                          className="text-sm resize-none bg-amber-50"
                          rows={1}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("subtitles")}>
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
                {/* Attempt Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Attempt Settings</h4>
                  
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
                </div>
                
                {/* Video Player Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Video Player Settings</h4>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Allow Pause</Label>
                    <Switch
                      checked={settings.allowPause}
                      onCheckedChange={(val) => setSettings({...settings, allowPause: val})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Allow Seeking</Label>
                    <Switch
                      checked={settings.allowSeek}
                      onCheckedChange={(val) => setSettings({...settings, allowSeek: val})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Allow Speed Control</Label>
                    <Switch
                      checked={settings.allowSpeedControl}
                      onCheckedChange={(val) => setSettings({...settings, allowSpeedControl: val})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Auto-Play Video</Label>
                    <Switch
                      checked={settings.autoPlay}
                      onCheckedChange={(val) => setSettings({...settings, autoPlay: val})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Loop Video</Label>
                    <Switch
                      checked={settings.loopVideo}
                      onCheckedChange={(val) => setSettings({...settings, loopVideo: val})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Accessibility Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Accessibility</h4>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Show Subtitles</Label>
                    <Switch
                      checked={settings.showSubtitles}
                      onCheckedChange={(val) => setSettings({...settings, showSubtitles: val})}
                    />
                  </div>
                  
                  {settings.showSubtitles && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <Label className="text-sm">Subtitle Language</Label>
                      <select
                        value={settings.subtitleLanguage}
                        onChange={(e) => setSettings({...settings, subtitleLanguage: e.target.value})}
                        className="px-2 py-1 border rounded-md text-sm"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Show Transcript</Label>
                    <Switch
                      checked={settings.showTranscript}
                      onCheckedChange={(val) => setSettings({...settings, showTranscript: val})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Allow Notes</Label>
                    <Switch
                      checked={settings.allowNotes}
                      onCheckedChange={(val) => setSettings({...settings, allowNotes: val})}
                    />
                  </div>
                </div>
                
                {/* Assessment Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Assessment Settings</h4>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Require Full Watching</Label>
                    <Switch
                      checked={settings.requireWatching}
                      onCheckedChange={(val) => setSettings({...settings, requireWatching: val})}
                    />
                  </div>
                  
                  {settings.requireWatching && (
                    <div className="space-y-2">
                      <Label className="text-sm">Minimum Watch Percentage</Label>
                      <div className="flex items-center gap-3">
                        <Slider
                          value={[settings.minWatchPercentage]}
                          onValueChange={(val) => setSettings({...settings, minWatchPercentage: val[0]})}
                          max={100}
                          step={5}
                          className="flex-1"
                        />
                        <span className="text-sm font-mono w-12">{settings.minWatchPercentage}%</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <Label className="text-sm">Show Feedback</Label>
                    <Switch
                      checked={settings.showFeedback}
                      onCheckedChange={(val) => setSettings({...settings, showFeedback: val})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Passing Score (%)</Label>
                    <Input
                      type="number"
                      value={settings.passingScore}
                      onChange={(e) => setSettings({...settings, passingScore: parseInt(e.target.value) || 0})}
                      min={0}
                      max={100}
                      className="w-32"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Time Limit (seconds, 0 = no limit)</Label>
                    <Input
                      type="number"
                      value={settings.timeLimit}
                      onChange={(e) => setSettings({...settings, timeLimit: parseInt(e.target.value) || 0})}
                      min={0}
                      max={7200}
                      className="w-32"
                    />
                  </div>
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
              {videoFile ? (
                <div className="space-y-6">
                  {/* Student View Preview */}
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    {/* Video Player */}
                    <div className="relative bg-black">
                      <video
                        ref={videoRef}
                        src={videoFile.url}
                        className="w-full max-h-[500px] object-contain"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                        controls={settings.allowPause}
                        autoPlay={settings.autoPlay}
                        loop={settings.loopVideo}
                      />
                    </div>
                    
                    {/* Scene Markers */}
                    {scenes.length > 0 && (
                      <div className="p-3 bg-slate-50 border-b">
                        <div className="flex gap-2 overflow-x-auto">
                          {scenes.map((scene, idx) => (
                            <Button
                              key={scene.id}
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (videoRef.current && settings.allowSeek) {
                                  videoRef.current.currentTime = scene.startTime;
                                }
                              }}
                              disabled={!settings.allowSeek}
                              className="whitespace-nowrap"
                            >
                              {scene.title || `Scene ${idx + 1}`}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Questions Panel */}
                    <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                      <h4 className="font-semibold text-slate-800">Comprehension Questions</h4>
                      {questions.map((question, idx) => (
                        <div key={question.id} className="p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-start gap-2 mb-2">
                            <Badge variant="outline" className="bg-red-50">
                              Q{idx + 1}
                            </Badge>
                            {question.timestamp > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(question.timestamp)}
                              </Badge>
                            )}
                            <span className="text-xs text-slate-500 ml-auto">{question.points} pts</span>
                          </div>
                          <p className="text-sm mb-3">{question.text}</p>
                          
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
                          
                          {question.type === "reflection" && (
                            <Textarea placeholder="Type your reflection here..." rows={3} />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Transcript Panel */}
                    {settings.showTranscript && transcript && (
                      <div className="p-4 bg-slate-50 border-t">
                        <h4 className="font-semibold text-slate-800 mb-2">Transcript</h4>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                          {transcript}
                        </p>
                      </div>
                    )}
                    
                    {/* Submit Button */}
                    <div className="p-4 border-t bg-white">
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Submit Answers
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("settings")}>
                      ← Back to Settings
                    </Button>
                    <Button onClick={saveScenario} className="bg-red-600 hover:bg-red-700">
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? "Update Scenario" : "Save Scenario"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Upload a video file to see preview</p>
                  <Button variant="outline" onClick={() => setActiveTab("video")} className="mt-4">
                    Go to Video Upload
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Saved Scenarios List */}
      {scenarios.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-slate-50 rounded-t-xl">
            <CardTitle className="text-slate-800 text-lg">
              Saved Video Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {scenarios.map((scenario) => {
                const { icon: Icon, color, label } = getScenarioTypeInfo(scenario.scenarioType);
                return (
                  <div key={scenario.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`bg-${color}-500`}>Video</Badge>
                          <Badge variant="outline" className={`text-${color}-600`}>
                            <Icon className="w-3 h-3 mr-1" />
                            {label}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {scenario.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {formatTime(scenario.duration)}
                          </Badge>
                          <Badge variant="outline">
                            {scenario.questions.length} questions
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium text-slate-800">{scenario.title}</h4>
                        <p className="text-sm text-slate-500 line-clamp-2">{scenario.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {scenario.settings.passingScore}% to pass
                          </span>
                          <span className="flex items-center gap-1">
                            <Scene className="w-3 h-3" />
                            {scenario.scenes.length} scenes
                          </span>
                          <span className="flex items-center gap-1">
                            <Subtitles className="w-3 h-3" />
                            {scenario.subtitles.length} captions
                          </span>
                        </div>
                        
                        {scenario.learningObjectives.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {scenario.learningObjectives.slice(0, 2).map(obj => (
                              <Badge key={obj} variant="outline" className="text-xs bg-green-50">
                                <Target className="w-3 h-3 mr-1" />
                                {obj}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => editScenario(scenario)}
                          className="hover:bg-red-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteScenario(scenario.id)}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoScenariosForm;