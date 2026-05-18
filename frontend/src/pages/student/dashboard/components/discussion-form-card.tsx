import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { discussionService } from "@/api/discussion.service";
import { Button } from "@/components/ui/button";

const DiscussionDormCard = () => {
  const navigate = useNavigate();
  const { data: threads = [] } = useQuery({
    queryKey: ["discussion-threads-preview"],
    queryFn: () => discussionService.fetchThreads(),
  });

  const recentThreads = useMemo(() => threads.slice(0, 2), [threads]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Discussion Form</h2>
        <button
          onClick={() => navigate("/student/discussions")}
          className="text-indigo-600 text-sm font-semibold hover:underline"
        >
          View All
        </button>
      </div>
      <div className="bg-white border border-indigo-100 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="space-y-4">
          {recentThreads.length > 0 ? (
            recentThreads.map((thread) => (
              <div key={thread._id} className="group cursor-pointer">
                <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition line-clamp-1">
                  {thread.title}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-slate-400">
                    {thread.replies?.length || 0} Replies • {thread.category?.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Intl.DateTimeFormat("en", { dateStyle: "short" }).format(
                      new Date(thread.createdAt || Date.now()),
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No discussions yet. Be the first to start one.</p>
          )}
        </div>
        <Button
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => navigate("/student/discussions")}
        >
          Go to Community
        </Button>
      </div>
    </section>
  );
};

export default DiscussionDormCard;
