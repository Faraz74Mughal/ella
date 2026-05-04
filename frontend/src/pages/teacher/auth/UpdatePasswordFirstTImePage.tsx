import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/ui/form-input";
import { useAuthStore } from "@/store/useAuthStore";
import {
  updatePasswordSchema,
  type UpdatePasswordFormValues,
} from "@/lib/validations/admin/teacher.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePassword } from "@/hooks/use-teacher";

const UpdatePasswordFirstTimePage = () => {
  const { mutate: updatePasswordMutate } = useUpdatePassword();
  const { logout } = useAuthStore();

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: UpdatePasswordFormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    updatePasswordMutate(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: (updatedUser) => {
          console.log("updatedUser", updatedUser);

          if (updatedUser) {
            logout();
          }
        },
      },
    );
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Update Your Password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please update your password to secure your account.
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Old Password */}
              <FormInput
                control={form.control}
                name="oldPassword"
                label="Current Password"
                type="password"
                placeholder="Enter current password"
              />

              {/* New Password */}
              <FormInput
                control={form.control}
                name="newPassword"
                label="New Password"
                type="password"
                placeholder="Enter new password"
              />

              {/* Confirm Password */}
              <FormInput
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Re-enter new password"
              />

              <Button type="submit" className="w-full h-11">
                Update Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePasswordFirstTimePage;
