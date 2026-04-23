import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layers,
  FileText,
  Link,
  Edit3,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Types for different question types
interface Mcq {
  id: string;
  type: "mcq";
  question: string;
  options: string[];
  correctAnswer: string;
}

interface FillBlank {
  id: string;
  type: "fillblank";
  sentence: string;
  correctAnswer: string;
  alternatives: string[];
}

interface Matching {
  id: string;
  type: "matching";
  title: string;
  pairs: { left: string; right: string }[];
}

type Question = Mcq | FillBlank | Matching;

// Dummy data
const dummyQuestions: Question[] = [
  {
    id: "1",
    type: "mcq",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: "2",
    type: "mcq",
    question:
      "Which programming language is known for its simplicity and readability?",
    options: ["C++", "Java", "Python", "Ruby"],
    correctAnswer: "Python",
  },
  {
    id: "3",
    type: "fillblank",
    sentence: "The _____ is the largest planet in our solar system.",
    correctAnswer: "Jupiter",
    alternatives: ["Jupiter", "jupiter"],
  },
  {
    id: "4",
    type: "fillblank",
    sentence: "Water freezes at _____ degrees Celsius.",
    correctAnswer: "0",
    alternatives: ["0", "zero", "Zero"],
  },
  {
    id: "5",
    type: "matching",
    title: "Countries and Capitals",
    pairs: [
      { left: "France", right: "Paris" },
      { left: "Germany", right: "Berlin" },
      { left: "Japan", right: "Tokyo" },
    ],
  },
  {
    id: "6",
    type: "matching",
    title: "Programming Languages and Uses",
    pairs: [
      { left: "Python", right: "Data Science" },
      { left: "JavaScript", right: "Web Development" },
      { left: "Swift", right: "iOS Development" },
    ],
  },
];

