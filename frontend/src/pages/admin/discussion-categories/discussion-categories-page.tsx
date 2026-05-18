import { useQuery } from "@tanstack/react-query";
import PageHeading from "@/components/ui/page-heading";
import { Card } from "@/components/ui/card";
import { discussionService } from "@/api/discussion.service";
import CategoryList from "./components/category-list";

const DiscussionCategoriesPage = () => {
  const categoriesQuery = useQuery({
    queryKey: ["discussion-categories"],
    queryFn: discussionService.fetchCategories,
  });

  const categories = categoriesQuery.data || [];

  return (
    <section className="space-y-6">
      <PageHeading
        title="Discussion Categories"
        createPageUrl="/admin/discussion-categories/add"
      />
      <Card className="-py-2">
        <CategoryList categories={categories} />
        {!categoriesQuery.isLoading && categories.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No categories created yet.
          </div>
        )}
      </Card>
    </section>
  );
};

export default DiscussionCategoriesPage;
