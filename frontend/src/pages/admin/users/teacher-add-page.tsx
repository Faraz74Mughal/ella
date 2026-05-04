import PageHeading from "@/components/ui/page-heading";

import { Card, CardContent } from "@/components/ui/card";
import TeacherForm from "./components/teacher-form";
import { useAddTeacherByAdmin } from "@/hooks/use-user";
import type { TeacherInput } from "@/lib/validations/admin/teacher.validation";
import type { ITeacherForm } from "@/types/user";

const TeacherAddPage = () => {
  const { mutate: addTeacher,isPending } = useAddTeacherByAdmin();
  const teacherAddHandler = async (values: TeacherInput) => {
    addTeacher(values as ITeacherForm);
  };
  return (
    <section className="space-y-8">
      <PageHeading title="Create New Teacher" isBack />
      <Card className="border-muted shadow-sm">
        <CardContent className="p-6">
          <TeacherForm onSubmit={teacherAddHandler} isLoading={isPending} />
        </CardContent>
      </Card>
    </section>
  );
};

export default TeacherAddPage;
