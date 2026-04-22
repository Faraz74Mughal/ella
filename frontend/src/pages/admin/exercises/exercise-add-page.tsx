import PageHeading from "@/components/ui/page-heading";

import { Card, CardContent } from "@/components/ui/card";
import type { IExercise } from "@/types/exercise";
import ExerciseForm from "./components/exercise-form";
import { useAddExerciseByAdmin } from "@/hooks/use-exercise";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";

const AdminExercisesAddPage = () => {
  const { mutate: addExercise,isPending } = useAddExerciseByAdmin();
  const exerciseAddHandler = async (values: ExerciseInput) => {
    addExercise(values as IExercise);
  };
  return (
    <section className="space-y-8">
      <PageHeading title="Create New Exercise" isBack />
      <Card className="border-muted shadow-sm">
        <CardContent className="p-6">
          <ExerciseForm onSubmit={exerciseAddHandler} isLoading={isPending} />
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminExercisesAddPage;
