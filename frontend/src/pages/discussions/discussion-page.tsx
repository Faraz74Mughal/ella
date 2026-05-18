import PageHeading from "@/components/ui/page-heading";
import { Card } from "@/components/ui/card";
import DiscussionList from "./components/discussion-list";

const DiscussionPage = () => {
  return (
    <section className="relative space-y-6">
      <PageHeading title="Discussion Forum" />
      <Card className="-py-2 p-4">
        <DiscussionList />
      </Card>
    </section>
  );
};

export default DiscussionPage;
