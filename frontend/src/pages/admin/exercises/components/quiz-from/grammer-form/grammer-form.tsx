import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import MCQRenderer from "./mcq-renderer";
import { useQuestionBuilder } from "@/hooks/use-grammar-question-builder";
import MatchingRenderer from "./matching-renderer";
import FillInTheBlankRenderer from "./fill-in-the-blank-renderer";
import { useFormContext, useWatch } from "react-hook-form";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect } from "@/components/ui/form-select";
import { useEffect } from "react";
import GrammarQuestion from "./grammar-question";

const GrammarForm = () => {
  const { setValue, watch,  formState, control } =
    useFormContext<ExerciseInput>();
  const content = useWatch({ control: control, name: "content" });

  const qb = useQuestionBuilder({
    value: watch("content"),
    onChange: (val) => setValue("content", val),
  });

  useEffect(()=>{

  },[])


  return (
    <div>
      <div className="space-y-6">
        {(content || []).map((question, idx) => (
          <GrammarQuestion
            key={idx}
            idx={idx}
            question={question}
            qb={qb}
            control={control}
            formState={formState}
          />
          // <Card key={idx} className="border-l-4 border-primary">
          //   <CardContent className="p-4">
          //     <div className="space-y-4">
          //       {/* Question Header */}
          //       <div className="flex items-start justify-between">
          //         <div className="flex items-center gap-3 flex-1">
          //           <Badge variant="outline" className="bg-blue-50">
          //             Q{idx + 1}
          //           </Badge>
          //           {/* <TypesSelect question={question} {...qb} /> */}
          //           <FormSelect
          //             control={control}
          //             label="Points"
          //             name={`content.[${idx}].type`}
          //             options={qb.types}
          //           />
          //           <FormInput
          //             itemClassName="flex items-center ml-auto gap-2"
          //             control={control}
          //             label="Points"
          //             name={`content.[${idx}].points`}
          //             type="number"
          //             // disabled={isLoading}
          //             placeholder="Enter points..."
          //           />
          //           {/* <div className="flex items-center gap-2 ml-auto">
          //             <Label className="text-sm text-slate-500">Points:</Label>
          //             <Input
          //               type="number"
          //               value={question.points}
          //               onChange={(e) =>
          //                 qb.updateQuestion(
          //                   question.id,
          //                   "points",
          //                   parseInt(e.target.value) || 0,
          //                 )
          //               }
          //               className="w-20 h-8 text-sm"
          //               min={0}
          //               max={100}
          //             />
          //           </div> */}
          //         </div>

          //         <Button
          //           type="button"
          //           size="sm"
          //           variant="ghost"
          //           onClick={() => qb.removeQuestion(question.id)}
          //           disabled={qb.questions.length === 1}
          //           className="text-red-500 ml-2"
          //         >
          //           <Trash2 className="w-4 h-4" />
          //         </Button>
          //       </div>

          //       {/* Question Text */}

          //       {(question.type === "fill_blank" ||
          //         question.type === "mcq") && (
          //         <div>
          //           <div className="space-y-1">
          //             <FormTextarea
          //               label="Question Text"
          //               control={control}
          //               name={`content.[${idx}].question`}
          //               placeholder="Enter your question..."
          //             />
          //           </div>
          //           <span className="text-xs  text-red-500">
          //             {Array.isArray(formState?.errors?.content) &&
          //               formState?.errors?.content?.[idx]?.question?.message}
          //           </span>
          //         </div>
          //       )}

          //       {question.type === "mcq" ? (
          //         <MCQRenderer {...qb} question={question} idx={idx} />
          //       ) : question.type === "matching" ? (
          //         <MatchingRenderer {...qb} question={question} idx={idx} />
          //       ) : question.type === "fill_blank" ? (
          //         <FillInTheBlankRenderer
          //           {...qb}
          //           question={question}
          //           idx={idx}
          //         />
          //       ) : (
          //         ""
          //       )}
          //     </div>
          //   </CardContent>
          // </Card>
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
