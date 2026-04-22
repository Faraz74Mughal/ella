import { Edit, Eye, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import type { IExercise } from "@/types/exercise";
import { DeleteDialog } from "@/components/ui/delete-dialog";

const ExerciseRow = ({
  exercise,
  onEdit,
  onDelete
}: {
  exercise: IExercise;
  onEdit: () => void;
  onDelete:()=>void;
}) => {
  return (
    <TableRow>
      <TableCell>{exercise.title}</TableCell>
      <TableCell>{exercise.category}</TableCell>
      <TableCell>{exercise?.level}</TableCell>
      <TableCell>
        
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

export default ExerciseRow;
