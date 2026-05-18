import PageHeading from "@/components/ui/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import AssignmentForm from "./components/assignment-form";

const TeacherAssignmentAddPage = () => {
  return (
    <section className="space-y-8">
      <PageHeading title="Create New Assignment" isBack />
      <Card className="border-muted shadow-sm">
        <CardContent className="p-6">
          <AssignmentForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default TeacherAssignmentAddPage;
