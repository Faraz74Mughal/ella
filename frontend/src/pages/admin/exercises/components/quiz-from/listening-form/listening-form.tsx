import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileVideo, FileText, HelpCircle, Plus } from "lucide-react";
import { FileDropzone } from "@/components/shared/file-dropzone";
import useListeningBuilder from "@/hooks/use-listening-builder";
import { useFormContext } from "react-hook-form";
import MCQRenderer from "./mcq-renderer";
import FillInTheBlankRenderer from "./fill-in-the-blank-renderer";
import type {
  FillBlankQuestion,
  ListeningQuestion,
  MCQQuestion,
  TrueFalseQuestion,
} from "@/types/listening-question";
import TypesSelect from "../grammer-form/types-select";
import TrueFalseRenderer from "./true-false-render";

const ListeningForm = () => {
  const { watch, setValue } = useFormContext();
  const lb = useListeningBuilder({
    value: watch("content"),
    onChange: (value: ListeningQuestion[]) => setValue("content", value),
  });

  return (
    <div className="space-y-6">
      {/* Main Form Card */}
      {lb.questions.map((question, idx) => (
        <Card key={idx} className="border-0 shadow-md">
          <CardContent className="p-0">
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Badge variant="outline" className="bg-blue-50">
                    Q{idx + 1}
                  </Badge>
                  <div className="flex items-center gap-2 ml-auto">
                    <Label className="text-sm text-slate-500">Points:</Label>
                    <Input
                      type="number"
                      value={question.points}
                      onChange={(e) =>
                        lb.updateQuestion(
                          question.id,
                          "points",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-20 h-8 text-sm"
                      min={0}
                      max={100}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => lb.removeQuestion(question.id)}
                  disabled={lb.questions.length === 1}
                  className="text-red-500 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {/* Video Tab */}

              <Label className="text-slate-700 font-semibold flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-red-600" />
                Video File / Audio File
              </Label>
              <FileDropzone
                label="Upload Video or Audio File"
                value={question.file}
                onFileSelect={(file: File | null) =>
                  lb.updateQuestion(question.id, "file", file)
                }
                onRemove={() => lb.updateQuestion(question.id, "file", null)}
                maxSizeMB={1000}
                accept={{
                  "audio/*": [".mp3", ".wav", ".ogg"],
                  "video/*": [".mp4", ".webm", ".mov"],
                  "image/*": [".png", ".jpg", ".jpeg", ".gif"],
                }}
              />
            </div>
            <div className="p-6 space-y-6">
              {/* Transcript */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  Transcript (Optional)
                </Label>
                <Textarea
                  value={question.transcript}
                  onChange={(e) =>
                    lb.updateQuestion(question.id, "transcript", e.target.value)
                  }
                  placeholder="Paste the full transcript of the video here..."
                  className="min-h-[150px] font-mono text-sm resize-none"
                />
              </div>
            </div>

            {/* Questions Tab */}
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-red-600" />
                  Comprehension Questions
                </Label>
              </div>

              <div className="space-y-6">
                {question.comprehensionQuestions.map(
                  (comprehensionQuestion, cdx) => (
                    <Card key={cdx} className="border-l-4 border-l-red-400">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* Question Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Badge variant="outline" className="bg-red-50">
                                CQ{cdx + 1}
                              </Badge>
                              <TypesSelect
                                question={comprehensionQuestion}
                                updateQuestion={(questionId, field, value) =>
                                  lb.updateComprehensionQuestion(
                                    question.id,
                                    comprehensionQuestion.id,
                                    field,
                                    value,
                                  )
                                }
                                types={lb.types}
                              />

                              <div className="flex items-center gap-2">
                                <Label className="text-sm text-slate-500">
                                  Points:
                                </Label>
                                <Input
                                  type="number"
                                  value={comprehensionQuestion.points}
                                  onChange={(e) =>
                                    lb.updateQuestion(
                                      comprehensionQuestion.id,
                                      "points",
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                  className="w-20 h-8 text-sm"
                                  min={0}
                                  max={100}
                                />
                              </div>
                            </div>

                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                lb.removeQuestion(comprehensionQuestion.id)
                              }
                              disabled={lb.questions.length === 1}
                              className="text-red-500 ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <Textarea
                            value={comprehensionQuestion.question}
                            onChange={(e) =>
                              lb.updateComprehensionQuestion(
                                question.id,
                                comprehensionQuestion.id,
                                "question",
                                e.target.value,
                              )
                            }
                            placeholder="Enter your question based on the video..."
                            className="resize-none"
                            rows={2}
                          />

                          {/* Scene Association */}

                          {/* Question Type Specific Fields */}

                          <>
                            {comprehensionQuestion.type === "mcq" ? (
                              <MCQRenderer
                                // {...lb}
                                addOption={lb.addOption}
                                removeOption={lb.removeOption}
                                listeningId={question.id}
                                updateQuestion={lb.updateComprehensionQuestion}
                                updateOption={lb.updateOption}
                                question={comprehensionQuestion as MCQQuestion}
                                idx={cdx}
                              />
                            ) : comprehensionQuestion.type === "fill_blank" ? (
                              <FillInTheBlankRenderer
                                listeningId={question.id}
                                updateQuestion={lb.updateComprehensionQuestion}
                                question={
                                  comprehensionQuestion as FillBlankQuestion
                                }
                                idx={cdx}
                              />
                            ) : comprehensionQuestion.type === "true_false" ? (
                              <TrueFalseRenderer
                                listeningId={question.id}
                                updateQuestion={lb.updateComprehensionQuestion}
                                question={
                                  comprehensionQuestion as TrueFalseQuestion
                                }
                              />
                            ) : (
                              ""
                            )}
                          </>
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </div>
          </CardContent>
          <div className="flex items-center justify-between mt-5">
            <span></span>
            <Button
              type="button"
              variant="outline"
              onClick={() => lb.addComprehensionQuestion(question.id)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Comprehension Question
            </Button>
          </div>
        </Card>
      ))}
      <div className="flex items-center justify-between mt-5">
        <span></span>
        <Button type="button" variant="outline" onClick={lb.addQuestion}>
          <Plus className="w-4 h-4 mr-1" />
          Add Question
        </Button>
      </div>
    </div>
  );
};

export default ListeningForm;
