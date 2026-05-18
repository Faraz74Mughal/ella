import React, { useState, useEffect } from 'react';
import { 
  BookOpen, CheckCircle2, Lock, PlayCircle, Clock, ChevronLeft, 
  ChevronRight, Mic, PenTool, Headphones, Check, X, Volume2, 
  Pause, Play, FileText, Send, RotateCcw, Flame, Star, Trophy,
  MessageCircle
} from 'lucide-react';
import { useGetSingleExerciseByAdmin, useGetSingleExerciseByLessonByAdmin } from '@/hooks/use-exercise';
import { useParams } from 'react-router-dom';
import GrammarQuiz from './components/grammar-quiz';
import { loginSchema } from '@/lib/validations/auth';
import ListeningQuiz from './components/listening-quiz';
import SpeakingQuiz from './components/speaking-quiz';
import WritingQuiz from './components/writing-quiz';

// ===================== DATA =====================
const LEVEL = { BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' };
const CATEGORY = { GRAMMAR: 'Grammar', VOCABULARY: 'Vocabulary', LISTENING: 'Listening', SPEAKING: 'Speaking', WRITING: 'Writing' };

const exercisesData = [
  {
    _id: 'ex1', title: 'Present Simple Tense', level: LEVEL.BEGINNER, category: CATEGORY.GRAMMAR, points: 50, passing_percentage: 70,
    content: [
      { type: 'mcq', question: 'She _____ to school every day.', options: ['go', 'goes', 'going', 'went'], correctAnswer: 'goes', points: 10 },
      { type: 'fill_blank', question: 'They _____ football on Sundays.', correctAnswer: 'play', alternatives: ['plays'], points: 10 },
      { type: 'matching', pairs: [{ left: 'I', right: 'am' }, { left: 'You', right: 'are' }, { left: 'He', right: 'is' }], points: 15 },
      { type: 'mcq', question: 'The sun _____ in the east.', options: ['rise', 'rises', 'rising', 'rose'], correctAnswer: 'rises', points: 10 },
      { type: 'fill_blank', question: 'Water _____ at 100 degrees Celsius.', correctAnswer: 'boils', alternatives: ['boil'], points: 5 }
    ]
  },
  {
    _id: 'ex2', title: 'Business Interview', level: LEVEL.INTERMEDIATE, category: CATEGORY.LISTENING, points: 60, passing_percentage: 65,
    content: {
      type: 'listening', file: '/audio/interview.mp3', transcript: "Welcome to today's business interview...",
      comprehensionQuestions: [
        { type: 'mcq', question: 'What is the main topic?', options: ['Marketing', 'Finance', 'Technology', 'HR'], correctAnswer: 'Technology', points: 20 },
        { type: 'true_false', question: 'The speaker believes AI will replace all jobs.', correctAnswer: false, points: 20 },
        { type: 'fill_blank', question: 'The company was founded in _____.', correctAnswer: '2015', points: 20 }
      ]
    }
  },
  {
    _id: 'ex3', title: 'Daily Conversation', level: LEVEL.BEGINNER, category: CATEGORY.SPEAKING, points: 40, passing_percentage: 60,
    content: [
      { type: 'dialogue', question: 'Hello! How are you doing today?', speaker: 'Friend', expectedAnswer: 'I am doing well, thank you.', alternative: "I'm fine, thanks.", points: 10 },
      { type: 'follow_up', question: 'What did you do last weekend?', expectedAnswer: 'I visited my family.', points: 15 },
      { type: 'dialogue', question: 'What are your plans for next weekend?', speaker: 'Friend', expectedAnswer: 'I plan to study English.', points: 15 }
    ]
  },
  {
    _id: 'ex4', title: 'Essay: My Dream Job', level: LEVEL.INTERMEDIATE, category: CATEGORY.WRITING, points: 100, passing_percentage: 75,
    content: { type: 'writing', topic: 'Describe your dream job and why you want it.', timeLimit: 30, minimumWords: 150, maximumWords: 300, points: 100 }
  },
  {
    _id: 'ex5', title: 'Advanced Vocabulary', level: LEVEL.ADVANCED, category: CATEGORY.VOCABULARY, points: 80, passing_percentage: 80,
    content: [
      { type: 'mcq', question: 'The _____ of the situation was not apparent.', options: ['gravity', 'lightness', 'simplicity', 'joy'], correctAnswer: 'gravity', points: 20 },
      { type: 'fill_blank', question: 'His _____ behavior made everyone uncomfortable.', correctAnswer: 'obsequious', alternatives: ['sycophantic'], points: 20 },
      { type: 'matching', pairs: [{ left: 'Ephemeral', right: 'Short-lived' }, { left: 'Ubiquitous', right: 'Everywhere' }, { left: 'Pragmatic', right: 'Practical' }, { left: 'Esoteric', right: 'Obscure' }], points: 40 }
    ]
  }
];

const lessonsData = [
  { _id: 'l1', title: 'Grammar Foundations', category: CATEGORY.GRAMMAR, level: LEVEL.BEGINNER, description: 'Master the basics of English grammar', exercises: ['ex1'], progress: 100, totalExercises: 5, completedExercises: 5, thumbnail: 'from-emerald-400 to-teal-600', duration: '2h 30m', status: 'completed' },
  { _id: 'l2', title: 'Listening Comprehension', category: CATEGORY.LISTENING, level: LEVEL.INTERMEDIATE, description: 'Improve listening with real-world audio', exercises: ['ex2'], progress: 65, totalExercises: 3, completedExercises: 2, thumbnail: 'from-blue-400 to-indigo-600', duration: '1h 45m', status: 'in-progress' },
  { _id: 'l3', title: 'Conversational English', category: CATEGORY.SPEAKING, level: LEVEL.BEGINNER, description: 'Practice everyday conversations', exercises: ['ex3'], progress: 33, totalExercises: 3, completedExercises: 1, thumbnail: 'from-pink-400 to-rose-600', duration: '1h 15m', status: 'in-progress' },
  { _id: 'l4', title: 'Academic Writing', category: CATEGORY.WRITING, level: LEVEL.INTERMEDIATE, description: 'Learn to write essays and reports', exercises: ['ex4'], progress: 0, totalExercises: 1, completedExercises: 0, thumbnail: 'from-amber-400 to-orange-600', duration: '3h 00m', status: 'in-progress' },
  { _id: 'l5', title: 'Advanced Vocabulary', category: CATEGORY.VOCABULARY, level: LEVEL.ADVANCED, description: 'Expand vocabulary with advanced words', exercises: ['ex5'], progress: 0, totalExercises: 3, completedExercises: 0, thumbnail: 'from-violet-400 to-purple-600', duration: '2h 00m', status: 'in-progress' },
  { _id: 'l6', title: 'Business English', category: CATEGORY.SPEAKING, level: LEVEL.ADVANCED, description: 'Professional communication skills', exercises: [], progress: 0, totalExercises: 4, completedExercises: 0, thumbnail: 'from-slate-400 to-slate-600', duration: '4h 30m', status: 'in-progress' }
];

// ===================== COMPONENTS =====================
const Badge = ({ children, color }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{children}</span>
);

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-slate-100 rounded-full h-2">
    <div className="bg-indigo-500 h-2 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
  </div>
);

