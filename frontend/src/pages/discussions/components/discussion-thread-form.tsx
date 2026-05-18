import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { discussionService } from "@/api/discussion.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SecondHeading from "@/components/shared/second-heading";

type DiscussionThreadFormProps = {
  redirectTo: string;
};

const DiscussionThreadForm = ({ redirectTo }: DiscussionThreadFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [threadForm, setThreadForm] = useState({ title: "", content: "", categoryId: "" });

  const categoriesQuery = useQuery({
    queryKey: ["discussion-categories"],
    queryFn: discussionService.fetchCategories,
  });

  const createThreadMutation = useMutation({
    mutationFn: discussionService.createThread,
    onSuccess: () => {
      toast.success("Discussion created successfully.");
      void queryClient.invalidateQueries({ queryKey: ["discussion-threads"] });
      navigate(redirectTo);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create discussion.");
    },
  });

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        createThreadMutation.mutate({
          categoryId: threadForm.categoryId,
          title: threadForm.title,
          content: threadForm.content,
        });
      }}
    >
      <div>
        <SecondHeading title="Discussion Details" />
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <Select
            value={threadForm.categoryId}
            onValueChange={(value) => setThreadForm((prev) => ({ ...prev, categoryId: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {(categoriesQuery.data || []).map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={threadForm.title}
            onChange={(e) => setThreadForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Discussion title"
          />
        </div>
      </div>

      <div>
        <SecondHeading title="Content" />
        <Textarea
          value={threadForm.content}
          onChange={(e) => setThreadForm((prev) => ({ ...prev, content: e.target.value }))}
          placeholder="Write the discussion prompt or question..."
          className="mt-4 min-h-32"
        />
      </div>

      <div className="flex justify-end border-t pt-6">
        <Button
          type="submit"
          disabled={
            createThreadMutation.isPending ||
            !threadForm.categoryId ||
            !threadForm.title ||
            !threadForm.content
          }
        >
          {createThreadMutation.isPending ? "Creating..." : "Create Discussion"}
        </Button>
      </div>
    </form>
  );
};

export default DiscussionThreadForm;
