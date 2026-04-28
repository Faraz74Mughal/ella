import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSpeakingBuilder } from "@/hooks/use-speaking-builder";
import { Play, Plus } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const SpeechRecognitionForm = () => {
  const { setValue, watch } = useFormContext<any>();
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
        {sb.questions.map((question) => (
          <Card className="border-l-4 border-primary">
            <CardContent className="p-6 space-y-6">
              {/* Prompt Section */}
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
