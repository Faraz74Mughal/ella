import PageHeading from "@/components/ui/page-heading";
import { Card } from "@/components/ui/card";
import DiscussionList from "@/pages/discussions/components/discussion-list";

const TeacherDiscussionsPage = () => {
  return (
    <section className="relative space-y-6">
      <PageHeading title="Discussions" createPageUrl="/teacher/discussions/add" />
      <Card className="-py-2 p-4">
        <DiscussionList />
      </Card>
    </section>
  );
};

export default TeacherDiscussionsPage;
