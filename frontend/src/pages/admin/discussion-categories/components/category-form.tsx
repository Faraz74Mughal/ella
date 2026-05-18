import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { discussionService } from "@/api/discussion.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SecondHeading from "@/components/shared/second-heading";

const CategoryForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", description: "" });

  const createMutation = useMutation({
    mutationFn: discussionService.createCategory,
    onSuccess: () => {
      toast.success("Category created successfully.");
      void queryClient.invalidateQueries({ queryKey: ["discussion-categories"] });
      navigate("/admin/discussion-categories");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create category.");
    },
  });

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        createMutation.mutate(form);
      }}
    >
      <div>
        <SecondHeading title="Category Information" />
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <Input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Category name (e.g., Grammar Discussion)"
          />
        </div>
      </div>

      <div>
        <SecondHeading title="Description" />
        <Textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Category description (optional)"
          className="mt-4 min-h-24"
        />
      </div>

      <div className="flex justify-end border-t pt-6">
        <Button type="submit" disabled={createMutation.isPending || !form.name}>
          {createMutation.isPending ? "Creating..." : "Create Category"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
