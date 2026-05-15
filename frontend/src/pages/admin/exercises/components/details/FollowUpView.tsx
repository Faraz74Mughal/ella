import { Badge } from "@/components/ui/badge";
import { MessageCircleQuestion, CornerDownRight, CheckCircle2 } from "lucide-react";

interface FollowUpProps {
  // Since your map sends the whole object, this handles a single follow-up item
  q: {
    id: string;
    type: string;
    question: string;
    expectedAnswer: string;
    points: number;
  };
}

const FollowUpView = ({ q }: FollowUpProps) => {
  return (
    <div className="space-y-4">
      {/* Header Label */}
      <div className="flex items-center gap-2 text-muted-foreground border-b border-slate-100 pb-2">
        <MessageCircleQuestion size={16} className="text-blue-500" />
        <span className="text-xs font-bold uppercase tracking-wider">Follow-up Task</span>
      </div>

      <div className="relative pl-6 space-y-4">
        {/* Visual Connector Line */}
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-100 rounded-full" />

        {/* Question Section */}
        <div className="relative">
          <div className="absolute -left-6 top-1.5 p-1 bg-white">
            <CornerDownRight size={14} className="text-slate-300" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Instruction / Question</p>
            <p className="text-base font-medium text-slate-800 dark:text-slate-200">
              {q.question}
            </p>
          </div>
        </div>

        {/* Expected Answer Section */}
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Expected Student Response</span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-none text-[10px]">
              {q.points} Points
            </Badge>
          </div>
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 italic">
            "{q.expectedAnswer}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default FollowUpView;