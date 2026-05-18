import PageHeading from "@/components/ui/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import DiscussionThreadForm from "@/pages/discussions/components/discussion-thread-form";

const AdminDiscussionAddPage = () => {
  return (
    <section className="space-y-8">
      <PageHeading title="Create New Discussion" isBack />
      <Card className="border-muted shadow-sm">
        <CardContent className="p-6">
          <DiscussionThreadForm redirectTo="/admin/discussions" />
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminDiscussionAddPage;
