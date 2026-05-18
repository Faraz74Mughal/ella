import { CheckCircle2, ChevronRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContinueLearningCard = ({ lesson }: any) => {
  const navigate = useNavigate();
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Continue Learning</h2>
        <button
        onClick={()=>navigate("/student/lessons")}
        className="text-indigo-600 text-sm font-semibold hover:underline">
          View All
        </button>
      </div>
      <div className="">
        <div className="group relative overflow-hidden bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg shadow-sm border-slate-200 transition-all duration-300">
          <div className="flex justify-between items-start mb-3">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full 
        ${
          lesson.level === "Beginner"
            ? "bg-green-100 text-green-700"
            : lesson.level === "Intermediate"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
        }`}
            >
              {lesson.level}
            </span>
            {lesson.status === "completed" && (
              <CheckCircle2 className="text-green-500" size={20} />
            )}
            {lesson.status === "locked" && (
              <Lock className="text-slate-300" size={20} />
            )}
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-1">
            {lesson.title}
          </h4>
          <p className="text-sm text-slate-500 mb-4">{lesson.category}</p>

          <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${lesson.status === "completed" ? "bg-green-500" : "bg-indigo-500"}`}
              style={{ width: `${lesson.progress}%` }}
            ></div>
          </div>

          <button
            onClick={() => navigate("/student/lessons/" + lesson._id)}
            className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2
      ${
        lesson.status === "locked"
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-slate-900 text-white hover:bg-slate-800"
      }`}
          >
            {lesson.status === "completed"
              ? "Review"
              : lesson.status === "locked"
                ? "Locked"
                : "Continue"}
            {lesson.status !== "locked" && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContinueLearningCard;
