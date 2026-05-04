import SecondHeading from "@/components/shared/second-heading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import {
  teacherSchema,
  type TeacherInput,
} from "@/lib/validations/admin/teacher.validation";
import type { IUser } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface TeacherFormProps {
  onSubmit: (values: TeacherInput) => Promise<void>;
  isLoading: boolean;
  teacher?: IUser | null | undefined;
}

const TeacherForm = ({ onSubmit, isLoading, teacher }: TeacherFormProps) => {
  const form = useForm<TeacherInput>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    if (teacher) {
      form.reset({
        name: teacher.name || "",
        username: teacher.username || "",
        email: teacher.email || "",
      });
    }
  }, [teacher, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* TOP SECTION */}
        <div>
          <SecondHeading title="Basic Information" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              control={form.control}
              label="Name"
              name="name"
              disabled={isLoading}
              placeholder="Enter teacher name..."
            />

            <FormInput
              control={form.control}
              label="Username"
              name="username"
              disabled={isLoading}
              placeholder="Enter username..."
            />

            <FormInput
              control={form.control}
              label="Email"
              name="email"
              type="email"
              disabled={isLoading}
              placeholder="Enter email..."
            />
          </div>
        </div>

        {/* PUBLISH SECTION */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="px-6">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {teacher ? "Update Teacher" : "Create New Teacher"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeacherForm;
