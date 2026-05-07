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
import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { type ExerciseInput } from "@/lib/validations/admin/exercise.validation";
import { generateId } from "@/utils/helpers";

type GrammarQuestionProps = {
  idx: number;
  question: any;
  qb: any;
  control: any;
  formState: any;
};

const GrammarQuestion = ({
  idx,
  qb,
  control,
  question,
  formState,
}: GrammarQuestionProps) => {
  const { setValue } = useFormContext<ExerciseInput>();
  const type = useWatch({
    control,
    name: `content.${idx}.type`,
  });
  const prevType = useRef(true);
  useEffect(() => {
    if (prevType.current) {
      prevType.current = false;
      return;
    }

    if (!type) return;
    setValue(`content.${idx}.id`, generateId());
    setValue(`content.${idx}.type`, "mcq");
    setValue(`content.${idx}.question`, "");
    setValue(`content.${idx}.options`, ["", "", "", ""]);
    setValue(`content.${idx}.correctAnswer`, "");
    setValue(`content.${idx}.points`, 1);
    // switch (type) {
    //   case "mcq":
    //     setValue(`content.${idx}.options`, ["","","",""]);
    //     setValue(`content.${idx}.correctAnswer`, "");
    //     break;

    //   case "fill_blank":
    //     setValue(`content.${idx}.answer`, "");
    //     break;

    //   case "pair":
    //     setValue(`content.${idx}.pairs`, []);
    //     break;

    //   default:
    //     break;
    // }
  }, [type]);

  console.log("COMNTETE", question);

  return (
    <Card key={idx} className="border-l-4 border-primary">
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
                control={control}
                label="Points"
                name={`content.[${idx}].type`}
                options={qb.types}
              />
              <FormInput
                itemClassName="flex items-center ml-auto gap-2"
                control={control}
                label="Points"
                name={`content.[${idx}].points`}
                type="number"
                // disabled={isLoading}
                placeholder="Enter points..."
              />
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

          {(question.type === "fill_blank" || question.type === "mcq") && (
            <div>
              <div className="space-y-1">
                <FormTextarea
                  label="Question Text"
                  control={control}
                  name={`content.[${idx}].question`}
                  placeholder="Enter your question..."
                />
              </div>
              <span className="text-xs  text-red-500">
                {Array.isArray(formState?.errors?.content) &&
                  formState?.errors?.content?.[idx]?.question?.message}
              </span>
            </div>
          )}

          {question.type === "mcq" ? (
            <MCQRenderer {...qb} question={question} idx={idx} />
          ) : question.type === "matching" ? (
            <MatchingRenderer {...qb} question={question} idx={idx} />
          ) : question.type === "fill_blank" ? (
            <FillInTheBlankRenderer {...qb} question={question} idx={idx} />
          ) : (
            ""
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GrammarQuestion;
