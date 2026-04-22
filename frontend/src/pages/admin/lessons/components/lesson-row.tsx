import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import type { ILesson } from "@/types/lesson";
import { DeleteDialog } from "@/components/ui/delete-dialog";

const LessonRow = ({
  lesson,
  onEdit,
  onDelete
}: {
  lesson: ILesson;
  onEdit: () => void;
  onDelete:()=>void;
}) => {
  return (
    <TableRow>
      <TableCell>{lesson.title}</TableCell>
      <TableCell>{lesson.category}</TableCell>
      <TableCell>{lesson?.level}</TableCell>
      <TableCell>
        <Badge variant={lesson?.is_published ? "default" : "destructive"}>
          {lesson?.is_published ? "Published" : "Wait for publish"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Eye size={16} className="text-primary" />
          <Edit size={16} className="text-primary" onClick={onEdit} />
          <DeleteDialog onConfirm={onDelete}>
            <Trash2 size={16} className="text-destructive" />
          </DeleteDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default LessonRow;
