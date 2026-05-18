import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { discussionService } from "@/api/discussion.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SecondHeading from "@/components/shared/second-heading";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { IDiscussionThread } from "@/types/discussion";

const formatDate = (value?: string) => {
  if (!value) return "Just now";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
};

const DiscussionList = () => {
  const queryClient = useQueryClient();
  const [categoryId, setCategoryId] = useState<string>("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["discussion-categories"],
    queryFn: discussionService.fetchCategories,
  });

  const threadsQuery = useQuery({
    queryKey: ["discussion-threads", categoryId],
    queryFn: () =>
      discussionService.fetchThreads(
        categoryId === "__all__" || !categoryId ? undefined : categoryId,
      ),
  });

  const visibleThreads = useMemo(() => threadsQuery.data || [], [threadsQuery.data]);

  const addReplyMutation = useMutation({
    mutationFn: discussionService.addReply,
    onSuccess: () => {
      toast.success("Reply posted.");
      setReplyDrafts({});
      void queryClient.invalidateQueries({ queryKey: ["discussion-threads"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to post reply.");
    },
  });

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Select value={categoryId || "__all__"} onValueChange={setCategoryId}>
          <SelectTrigger className="w-full md:w-56">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Categories</SelectItem>
            {(categoriesQuery.data || []).map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>By</TableHead>
            <TableHead>Replies</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleThreads.map((thread: IDiscussionThread) => (
            <TableRow key={thread._id}>
              <TableCell className="max-w-xs truncate font-medium">{thread.title}</TableCell>
              <TableCell>{thread.category?.name}</TableCell>
              <TableCell>{thread.createdBy?.name}</TableCell>
              <TableCell>{thread.replies?.length || 0}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(thread.createdAt)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setExpandedThreadId(expandedThreadId === thread._id ? null : thread._id)
                  }
                >
                  {expandedThreadId === thread._id ? "Hide" : "View"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!threadsQuery.isLoading && visibleThreads.length === 0 && (
        <div className="p-4 text-center text-sm text-muted-foreground">No discussions found.</div>
      )}

      {expandedThreadId &&
        visibleThreads.map((thread: IDiscussionThread) => {
          if (expandedThreadId !== thread._id) return null;
          const replyCount = thread.replies?.length || 0;

          return (
            <Card key={thread._id} className="mt-6 border-muted shadow-sm">
              <CardHeader className="space-y-2 border-b">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">{thread.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {thread.category?.name} • by {thread.createdBy?.name} •{" "}
                      {formatDate(thread.createdAt)}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setExpandedThreadId(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm leading-6">{thread.content}</p>
                </div>

                <div className="space-y-3">
                  <SecondHeading title="Replies" />
                  <div className="space-y-3">
                    {(thread.replies || []).map((reply) => (
                      <div
                        key={reply._id || `${reply.author?._id}-${reply.createdAt}`}
                        className="rounded-xl border bg-background p-4"
                      >
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="font-semibold">{reply.author?.name}</span>
                          <span className="text-muted-foreground">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="mt-3 text-sm">{reply.content}</p>
                      </div>
                    ))}
                    {replyCount === 0 && (
                      <p className="py-4 text-center text-sm text-muted-foreground">
                        No replies yet. Be the first to respond.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <Textarea
                      value={replyDrafts[thread._id] || ""}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({ ...prev, [thread._id]: e.target.value }))
                      }
                      placeholder="Write your reply..."
                      className="min-h-20"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={() =>
                          addReplyMutation.mutate({
                            threadId: thread._id,
                            payload: { content: replyDrafts[thread._id] || "" },
                          })
                        }
                        disabled={
                          addReplyMutation.isPending || !replyDrafts[thread._id]?.trim()
                        }
                      >
                        {addReplyMutation.isPending ? "Posting..." : "Post Reply"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </>
  );
};

export default DiscussionList;
