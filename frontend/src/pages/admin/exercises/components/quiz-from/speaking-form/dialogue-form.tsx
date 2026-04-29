import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { useSpeakingDialogueBuilder } from "@/hooks/use-speaking-dialogue-builder";
import { useFormContext } from "react-hook-form";



const DialogueForm = () => {
  const { setValue, watch } = useFormContext<any>();
  // const [questions, setQuestions] = useState<DialogueQuestion[]>([]);
  const sdb = useSpeakingDialogueBuilder({
    value: watch("content"),
    onChange: (val) => setValue("content", val),
  });
  // Form state
 
  

  
  

  

  //  {error && (
  //             <Alert variant="destructive">
  //               <XCircle className="h-4 w-4" />
  //               <AlertDescription>{error}</AlertDescription>
  //             </Alert>
  //           )}
  return (
    <div className="w-full mt-5">
      {/* Content Tab */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-700 font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Dialogue Lines
            </Label>
            <Button type="button" variant="outline" onClick={sdb.addQuestion}>
              <Plus className="w-4 h-4 mr-1" />
              Add Line
            </Button>
          </div>

          {/* Dialogue Lines */}
          <div className="space-y-4">
            {(sdb.questions || []).map((line, index) => (
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
                        onClick={() => sdb.moveLine(line.id, "up")}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <MoveUp className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => sdb.moveLine(line.id, "down")}
                        disabled={index === sdb.questions.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <MoveDown className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Speaker and line number */}
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-slate-100">
                          Line {index + 1}
                        </Badge>
                        <select
                          value={line.speaker}
                          onChange={(e) =>
                            sdb.updateQuestion(
                              line.id,
                              "speaker",
                              e.target.value,
                            )
                          }
                          className="px-2 py-1 border rounded-md text-sm"
                        >
                          {sdb.speakers.map((speaker) => (
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
                          value={line.question}
                          onChange={(e) =>
                            sdb.updateQuestion(
                              line.id,
                              "question",
                              e.target.value,
                            )
                          }
                          placeholder="What does the speaker say?"
                          className="resize-none text-sm"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2 pl-4 border-l-2 border-dashed border-slate-200">
                        <Label className="text-sm text-slate-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Expected Response / Blank Answer
                        </Label>
                        <Input
                          value={line.expectedAnswer || ""}
                          onChange={(e) =>
                            sdb.updateQuestion(
                              line.id,
                              "expectedAnswer",
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
                              onChange={(e) =>
                                sdb.updateQuestion(
                                  line.id,
                                  "alternative",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Remove button */}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => sdb.removeQuestion(line.id)}
                      disabled={sdb.questions.length === 1}
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
      </div>
    </div>
  );
};

export default DialogueForm;
