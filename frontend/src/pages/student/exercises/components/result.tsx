import { CheckCircle2, ChevronLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ResultProps {
  score: number;
  totalPoints: number;
  passed: boolean;
  percentage: number;
  onBack: () => void;
  exercise?: any;
}

const Result = ({ score, totalPoints, passed, percentage, onBack, exercise }: ResultProps) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    if (passed) {
      toast.success("Excellent! Moving to next lesson...");
      navigate("/student/lessons");
    } else {
      toast.info("Please try this lesson again.");
      if (exercise?.lesson_id) {
        navigate(`/student/lessons/${exercise.lesson_id?._id || exercise.lesson_id}`);
      } else {
        navigate(-1);
      }
    }
  };

  return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto space-y-6">
          <button 
            type="button"
            onClick={onBack} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium transition-colors"
          >
            <ChevronLeft size={20} /> Back
          </button>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-500 ${passed ? 'bg-green-100 scale-105' : 'bg-red-100'}`}>
              {passed ? <CheckCircle2 size={48} className="text-green-600" /> : <X size={48} className="text-red-600" />}
            </div>
            
            <h2 className="text-3xl font-bold mb-2 text-slate-800">
              {passed ? 'Great Job!' : 'Keep Practicing!'}
            </h2>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              {passed ? "Excellent accuracy! You have successfully passed this language exercise module." : "Don't worry! Review your study guidelines and try completing the task once more."}
            </p>

            <div className="flex justify-center gap-12 my-8 border-y border-slate-100 py-4">
              <div>
                <p className="text-3xl font-black text-slate-800">{score} <span className="text-sm font-medium text-slate-400">/ {totalPoints}</span></p>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-0.5">Points</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-800">{Math.round(percentage)}%</p>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-0.5">Accuracy</p>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleContinue} 
              className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all w-full sm:w-auto ${
                passed
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-green-100 hover:shadow-green-200"
                  : "bg-amber-600 text-white hover:bg-amber-700 shadow-amber-100 hover:shadow-amber-200"
              }`}
            >
              {passed ? "Proceed to Next Lesson" : "Try Again"}
            </button>
          </div>
        </div>
      </div>
  )
}

export default Result