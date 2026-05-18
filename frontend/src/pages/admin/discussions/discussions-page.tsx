import PageHeading from "@/components/ui/page-heading";
import { Card } from "@/components/ui/card";
import DiscussionList from "@/pages/discussions/components/discussion-list";

const AdminDiscussionsPage = () => {
  return (
    <section className="relative space-y-6">
      <PageHeading title="Discussions" createPageUrl="/admin/discussions/add" />
      <Card className="-py-2 p-4">
        <DiscussionList />
      </Card>
    </section>
  );
};

export default AdminDiscussionsPage;
