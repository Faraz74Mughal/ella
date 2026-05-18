import PageHeading from "@/components/ui/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import CategoryForm from "./components/category-form";

const DiscussionCategoryAddPage = () => {
  return (
    <section className="space-y-8">
      <PageHeading title="Create New Category" isBack />
      <Card className="border-muted shadow-sm">
        <CardContent className="p-6">
          <CategoryForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default DiscussionCategoryAddPage;
