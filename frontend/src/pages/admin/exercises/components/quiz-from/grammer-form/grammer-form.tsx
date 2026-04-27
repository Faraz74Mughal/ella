import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Plus, Trash2 } from "lucide-react";
import MCQRenderer from "./mcq-renderer";
import { useQuestionBuilder } from "@/hooks/use-grammar-question-builder";
import MatchingRenderer from "./matching-renderer";
import FillInTheBlankRenderer from "./fill-in-the-blank-renderer";
import TypesSelect from "./types-select";
import { useFormContext } from "react-hook-form";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";

const GrammarForm = () => {
  const { setValue, watch } = useFormContext<ExerciseInput>();
  const qb = useQuestionBuilder({
    value: watch("content"),
    onChange: (val) => setValue("content", val),
  });
  return (
    <div>
      <div className="space-y-6">
        {qb.questions.map((question, idx) => (
          <Card key={question.id} className="border-l-4 border-primary">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Question Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="outline" className="bg-blue-50">
                      Q{idx + 1}
                    </Badge>
                    <TypesSelect question={question} {...qb} />
                    <div className="flex items-center gap-2 ml-auto">
                      <Label className="text-sm text-slate-500">Points:</Label>
                      <Input
                        type="number"
                        value={question.points}
                        onChange={(e) =>
                          qb.updateQuestion(
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
                    onClick={() => qb.removeQuestion(question.id)}
                    disabled={qb.questions.length === 1}
                    className="text-red-500 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Question Text */}
                {(question.type === "fill_blank" ||
                  question.type === "mcq") && (
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Question Text</Label>
                    <Textarea
                      value={question.question}
                      onChange={(e) =>
                        qb.updateQuestion(
                          question.id,
                          "question",
                          e.target.value,
                        )
                      }
                      placeholder="Enter your question based on the audio..."
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                )}

                {/* Audio Timestamp (Optional) */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <Input
                    type="number"
                    value={question.timestamp || ""}
                    onChange={(e) =>
                      qb.updateQuestion(
                        question.id,
                        "timestamp",
                        parseInt(e.target.value) || undefined,
                      )
                    }
                    placeholder="Timestamp in seconds (e.g., 45)"
                    className="w-32 h-8 text-sm"
                    step={1}
                  />
                </div>

                {question.type === "mcq" ? (
                  <MCQRenderer {...qb} question={question} />
                ) : question.type === "matching" ? (
                  <MatchingRenderer {...qb} question={question} />
                ) : question.type === "fill_blank" ? (
                  <FillInTheBlankRenderer {...qb} question={question} />
                ) : (
                  ""
                )}
              </div>

              {/* <TabsContent value="questions" className="p-6 space-y-6"> */}
            </CardContent>
          </Card>
        ))}

        <div className="flex items-center justify-between mt-5">
          <span></span>
          <Button type="button" variant="outline" onClick={qb.addQuestion}>
            <Plus className="w-4 h-4 mr-1" />
            Add Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrammarForm;
