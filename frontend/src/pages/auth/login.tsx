import { Link } from "react-router-dom";

import { UserLoginForm } from "./components/user-login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleLoginButton } from "@/components/google-login-button";
import { useLogin, useResendVerificationEmail } from "@/hooks/use-auth";
import type { LoginInput } from "@/types/auth";

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();

  const {
    mutateAsync: resendVerificationEmail,
    isPending: isResendingVerificationEmail,
  } = useResendVerificationEmail();

  const handleEmailLogin = async (values: LoginInput) => {
    await login(values);
  };

  const handleResendVerification = async (email: string) => {
    await resendVerificationEmail(email);
  };
  const isResendEmailShow: boolean = (
    error as any
  )?.response?.data?.message?.includes("email is not verified");
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-100 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Select your preferred login method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Component 1: Email Form */}
          <UserLoginForm
            onSubmit={handleEmailLogin}
            onResendVerification={handleResendVerification}
            isLoading={isPending}
            isResending={isResendingVerificationEmail}
            isResendEmailShow={isResendEmailShow}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Component 2: Social Login */}
          <GoogleLoginButton />

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
