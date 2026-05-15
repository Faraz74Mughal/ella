import { Badge } from "@/components/ui/badge";
import {
  Headphones,
  FileText,
  ListFilter,
  Video,
  AlertCircle,
} from "lucide-react";
import MCQView from "./MCQView";
import FillBlankView from "./FillBlankView";
import TrueFalseView from "./TrueFalseView";

interface ListeningProps {
  q: {
    file?: {
      url: string;
      resource_type: string;
    };
    transcript: string;
    points: number;
    comprehensionQuestions: any[];
  };
}

const ListeningView = ({ q }: ListeningProps) => {
  // 1. Check if media exists
  const hasMedia = q?.file?.url;

  // 2. Determine if content is video (only if media exists)
  const isVideo =
    hasMedia &&
    (q.file?.url.match(/\.(mp4|webm|ogg|mov)$/i) ||
      (q.file?.resource_type === "video" && !q.file?.url.endsWith(".mp3")));

  return (
    <div className="space-y-8">
      {/* 1. Media Player Section */}
      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400">
          {isVideo ? <Video size={18} /> : <Headphones size={18} />}
          <span className="text-xs font-bold uppercase tracking-widest">
            {isVideo ? "Video Resource" : "Audio Resource"}
          </span>
        </div>

        {hasMedia ? (
          isVideo ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <video controls className="w-full h-full">
                <source src={q.file?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <audio controls className="w-full h-10">
              <source src={q.file?.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )
        ) : (
          /* EMPTY / MISSING STATE */
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-100/50">
            <AlertCircle className="text-slate-400 mb-2" size={24} />
            <p className="text-sm font-medium text-slate-500">
              No media file attached
            </p>
            <p className="text-[10px] text-slate-400 uppercase">
              Please upload an audio or video file
            </p>
          </div>
        )}
      </div>

      {/* 2. Transcript Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText size={16} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Transcript
          </span>
        </div>
        {q.transcript ? (
          <div className="p-4 bg-white border rounded-lg text-sm text-slate-600 italic leading-relaxed dark:bg-slate-950 max-h-40 overflow-y-auto">
            {q.transcript}
          </div>
        ) : (
          <div className="p-4 border border-dashed rounded-lg text-xs text-slate-400 text-center">
            No transcript available for this exercise.
          </div>
        )}
      </div>

      {/* 3. Nested Comprehension Questions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <ListFilter size={18} className="text-indigo-500" />
          <h4 className="font-bold text-slate-700 dark:text-slate-200">
            Comprehension Check ({q.comprehensionQuestions?.length || 0})
          </h4>
        </div>

        {!q.comprehensionQuestions || q.comprehensionQuestions.length === 0 ? (
          <div className="py-10 text-center border rounded-xl bg-slate-50/50">
            <p className="text-sm text-slate-400 font-medium">
              No questions added yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {q.comprehensionQuestions.map((subQ) => (
              <div
                key={subQ.id}
                className="p-4 border rounded-xl bg-white dark:bg-slate-950 shadow-sm relative"
              >
                {/* ... existing question rendering code ... */}
                <div className="absolute top-7 right-3">
                  <Badge variant="outline" className="text-[10px]">
                    {subQ.points} PTS
                  </Badge>
                </div>

                <div className="flex gap-3">
                  {/* <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100">
                    {idx + 1}
                  </span> */}
                  <div className="flex-1 space-y-3 pt-0.5">
                    {/* <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold pr-16">{subQ.question}</p>
                      <Badge className="text-[9px] uppercase h-4 px-1">{subQ.type.replace('_', ' ')}</Badge>
                    </div> */}

                    <div className="mt-2  border-slate-50">
                      {subQ.type === "mcq" && <MCQView q={subQ} />}
                      {subQ.type === "fill_blank" && <FillBlankView q={subQ} />}
                      {subQ.type === "true_false" && <TrueFalseView q={subQ} />}
                      {/* ... other type checks ... */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeningView;
