import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserCircle2 } from "lucide-react";

interface DialogueProps {
  q: {
    id: string;
    type: string;
    question: string;
    speaker: string;
    expectedAnswer: string;
    points: number;
  };
}

const AdminDialogueViewer = ({ q }: DialogueProps) => {
  return (
    <div className="space-y-6">
      {/* Speaker Section */}
      <div className="flex items-start gap-4">
        <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
          <UserCircle2 size={24} />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Speaker {q.speaker}
            </span>
            <Badge variant="secondary" className="text-[10px] h-4">Prompt</Badge>
          </div>
          <p className="text-lg font-medium leading-tight text-foreground">
            "{q.question}"
          </p>
        </div>
      </div>

      {/* Answer Section */}
      <div className="relative pl-12">
        {/* Decorative Connector Line */}
        <div className="absolute left-6 top-[-24px] bottom-6 w-px bg-border border-dashed border-l-2 ml-[-1px]" />
        
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 dark:bg-emerald-950/20 dark:border-emerald-900/30">
          <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
            <MessageSquare size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Expected Student Response
            </span>
          </div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 italic">
            {q.expectedAnswer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDialogueViewer;