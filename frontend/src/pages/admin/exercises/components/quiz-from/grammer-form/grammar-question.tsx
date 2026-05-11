import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { Trash2 } from "lucide-react";
import MCQRenderer from "./mcq-renderer";
import MatchingRenderer from "./matching-renderer";
import FillInTheBlankRenderer from "./fill-in-the-blank-renderer";
import useExerciseBuilder from "@/hooks/use-exercise-builder";

type GrammarQuestionProps = {
  idx: number;
  question: any;
  eb: ReturnType<typeof useExerciseBuilder>;
};

const GrammarQuestion = ({ idx, question, eb }: GrammarQuestionProps) => {

  return (
    <Card  className="border-l-4 border-primary">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Question Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Badge variant="outline" className="bg-blue-50">
                Q{idx + 1}
              </Badge>
              {/* <TypesSelect question={question} {...qb} /> */}
              <FormSelect
                control={eb.form.control}
                label="Points"
                name={`content.${idx}.type`}
                options={eb.grammarTypes}
              />
              <FormInput
                itemClassName="flex items-center ml-auto gap-2"
                control={eb.form.control}
                label="Points"
                name={`content.${idx}.points`}
                type="number"
                // disabled={isLoading}
                placeholder="Enter points..."
              />
            </div>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => eb.removeQuestion(idx)}
              disabled={eb.questions.length === 1}
              className="text-red-500 ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Question Text */}

          {(question.type === "fill_blank" || question.type === "mcq") && (
            <div>
              <div className="space-y-1">
                <FormTextarea
                  label="Question Text"
                  control={eb.form.control}
                  name={`content.[${idx}].question`}
                  placeholder="Enter your question..."
                />
              </div>
              <span className="text-xs  text-red-500">
                {Array.isArray(eb.form.formState?.errors?.content) &&
                  eb.form.formState?.errors?.content?.[idx]?.question?.message}
              </span>
            </div>
          )}

          {question.type === "mcq" ? (
            <MCQRenderer idx={idx} question={question} eb={eb} />
          ) : question.type === "matching" ? (
            <MatchingRenderer eb={eb} question={question} idx={idx} />
          ) : question.type === "fill_blank" ? (
            <FillInTheBlankRenderer eb={eb} question={question} idx={idx} />
          ) : (
            ""
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GrammarQuestion;
