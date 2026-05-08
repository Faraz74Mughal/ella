import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import GrammarQuestion from "./grammar-question";
import useExerciseBuilder from "@/hooks/use-exercise-builder";

const GrammarForm = ({ eb }: { eb: ReturnType<typeof useExerciseBuilder> }) => {
  return (
    <div>
      <div className="space-y-6">
        {(eb?.questions || []).map((question, idx) => (
          <GrammarQuestion
            key={question.id}
            idx={idx}
            question={question}
            eb={eb}
          />
        ))}

        <div className="flex items-center justify-between mt-5">
          <span></span>
          <Button type="button" variant="outline" onClick={eb.addQuestion}>
            <Plus className="w-4 h-4 mr-1" />
            Add Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrammarForm;