const UnifiedQuestionBank = ({ content ,setContent}: { content: any[], setContent: any }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };


  const getTypeBadge = (type: string) => {
    switch (type) {
      case "mcq":
        return <Badge className="bg-blue-500">MCQ</Badge>;
      case "fillblank":
        return <Badge className="bg-purple-500">Fill in Blank</Badge>;
      case "matching":
        return <Badge className="bg-emerald-500">Matching</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const renderPreview = (question: Question) => {
    switch (question.type) {
      case "mcq":
        return (
          <div className="space-y-2">
            <div className="font-medium">{question.question}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {question.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-slate-400">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span
                    className={
                      opt === question.correctAnswer
                        ? "text-green-600 font-medium"
                        : "text-slate-600"
                    }
                  >
                    {opt}
                    {opt === question.correctAnswer && (
                      <CheckCircle className="w-3 h-3 inline ml-1 text-green-600" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "fillblank":
        return (
          <div className="space-y-2">
            <div className="text-slate-700">
              {question.sentence
                .split(/_____|___|\{\{blank\}\}/)
                .map((part, idx, arr) => (
                  <span key={idx}>
                    {part}
                    {idx < arr.length - 1 && (
                      <span className="inline-block bg-yellow-100 px-2 py-0.5 rounded font-mono text-yellow-800 border border-yellow-300 mx-1">
                        _____
                      </span>
                    )}
                  </span>
                ))}
            </div>
            <div className="text-sm">
              <span className="text-slate-500">Answer: </span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {question.correctAnswer}
              </Badge>
              {question.alternatives.length > 0 && (
                <span className="text-xs text-slate-400 ml-2">
                  (or {question.alternatives.join(", ")})
                </span>
              )}
            </div>
          </div>
        );

      case "matching":
        return (
          <div className="space-y-2">
            <div className="font-medium text-slate-700">{question.title}</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-slate-500 mb-1">Terms</div>
                <ul className="space-y-1">
                  {question.pairs.map((pair, idx) => (
                    <li key={idx} className="text-slate-600">
                      • {pair.left}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-500 mb-1">Matches</div>
                <ul className="space-y-1">
                  {question.pairs.map((pair, idx) => (
                    <li key={idx} className="text-slate-600">
                      • {pair.right}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  // Statistics
  const stats = {
    total: content.length,
    mcq: content.filter((q) => q.type === "mcq").length,
    fillblank: content.filter((q) => q.type === "fillblank").length,
    matching: content.filter((q) => q.type === "matching").length,
  };
 const handleDelete = (id: string) => {
    setContent((prev: any[]) => prev.filter((q: any) => q.id !== id));
  };
  return (
    <div className="  ">
      <div className=" mx-auto space-y-6">
        {/* Header with Stats */}
        {/* <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Question Bank Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Manage all your assessment questions in one place</p>
          </div>
          <div className="flex gap-3">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
                  <div className="text-xs text-slate-500">Total Questions</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div> */}

        {/* Main Table */}
        <Card className="border-0 rounded-lg ">
          <CardHeader className="bg-white border-b border-slate-200 rounded-t-xl">
            <CardTitle className="flex items-center justify-between text-slate-800">
              <span>All Questions</span>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="text-blue-600 border-blue-200"
                >
                  {stats.mcq} MCQ
                </Badge>
                <Badge
                  variant="outline"
                  className="text-purple-600 border-purple-200"
                >
                  {stats.fillblank} Fill Blank
                </Badge>
                <Badge
                  variant="outline"
                  className="text-emerald-600 border-emerald-200"
                >
                  {stats.matching} Matching
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[5%]">Type</TableHead>
                    <TableHead className="w-[55%]">Question Preview</TableHead>
                    <TableHead className="w-[15%]">Details</TableHead>
                    <TableHead className="w-[10%] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(content||[]).map((question) => (
                    <>
                      <TableRow
                        key={question.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="align-top">
                          {getTypeBadge(question.type)}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <div className="text-sm text-slate-700 line-clamp-2">
                              {question.type === "mcq" && question.question}
                              {question.type === "fillblank" &&
                                question.sentence}
                              {question.type === "matching" && question.title}
                            </div>
                            {question.type === "fillblank" && (
                              <div className="text-xs text-slate-400">
                                Answer: {question.correctAnswer}
                              </div>
                            )}
                            {question.type === "mcq" && (
                              <div className="text-xs text-green-600">
                                ✓ {question.correctAnswer}
                              </div>
                            )}
                            {question.type === "matching" && (
                              <div className="text-xs text-muted-foreground">
                                {question.shuffleOptions ? (
                                  <Shuffle className="w-3 h-3 inline mr-1" />
                                ) : null}
                                {question.shuffleOptions ? "Shuffled" : "Ordered"} Pairs
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          {question.type === "mcq" && (
                            <span className="text-xs text-slate-500">
                              {question.options.length} options
                            </span>
                          )}
                          {question.type === "fillblank" && (
                            <span className="text-xs text-slate-500">
                              {question.alternatives.length} alternative
                              {question.alternatives.length !== 1 ? "s" : ""}
                            </span>
                          )}
                          {question.type === "matching" && (
                            <span className="text-xs text-slate-500">
                              {question.pairs.length} pairs
                            </span>
                          )}
                        </TableCell>
                        
                        <TableCell className="align-top text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleExpand(question.id)}
                              className="hover:bg-slate-100"
                            >
                              {expandedRows.has(question.id) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="hover:bg-blue-100 hover:text-blue-600"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="hover:bg-red-100 hover:text-red-600"
                              onClick={() => handleDelete(question.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Row */}
                      {expandedRows.has(question.id) && (
                        <TableRow className="bg-slate-50/50">
                          <TableCell colSpan={5} className="p-4">
                            <div className="pl-4 border-l-4 border-slate-300">
                              <div className="mb-2 text-sm font-semibold text-slate-600">
                                Full Preview:
                              </div>
                              {renderPreview(question)}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Alternative: Card Grid View */}
        {/* <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Alternative View - Card Grid
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((question) => (
              <Card key={question.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    {getTypeBadge(question.type)}
                    <div className="flex gap-1">
                      <Button
                      type="button" size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                      type="button" size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    {question.type === "mcq" && (
                      <>
                        <div className="text-sm font-medium text-slate-800 mb-2 line-clamp-2">
                          {question.question}
                        </div>
                        <div className="text-xs text-green-600">
                          Answer: {question.correctAnswer}
                        </div>
                      </>
                    )}
                    {question.type === "fillblank" && (
                      <>
                        <div className="text-sm text-slate-700 mb-2 line-clamp-2">
                          {question.sentence}
                        </div>
                        <div className="text-xs text-green-600">
                          ✓ {question.correctAnswer}
                        </div>
                      </>
                    )}
                    {question.type === "matching" && (
                      <>
                        <div className="text-sm font-medium text-slate-800 mb-2">
                          {question.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {question.pairs.length} matching pairs
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="pt-3 border-t text-xs text-slate-400">
                    ID: {question.id.slice(0, 8)}...
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UnifiedQuestionBank;
