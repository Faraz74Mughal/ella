import { useQuery } from "@tanstack/react-query";
import { assignmentService } from "@/api/assignment.service";
import PageHeading from "@/components/ui/page-heading";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminAssignmentsPage() {
  const { data: assignments = [] } = useQuery({
    queryKey: ["admin-assignments"],
    queryFn: assignmentService.fetchAdminAssignments,
  });

  return (
    <section className="space-y-6">
      <PageHeading title="Assignments" />
      <Card className="-py-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Window</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>XP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment._id}>
                <TableCell className="font-medium">{assignment.title}</TableCell>
                <TableCell>
                  {(assignment.teacher as any)?.name || (assignment.teacher as any)?.username}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(assignment.start_date).toLocaleDateString()} -{" "}
                  {new Date(assignment.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{assignment.total_marks}</TableCell>
                <TableCell>{assignment.xp_total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {assignments.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No assignments found.
          </div>
        )}
      </Card>
    </section>
  );
}
