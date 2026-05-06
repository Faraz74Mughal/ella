import { Edit, Eye, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import type { IExercise } from "@/types/exercise";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Link } from "react-router-dom";

const ExerciseRow = ({
  exercise,
  onEdit,
  onDelete,
}: {
  exercise: IExercise;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <TableRow>
      <TableCell>{exercise.title}</TableCell>
      <TableCell>{exercise?.created_by?.name}</TableCell>
      <TableCell>{exercise?.visibility}</TableCell>
      <TableCell>{exercise?.category}</TableCell>
      <TableCell>{exercise?.points}</TableCell>
      <TableCell>{exercise?.passing_percentage}%</TableCell>

      <TableCell>
        <div className="flex gap-2">
          <Link to={`/admin/exercises/${exercise._id}`}>
            <Eye size={16} className="text-primary" />
          </Link>
          <Link to={`/admin/exercises/edit/${exercise._id}`}>
            <Edit size={16} className="text-primary" onClick={onEdit} />
          </Link>
          <DeleteDialog onConfirm={onDelete}>
            <Trash2 size={16} className="text-destructive" />
          </DeleteDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ExerciseRow;
