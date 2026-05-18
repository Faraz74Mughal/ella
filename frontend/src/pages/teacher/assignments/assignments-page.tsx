import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignmentService } from "@/api/assignment.service";
import PageHeading from "@/components/ui/page-heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AssignmentList from "./components/assignment-list";

const formatDate = (value?: string) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
};

export default function TeacherAssignmentsPage() {
  const queryClient = useQueryClient();
  const [gradeDrafts, setGradeDrafts] = useState<Record<string, { score: string; feedback: string }>>({});
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);

  const assignmentsQuery = useQuery({
    queryKey: ["teacher-assignments"],
    queryFn: assignmentService.fetchTeacherAssignments,
  });

  const submissionsQuery = useQuery({
    queryKey: ["teacher-assignment-submissions"],
    queryFn: assignmentService.fetchTeacherSubmissions,
  });

  const gradeMutation = useMutation({
    mutationFn: assignmentService.gradeSubmission,
    onSuccess: () => {
      toast.success("Submission graded successfully.");
      void queryClient.invalidateQueries({ queryKey: ["teacher-assignment-submissions"] });
      setExpandedSubmissionId(null);
    },
    onError: (error: any) => toast.error(error?.message || "Failed to grade submission."),
  });

  const assignments = useMemo(() => assignmentsQuery.data || [], [assignmentsQuery.data]);
  const submissions = useMemo(() => submissionsQuery.data || [], [submissionsQuery.data]);

  return (
    <section className="space-y-6">
      <PageHeading title="Assignments" createPageUrl="/teacher/assignments/add" />

      <Card className="-py-2">
        <AssignmentList assignments={assignments} />
        {!assignmentsQuery.isLoading && assignments.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No assignments created yet.
          </div>
        )}
      </Card>

      <Card className="border-muted shadow-sm">
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
          <CardDescription>Review and grade student submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission._id}>
                  <TableCell className="font-medium">{submission.student?.name}</TableCell>
                  <TableCell>{(submission.assignment as any)?.title}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold uppercase">
                      {submission.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {submission.createdAt ? formatDate(submission.createdAt) : "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setExpandedSubmissionId(
                          expandedSubmissionId === submission._id ? null : submission._id,
                        )
                      }
                    >
                      {expandedSubmissionId === submission._id ? "Close" : "Grade"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!submissionsQuery.isLoading && submissions.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">No submissions yet.</div>
          )}
        </CardContent>
      </Card>

      {expandedSubmissionId &&
        submissions
          .filter((submission) => submission._id === expandedSubmissionId)
          .map((submission) => {
            const draft = gradeDrafts[submission._id] || {
              score: String(submission.score_obtained || 0),
              feedback: submission.feedback || "",
            };
            return (
              <Card key={submission._id} className="border-muted shadow-sm">
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle>{(submission.assignment as any)?.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {submission.student?.name} • Submitted {formatDate(submission.createdAt)}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedSubmissionId(null)}>
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="mb-2 text-sm font-medium">Student Document:</p>
                    <a
                      href={submission.document_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-primary underline"
                    >
                      Open Document
                    </a>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Score</label>
                      <Input
                        type="number"
                        value={draft.score}
                        onChange={(e) =>
                          setGradeDrafts((prev) => ({
                            ...prev,
                            [submission._id]: { ...draft, score: e.target.value },
                          }))
                        }
                        placeholder="0"
                        max={(submission.assignment as any)?.total_marks || 100}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Feedback</label>
                    <Textarea
                      value={draft.feedback}
                      onChange={(e) =>
                        setGradeDrafts((prev) => ({
                          ...prev,
                          [submission._id]: { ...draft, feedback: e.target.value },
                        }))
                      }
                      placeholder="Provide constructive feedback..."
                      className="mt-2 min-h-24"
                    />
                  </div>
                  <div className="flex justify-end border-t pt-4">
                    <Button
                      onClick={() =>
                        gradeMutation.mutate({
                          submissionId: submission._id,
                          data: { score_obtained: Number(draft.score), feedback: draft.feedback },
                        })
                      }
                      disabled={gradeMutation.isPending}
                    >
                      {gradeMutation.isPending ? "Grading..." : "Submit Grade"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
    </section>
  );
}
