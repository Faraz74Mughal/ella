import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IAssignment } from "@/types/assignment";

const formatDate = (value?: string) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
};

const AssignmentList = ({ assignments }: { assignments: IAssignment[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Marks</TableHead>
          <TableHead>XP</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((assignment) => (
          <TableRow key={assignment._id}>
            <TableCell className="font-medium">{assignment.title}</TableCell>
            <TableCell>{assignment.total_marks}</TableCell>
            <TableCell>{assignment.xp_total}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(assignment.start_date)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(assignment.end_date)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AssignmentList;