// ===================== LESSONS PAGE =====================
const LessonsPage = ({ onStartExercise }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = lessonsData.filter(l => {
    const matchesFilter = filter === 'all' || l.status === filter;
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getLevelColor = (level) => {
    if (level === LEVEL.BEGINNER) return 'bg-emerald-100 text-emerald-700';
    if (level === LEVEL.INTERMEDIATE) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Learning Path</h1>
            <p className="text-slate-500 mt-1">Pick up where you left off or explore new lessons</p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search lessons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-4 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'in-progress', 'completed', 'locked'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors
                ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
              {f === 'all' ? 'All Lessons' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(lesson => (
            <div key={lesson._id} className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all ${lesson.status === 'locked' ? 'opacity-60' : ''}`}>
              {/* Thumbnail */}
              <div className={`h-32 bg-gradient-to-br ${lesson.thumbnail} relative`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge color="bg-white/90 text-slate-800">{lesson.category}</Badge>
                  <h3 className="text-white font-bold text-lg mt-1 drop-shadow-lg">{lesson.title}</h3>
                </div>
                {lesson.status === 'locked' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Lock size={32} className="text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-sm text-slate-500 mb-4">{lesson.description}</p>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Clock size={14} /> {lesson.duration}</span>
                  <span>{lesson.completedExercises}/{lesson.totalExercises} exercises</span>
                </div>

                <div className="mb-4">
                  <ProgressBar progress={lesson.progress} />
                  <span className="text-xs text-slate-500 mt-1 block">{lesson.progress}% Complete</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge color={getLevelColor(lesson.level)}>{lesson.level}</Badge>
                  <button 
                    onClick={() => lesson.status !== 'locked' && onStartExercise(exercisesData.find(e => lesson.exercises.includes(e._id)))}
                    disabled={lesson.status === 'locked'}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2
                      ${lesson.status === 'locked' 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : lesson.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                  >
                    {lesson.status === 'completed' && <><CheckCircle2 size={16} /> Review</>}
                    {lesson.status === 'in-progress' && <><PlayCircle size={16} /> Continue</>}
                    {lesson.status === 'locked' && <><Lock size={16} /> Locked</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===================== EXERCISE PLAYER =====================
const ExercisePlayer = ({ exercise, onBack }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);

  const questions = Array.isArray(exercise.content) 
    ? exercise.content 
    : exercise.content.comprehensionQuestions || [];

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, showResults]);

  const handleAnswer = (answer) => {
    setAnswers(prev => ({ ...prev, [currentQ]: answer }));
  };

  const calculateScore = () => {
    let earned = 0;
    questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (!ans) return;
      if (q.type === 'mcq' && ans === q.correctAnswer) earned += q.points;
      else if (q.type === 'fill_blank' && ans.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) earned += q.points;
      else if (q.type === 'true_false' && ans === q.correctAnswer) earned += q.points;
      else if (q.type === 'matching') {
        let correct = 0;
        q.pairs.forEach(p => { if (ans[p.left] === p.right) correct++; });
        earned += (correct / q.pairs.length) * q.points;
      }
    });
    setScore(Math.round(earned));
    setShowResults(true);
  };

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  const totalPoints = questions.reduce((a, q) => a + q.points, 0);
  const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
  const passed = percentage >= exercise.passing_percentage;

  // Results Screen
  if (showResults) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
            <ChevronLeft size={20} /> Back to Lessons
          </button>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {passed ? <CheckCircle2 size={48} className="text-green-600" /> : <X size={48} className="text-red-600" />}
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{passed ? 'Congratulations!' : 'Keep Practicing!'}</h2>
            <p className="text-slate-500 mb-6">{passed ? 'You passed the exercise!' : `You need ${exercise.passing_percentage}% to pass.`}</p>

            <div className="flex justify-center gap-8 mb-6">
              <div><p className="text-3xl font-bold text-slate-800">{score}</p><p className="text-sm text-slate-500">Points Earned</p></div>
              <div><p className="text-3xl font-bold text-slate-800">{Math.round(percentage)}%</p><p className="text-sm text-slate-500">Accuracy</p></div>
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={onBack} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">Continue</button>
              <button onClick={() => { setShowResults(false); setAnswers({}); setCurrentQ(0); }} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200">Retry</button>
            </div>
          </div>

          {/* Review */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Review Answers</h3>
            {questions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-500 mb-2">Question {idx + 1}</p>
                <p className="font-medium text-slate-800 mb-2">{q.question}</p>
                {q.type === 'mcq' && (
                  <div className="space-y-1">
                    {q.options.map((opt, i) => (
                      <div key={i} className={`p-2 rounded-lg text-sm ${opt === q.correctAnswer ? 'bg-green-50 text-green-700' : answers[idx] === opt ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-600'}`}>
                        {opt} {opt === q.correctAnswer && '✓'} {answers[idx] === opt && opt !== q.correctAnswer && '✗'}
                      </div>
                    ))}
                  </div>
                )}
                {(q.type === 'fill_blank' || q.type === 'true_false') && (
                  <div className="text-sm">
                    <span className="text-green-600 font-medium">Correct: {q.correctAnswer.toString()}</span>
                    {answers[idx] !== undefined && answers[idx] !== q.correctAnswer && (
                      <span className="text-red-600 ml-3">Your answer: {answers[idx].toString()}</span>
                    )}
                  </div>
                )}
                {q.type === 'matching' && (
                  <div className="text-sm space-y-1">
                    {q.pairs.map(p => (
                      <div key={p.left} className="flex gap-2">
                        <span className="text-slate-600">{p.left}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-green-600 font-medium">{p.right}</span>
                        {answers[idx]?.[p.left] && answers[idx][p.left] !== p.right && (
                          <span className="text-red-600">(You: {answers[idx][p.left]})</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Question Screen
  const q = questions[currentQ];
  const isLast = currentQ === questions.length - 1;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
            <ChevronLeft size={20} /> Back
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock size={16} />
            <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : ''}`}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{exercise.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge color={exercise.level === LEVEL.BEGINNER ? 'bg-emerald-100 text-emerald-700' : exercise.level === LEVEL.INTERMEDIATE ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}>{exercise.level}</Badge>
            <Badge color="bg-indigo-100 text-indigo-700">{exercise.category}</Badge>
            <span className="text-sm text-slate-500">{exercise.points} pts</span>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="text-sm text-slate-500">Question {currentQ + 1} of {questions.length}</p>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {/* MCQ */}
          {q.type === 'mcq' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const selected = answers[currentQ] === opt;
                  return (
                    <button key={i} onClick={() => handleAnswer(opt)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3
                        ${selected ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                        {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-medium">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fill Blank */}
          {q.type === 'fill_blank' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
              <input
                type="text"
                value={answers[currentQ] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 font-medium"
              />
            </div>
          )}

          {/* Matching */}
          {q.type === 'matching' && (
            <MatchingQuestion data={q} onAnswer={(ans) => handleAnswer(ans)} userAnswer={answers[currentQ]} />
          )}

          {/* True/False */}
          {q.type === 'true_false' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
              <div className="flex gap-3">
                {['True', 'False'].map(val => {
                  const boolVal = val === 'True';
                  const selected = answers[currentQ] === boolVal;
                  return (
                    <button key={val} onClick={() => handleAnswer(boolVal)}
                      className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all
                        ${selected ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-slate-200 hover:border-indigo-300'}`}>
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dialogue / Follow-up (Speaking) */}
          {(q.type === 'dialogue' || q.type === 'follow_up') && (
            <div className="space-y-4">
              {q.speaker && <p className="text-xs font-semibold text-indigo-600 uppercase">{q.speaker}</p>}
              <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
              <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-indigo-300 transition-colors">
                <button className="w-16 h-16 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center mx-auto mb-2">
                  <Mic size={24} className="text-white" />
                </button>
                <p className="text-sm text-slate-500">Tap to record your response</p>
              </div>
              <p className="text-xs text-slate-400">Expected: {q.expectedAnswer}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button 
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-50 flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {isLast ? (
            <button 
              onClick={calculateScore}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2"
            >
              <Check size={16} /> Submit
            </button>
          ) : (
            <button 
              onClick={() => setCurrentQ(currentQ + 1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2"
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Matching Question Component
const MatchingQuestion = ({ data, onAnswer, userAnswer }) => {
  const [matches, setMatches] = useState(userAnswer || {});
  const [selectedLeft, setSelectedLeft] = useState(null);

  const handleLeft = (left) => {
    if (selectedLeft === left) setSelectedLeft(null);
    else setSelectedLeft(left);
  };

  const handleRight = (right) => {
    if (!selectedLeft) return;
    const newMatches = { ...matches, [selectedLeft]: right };
    setMatches(newMatches);
    onAnswer(newMatches);
    setSelectedLeft(null);
  };

  const leftItems = data.pairs.map(p => p.left);
  const rightItems = [...data.pairs.map(p => p.right)].sort(() => Math.random() - 0.5);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Match the items</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase">Column A</p>
          {leftItems.map(left => (
            <button key={left} onClick={() => handleLeft(left)}
              className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all
                ${selectedLeft === left ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 
                  matches[left] ? 'border-slate-300 bg-slate-50' : 'border-slate-200 hover:border-indigo-300'}`}>
              {left} {matches[left] && <span className="text-slate-400 ml-2">→ {matches[left]}</span>}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase">Column B</p>
          {rightItems.map(right => {
            const used = Object.values(matches).includes(right);
            return (
              <button key={right} onClick={() => handleRight(right)} disabled={used}
                className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all
                  ${used ? 'border-slate-100 bg-slate-50 text-slate-300' : 
                    selectedLeft ? 'border-indigo-300 bg-indigo-50 hover:border-indigo-500 cursor-pointer' : 'border-slate-200 text-slate-400'}`}>
                {right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ===================== LISTENING EXERCISE =====================
const ListeningExercise = ({ exercise, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = exercise.content.comprehensionQuestions;

  const handleAnswer = (qIdx, answer) => {
    setAnswers(prev => ({ ...prev, [qIdx]: answer }));
  };

  const calculateScore = () => {
    let earned = 0;
    questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (q.type === 'mcq' && ans === q.correctAnswer) earned += q.points;
      else if (q.type === 'fill_blank' && ans?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) earned += q.points;
      else if (q.type === 'true_false' && ans === q.correctAnswer) earned += q.points;
    });
    setScore(earned);
    setShowResults(true);
  };

  const totalPoints = questions.reduce((a, q) => a + q.points, 0);
  const percentage = (score / totalPoints) * 100;
  const passed = percentage >= exercise.passing_percentage;

  if (showResults) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
            <ChevronLeft size={20} /> Back
          </button>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {passed ? <CheckCircle2 size={48} className="text-green-600" /> : <X size={48} className="text-red-600" />}
            </div>
            <h2 className="text-3xl font-bold mb-2">{passed ? 'Great Job!' : 'Keep Practicing!'}</h2>
            <div className="flex justify-center gap-8 my-6">
              <div><p className="text-3xl font-bold">{score}</p><p className="text-sm text-slate-500">Points</p></div>
              <div><p className="text-3xl font-bold">{Math.round(percentage)}%</p><p className="text-sm text-slate-500">Accuracy</p></div>
            </div>
            <button onClick={onBack} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">Continue</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
          <ChevronLeft size={20} /> Back
        </button>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">{exercise.title}</h2>
          <Badge color="bg-blue-100 text-blue-700">{exercise.category}</Badge>
        </div>

        {/* Audio Player */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <div className="flex-1">
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-indigo-400 rounded-full" />
              </div>
              <div className="flex justify-between mt-1 text-xs text-slate-400">
                <span>1:23</span><span>4:15</span>
              </div>
            </div>
            <Volume2 size={20} className="text-slate-400" />
          </div>
          <button onClick={() => setShowTranscript(!showTranscript)} className="text-sm text-indigo-300 mt-3 flex items-center gap-1">
            <FileText size={14} /> {showTranscript ? 'Hide' : 'Show'} Transcript
          </button>
          {showTranscript && <p className="mt-3 text-sm text-slate-300 bg-slate-800 p-3 rounded-lg">{exercise.content.transcript}</p>}
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800">Comprehension Questions</h3>
          {questions.map((q, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5  ">
              <p className="text-sm text-slate-500 mb-3">Question {idx + 1} ({q.points} pts)</p>
              <p className="font-medium text-slate-800 mb-3">{q.question}</p>

              {q.type === 'mcq' && (
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <button key={i} onClick={() => handleAnswer(idx, opt)}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3
                        ${answers[idx] === opt ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}>
                      <div className={`w-5 h-5 rounded-full border-2 ${answers[idx] === opt ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                        {answers[idx] === opt && <div className="w-2 h-2 rounded-full bg-white m-auto mt-1" />}
                      </div>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'fill_blank' && (
                <input type="text" value={answers[idx] || ''} onChange={(e) => handleAnswer(idx, e.target.value)}
                  placeholder="Your answer..." className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-indigo-500" />
              )}

              {q.type === 'true_false' && (
                <div className="flex gap-3">
                  {['True', 'False'].map(val => {
                    const boolVal = val === 'True';
                    return (
                      <button key={val} onClick={() => handleAnswer(idx, boolVal)}
                        className={`flex-1 p-3 rounded-xl border-2 font-semibold ${answers[idx] === boolVal ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>
                        {val}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={calculateScore} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">
          Submit Answers
        </button>
      </div>
    </div>
  );
};

// ===================== WRITING EXERCISE =====================
const WritingExercise = ({ exercise, onBack }) => {
  const [text, setText] = useState('');
  const [timeLeft, setTimeLeft] = useState(exercise.content.timeLimit * 60);
  const [submitted, setSubmitted] = useState(false);
  const wordCount = text.trim().split(/\s+/).filter(w => w).length;
  const data = exercise.content;

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, submitted]);

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
          <ChevronLeft size={20} /> Back
        </button>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">{exercise.title}</h2>
          <Badge color="bg-amber-100 text-amber-700">{exercise.category}</Badge>
        </div>

        {/* Timer & Stats */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-slate-600">
              <Clock size={16} />
              <span className={`font-mono font-bold ${timeLeft < 300 ? 'text-red-500' : ''}`}>{formatTime(timeLeft)}</span>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="text-sm text-slate-600">
              Words: <span className={`font-bold ${wordCount < data.minimumWords ? 'text-amber-500' : wordCount > data.maximumWords ? 'text-red-500' : 'text-green-600'}`}>{wordCount}</span>
              <span className="text-slate-400"> / {data.minimumWords}-{data.maximumWords}</span>
            </div>
          </div>
          <Badge color="bg-indigo-100 text-indigo-700">{data.points} Points</Badge>
        </div>

        {/* Topic */}
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <p className="text-sm font-medium text-amber-800">Topic: {data.topic}</p>
        </div>

        {/* Editor */}
        <textarea
          value={text} onChange={(e) => setText(e.target.value)} disabled={submitted}
          placeholder="Start writing your essay here..."
          className="w-full h-96 p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none text-slate-800 leading-relaxed"
        />

        {/* Actions */}
        {!submitted ? (
          <div className="flex gap-3">
            <button onClick={() => setSubmitted(true)} disabled={wordCount < data.minimumWords}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
              <Send size={18} /> Submit Essay
            </button>
            <button onClick={() => setText('')} className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">
              <RotateCcw size={18} />
            </button>
          </div>
        ) : (
          <div className="bg-green-50 rounded-xl border border-green-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={20} className="text-green-600" />
              <p className="font-semibold text-green-800">Essay Submitted!</p>
            </div>
            <p className="text-sm text-green-700">Your essay has been submitted for review. You'll receive feedback within 24 hours.</p>
            <button onClick={onBack} className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              Back to Lessons
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ===================== SPEAKING EXERCISE =====================
const SpeakingExercise = ({ exercise, onBack }) => {
  const [recording, setRecording] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleRecord = (idx) => {
    setRecording(!recording);
    setAnswers(prev => ({ ...prev, [idx]: 'recorded' }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
          <ChevronLeft size={20} /> Back
        </button>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">{exercise.title}</h2>
          <Badge color="bg-pink-100 text-pink-700">{exercise.category}</Badge>
        </div>

        <div className="space-y-4">
          {exercise.content.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={20} className="text-indigo-600" />
                </div>
                <div>
                  {item.speaker && <p className="text-xs font-semibold text-indigo-600 uppercase">{item.speaker}</p>}
                  <p className="font-medium text-slate-800">{item.question}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-indigo-300 transition-colors">
                <button onClick={() => handleRecord(idx)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 transition-all
                    ${recording ? 'bg-red-500 animate-pulse' : 'bg-indigo-500 hover:bg-indigo-600'}`}>
                  <Mic size={24} className="text-white" />
                </button>
                <p className="text-sm text-slate-500">{recording ? 'Recording... Click to stop' : 'Tap to record your response'}</p>
              </div>

              {answers[idx] && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800">Expected Answer:</p>
                  <p className="text-sm text-green-700">{item.expectedAnswer}</p>
                  {item.alternative && <p className="text-sm text-green-600 mt-1">Alternative: {item.alternative}</p>}
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={() => setShowResults(true)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">
          Complete Exercise
        </button>
      </div>
    </div>
  );
};

// ===================== MAIN APP =====================
export default function App() {
  const [view, setView] = useState('lessons'); // 'lessons' | 'exercise' | 'listening' | 'writing' | 'speaking'
  const [currentExercise, setCurrentExercise] = useState(null);
  const {id} = useParams()
const {data:exerciseQuiz} = useGetSingleExerciseByLessonByAdmin(id)
  const startExercise = (exercise) => {
    setCurrentExercise(exercise);
    if (exercise?.category === CATEGORY.LISTENING) setView('listening');
    else if (exercise.category === CATEGORY.WRITING) setView('writing');
    else if (exercise.category === CATEGORY.SPEAKING) setView('speaking');
    else setView('exercise');
  };

  const goBack = () => {
    setView('lessons');
    setCurrentExercise(null);
  };
console.log(exerciseQuiz)
  return (
    <div>
      {console.log(exerciseQuiz?.category,CATEGORY.SPEAKING)}
      
      {exerciseQuiz&&exerciseQuiz.category?.toLowerCase()===CATEGORY.GRAMMAR?.toLowerCase()&&<GrammarQuiz exercise={exerciseQuiz} />}
      {exerciseQuiz&&exerciseQuiz.category?.toLowerCase()===CATEGORY.LISTENING?.toLowerCase()&&<ListeningQuiz exercise={exerciseQuiz} />}
      {exerciseQuiz&&exerciseQuiz.category?.toLowerCase()===CATEGORY.SPEAKING?.toLowerCase()&&<SpeakingQuiz exercise={exerciseQuiz} />}
      {exerciseQuiz&&exerciseQuiz.category?.toLowerCase()===CATEGORY.WRITING?.toLowerCase()&&<WritingQuiz exercise={exerciseQuiz} />}
      {/* {view === 'lessons' && <LessonsPage onStartExercise={startExercise} />} */}
      {view === 'exercise' && currentExercise && <ExercisePlayer exercise={currentExercise} onBack={goBack} />}
      {view === 'listening' && currentExercise && <ListeningExercise exercise={currentExercise} onBack={goBack} />}
      {view === 'writing' && currentExercise && <WritingExercise exercise={currentExercise} onBack={goBack} />}
      {view === 'speaking' && currentExercise && <SpeakingExercise exercise={currentExercise} onBack={goBack} />}
    </div>
  );
}