import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QUIZ_TYPES } from "@/constants/lesson.constant";
import { FileText, Layers, Link } from "lucide-react";

const ExerciseTypeTabs = ({
  value,
  onValueChange,
  exerciseTypeOptions
}: {
  value: string;
  onValueChange: (value: string) => void;
  exerciseTypeOptions: { label: string; value: string }[];
}) => {
  return (
    <div className="space-y-4 mt-5">
      <Tabs value={value} onValueChange={onValueChange} className="w-full">
        <TabsList className={`grid w-full grid-cols-${exerciseTypeOptions.length} h-10!  bg-slate-100`}>
            {exerciseTypeOptions.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="data-[state=active]:bg-blue-500  data-[state=active]:text-white"
              >
                {option.label}
              </TabsTrigger>
            ))}
          {/* <TabsTrigger
            value={QUIZ_TYPES.MCQ}
            className="data-[state=active]:bg-blue-500  data-[state=active]:text-white"
          >
            <Layers className="w-4 h-4 mr-2" />
            Multiple Choice
          </TabsTrigger>
          <TabsTrigger
            value={QUIZ_TYPES.FILL_IN_THE_BLANK}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Fill in Blank
          </TabsTrigger>
          <TabsTrigger
            value={QUIZ_TYPES.MATCHING}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            <Link className="w-4 h-4 mr-2" />
            Matching
          </TabsTrigger> */}
        </TabsList>
      </Tabs>

      {/* <div className="text-sm text-slate-500">
        {value === "mcq" && "Create questions with multiple answer options. Perfect for testing knowledge."}
        {value === "fill_blank" && "Create sentence completion exercises. Great for vocabulary and grammar."}
        {value === "matching" && "Create pair matching exercises. Ideal for associations and relationships."}
      </div> */}
    </div>
  );
};

export default ExerciseTypeTabs;
