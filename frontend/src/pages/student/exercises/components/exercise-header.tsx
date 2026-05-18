import { Badge } from "@/components/ui/badge";
import { LEVEL } from "@/constants/lesson.constant";



const ExerciseHeader = ({ showResults, exercise, score ,totalPoints}: any) => {

  // Helper to determine badge background/text design based on exercise levels safely
  const getLevelStyles = (level: string): string => {
    switch (level) {
      case LEVEL.BEGINNER:
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case LEVEL.INTERMEDIATE:
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      default:
        return "bg-red-100 text-red-700 hover:bg-red-100";
    }
  };

  return (
    <div className="space-y-4">
      

      {/* Title & Metadata Badges Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {exercise.title}
          </h2>
          <div className="flex items-center flex-wrap gap-2">
            <Badge variant="secondary" className={`${getLevelStyles(exercise.level)} border-none shadow-none font-medium`}>
              {exercise.level}
            </Badge>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none shadow-none font-medium">
              {exercise.category}
            </Badge>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
              Max Value: {totalPoints} pts
            </span>
          </div>
        </div>

        {/* Dynamic Display shown exclusively when results are computed */}
        {showResults && score !== undefined && (
          <div className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-xl text-center md:text-right">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Your Result</p>
            <p className="text-2xl font-black text-indigo-700">
              {score} <span className="text-sm font-medium text-indigo-500">/ {totalPoints} pts</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseHeader;