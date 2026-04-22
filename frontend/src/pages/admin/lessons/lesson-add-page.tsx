import PageHeading from "@/components/ui/page-heading";

import { Card, CardContent } from "@/components/ui/card";
import type { ILesson } from "@/types/lesson";
import LessonForm from "./components/lesson-form";
import { useAddLessonByAdmin } from "@/hooks/use-lesson";
import type { LessonInput } from "@/lib/validations/admin/lesson.validation";

const AdminLessonsAddPage = () => {
  const { mutate: addLesson,isPending } = useAddLessonByAdmin();
  const lessonAddHandler = async (values: LessonInput) => {
    if(!values.study_material?.content){
        delete values.study_material
    }
    addLesson(values as ILesson);
  };
  return (
    <section className="space-y-8">
      <PageHeading title="Create New Lesson" isBack />
      <Card className="border-muted shadow-sm">
        <CardContent className="p-6">
          <LessonForm onSubmit={lessonAddHandler} isLoading={isPending} />
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminLessonsAddPage;
