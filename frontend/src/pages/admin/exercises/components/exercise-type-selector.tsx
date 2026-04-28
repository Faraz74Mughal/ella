import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


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
                className="data-[state=active]:bg-primary  data-[state=active]:text-white"
              >
                {option.label}
              </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>

      
    </div>
  );
};

export default ExerciseTypeTabs;
