import { Badge } from "@/components/ui/badge";
import { LEVEL } from "@/constants/lesson.constant";
import { ChevronLeft, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

const ExerciseHeader = ({showResults,exercise   }:{showResults: boolean, exercise: any}) => {
  const [timeLeft, setTimeLeft] = useState(600);
  const formatTime = (s:any) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, showResults]);
  const onBack = () => {};
  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={16} />
          <span
            className={`font-mono font-bold ${timeLeft < 60 ? "text-red-500" : ""}`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800">{exercise.title}</h2>
        <div className="flex items-center gap-2 mt-1">
          <Badge
            color={
              exercise.level === LEVEL.BEGINNER
                ? "bg-emerald-100 text-emerald-700"
                : exercise.level === LEVEL.INTERMEDIATE
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
            }
          >
            {exercise.level}
          </Badge>
          <Badge color="bg-indigo-100 text-indigo-700">
            {exercise.category}
          </Badge>
          <span className="text-sm text-slate-500">{exercise.points} pts</span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseHeader;
