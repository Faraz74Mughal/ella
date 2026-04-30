import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSpeakingBuilder } from "@/hooks/use-speaking-builder";
import { Play, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const SpeechRecognitionForm = () => {
  const { setValue, watch, control } = useFormContext<any>();
  const sb = useSpeakingBuilder({
    value: watch("content"),
    onChange: (val) => setValue("content", val),
  });
  useEffect(() => {
    if (watch("category") || "") setValue("content", []);
  }, [watch, setValue]);
  return (
    <>
      {/* Form Card */}
      <div className="space-y-6 mt-5">
        {sb.questions.map((question, idx) => (
          <Card className="border-l-4 border-primary">
            <CardContent className="p-6 space-y-6">
              {/* Prompt Section */}

              <div className="flex items-center justify-between gap-3 w-full">
                <Badge variant="outline" className="bg-red-50">
                  CQ{idx + 1}
                </Badge>
                <div className="flex items-start justify-between">
                  <FormInput
                    control={control}
                    name={`content.${idx}.points`}
                    label="Points:"
                    type="number"
                    min={0}
                    max={100}
                  />
                  {/* <div className="flex items-center gap-2">
                    <Label className="text-sm text-slate-500">Points:</Label>
                    <Input
                      type="number"
                      value={question.points}
                      onChange={(e) =>
                        sb.updateQuestion(
                          question.id,
                          "points",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-20 h-8 text-sm"
                      min={0}
                      max={100}
                    />
                  </div> */}

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => sb.removeQuestion(question.id)}
                    disabled={sb.questions.length === 1}
                    className="text-red-500 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <Play className="w-4 h-4 text-indigo-500" />
                  Instruction/Prompt
                </Label>
                <Textarea
                  value={question.question as string}
                  onChange={(e) =>
                    sb.updateQuestion(question.id, "question", e.target.value)
                  }
                  placeholder="e.g., 'Say the following sentence: The quick brown fox jumps over the lazy dog'"
                  className=" resize-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Expected Answer */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">
                    Expected Answer
                  </Label>
                  <Input
                    value={question.expectedAnswer as string}
                    onChange={(e) =>
                      sb.updateQuestion(
                        question.id,
                        "expectedAnswer",
                        e.target.value,
                      )
                    }
                    placeholder="What the learner should say..."
                    className="focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
            </CardContent>
          </Card>
        ))}
        <div className="flex items-center justify-between ">
          <span></span>
          <Button type="button" variant="outline" onClick={sb.addQuestion}>
            <Plus className="w-4 h-4 mr-1" />
            Add Question
          </Button>
        </div>
      </div>
    </>
  );
};

export default SpeechRecognitionForm;
