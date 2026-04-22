import PageHeading from "@/components/ui/page-heading";

import { Card, CardContent } from "@/components/ui/card";
import type { ILesson } from "@/types/lesson";
import LessonForm from "./components/lesson-form";
import {
  useGetSingleLessonByAdmin,
  useUpdateLessonByAdmin,
} from "@/hooks/use-lesson";
import { useNavigate, useParams } from "react-router-dom";

const AdminLessonsEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate(-1);
  const { data: lesson, isPending: isPendingSingle } =
    useGetSingleLessonByAdmin(id!);
  const { mutate: updateLesson, isPending } = useUpdateLessonByAdmin();
  const lessonAddHandler = async (values: ILesson) => {
    if (!values.study_material?.content) {
      delete values.study_material;
    }
    updateLesson({ id: id!, data: values });
  };
  console.log("lesson1",lesson);
  
  return (
    <section className="space-y-8">
      <PageHeading title="Create New Lesson" isBack />
      <Card className="border-muted shadow-sm">
        <CardContent className="p-6">
          <LessonForm
            lesson={lesson}
            onSubmit={lessonAddHandler}
            isLoading={isPending || isPendingSingle}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminLessonsEditPage;
