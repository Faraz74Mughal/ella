import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { assignmentService } from "@/api/assignment.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SecondHeading from "@/components/shared/second-heading";
import type { CreateAssignmentPayload } from "@/types/assignment";

const emptyForm: CreateAssignmentPayload = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  total_marks: 100,
  xp_total: 100,
};

const AssignmentForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateAssignmentPayload>(emptyForm);

  const createMutation = useMutation({
    mutationFn: assignmentService.createAssignment,
    onSuccess: () => {
      toast.success("Assignment created successfully.");
      void queryClient.invalidateQueries({ queryKey: ["teacher-assignments"] });
      navigate("/teacher/assignments");
    },
    onError: (error: any) => toast.error(error?.message || "Failed to create assignment."),
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
        <SecondHeading title="Basic Information" />
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <Input
            placeholder="Assignment title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Total marks"
            value={form.total_marks}
            onChange={(e) => setForm((prev) => ({ ...prev, total_marks: Number(e.target.value) }))}
          />
          <Input
            type="number"
            placeholder="XP points"
            value={form.xp_total}
            onChange={(e) => setForm((prev) => ({ ...prev, xp_total: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div>
        <SecondHeading title="Schedule" />
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Start Date & Time</label>
            <Input
              type="datetime-local"
              value={form.start_date}
              onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">End Date & Time</label>
            <Input
              type="datetime-local"
              value={form.end_date}
              onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      <div>
        <SecondHeading title="Description" />
        <Textarea
          placeholder="Assignment description and instructions..."
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          className="mt-4 min-h-24"
        />
      </div>

      <div className="flex justify-end border-t pt-6">
        <Button
          type="submit"
          disabled={createMutation.isPending || !form.title || !form.start_date || !form.end_date}
        >
          {createMutation.isPending ? "Creating..." : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
};

export default AssignmentForm;
