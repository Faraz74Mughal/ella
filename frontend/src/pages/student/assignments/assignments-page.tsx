import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignmentService } from "@/api/assignment.service";

export default function StudentAssignmentsPage() {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<Record<string, File | null>>({});

  const { data: assignments = [] } = useQuery({
    queryKey: ["student-assignments"],
    queryFn: assignmentService.fetchStudentAssignments,
  });

  const submitMutation = useMutation({
    mutationFn: ({ assignmentId, file }: { assignmentId: string; file: File }) => assignmentService.submitAssignment(assignmentId, file),
    onSuccess: () => {
      toast.success("Assignment submitted successfully.");
      void queryClient.invalidateQueries({ queryKey: ["student-assignments"] });
    },
    onError: (error: any) => toast.error(error?.message || "Failed to submit assignment."),
  });

  const activeAssignments = useMemo(() => assignments, [assignments]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Assignments</h1>
        <p className="mt-2 text-muted-foreground">Open assignments when they become active and submit your document files here.</p>
      </div>

      <div className="grid gap-4">
        {activeAssignments.map((assignment) => (
          <div key={assignment._id} className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">{assignment.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{assignment.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(assignment.start_date).toLocaleString()} → {new Date(assignment.end_date).toLocaleString()}
                </p>
              </div>
              <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase">
                {assignment.status}
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <input
                type="file"
                accept=".doc,.docx,.pdf"
                className="rounded-xl border border-border px-4 py-2 text-sm"
                disabled={!assignment.can_submit}
                onChange={(e) => setFiles((prev) => ({ ...prev, [assignment._id]: e.target.files?.[0] || null }))}
              />
              <button
                type="button"
                disabled={!assignment.can_submit || !files[assignment._id] || submitMutation.isPending}
                onClick={() => files[assignment._id] && submitMutation.mutate({ assignmentId: assignment._id, file: files[assignment._id]! })}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                Submit Document
              </button>
            </div>

            <div className="mt-3 text-sm text-muted-foreground">
              Best score: <span className="font-semibold text-foreground">{assignment.best_percentage || 0}%</span>
              {assignment.submission?.status === "graded" && (
                <span className="ml-4">Latest graded: {assignment.submission.percentage || 0}%</span>
              )}
            </div>
          </div>
        ))}
        {activeAssignments.length === 0 && <p className="text-sm text-muted-foreground">No assignments available right now.</p>}
      </div>
    </section>
  );
}
