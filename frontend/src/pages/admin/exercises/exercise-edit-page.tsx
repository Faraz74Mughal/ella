import PageHeading from "@/components/ui/page-heading";

import { Card, CardContent } from "@/components/ui/card";
import type { IExercise } from "@/types/exercise";
import ExerciseForm from "./components/exercise-form";
import {
  useGetSingleExerciseByAdmin,
  useUpdateExerciseByAdmin,
} from "@/hooks/use-exercise";
import { useNavigate, useParams } from "react-router-dom";

const AdminExercisesEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate(-1);
  const { data: exercise, isPending: isPendingSingle } =
    useGetSingleExerciseByAdmin(id!);
  const { mutate: updateExercise, isPending } = useUpdateExerciseByAdmin();
  const exerciseAddHandler = async (values: IExercise) => {
    updateExercise({ id: id!, data: values });
  };

  return (
    <section className="space-y-8">
      <PageHeading title="Create New Exercise" isBack />
      <Card className="border-muted shadow-sm">
        <CardContent className="p-6">
          <ExerciseForm
            exercise={exercise}
            onSubmit={exerciseAddHandler}
            isLoading={isPending || isPendingSingle}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminExercisesEditPage;
