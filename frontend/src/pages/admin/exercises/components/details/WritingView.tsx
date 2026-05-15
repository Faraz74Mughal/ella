import { Badge } from "@/components/ui/badge";
import { Timer, FileText, AlignLeft } from "lucide-react";

interface WritingProps {
  q: {
    id: string;
    type: string;
    topic: string;
    timeLimit: number;
    minimumWords: number;
    maximumWords: number;
    points: number;
  };
}

const WritingView = ({ q }: WritingProps) => {
  return (
    <div className="space-y-6">
      {/* Topic Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlignLeft size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Writing Topic
          </span>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg dark:bg-slate-900 dark:border-slate-800">
          <p className="text-base font-medium text-foreground leading-relaxed">
            {q.topic}
          </p>
        </div>
      </div>

      {/* Constraints Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Time Limit */}
        <div className="flex items-center gap-3 p-3 border rounded-xl bg-white shadow-sm dark:bg-slate-950">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg dark:bg-amber-900/30 dark:text-amber-400">
            <Timer size={18} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1">
              Time Limit
            </p>
            <p className="text-sm font-bold">{q.timeLimit} Minutes</p>
          </div>
        </div>

        {/* Word Count Range */}
        <div className="flex items-center gap-3 p-3 border rounded-xl bg-white shadow-sm dark:bg-slate-950 sm:col-span-2">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg dark:bg-indigo-900/30 dark:text-indigo-400">
            <FileText size={18} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1">
              Word Count Requirement
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">
                {q.minimumWords} - {q.maximumWords} words
              </span>
              <Badge variant="outline" className="text-[10px] font-normal py-0">
                Range: {q.maximumWords - q.minimumWords} words
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingView;
