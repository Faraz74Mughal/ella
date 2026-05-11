import PageHeading from "@/components/ui/page-heading";

import { Card, CardContent } from "@/components/ui/card";
import ExerciseForm from "./components/exercise-form";
import {
  useGetSingleExerciseByAdmin,
  useUpdateExerciseByAdmin,
} from "@/hooks/use-exercise";
import { useNavigate, useParams } from "react-router-dom";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";
import { CATEGORY, VISIBILITY } from "@/constants/lesson.constant";

const AdminExercisesEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate(-1);
  const { data: exercise, isPending: isPendingSingle } =
    useGetSingleExerciseByAdmin(id!);
  const { mutate: updateExercise, isPending } = useUpdateExerciseByAdmin();
  const exerciseAddHandler = async (values: ExerciseInput) => {
    const payload = {
      ...values,
      visibility: values.visibility ?? VISIBILITY.PRIVATE,
    } as unknown as any;

    values.points =
      (values.content || [])?.reduce((acc, item) => {
        acc += item?.points || 1;
        return acc;
      }, 0) || 10;
    if (values.category === CATEGORY.GRAMMAR) {
      values.content?.map((cont: any) => {
        if (cont.type === "mcq")
          cont.correctAnswer = cont?.options[cont?.correctAnswer];
        return { ...cont };
      });
    }


    updateExercise({ id: id!, data: payload });
  };

  if (!isPendingSingle && !exercise) return <div>Loading...</div>;

  return (
    <section className="space-y-8">
      <PageHeading title="Edit Exercise" isBack />
      <Card className="border-muted shadow-sm">
        <CardContent className="p-6">
          <ExerciseForm
            key={exercise?._id}
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
