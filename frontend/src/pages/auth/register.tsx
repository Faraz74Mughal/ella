import { useRegister } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import UserRegisterForm from "./components/user-register-form";
import { Link } from "react-router-dom";
import type { RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();

  const onSubmit = (values: RegisterInput) => {
    register(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to get started with EduPlatform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserRegisterForm isPending={isPending} onSubmit={onSubmit} />
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
