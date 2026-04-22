import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserRow from "./exercise-row";
import type { IExercise } from "@/types/exercise";
import { useNavigate } from "react-router-dom";
import { useDeleteExerciseByAdmin } from "@/hooks/use-exercise";

const ExerciseList = ({ exercises }: { exercises: IExercise[] }) => {
  const navigate = useNavigate();

  const editNavigateHandler = (id: string) => {
    navigate(`/admin/exercises/edit/${id}`);
  };
  const { mutate: deleteExercise } = useDeleteExerciseByAdmin();

  const handleDelete = (id: string) => {
    deleteExercise(id);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>Passing %</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {((exercises as IExercise[]) || []).map((user: IExercise) => (
          <UserRow
            key={user._id}
            exercise={user}
            onEdit={() => editNavigateHandler(user?._id)}
            onDelete={() => handleDelete(user._id)}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default ExerciseList;
