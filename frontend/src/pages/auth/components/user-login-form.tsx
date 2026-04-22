import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";

interface UserLoginFormProps {
  onSubmit: (values: LoginInput) => Promise<void>;
  onResendVerification?: (email: string) => Promise<void>;
  isLoading?: boolean;
  isResending?: boolean;
  isResendEmailShow: boolean;
}

export function UserLoginForm({
  onSubmit,
  onResendVerification,
  isLoading,
  isResending,
  isResendEmailShow,
}: UserLoginFormProps) {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleResendVerification = async () => {
    if (!onResendVerification) return;

    const isEmailValid = await form.trigger("email");
    const email = form.getValues("email").trim();

    if (!isEmailValid || !email) return;
    await onResendVerification(email);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={form.control}
          label="Email"
          name="email"
          disabled={isLoading}
          placeholder="name@example.com"
        />
        <FormInput
          control={form.control}
          label="Password"
          name="password"
          disabled={isLoading}
          placeholder="••••••••"
          type="password"
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In with Email
        </Button>
        {isResendEmailShow && (
          <Button
            type="button"
            variant="link"
            className="h-auto w-full p-0 text-xs"
            onClick={handleResendVerification}
            disabled={isLoading || isResending || !onResendVerification}
          >
            {isResending
              ? "Resending verification email..."
              : "Didn't receive email? Resend verification email"}
          </Button>
        )}
      </form>
    </Form>
  );
}
