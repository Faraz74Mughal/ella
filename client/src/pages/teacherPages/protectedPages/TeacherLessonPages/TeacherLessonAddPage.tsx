import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LessonForm from "./components/LessonForm";

const TeacherLessonAddPage = () => {
  return (
    <section>
      <Card className="pt-0">
        <CardHeader >
          <CardTitle>Create New</CardTitle>
        </CardHeader>
        <CardContent>
            <LessonForm/>
        </CardContent>
      </Card>
    </section>
  );
};

export default TeacherLessonAddPage;
